import { aboutPage } from "./aboutPage";
import { team } from "./team";

export const schemaTypes = [aboutPage, team];

/**
 * Document types that should behave as singletons: one fixed document, no
 * "create new" or "delete" actions in the Studio.
 */
export const singletonTypes = new Set(["aboutPage"]);
