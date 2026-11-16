/**
 * Sections of the site that exist but are not ready to show.
 *
 * Changelog and Shipped (the weekly digest) have no entries yet. While this is
 * false they are left out of the navigation and the sitemap, and their pages
 * ask search engines not to index them. The pages still load at their URLs.
 * Set it to true once there is something to show.
 */
export const SHOW_LOG_PAGES = false;

/** Robots setting for pages behind SHOW_LOG_PAGES: undefined keeps the site default. */
export const logPageRobots = SHOW_LOG_PAGES ? undefined : { index: false, follow: true };
