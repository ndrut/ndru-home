# ndru-home

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

## todo

 - [ ]  `hydrate` in entry-client?
 - [ ]  add multi-platform build and compose


## Setup

 ```
 git clone
 npm i
 npm run build
 npm run start
 ```