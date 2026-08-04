import {
  userHasRole,
  type ConditionalPropertyCallbackContext,
  type CurrentUser,
} from "sanity";

/**
 * The logged-in user as the Studio hands it to us. Field-level callbacks get a
 * `CurrentUser` without the deprecated `role` singular, so accept the wider
 * shape and every call site lines up.
 */
type StudioUser = Omit<CurrentUser, "role"> | null;

/**
 * Who sees what in the Studio.
 *
 * Coaches get Sanity's built-in **Editor** role, which can publish. Anything a
 * coach shouldn't have to think about — the team name, the web address, the
 * age-group birth years, the whole About page — is hidden from them here so the
 * Studio only shows the fields they actually maintain.
 *
 * This is a clarity measure, not a security boundary. Per-field and per-document
 * permissions come from Sanity's custom roles, which are an Enterprise feature;
 * the Content Lake still accepts writes to these fields from anyone with edit
 * access. That's fine for what this is: the point is a short, obvious form, not
 * a lock.
 */
export function isAdmin(currentUser: StudioUser): boolean {
  return userHasRole(currentUser, "administrator");
}

/**
 * Drop-in `hidden` callback for fields only an administrator should see.
 *
 * Only use it on optional fields, or on required fields that are always filled
 * in at creation time (`name`, `slug`). A required field that is both empty and
 * hidden blocks publishing with an error the coach can't see the cause of —
 * which is why coaches can't create teams; see `sanity.config.ts`.
 */
export const adminOnly = ({
  currentUser,
}: ConditionalPropertyCallbackContext) => !isAdmin(currentUser);
