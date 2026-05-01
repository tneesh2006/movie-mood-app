# 🎬 MoodFlicks — Mood-Based Movie Recommender

A beautiful, responsive web app that recommends movies based on how you're feeling — powered by the OMDb API.

![MoodFlicks Preview](https://via.placeholder.com/800x400?text=MoodFlicks+Preview)

## ✨ Features

- 🎭 **Mood-based discovery** — Pick Happy, Sad, Angry, or Relaxed and get matched movies
- 🔍 **Smart search** — Combine mood + keyword for refined results (e.g. "sad + space")
- 🗂️ **Year & type filters** — Filter by release year or Movie/Series
- ❤️ **Favorites** — Save movies with localStorage persistence
- 📱 **Fully responsive** — Works great on mobile, tablet, and desktop
- 🌙 **Cinematic dark UI** — Netflix-inspired design with smooth animations

## 🗂 Folder Structure

```
mood-movie-recommender/
├── index.html      # App structure & layout
├── style.css       # All styling (dark theme, animations, responsive)
├── script.js       # App logic (API, favorites, DOM)
└── README.md       # This file
```

## 🚀 How to Run

1. **Clone or download** this repository
2. Open `script.js` and replace the API key placeholder:

```js
const API_KEY = "YOUR_API_KEY_HERE";  // ← Replace this
```

3. **Open `index.html`** in your browser — no server needed!

> 💡 You can also use the VS Code **Live Server** extension for a better dev experience.

## 🔑 Getting Your OMDb API Key

1. Go to [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Choose the **Free** plan (1,000 requests/day)
3. Check your email for the key
4. Paste it in `script.js`

## 🎭 Mood → Genre Mapping

| Mood      | Genre   | Keyword used |
|-----------|---------|--------------|
| 😄 Happy  | Comedy  | `comedy`     |
| 😢 Sad    | Drama   | `drama`      |
| 😤 Angry  | Action  | `action`     |
| 😌 Relaxed| Romance | `romance`    |

## 🛠 Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — Async/await, DOM, localStorage
- **OMDb API** — Movie data (poster, title, year, type)

## 📄 License

MIT — free to use, modify, and share.
