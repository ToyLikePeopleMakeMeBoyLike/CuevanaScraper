# Cuevana3 Scraper

<div align="center">
  <img src="https://raw.githubusercontent.com/ToyLikePeopleMakeMeBoyLike/CuevanaScraper/main/assets/img/logo.png" alt="Cuevana3 Logo" width="200"/>
</div>

<p align="center">
  Cuevana3 scraper is a content provider of the latest in the world of movies and tv show in Latin Spanish dub or subtitled.
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/npm?style=flat-square" alt="npm version"/>
  <img src="https://img.shields.io/github/package-json/v/carlosfdezb/cuevana3?style=flat-square" alt="GitHub package.json version"/>
  <img src="https://img.shields.io/npm/l/cuevana3?style=flat-square" alt="NPM License"/>
</p>

## 📌 Installation

```bash
npm install cuevana3
```

## 📖 Documentation

Available methods:

- **getMovies(type)**: Returns a list with the movies according to the indicated type.
- **getSeries(type)**: Returns a list with the series according to the indicated type.
- **getDetail(id)**: Returns the detail of the selected movie/series.
- **getByGenre(id, page)**: Returns a list with movies according to the indicated genre and page.
- **getByActor(id, page)**: Returns a list with movies according to the indicated actor.
- **getSearch(query, page)**: Returns a list with movies/series according to query.
- **getLinks(id)**: Returns a list of links of selected movie or episode of serie.
- **getDownload(id)**: Returns a list of download links of selected movie or episode of serie.
- **getTrailer(id)**: Returns a trailer link of selected movie/serie.

## 🚩 getMovies(type)

Returns a list with the movies according to the indicated `type`.

| VALUE | TYPE |
|------|------|
| Latest movies added | 0 |
| Premiere movies | 1 |
| Most viewed movies | 2 |
| Top rated movies | 3 |
| Latin dub movies | 4 |
| Spanish dub movies | 5 |
| Subtitled movies | 6 |

### Example:

```javascript
const cuevana3 = require('cuevana3');

cuevana3.getMovies(0)
  .then((res) => console.log(res));
```

### Results:

```json
[
  {
    "id": "42040/without-remorse",
    "title": "Sin remordimientos",
    "poster": "https://cuevana3.io/wp-content/uploads/2021/04/sin-remordimientos-42040-poster-204x300.jpg",
    "year": "2021",
    "sypnosis": "Un ex Navy SEAL convertido en agente de la CIA busca venganza después de que su novia es asesinada por un narcotraficante de Baltimore.",
    "rating": "4.42",
    "duration": "1h 49m",
    "director": ["Stefano Sollima"],
    "genres": ["Acción", "Aventura", "Thriller"],
    "cast": ["Adrian Rawlins", "Alec Rosenthal", "Artjom Gilz"]
  }
]
```

## 🚩 getSeries(type)

Returns a list with the series according to the indicated `type`.

| VALUE | TYPE |
|------|------|
| Latest series added | 0 |
| Premiere series | 1 |
| Top rated series | 2 |
| Most viewed series | 3 |
| Latest episodes added | 4 |

### Example:

```javascript
const cuevana3 = require('cuevana3');

cuevana3.getSeries(4)
  .then((res) => console.log(res));
```

### Results:

```json
[
  {
    "id": "episodio/the-innocent-1x8",
    "episode": "The Innocent 1x8",
    "poster": "https://image.tmdb.org/t/p/w185/o2Xf958jMUS7H7ggZLt7qYyGTD.jpg"
  }
]
```

## 🚩 getByGenre(type, page)

Returns a list with movies according to the indicated `genre` and `page`.

| VALUE | TYPE |
|------|------|
| Acción | 0 |
| Animación | 1 |
| Aventura | 2 |
| Bélico guerra | 3 |
| Biografía | 4 |
| Ciencia ficción | 5 |
| Comedia | 6 |
| Crimen | 7 |
| Documentales | 8 |
| Drama | 9 |
| Familiar | 10 |
| Fantasía | 11 |
| Misterio | 12 |
| Musical | 13 |
| Romance | 14 |
| Terror | 15 |

## License

MIT License

### **:busts_in_silhouette: Credits**

- [Carlos Fernández](https://github.com/carlosfdezb) (Project Leader, and Developer)

### **:anger: Troubleshootings**

This is just a personal project created for study / demonstration purpose and to simplify my working life, it may or may
not be a good fit for your project(s).

### **:heart: Show your support**

Please :star: this repository if you like it or this project helped you!\
Feel free to open issues or submit pull-requests to help me improving my work.

### **:robot: Author**

_*Carlos Fernández*_

> You can follow me on
[github](https://github.com/carlosfdezb)

Copyright © 2021 [Cuevana3 Scraper](https://github.com/carlosfdezb/cuevana3).

<p align="center">
  <a href="http://forthebadge.com/" target="_blank">
    <img src="http://forthebadge.com/images/badges/built-with-love.svg"/>
  </a>
</p>

#   C u e v a n a S c r a p e r 
 
 