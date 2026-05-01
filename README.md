# MoodFlicks, Mood-Based Movie Recommender

A beautiful, responsive web app that recommends movies based on how you're feeling. It uses the OMDb API.

![MoodFlicks Preview](https://via.placeholder.com/800x400?text=MoodFlicks+Preview)

## Features

- Mood-based discovery. Pick Happy, Sad, Angry, or Relaxed and get matched with movies.
- Smart search. Combine mood and keyword for refined results (e.g., "sad + space").
- Year and type filters. Filter by release year or movie/series.
- Favorites. Save movies with localStorage.
- Fully responsive. Works great on mobile, tablet, and desktop.
- Cinematic dark UI. Netflix-inspired design with smooth animations.

## Folder Structure

```
mood-movie-recommender/
├── index.html      # App structure and layout
├── style.css       # All styling (dark theme, animations, responsive)
├── script.js       # App logic (API, favorites, DOM)
└── README.md       # This file
```

## How to Run

1. Clone or download this repository.
2. Open `script.js` and replace the API key placeholder:

```js
const API_KEY = "YOUR_API_KEY_HERE";  // Replace this
```

3. Open `index.html` in your browser. No server needed!

You can also use the VS Code Live Server extension for a better development experience.

## Getting Your OMDb API Key

1. Go to [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx).
2. Choose the Free plan (1,000 requests per day).
3. Check your email for the key.
4. Paste it in `script.js`.

## Mood to Genre Mapping

| Mood      | Genre   | Keyword used |
|-----------|---------|--------------|
| Happy     | Comedy  | `comedy`     |
| Sad       | Drama   | `drama`      |
| Angry     | Action  | `action`     |
| Relaxed   | Romance | `romance`    |

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — Custom properties, Grid, Flexbox, animations
- Vanilla JavaScript — Async/await, DOM, localStorage
- OMDb API — Movie data (poster, title, year, type)

## License

MIT — free to use, modify, and share.
