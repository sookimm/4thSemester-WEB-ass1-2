let page = 1; // to store the current page number
const perPage = 10; // number of movies per pages

const moviesTableBody = document
  .getElementById("moviesTable")
  .getElementsByTagName("tbody")[0];
const currentPageElement = document.getElementById("current-page");
const paginationElement = document.querySelector(".pagination");

const previousPageLink = document.getElementById("previous-page");

//Load movie data
async function loadMovieData(title = null) {
  let url = `/api/movies?page=${page}&perPage=${perPage}`;
  if (title) {
    url += `&title=${title}`;
    page = 1;
    paginationElement.classList.add("d-none");
  } else {
    paginationElement.classList.remove("d-none");
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch movie data");
    }
    const data = await response.json();

    //clear existing data in the table
    moviesTableBody.innerHTML = "";

    //Loop
    data.forEach((movie) => {
      const { _id, year, title, plot, rated, runtime } = movie;

      const row = document.createElement("tr");
      row.dataset.id = _id;

      const formattedRuntime = `${Math.floor(runtime / 60)}:${(runtime % 60)
        .toString()
        .padStart(2, "0")}`;

      const html = `
        <td>${year}</td>
        <td>${title}</td>
        <td>${plot || "N/A"}</td>
        <td>${rated || "N/A"}</td>
        <td>${formattedRuntime}</td>
      `;

      row.innerHTML = html;
      moviesTableBody.appendChild(row);
    });

    currentPageElement.textContent = page;
    updateCurrentPage();

    // Add event listener to each row to show modal on click
    const movieRows = moviesTableBody.getElementsByTagName("tr");
    for (let i = 0; i < movieRows.length; i++) {
      movieRows[i].addEventListener("click", () => {
        const selectedMovieId = movieRows[i].dataset.id;
        showMovieDetails(selectedMovieId);
      });
    }
  } catch (error) {
    console.error("Error loading movie data:", error);
    // Handle error
  }
}

//to update the current page number
function updateCurrentPage() {
  currentPageElement.textContent = page;
  currentPageElement.style.color = "black";
}

//to navigate to the previous page
function decreasePage() {
  if (page > 1) {
    page--;
    loadMovieData();
  }
}

// to navigate to the next page
function increasePage() {
  page++;
  loadMovieData();
}

document.addEventListener("DOMContentLoaded", () => {
  loadMovieData();
});

document
  .getElementById("previous-page")
  .addEventListener("click", decreasePage);

document.getElementById("next-page").addEventListener("click", increasePage);

document.getElementById("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  loadMovieData(title);
});

document.getElementById("clearForm").addEventListener("click", () => {
  document.getElementById("title").value = "";
  loadMovieData();
});

// Show details in modal
async function showMovieDetails(movieId) {
  const detailsModal = new bootstrap.Modal(
    document.querySelector("#detailsModal"),
    { backdrop: "static", keyboard: false, focus: true }
  );
  detailsModal.show();

  try {
    // Get details from the server
    const response = await fetch(`/api/movies/${movieId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }
    const movie = await response.json();

    // Populate the modal with movie details
    const modalTitleElement = document.querySelector(
      "#detailsModal .modal-title"
    );
    const modalBodyElement = document.querySelector(
      "#detailsModal .modal-body"
    );

    modalTitleElement.textContent = movie.title;
    modalBodyElement.innerHTML = `
      <div class="row">
        <div class="col-4">
          <img src="${movie.poster}" alt="${movie.title}" class="img-fluid">
        </div>
        <div class="col-8">
          <p><strong>Year:</strong> ${movie.year}</p>
          <p><strong>Plot:</strong> ${movie.plot || "N/A"}</p>
          <p><strong>Rated:</strong> ${movie.rated || "N/A"}</p>
          <p><strong>Runtime:</strong> ${movie.runtime || "N/A"} minutes</p>
          <p><strong>Genre:</strong> ${movie.genre || "N/A"}</p>
          <p><strong>Director:</strong> ${movie.director || "N/A"}</p>
          <p><strong>Actors:</strong> ${movie.actors || "N/A"}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error loading movie details:", error);
    // Handle error
  }
}
