# redis

Renderproxy uses [redisjson](https://oss.redislabs.com/redisjson/) under the hood for caching and telemetry.

To run it locally run:

```
docker run -p 6379:6379 --name redis-redisjson redislabs/rejson:latest
```