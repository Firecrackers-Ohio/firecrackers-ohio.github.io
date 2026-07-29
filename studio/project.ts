/**
 * Sanity project coordinates.
 *
 * These are NOT secrets. A project ID and dataset name are public identifiers —
 * anyone can read a public dataset with them, which is exactly what the website
 * does at build time. Only write access requires a token.
 *
 * Find these at https://sanity.io/manage under the "Firecrackers" project.
 */
export const projectId = "9mzt60a4";
export const dataset = "production";

/**
 * Subdomain for the Sanity-hosted Studio: <studioHost>.sanity.studio
 * Must be globally unique across all Sanity users. Change it if `sanity deploy`
 * reports the name is taken.
 */
export const studioHost = "firecrackersohio";
