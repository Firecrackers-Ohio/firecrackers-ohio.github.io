import { defineCliConfig } from "sanity/cli";

import { dataset, projectId, studioHost } from "./project";

export default defineCliConfig({
  api: { projectId, dataset },
  // Where `npx sanity deploy` publishes the Studio: <studioHost>.sanity.studio
  studioHost,
  // The Studio is deployed on its own, never as part of the Astro site build.
  // Auto-updates let Sanity ship Studio patches without a redeploy from here.
  deployment: { autoUpdates: true },
});
