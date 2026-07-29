import { aboutPage } from "./aboutPage";

export const schemaTypes = [aboutPage];

/**
 * Document types that should behave as singletons: one fixed document, no
 * "create new" or "delete" actions in the Studio.
 */
export const singletonTypes = new Set(["aboutPage"]);
