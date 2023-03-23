# Next.js client-only SPA example

Made this example to show how to use Next.js router for a 100% SPA (no JS server) app.

You use Next.js router like normally, but don't define `getStaticProps` and such. Instead you do client-only fetching with `swr`, `react-query`, or similar methods.

You can generate HTML fallback for the page if there's something meaningful to show before you "know" the params. (Remember, HTML is static, so it can't respond to dynamic query. But it can be different per route.)

> Don't like Next? [Here's how to do the same in Gatsby.](https://www.gatsbyjs.com/docs/how-to/routing/client-only-routes-and-user-authentication/)

## Building

```
npm run build
```

This produces a **purely static app** in `out/` folder.

It's purely static in the sense that it doesn't require Node.js — but **router transitions are all client-side.** It's an SPA.

## Deploying

Host the `out/` folder anywhere on a static hosting.

There is however an unintuitive caveat — which is maybe why people don't use Next.js widely this way at the moment.

In traditional SPA setups like CRA and Vite, you have one file like `index.html` that's served for every route. The downside of this is that (1) it's empty, (2) it contains **your entire bundle** by default (code splitting and `React.lazy` doesn't help here a lot because it creates waterfalls — you still have to load the main bundle first before it "decides" to load other scripts).

But if you look at what Next.js generated, it's an HTML file **per route**:

- `out/index.html`
- `out/404.html`
- `out/stuff/[id].html`

So you'd need to teach your static server to do this rewrite:

- rewrite `/` to `out/index.html`
- rewrite `/stuff/whatever` to `out/stuff/[id].html`

The syntax for these rewrites is different for different static hosts, and I don't think there's an automated solution yet.

I suspect this is why a lot of people don't realize Next.js can produce SPAs. It's just not obvious how to set this up.

Ideally I think Next.js should either pregenerate such rewrite lists for common static hosts (e.g. Nginx, Apache) etc or there should be some common format that can be adopted across providers (e.g. Vercel, Netlify, etc).

(Note that if we didn't do `next export`, Next.js would **still** create static output, but it would also generate a Node.js server that serves *that* static output. This is why by default SSG mode in Next.js emits a Node.js app. But it doesn't mean your app needs Node.js by default. **Next.js apps don't need Node.js at all by default, until you start using server-only features.** But you *do* need to rewrite your requests to serve the right HTML file for each route.)

## This is a better SPA

It **makes sense** to have an HTML file per route even if you're doing an SPA. Yes, we need to figure out a good way to set up these rewrite maps, but it's strictly better than serving one `index.html` page with a giant bundle (or a smaller bundle + a bunch of code that's loaded in a waterfall), which is how SPAs are typically done today.

It's also great to **have the ability** to do a bunch of stuff at the build time. E.g. I can still do `getStaticProps` + `getStaticPaths` in this app to pregenerate a bunch of HTML files **with actual content**. It's still an SPA and still can be hosted statically! I can also eventually decide to add a server, and I don't need to rewrite anything.

