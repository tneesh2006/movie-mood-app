
const API_KEY = "21357e6d";
const API_BASE = "https://www.omdbapi.com/";


const MOOD_CONFIG = {
  happy: {
    genre:   "comedy",
    emoji:   "😄",
    label:   "Happy",
    color:   "#f9c74f",
    message: "Laughter is the best medicine — this one will keep you smiling!",
  },
  sad: {
    genre:   "drama",
    emoji:   "😢",
    label:   "Sad",
    color:   "#4cc9f0",
    message: "Sometimes a good cry is healing. This story will touch your heart.",
  },
  angry: {
    genre:   "action",
    emoji:   "😤",
    label:   "Angry",
    color:   "#f72585",
    message: "Channel that energy! This high-octane film will get your blood pumping.",
  },
  relaxed: {
    genre:   "romance",
    emoji:   "😌",
    label:   "Relaxed",
    color:   "#80ffdb",
    message: "Settle in and enjoy a warm, feel-good story made for cozy evenings.",
  },
};

// ============================================================
// 📦 STATE
// ============================================================
let currentMood    = null;   // Currently selected mood key
let currentMovies  = [];     // List of movies currently displayed
let favorites      = [];     // User's saved favorites (synced to localStorage)

// ============================================================
// 🚀 INITIALIZATION
// Runs when the page loads
// ============================================================
(function init() {
  loadFavorites();         // Pull favorites from localStorage
  updateFavCount();        // Refresh the badge in the nav
})();

// ============================================================
// 🎭 MOOD SELECTION
// Called when a mood button is clicked
// ============================================================
function selectMood(mood) {
  currentMood = mood;

  // Highlight the selected mood button
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.mood === mood);
  });

  // Show search/filter section
  document.getElementById("searchSection").classList.add("visible");

  // Clear previous search input and filters
  document.getElementById("searchInput").value = "";
  document.getElementById("filterYear").value  = "";
  document.getElementById("filterType").value  = "";

  // Fetch movies for this mood
  const genre = MOOD_CONFIG[mood].genre;
  fetchMovies(genre, "", "", "");
}

// ============================================================
// 🔍 SEARCH TRIGGER
// Called when user clicks Search or presses Enter
// ============================================================
function triggerSearch() {
  if (!currentMood) {
    showError("Please select a mood first!");
    return;
  }
  const keyword = document.getElementById("searchInput").value.trim();
  const year    = document.getElementById("filterYear").value;
  const type    = document.getElementById("filterType").value;
  const genre   = MOOD_CONFIG[currentMood].genre;

  fetchMovies(genre, keyword, year, type);
}

// Allow pressing Enter in the search box
function handleSearchKey(event) {
  if (event.key === "Enter") triggerSearch();
}

// Clear filters and re-fetch
function clearFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("filterYear").value  = "";
  document.getElementById("filterType").value  = "";
  if (currentMood) {
    fetchMovies(MOOD_CONFIG[currentMood].genre, "", "", "");
  }
}

// ============================================================
// 🌐 FETCH MOVIES FROM OMDB API
// Uses the OMDb search endpoint (returns multiple results)
// ============================================================
async function fetchMovies(genre, keyword, year, type) {
  // Build the search query: prefer keyword, fallback to genre
  const query = keyword ? `${keyword} ${genre}` : genre;

  // Build the API URL with optional filters
  let url = `${API_BASE}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
  if (year)  url += `&y=${year}`;
  if (type)  url += `&type=${type}`;

  showLoader(true);
  hideError();
  hideResults();

  try {
    const response = await fetch(url);

    // Check for network errors
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();

    // Check for API-level errors
    if (data.Response === "False") {
      showError(data.Error || "No movies found. Try a different search!");
      showLoader(false);
      return;
    }

    // Success — render the movies
    currentMovies = data.Search;
    renderMovies(currentMovies);

  } catch (err) {
    // Handle fetch failures (e.g., invalid API key, network down)
    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      showError("Could not reach OMDb API. Check your internet connection.");
    } else if (API_KEY === "YOUR_API_KEY_HERE") {
      showError("⚠️ Please add your OMDb API key in script.js to see movies!");
    } else {
      showError("Something went wrong. Check your API key or try again.");
    }
    console.error("OMDb fetch error:", err);
  } finally {
    showLoader(false);
  }
}

// ============================================================
// 🎬 RENDER MOVIE CARDS
// Builds and injects movie card HTML into the DOM
// ============================================================
function renderMovies(movies) {
  const grid         = document.getElementById("movieGrid");
  const section      = document.getElementById("resultsSection");
  const titleEl      = document.getElementById("resultsTitle");
  const countEl      = document.getElementById("resultsCount");
  const moodInfo     = MOOD_CONFIG[currentMood];

  // Clear previous results
  grid.innerHTML = "";

  // Update section title
  titleEl.textContent = `${moodInfo.emoji} ${moodInfo.label} picks`;
  countEl.textContent = `${movies.length} results`;

  // Build a card for each movie
  movies.forEach((movie) => {
    const isFav    = isFavorite(movie.imdbID);
    const card     = createMovieCard(movie, moodInfo, isFav);
    grid.appendChild(card);
  });

  section.classList.add("visible");

  // Scroll smoothly down to results
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ============================================================
// 🃏 CREATE A SINGLE MOVIE CARD (DOM element)
// ============================================================
function createMovieCard(movie, moodInfo, isFav) {
  const card = document.createElement("div");
  card.className = "movie-card";
  card.dataset.id = movie.imdbID;

  // Poster HTML — show placeholder if N/A
  const posterHtml = (movie.Poster && movie.Poster !== "N/A")
    ? `<img class="card-poster" src="${movie.Poster}" alt="${movie.Title}" loading="lazy" />`
    : `<div class="poster-placeholder">🎞️<p>No Poster</p></div>`;

  // Favorite button state
  const favIcon  = isFav ? "❤️" : "🤍";
  const favClass = isFav ? "card-fav-btn saved" : "card-fav-btn";
  const favText  = isFav ? "❤️ Saved" : "Add to Favorites ❤️";
  const overlayClass = isFav ? "card-fav-overlay is-fav" : "card-fav-overlay";

  card.innerHTML = `
    <div class="card-poster-wrap">
      ${posterHtml}
      <span class="card-mood-badge">${moodInfo.label}</span>
      <button
        class="${overlayClass}"
        onclick="toggleFavorite('${movie.imdbID}', event)"
        title="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
      >${favIcon}</button>
    </div>
    <div class="card-body">
      <h3 class="card-title">${movie.Title}</h3>
      <div class="card-meta">
        <span class="card-year">${movie.Year || "—"}</span>
        <span class="card-type">${movie.Type || "movie"}</span>
      </div>
      <p class="card-why">${moodInfo.message}</p>
      <button
        class="${favClass}"
        id="favBtn-${movie.imdbID}"
        onclick="toggleFavorite('${movie.imdbID}', event)"
      >${favText}</button>
    </div>
  `;

  return card;
}

// ============================================================
// ❤️ FAVORITES LOGIC
// Add/remove movies to localStorage-backed favorites list
// ============================================================

/** Load favorites from localStorage on startup */
function loadFavorites() {
  try {
    const stored = localStorage.getItem("moodflicks_favorites");
    favorites = stored ? JSON.parse(stored) : [];
  } catch (e) {
    favorites = [];
    console.warn("Could not load favorites:", e);
  }
}

/** Save current favorites array to localStorage */
function saveFavorites() {
  try {
    localStorage.setItem("moodflicks_favorites", JSON.stringify(favorites));
  } catch (e) {
    console.warn("Could not save favorites:", e);
  }
}

/** Check if a movie is already in favorites */
function isFavorite(imdbID) {
  return favorites.some((fav) => fav.imdbID === imdbID);
}

/** Toggle a movie in/out of favorites */
function toggleFavorite(imdbID, event) {
  // Prevent the card click from firing other events
  event.stopPropagation();

  if (isFavorite(imdbID)) {
    // Remove from favorites
    favorites = favorites.filter((fav) => fav.imdbID !== imdbID);
  } else {
    // Find the movie in currentMovies and add it
    const movie = currentMovies.find((m) => m.imdbID === imdbID)
                || favorites.find((m) => m.imdbID === imdbID);
    if (movie) {
      // Store mood info alongside the movie for display in Favorites
      favorites.push({ ...movie, savedMood: currentMood || "happy" });
    }
  }

  saveFavorites();
  updateFavCount();
  refreshCardFavState(imdbID);

  // If we're on the Favorites page, re-render it
  if (document.getElementById("sectionFavorites").classList.contains("active")) {
    renderFavorites();
  }
}

/** Update the heart button states on all visible cards for a given movie */
function refreshCardFavState(imdbID) {
  const isFav    = isFavorite(imdbID);
  const favBtn   = document.getElementById(`favBtn-${imdbID}`);
  const overlays = document.querySelectorAll(`.movie-card[data-id="${imdbID}"] .card-fav-overlay`);

  if (favBtn) {
    favBtn.textContent = isFav ? "❤️ Saved" : "Add to Favorites ❤️";
    favBtn.className   = isFav ? "card-fav-btn saved" : "card-fav-btn";
  }

  overlays.forEach((btn) => {
    btn.textContent = isFav ? "❤️" : "🤍";
    btn.classList.toggle("is-fav", isFav);
  });
}

/** Update the count badge on the Favorites nav button */
function updateFavCount() {
  const badge = document.getElementById("favCount");
  badge.textContent = favorites.length;
  badge.style.display = favorites.length > 0 ? "inline-flex" : "none";
}

/** Clear all favorites */
function clearAllFavorites() {
  if (favorites.length === 0) return;
  if (confirm("Clear all favorites? This cannot be undone.")) {
    favorites = [];
    saveFavorites();
    updateFavCount();
    renderFavorites();
  }
}

// ============================================================
// ❤️ RENDER FAVORITES PAGE
// ============================================================
function renderFavorites() {
  const grid  = document.getElementById("favoritesGrid");
  const empty = document.getElementById("emptyFavorites");

  grid.innerHTML = "";

  if (favorites.length === 0) {
    empty.classList.add("visible");
    return;
  }

  empty.classList.remove("visible");

  favorites.forEach((movie) => {
    const mood     = movie.savedMood || "happy";
    const moodInfo = MOOD_CONFIG[mood];
    const card     = createMovieCard(movie, moodInfo, true);
    grid.appendChild(card);
  });
}

// ============================================================
// 👫 WATCH TOGETHER LOGIC
// Two people each pick a mood; we blend them into one query
// ============================================================

// State for each person's selected mood
const togetherState = { 1: null, 2: null };

/**
 * COMBINED MOOD LOGIC
 * Maps any two moods into a single blended genre/keyword.
 * Same mood = pure genre. Different moods = smart blend.
 */
const MOOD_BLEND = {
  "happy+happy":    { genre: "comedy",         label: "Double the laughs!",         keyword: "funny comedy" },
  "sad+sad":        { genre: "drama",           label: "A deep emotional journey",   keyword: "emotional drama" },
  "angry+angry":    { genre: "action",          label: "Pure adrenaline night!",     keyword: "action thriller" },
  "relaxed+relaxed":{ genre: "romance",         label: "A cozy evening together",    keyword: "romance" },
  "happy+sad":      { genre: "comedy drama",    label: "Heartwarming with laughs",   keyword: "feel good drama" },
  "sad+happy":      { genre: "comedy drama",    label: "Heartwarming with laughs",   keyword: "feel good drama" },
  "happy+angry":    { genre: "action comedy",   label: "Fun + high energy!",         keyword: "action comedy" },
  "angry+happy":    { genre: "action comedy",   label: "Fun + high energy!",         keyword: "action comedy" },
  "happy+relaxed":  { genre: "romantic comedy", label: "Light, fun & sweet",         keyword: "romantic comedy" },
  "relaxed+happy":  { genre: "romantic comedy", label: "Light, fun & sweet",         keyword: "romantic comedy" },
  "sad+angry":      { genre: "thriller",        label: "Dark & intense",             keyword: "dark thriller" },
  "angry+sad":      { genre: "thriller",        label: "Dark & intense",             keyword: "dark thriller" },
  "sad+relaxed":    { genre: "drama romance",   label: "Moving & tender",            keyword: "romantic drama" },
  "relaxed+sad":    { genre: "drama romance",   label: "Moving & tender",            keyword: "romantic drama" },
  "angry+relaxed":  { genre: "adventure",       label: "Exciting yet satisfying",    keyword: "adventure" },
  "relaxed+angry":  { genre: "adventure",       label: "Exciting yet satisfying",    keyword: "adventure" },
};

/** Called when a person clicks a mood button in the Together section */
function selectPersonMood(person, mood) {
  togetherState[person] = mood;
  const moodInfo = MOOD_CONFIG[mood];

  // Highlight selected button in that person's grid
  document.querySelectorAll(`#moodGrid${person} .mini-mood-btn`).forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.mood === mood);
  });

  // Mark the picker card
  document.getElementById(`picker${person}`).classList.add("has-mood");

  // Update the selected display
  document.getElementById(`selectedEmoji${person}`).textContent = moodInfo.emoji;
  document.getElementById(`selectedLabel${person}`).textContent =
    `${moodInfo.label} → ${moodInfo.genre}`;

  // If both people have selected, show the combined banner
  if (togetherState[1] && togetherState[2]) {
    showCombinedBanner();
  }
}

/** Show the combined mood banner with blended genre */
function showCombinedBanner() {
  const mood1    = togetherState[1];
  const mood2    = togetherState[2];
  const blendKey = `${mood1}+${mood2}`;
  const blend    = MOOD_BLEND[blendKey];
  const name1    = document.getElementById("name1").value.trim() || "Person 1";
  const name2    = document.getElementById("name2").value.trim() || "Person 2";
  const m1       = MOOD_CONFIG[mood1];
  const m2       = MOOD_CONFIG[mood2];

  // Build combined moods display
  document.getElementById("combinedMoods").innerHTML = `
    <div class="combined-mood-chip">
      <span class="chip-emoji">${m1.emoji}</span>
      <span class="chip-name">${name1} is ${m1.label}</span>
    </div>
    <span class="combined-plus">+</span>
    <div class="combined-mood-chip">
      <span class="chip-emoji">${m2.emoji}</span>
      <span class="chip-name">${name2} is ${m2.label}</span>
    </div>
    <span class="combined-arrow">→</span>
  `;

  document.getElementById("combinedGenre").textContent =
    `🎬 ${blend.label} · Genre: ${blend.genre}`;

  document.getElementById("combinedBanner").classList.add("visible");
  document.getElementById("combinedBanner").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/** Fetch movies based on the blended genre */
async function fetchTogetherMovies() {
  const mood1    = togetherState[1];
  const mood2    = togetherState[2];

  if (!mood1 || !mood2) {
    showTogetherError("Both people need to pick a mood first!");
    return;
  }

  const blendKey = `${mood1}+${mood2}`;
  const blend    = MOOD_BLEND[blendKey];

  // Show loader, hide results
  document.getElementById("togetherLoader").classList.add("visible");
  document.getElementById("togetherResults").classList.remove("visible");
  document.getElementById("togetherError").classList.remove("visible");

  const url = `${API_BASE}?apikey=${API_KEY}&s=${encodeURIComponent(blend.keyword)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network error: ${response.status}`);

    const data = await response.json();

    if (data.Response === "False") {
      showTogetherError(data.Error || "No movies found for this combo. Try different moods!");
      return;
    }

    renderTogetherMovies(data.Search, blend);

  } catch (err) {
    if (err.message.includes("Failed to fetch")) {
      showTogetherError("Could not reach OMDb API. Check your internet connection.");
    } else if (API_KEY === "YOUR_API_KEY_HERE") {
      showTogetherError("⚠️ Please add your OMDb API key in script.js!");
    } else {
      showTogetherError("Something went wrong. Please try again.");
    }
    console.error("Together fetch error:", err);
  } finally {
    document.getElementById("togetherLoader").classList.remove("visible");
  }
}

/** Render movies in the Together results grid */
function renderTogetherMovies(movies, blend) {
  const grid     = document.getElementById("togetherGrid");
  const section  = document.getElementById("togetherResults");
  const name1    = document.getElementById("name1").value.trim() || "Person 1";
  const name2    = document.getElementById("name2").value.trim() || "Person 2";

  grid.innerHTML = "";

  document.getElementById("togetherTitle").textContent =
    `🍿 Perfect for ${name1} & ${name2}`;
  document.getElementById("togetherCount").textContent =
    `${movies.length} results · ${blend.genre}`;

  // Use a special moodInfo that shows the blended message
  const blendedMoodInfo = {
    emoji:   "👫",
    label:   "Watch Together",
    message: `${blend.label} — the perfect pick for both of you!`,
  };

  movies.forEach((movie) => {
    const isFav = isFavorite(movie.imdbID);
    const card  = createMovieCard(movie, blendedMoodInfo, isFav);
    grid.appendChild(card);
  });

  // Add to currentMovies so favorites work
  currentMovies = [...movies];

  section.classList.add("visible");
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showTogetherError(message) {
  document.getElementById("togetherErrorText").textContent = message;
  document.getElementById("togetherError").classList.add("visible");
}

// ============================================================
// 🗂️ SECTION NAVIGATION
// Toggles between Discover, Together, and Favorites views
// ============================================================
function showSection(name) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));

  // Show selected section
  document.getElementById(`section${capitalize(name)}`).classList.add("active");

  // Update nav button states
  document.getElementById("navDiscover").classList.toggle("active",   name === "discover");
  document.getElementById("navTogether").classList.toggle("active",   name === "together");
  document.getElementById("navFavorites").classList.toggle("active",  name === "favorites");

  // If switching to favorites, render the list
  if (name === "favorites") renderFavorites();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================
// 🔧 UI HELPERS
// ============================================================

function showLoader(visible) {
  document.getElementById("loader").classList.toggle("visible", visible);
}

function showError(message) {
  const el = document.getElementById("errorMsg");
  document.getElementById("errorText").textContent = message;
  el.classList.add("visible");
}

function hideError() {
  document.getElementById("errorMsg").classList.remove("visible");
}

function hideResults() {
  document.getElementById("resultsSection").classList.remove("visible");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
