<p align="center">
    <img src=".github/.media/colly-logo.png" width="120" height="120" alt="Colly app logo">
</p>

<h1 align="center">Colly</h1>
<p align="center">Web-based Website URL Collection app</p>

<br>

<p align="center">
    <a href="https://github.com/jarne/colly/blob/main/package.json">
        <img src="https://img.shields.io/github/package-json/v/jarne/colly.svg" alt="Package version">
    </a>
    <a href="https://circleci.com/gh/jarne/colly">
        <img src="https://circleci.com/gh/jarne/colly.svg?style=svg&circle-token=0e76027eadc4f54e64529265f8e3aa6def8ba11d" alt="Build status">
    </a>
    <a href="https://github.com/jarne/colly/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/jarne/colly.svg" alt="License">
    </a>
</p>

##

[• Description](#-description)  
[• Usage](#-usage)  
[• Contribution](#-contribution)  
[• License](#%EF%B8%8F-license)

## 📙 Description

Colly is a web-based URL/website collection app, where you can add links to your favourite web pages and organize them using tags.

### Screenshots

<img src=".github/.media/screenshot.png" alt="Screenshot of Colly web app">

## 🖥 Usage

### Setup & requirements

...

#### Environment variables

The following environment variables can be set:

| Env variable               | Default Value      | Description                                                 |
| -------------------------- | ------------------ | ----------------------------------------------------------- |
| `MONGO_HOST`               |                    | Hostname of MongoDB                                         |
| `MONGO_PORT`               | `27017`            | Port of MongoDB                                             |
| `MONGO_DB`                 |                    | MongoDB database name                                       |
| `JWT_SECRET`               |                    | Random secret for JWT                                       |
| `EXPIRES_IN_SEC`           | `86400`            | Expiration of JWT (in seconds)                              |
| `PREVIEW_SCREENSHOTS_PATH` | `content/previews` | Path of the preview screenshots storage                     |
| `PREVIEW_WIDTH`            | `640`              | Width of preview screenshots                                |
| `PREVIEW_HEIGHT`           | `400`              | Height of preview screenshots                               |
| `PREVIEW_TIMEOUT`          | `3`                | Timeout when loading website to create preview (in seconds) |

## 🙋‍ Contribution

Contributions are always very welcome! It's completely equal if you're a beginner or a more experienced developer.

Thanks for your interest 🎉👍!

## 👨‍⚖️ License

[MIT](https://github.com/jarne/colly/blob/main/LICENSE)
