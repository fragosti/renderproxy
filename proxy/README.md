# proxy

Prerender Proxy

Available at http://proxy-prod.jscysrqm63.us-west-2.elasticbeanstalk.com/
IP address: 34.220.121.154


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
#### Run in *development* mode:
Runs the application is development mode. Should not be used in production

```shell
yarn run dev
```

or debug it

```shell
yarn run dev:debug
```

#### Run in *production* mode:

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

You can deploy using `yarn deploy` assuming you have the AWS elastic beanstalk set up in as described [here](../README.md).

#### Creating a new Elastic Beanstalk Environment

Make sure to use the "network" ELB type, so as to obtain a static IP.

```
$ eb create <ENV_NAME> --elb-type network
```