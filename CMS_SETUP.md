# Kava Koru Events CMS Setup

The public page reads published events from Sanity. Editors sign in to Sanity Studio to create, update, and publish events; no write token is placed on the public website.

## 1. Create the Sanity project and Studio

1. Install Node.js 22.12 or newer, which includes npm.
2. From the KavaKoruSimple project folder, run `npm create sanity@latest`.
3. Sign in or create a Sanity account, create a project, choose the `production` dataset, and set the Studio output folder to `studio`.
4. In Sanity project settings, make the `production` dataset publicly readable. It contains published site content, so do not store private information in it.

## 2. Add the event editor form

Copy the contents of `sanity-schema/event.ts` into `studio/schemaTypes/event.ts`, and the contents of `sanity-schema/index.ts` into `studio/schemaTypes/index.ts`.

In `studio/sanity.config.ts`, use the project ID from Sanity Manage, set the dataset to `production`, and ensure the schema configuration imports `schemaTypes` from `./schemaTypes`:

```ts
import {schemaTypes} from './schemaTypes'

// Keep the generated plugins and other config; set these values in defineConfig:
projectId: 'YOUR_SANITY_PROJECT_ID',
dataset: 'production',
schema: {types: schemaTypes},
```

Run the Studio locally from its folder with `npm run dev`. The editor can add events with a name, date, time, description, and flyer. Publish an event when it is ready to appear on the website. To host the editor, run `npx sanity deploy` from the `studio` folder and follow the prompts.

## 3. Connect the public page

Replace `YOUR_SANITY_PROJECT_ID` in `events-config.js` with the project ID shown in Sanity Manage. The dataset and API version are already set. The public page shows published events dated today or later, ordered by date; it updates when visitors reload the page.

For local browser testing, serve the site over HTTP (for example, with the VS Code Live Server extension), then add that exact origin under **Sanity Manage > Project > API > CORS Origins**. Add the final website origin there too after hosting, such as `https://www.example.com`. Public read access does not require credentials.

## 4. Limit who can edit

In Sanity Manage, invite only the people who should maintain events and assign an editor-level role. They sign in to the Studio with their own accounts. The website's Sanity project ID is public by design; never put an API token in `events-config.js` or any other browser code.
