# Greenfield Demo

This repo contains the source code powering [https://greenfielddemo.com/](https://greenfielddemo.com/).

## Getting started

### Prerequisites

1. Git
1. Node (>=24.0.0), npm (>=11.0.0)
1. A fork of the repo (for any contributions)
1. A clone of the [greenfielddemo repo](https://github.com/hellocoop/greenfielddemo) on your local machine

### Running locally

1. `npm install`
1. `npm run dev`
1. `open http://localhost:5173` to open the site in your favorite browser

## License

[MIT](LICENSE)
## Deployment

www.greenfielddemo.com is served from Cloudflare Workers as static assets (see `wrangler.toml`).

- `npm run build` writes the site to `dist/`.
- `worker/index.js` proxies `POST /api/event` to Plausible; every other path is a static asset.
- Merging a PR into `main` requires the **Ready for merge** check and the **Cloudflare Workers** preview build to pass.
- Cloudflare Workers Builds watches `main` and deploys on merge. Nothing deploys from GitHub Actions.
- `public/_headers` sets the CSP and is copied into `dist/` by the build.
- `npm run deploy` deploys by hand with your own Cloudflare login. Normally unnecessary.
