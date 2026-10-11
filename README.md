# Design review tool for every screen case

A web app where AI reads a branch's code and finds every screen case. A designer checks each case, leaves pins and comments, and sends them to the developer. After the fix, the AI checks again and the designer approves.

This is a take-home project. The data, the developer, and the code host are simulated, so the whole flow works without a backend.

## Run it

You need Node.js 18 or newer.

```
cd app
npm install
npm run dev
```

Open the address that the terminal shows (usually http://localhost:5173).

Other commands:

- `npm run build` builds the app.
- `npm run preview` serves the built app.
- `npm run typecheck` checks the types.

## Try the flow

1. Open the app as the designer (Emma). Add a project or open the request in the notification bell.
2. Check each case. Use Full screen and Inspect, then add pins and comments.
3. Click Approve and finish. This sends the comments to the developer.
4. Switch to the developer (Tom) at the bottom of the left sidebar. Click Ready for re-check.
5. Switch back to the designer. The AI marks each comment as resolved or not resolved. Turn on Show earlier comments to see the resolved ones.

Reset demo, in the same menu, clears all data.

## Docs

- `docs/product-brief.md`: why this is built, who it is for, and what it does.
- `docs/user-journey.md`: the steps for the designer and the developer.
- `docs/pages.md`: every page and its address.
- `docs/design-system.md`: the parts and rules of the design.

## Tech

React, TypeScript, Vite, and React Router. Data is kept in the browser, in local storage.
