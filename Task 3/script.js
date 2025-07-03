// --- Netflix Clone Advanced Script ---

const PROFILES = [
  { id: 1, name: 'Alex', img: 'images/profile1.png' },
  { id: 2, name: 'Sam', img: 'images/profile2.png' },
  { id: 3, name: 'Jamie', img: 'images/profile3.png' }
];

let currentProfile = null;
let allMovies = [];
let filteredMovies = [];
let myList = [];
let likes = {};
let continueWatching = {};

// --- Profile Selection ---
document.addEventListener('DOMContentLoaded', () => {
  // Profile selection
  document.querySelectorAll('.profile').forEach(profile => {
    profile.onclick = () => {
      const id = profile.getAttribute('data-profile');
      currentProfile = PROFILES.find(p => p.id == id);
      document.getElementById('profile-screen').style.display = 'none';
      document.getElementById('main-app').style.display = 'block';
      document.querySelector('#profile-mini img').src = currentProfile.img;
      loadLocalData();
      fetchMovies();
    };
  });

  // Profile mini click (reset to profile screen)
  document.getElementById('profile-mini').onclick = () => {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('profile-screen').style.display = 'flex';
  };

  // Search
  document.getElementById('search-bar').addEventListener('input', e => {
    filterAndRenderRows(e.target.value);
  });

  // My List link
  document.getElementById('my-list-link').onclick = (e) => {
    e.preventDefault();
    renderRows('My List');
  };
  document.getElementById('home-link').onclick = (e) => {
    e.preventDefault();
    renderRows();
  };

  // Modal close
  document.getElementById('close-details').onclick = () => {
    document.getElementById('details-modal').style.display = 'none';
  };
  document.getElementById('close-video').onclick = () => {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('video-player').pause();
  };

  // Modal outside click
  window.onclick = function(event) {
    if (event.target == document.getElementById('details-modal'))
      document.getElementById('details-modal').style.display = 'none';
    if (event.target == document.getElementById('video-modal')) {
      document.getElementById('video-modal').style.display = 'none';
      document.getElementById('video-player').pause();
    }
  };
});

function fetchMovies() {
  fetch('movies.json')
    .then(res => res.json())
    .then(movies => {
      allMovies = movies;
      filterAndRenderRows();
    });
}

function filterAndRenderRows(search = '') {
  if (search) {
    filteredMovies = allMovies.filter(m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    filteredMovies = allMovies;
  }
  renderRows();
}

function renderRows(mode = 'Home') {
  const container = document.getElementById('rows-container');
  container.innerHTML = '';
  let rows = [];
  if (mode === 'My List') {
    rows = [{ title: 'My List', movies: allMovies.filter(m => myList.includes(m.id)) }];
  } else {
    // Example categories
    rows = [
      { title: 'Trending Now', movies: filteredMovies.slice(0, 6) },
      { title: 'Top Picks for You', movies: filteredMovies.slice(6, 12) },
      { title: 'New Releases', movies: filteredMovies.slice(12, 18) },
      { title: 'Sci-Fi', movies: filteredMovies.filter(m => m.genre === 'Sci-Fi') },
      { title: 'Adventure', movies: filteredMovies.filter(m => m.genre === 'Adventure') },
      { title: 'Mystery', movies: filteredMovies.filter(m => m.genre === 'Mystery') }
    ];
  }
  rows.forEach(row => {
    if (row.movies.length === 0) return;
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    rowDiv.innerHTML = `<div class="row-title">${row.title}</div>`;
    const listDiv = document.createElement('div');
    listDiv.className = 'row-list';
    row.movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">
        <div class="movie-card-title">${movie.title}</div>
      `;
      card.onclick = () => showDetails(movie);
      listDiv.appendChild(card);
    });
    rowDiv.appendChild(listDiv);
    container.appendChild(rowDiv);
  });
}

// --- Modal Logic ---
let currentMovie = null;
function showDetails(movie) {
  currentMovie = movie;
  document.getElementById('details-image').src = movie.image;
  document.getElementById('details-title').textContent = movie.title;
  document.getElementById('details-description').textContent = movie.description;
  document.getElementById('details-genre').textContent = 'Genre: ' + movie.genre;
  // Like/Dislike state
  updateLikeDislikeButtons();
  // My List state
  document.getElementById('add-list-button').textContent = myList.includes(movie.id) ? 'Remove from My List' : 'Add to My List';
  document.getElementById('details-modal').style.display = 'flex';
  // Button actions
  document.getElementById('play-button').onclick = () => playMovie(movie);
  document.getElementById('add-list-button').onclick = () => toggleMyList(movie);
  document.getElementById('like-button').onclick = () => toggleLike(movie, true);
  document.getElementById('dislike-button').onclick = () => toggleLike(movie, false);
}

function playMovie(movie) {
  document.getElementById('video-player').src = movie.video;
  document.getElementById('video-modal').style.display = 'flex';
  document.getElementById('video-player').play();
  // Save continue watching
  continueWatching[movie.id] = { time: 0, title: movie.title };
  saveLocalData();
  document.getElementById('video-player').ontimeupdate = function() {
    continueWatching[movie.id].time = this.currentTime;
    saveLocalData();
  };
}

function toggleMyList(movie) {
  if (myList.includes(movie.id)) {
    myList = myList.filter(id => id !== movie.id);
  } else {
    myList.push(movie.id);
  }
  saveLocalData();
  document.getElementById('add-list-button').textContent = myList.includes(movie.id) ? 'Remove from My List' : 'Add to My List';
}

function toggleLike(movie, isLike) {
  likes[movie.id] = isLike ? 1 : -1;
  saveLocalData();
  updateLikeDislikeButtons();
}

function updateLikeDislikeButtons() {
  const likeBtn = document.getElementById('like-button');
  const dislikeBtn = document.getElementById('dislike-button');
  if (!currentMovie) return;
  if (likes[currentMovie.id] === 1) {
    likeBtn.style.background = '#e50914';
    dislikeBtn.style.background = '#222';
  } else if (likes[currentMovie.id] === -1) {
    likeBtn.style.background = '#222';
    dislikeBtn.style.background = '#e50914';
  } else {
    likeBtn.style.background = '#222';
    dislikeBtn.style.background = '#222';
  }
}

// --- Local Storage ---
function loadLocalData() {
  myList = JSON.parse(localStorage.getItem('myList_' + currentProfile.id) || '[]');
  likes = JSON.parse(localStorage.getItem('likes_' + currentProfile.id) || '{}');
  continueWatching = JSON.parse(localStorage.getItem('continue_' + currentProfile.id) || '{}');
}
function saveLocalData() {
  localStorage.setItem('myList_' + currentProfile.id, JSON.stringify(myList));
  localStorage.setItem('likes_' + currentProfile.id, JSON.stringify(likes));
  localStorage.setItem('continue_' + currentProfile.id, JSON.stringify(continueWatching));
} 