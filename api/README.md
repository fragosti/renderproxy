# api

Render Proxy API

Available at api.renderproxy.com

## Config Requirements

- Define a `dev.env` file for development.
- Get a `google-cloud-key-file.json` auth file for the Google cloud project.

## Quick Start

Get started developing...

```shell
# install deps
yarn install

# run in development mode
yarn run dev

# run tests
yarn run test
```

---

## Install Dependencies

Install all package dependencies (one time operation)

```shell
yarn install
```

## Run It

#### Run in _development_ mode:

Runs the application is development mode. Should not be used in production

```shell
yarn run dev
```

or debug it

```shell
yarn run dev:debug
```

## Test It

Run the Mocha unit tests

```shell
yarn test
```

or debug them

```shell
yarn run test:debug
```

## Debug It

#### Debug the server:

```
yarn run dev:debug
```

#### Debug Tests

```
yarn run test:debug
```

#### Deploy

You can build and push the image to GCR using `./scripts/build_and_push.sh` assuming you have set up google cloud and kubectl as described [here](../README.md).
