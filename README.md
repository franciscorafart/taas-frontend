# About

This is an AI powered Tarot reading app

## How to run locally

1. On `./` directory run `$ yarn install` to instal front-end dependencies
2. On `./` directory, run `$ yarn dev` to run with nodemon

## Deployment notes

- _redirects file neede in public dir with `_/\* /index.html 200` for React Router to work on Netlify
- `NODE_OPTIONS='--openssl-legacy-provider'` needed on build script to avoid error on Netlify build
