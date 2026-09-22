#!/usr/bin/env node
/**
 * Reset the password of the admin user (or any user) on Supabase.
 *
 * Usage (from this project folder, .env must exist):
 *   pnpm reset-admin-password you@example.com "new-strong-password"
 *
 * Requires VITE_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.
 * Uses the Supabase admin API (service role), never the frontend anon key.
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

const email = process.argv[2];
const password = process.argv[3];

function fail(message) {
  console.error(`\n[reset-admin-password] ${message}\n`);
  process.exit(1);
}

if (!url || !secret) {
  fail(
    'Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY. Make sure a .env file exists ' +
      '(copy .env.example to .env) before running this script.',
  );
}

if (!email || !password || email === '--help' || email === '-h') {
  console.log(`
reset-admin-password — reset the password of an existing user.

Usage:
  pnpm reset-admin-password <email> <new-password>

Requires a .env file containing:
  VITE_SUPABASE_URL=<project url>
  SUPABASE_SECRET_KEY=<secret key>

Effect:
  Finds the user by email and updates their password + forces a sign-out
  of any existing sessions (they must sign in again with the new password).
`);
  process.exit(0);
}

const supabase = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(`[reset-admin-password] Looking up ${email} …`);

const { data: list, error: listError } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listError) fail(`Could not list users: ${listError.message}`);

const match = list.users?.find(
  (u) => (u.email ?? '').toLowerCase() === email.trim().toLowerCase(),
);
if (!match) {
  fail(
    `No user with email "${email}" was found. ` +
      `Create one instead with: pnpm create-admin "${email}" "<password>"`,
  );
}

const { data: updated, error: updateError } =
  await supabase.auth.admin.updateUserById(match.id, {
    password,
    app_metadata: { role: 'admin' },
    user_metadata: match.user_metadata,
  });
if (updateError) {
  fail(`Could not update password: ${updateError.message}`);
}

await supabase.auth.admin.signOut(match.id).catch(() => {});

console.log(
  `[reset-admin-password] Done. Password changed for:\n` +
    `  email:        ${email}\n` +
    `  id:           ${match.id}\n` +
    `  app_metadata: ${JSON.stringify(updated?.user?.app_metadata ?? match.app_metadata)}\n\n` +
    `They were signed out of all devices and must sign in again at ` +
    `<your-site>/panel-x7k2mt9 with the new password.`,
);