# How it works

Renderproxy is the easiest way to set up a reverse proxy to any website or endpoint.

A reverse proxy is software running on a server that forwards requests and responses from an origin server (the server being proxied).

![reverse proxy](https://www.cloudflare.com/img/learning/cdn/glossary/reverse-proxy/reverse-proxy-flow.svg)

Running a reverse proxy can bring many benefits, but is typically difficult to set up. With renderproxy, you can configure one instantly and get the features described below.

## Dynamic Rendering

One of the main use-cases of renderproxy is to implement [dynamic rendering](https://webmasters.googleblog.com/2019/01/dynamic-rendering-with-rendertron.html), which can help Javascript client-side rendered sites with SEO issues.

Read about how to set up dynamic rendering for your Javascript site on [GitHub pages](/blog/dynamic-rendering-with-git-hub-pages) or on an [AWS S3](/blog/dynamic-rendering-with-s3) bucket.

## Free Custom Domains and Profiles

Another main use-case of renderproxy is to [get free custom domains](/blog/get-free-custom-domains) for any website builder. In fact, you can proxy any website and replace the domain with one you own. 

You can even use social profiles as the origin URL. For example, if you own yourname.com, you can point that to https://github.com/yourprofile, or https://linkedin.com/yourprofile.

## Encryption

Secure connections are better and encrypting and decrypting SSL (or TLS) communications for each client can be computationally expensive for an origin server. A reverse proxy can be configured to decrypt all incoming requests and encrypt all outgoing responses, freeing up valuable resources on the origin server.

## Caching

Renderproxy caches aggressively so you don't pay a performance penalty for using renderproxy in front of you website. You can configure and clear the cache from your dashboard.
