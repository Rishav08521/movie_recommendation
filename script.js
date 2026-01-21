const API_KEY = '2726e48b';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const movieGrid = document.getElementById('movieGrid');
const searchForm = document.getElementById('searchForm');
const modal = document.getElementById('movieModal');
const modalDetails = document.getElementById('modalDetails');
const closeBtn = document.querySelector('.close-modal');

// Fetch movies from API
async function getMovies(searchTerm) {
    try {
        const res = await fetch(`${BASE_URL}&s=${searchTerm}`);
        const data = await res.json();
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            movieGrid.innerHTML = `<p style="text-align:center; width:100%;">No movies found for "${searchTerm}"</p>`;
        }
    } catch (error) {
        console.log("Error loading movies");
    }
}

// Display movies in grid
function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="poster-wrapper">
                <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${movie.Title}">
                <div class="overlay">
                    <button class="view-btn" onclick="getMovieDetails('${movie.imdbID}')">View Details</button>
                </div>
            </div>
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p style="color:gray; font-size:0.8rem;">${movie.Year}</p>
            </div>
        `;
        movieGrid.appendChild(card);
    });
}

// Get specific details for the modal
async function getMovieDetails(id) {
    const res = await fetch(`${BASE_URL}&i=${id}&plot=full`);
    const movie = await res.json();
    modalDetails.innerHTML = `
        <div class="detail-container">
            <img src="${movie.Poster}" class="detail-poster">
            <div class="detail-info">
                <h2>${movie.Title}</h2>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <p><strong>Rating:</strong> ⭐ ${movie.imdbRating}</p>
            </div>
        </div>
    `;
    modal.style.display = "block";
}

// Modal closing logic
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

// Handle Search
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('movieInput').value;
    if (val) {
        getMovies(val);
        document.getElementById('sectionTitle').innerText = `Results for: ${val}`;
    }
});

// Initial Load
window.onload = () => getMovies('Batman');