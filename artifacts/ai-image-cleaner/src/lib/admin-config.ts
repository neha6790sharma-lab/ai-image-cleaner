/**
 * Hard-to-guess admin URLs. These paths are deliberately NOT "admin" or
 * "login" and must never be linked from the public site, navigation menus,
 * sitemap.xml or robots.txt (robots.txt disallows them explicitly).
 */

export const ADMIN_BASE_PATH = '/panel-x7k2mt9';

export const ADMIN_LOGIN_PATH = ADMIN_BASE_PATH;

export const ADMIN_DASHBOARD_PATH = `${ADMIN_BASE_PATH}/dashboard`;

export const ADMIN_POSTS_PATH = `${ADMIN_BASE_PATH}/posts`;

export const ADMIN_POST_NEW_PATH = `${ADMIN_POSTS_PATH}/new`;

export const ADMIN_POST_EDIT_PATH = `${ADMIN_POSTS_PATH}/:id`;