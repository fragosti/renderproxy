# api

Prerender API

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

Install virtualenv and create an env to install awsebcli.

```
$ pip install --user virtualenv
$ virtualenv eb-env
$ source eb-env/bin/activate
$ pip install awsebcli --upgrade
```

You need the correct acccess keys in ~/.aws/config with profile `eb-cli` to deploy the EB instance using `yarn deploy`.

#### Creating a new Elastic Beanstalk Environment

Make sure to use the "network" ELB type, so as to obtain a static IP.

```
$ eb create <ENV_NAME> --elb-type network
```