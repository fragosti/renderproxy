# redis

Renderproxy uses [redis](https://hub.docker.com/_/redis?tab=tags) under the hood for caching and usage tracking.

To run it locally run:

```
docker run -p 6379:6379 --name redis redis:latest
``` 