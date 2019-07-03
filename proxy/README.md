# proxy

Prerender Proxy

Available at
IP address: 35.193.207.37

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

#### Run in _production_ mode:

Compiles the application and starts it in production production mode.

```shell
yarn run build
yarn start
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

You can deploy using `./scripts/deploy.sh` assuming you have set up google cloud and kubectl as described [here](../README.md).
