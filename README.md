
!!! warning [actions](.github/workflows/docker-publish.yml)

home page web app

## files

```
├── Dockerfile
├── app.config.ts          // cache headers configured here
├── public                 //   for static resources served from here
│   ├── favicons
│   └── fonts
├── src
│   ├── app.css
│   ├── app.tsx            // suspense and filerouter
│   ├── entry-client.tsx
│   ├── entry-server.tsx
│   └── routes
│       ├── (root)
│       │   ├── dns.tsx    // dns tool
│       │   └── index.tsx  // home page
│       ├── (root).tsx     // // maybe can be removed?
│       └── [...404].tsx   // 404 catchall
└── tsconfig.json
```

## dns

DNS Lookup Tool utilizing the DNS-over-HTTPS endpoint provided by CloudFlare

 - [ ] perform lookups against the common types for a given domain
   - [ ] A
   - [ ] AAAA
   - [ ] CNAME
 - [ ] based on the results, recurse automatically
   - [ ] 
- [ ]  dns -> dns/domain.com
                  /TYPE:domain


## todo

 - [ ] `hydrate` in entry-client?
 - [X] add multi-platform build and compose
 - [X] add sitemap
 - [X] return 404 status code
 - [ ] add meta descriptions
 - [ ] add meta:og tags
 - [ ] 

## Setup

 ```
 git clone
 npm i
 npm run build
 npm run start
 ```