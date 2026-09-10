#!/usr/bin/env node
/**
 * Create the admin user for the secret admin panel.
 *
 * Usage (from this project folder):
 *   pnpm create-admin you@example.com "a-strong-password"
 *
 * This must be run on a machine that has the SUPABASE_SECRET_KEY in .env -
 * it never touches frontend code. The created user gets
 * app_metadata: { "role": "admin" }, which the Row Level Security policies
 * use to decide who may write posts/settings.
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

const email = process.argv[2];
const password = process.argv[3];

function fail(message) {
  console.error(`\n[create-admin] ${message}\n`);
  process.exit(1);
}

if (!url || !secret) {
  fail(
    'Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY. Make sure a .env file exists ' +
      '(copy .env.example to .env) and that you run this via `pnpm create-admin`.',
  );
}

if (!email || !password || email === '--help' || email === '-h') {
  console.log(`
create-admin — create the admin user for the secret admin panel.

Usage:
  pnpm create-admin <email> <password>

Requires a .env file containing:
  VITE_SUPABASE_URL=<project url>
  SUPABASE_SECRET_KEY=<secret key>

Effect:
  Creates the user with email_confirm=true and app_metadata.role="admin",
  which is what the blog/settings Row Level Security policies check for.
`);
  process.exit(0);
}

const supabase = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(`[create-admin] Creating admin user ${email} …`);

const { data: created, error: createError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: { role: 'admin' },
});

let userId = created?.user?.id;
if (createError) {
  if (/already.*exis/i.test(createError.message)) {
    console.warn(
      `[create-admin] A user with this email already exists. Your password was NOT changed.`,
    );
    const { data: find, error: findError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (findError) fail(findError.message);
    const match = find.users?.find((u) => u.email === email);
    if (!match) fail('User exists but could not be looked up.');
    userId = match.id;
  } else {
    fail(createError.message);
  }
}

if (!userId) fail('User id was not returned.');

const { error: roleError } = await supabase.auth.admin.updateUserById(userId, {
  app_metadata: { role: 'admin' },
});

if (roleError) {
  fail(`Could not set admin role: ${roleError.message}`);
}

const { data: confirm } = await supabase.auth.admin.getUserById(userId);
console.log(
  `[create-admin] Done. Admin user ready:\n` +
    `  email:        ${confirm?.user?.email ?? email}\n` +
    `  id:           ${userId}\n` +
    `  app_metadata: ${JSON.stringify(confirm?.user?.app_metadata)}\n\n` +
    `Sign in at <your-site>/panel-x7k2mt9 (the secret admin URL defined in src/lib/admin-config.ts).`,
);