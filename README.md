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
        <img src="https://circleci.com/gh/jarne/colly.svg?style=shield" alt="Build status">
    </a>
    <a href="https://github.com/jarne/colly/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/jarne/colly.svg" alt="License">
    </a>
</p>

##

[Description](#-description) | [Usage](#-usage) | [Contribution](#-contribution) | [License](#%EF%B8%8F-license)

## 📙 Description

Colly is a web-based application designed for effortlessly collecting and organizing your favorite URL's and websites.
With Colly, users can create a personalized library of web pages.

One of Colly's features is its tagging system, which allows users to categorize and organize their collections with ease.
Whether it's articles, blogs, tutorials, or any other web content, users can assign relevant tags to each link,
enabling efficient retrieval and navigation within their collections.

The collection of a user can also be set as public and accessed using a public access link by
anyone who has the link.

Whether you're a student, professional, or simply someone who loves to explore the web,
Colly empowers users to create curated collections tailored to their unique preferences and interests.
Say goodbye to scattered bookmarks and hello to a more organized, accessible, and enjoyable web browsing experience with Colly.

### Screenshots

<img src=".github/.media/screenshot-login.png" alt="Screenshot of Colly login page">

<img src=".github/.media/screenshot-dashboard.png" alt="Colly item dashboard">

<img src=".github/.media/screenshot-item-edit.png" alt="Item edit view">

## 🖥 Usage

### Setup & requirements

The back-end of the application is written using Node.js and the Express framework, while
the front-end part uses React.

As dependencies, a MongoDB database and an S3-compatible object storage, such as MinIO,
are required. Its access credentials need to be configured using the environment variables below.

#### Deploy using Docker

The recommended way to deploy Colly is using its [Docker](./Dockerfile) image.

The image can be pulled from the
[GitHub Packages registry](https://github.com/users/jarne/packages/container/package/colly)
using: `docker pull ghcr.io/jarne/colly:latest`.

#### Environment variables

The following environment variables can be set:

| Env variable             | Default Value | Description                                                     |
| ------------------------ | ------------- | --------------------------------------------------------------- |
| `MONGO_HOST`             |               | Hostname of MongoDB                                             |
| `MONGO_PORT`             | `27017`       | Port of MongoDB                                                 |
| `MONGO_DB`               |               | MongoDB database name                                           |
| `JWT_SECRET`             |               | Random secret for JWT                                           |
| `EXPIRES_IN_SEC`         | `86400`       | Expiration of JWT (in seconds)                                  |
| `INITIAL_ADMIN_USERNAME` |               | Create initial admin user with this username                    |
| `INITIAL_ADMIN_PASSWORD` |               | Password for initial admin user                                 |
| `LOG_LEVEL`              | `info`        | Log level of the app                                            |
| `LOKI_HOST`              |               | Hostname for Grafana Loki to send logs to                       |
| `LOKI_BASIC_AUTH`        |               | Authentication credentials (basic auth format) for Grafana Loki |
| `S3_ENDPOINT`            |               | Hostname for S3-compatible endpoint for image storage           |
| `S3_REGION`              |               | S3 region to use                                                |
| `S3_ACCESS_KEY`          |               | Access key ID for S3 endpoint                                   |
| `S3_ACCESS_SECRET`       |               | Secret access key for S3 endpoint                               |
| `S3_BUCKET`              |               | Name of the S3 bucket                                           |

## 🙋‍ Contribution

Contributions are always very welcome! It's completely equal if you're a beginner or a more experienced developer.

Thanks for your interest 🎉👍!

## 👨‍⚖️ License

[MIT](https://github.com/jarne/colly/blob/main/LICENSE)
