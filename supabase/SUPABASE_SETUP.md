# Shams Glass — Supabase Setup

This guide walks you through the complete Supabase configuration needed to run the Shams Glass website locally and in production.

---

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New project**, name it (e.g. `shams-glass`), and choose a region close to your users.
3. Wait for the project to provision.

---

## 2. Run the database migration

1. In your Supabase project, open the **SQL editor**.
2. Open `supabase/migrations/0001_init.sql` from this project.
3. Paste the entire file contents into the SQL editor and run it.

This creates the `categories`, `products`, and `product_images` tables with:
- Correct data types, constraints, and indexes.
- An `updated_at` auto-update trigger on `products`.
- Row Level Security (RLS) policies (public visitors read only published data; admins use the service role key, which bypasses RLS).
- Seeded default product categories.

---

## 3. Create the Storage bucket

1. In your Supabase project, go to **Storage**.
2. Click **New bucket**.
3. Name it exactly: `product-images`
4. Set it to **Public** (product images are shown on the public website).
5. Click **Create**.

### Storage policies

In the **product-images** bucket, open **Policies** and add:

**Allow public reads:**
```sql
create policy "product-images: public read"
  on storage.objects for select
  using (bucket_id = 'product-images');
```

**Allow authenticated uploads (admin writes go through the service role in server code; this policy covers any edge-case auth-based uploads):**
```sql
create policy "product-images: authenticated insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');
```

**Allow authenticated deletes:**
```sql
create policy "product-images: authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
```

> **Note:** The application uses the service role key for all admin writes (upload + delete), which bypasses all storage policies. The policies above are fallback coverage.

---

## 4. Create an admin user in Supabase Auth

The admin dashboard requires a Supabase Auth user **whose email is in the `ADMIN_EMAILS` allowlist**.

1. In your Supabase project, go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter the admin's email and a strong password.
4. Click **Create user**.

Keep the password safe — it is needed to log in to `/admin/login`.

---

## 5. Configure environment variables

Copy `.env.example` to `.env.local` in the project root and fill in:

```bash
# Get from: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Comma-separated list of emails allowed to access the admin dashboard.
# Must match the email(s) you created in Supabase Auth above.
ADMIN_EMAILS=owner@shamsglass.com

# Your deployed URL (no trailing slash)
NEXT_PUBLIC_SITE_URL=https://shamsglass.com

# Business contact details (shown across the public site)
NEXT_PUBLIC_WHATSAPP_NUMBER=+971XXXXXXXXX
NEXT_PUBLIC_BUSINESS_PHONE=+971 X XXXX XXXX
NEXT_PUBLIC_BUSINESS_EMAIL=info@shamsglass.com
NEXT_PUBLIC_BUSINESS_ADDRESS=Dubai, United Arab Emirates

# Contact form delivery via Resend (optional but recommended)
# Sign up at https://resend.com — free tier handles ~100 emails/day
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_FORM_TO=info@shamsglass.com
CONTACT_FORM_FROM=no-reply@shamsglass.com
```

**Never commit `.env.local` to Git.** The `.gitignore` already excludes it.

### Where to find the Supabase keys

1. In your Supabase project, go to **Settings → API**.
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy **Project API keys → anon / public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy **Project API keys → service_role** → `SUPABASE_SERVICE_ROLE_KEY`.

> **Security**: The service role key bypasses all Row Level Security. Never expose it in browser-side code or public environment variables (`NEXT_PUBLIC_` prefix). It only runs in server-only modules.

---

## 6. Verify the setup

1. Run the dev server: `npm run dev`
2. Open `http://localhost:3000` — the homepage should load with a "Connect Supabase" notice in the product collection (until Supabase credentials are added).
3. With credentials added, the collection shows "No published products yet" until you add some.
4. Visit `http://localhost:3000/admin/login` and sign in with the admin email/password you created.
5. Go to **Products → Add Product**, create a product, set it to Published, and save.
6. Return to the homepage — the product should now appear in the collection.

---

## 7. Production deployment (Vercel)

1. Push the project to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. In **Settings → Environment Variables**, add all values from `.env.local`.
4. Deploy. Vercel will detect Next.js and configure the build automatically.
5. Update `NEXT_PUBLIC_SITE_URL` to your production domain.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Homepage shows amber "Supabase not configured" notice | `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` missing from `.env.local` |
| Admin login shows amber notice | Same as above |
| Admin dashboard shows "Service role key required" | `SUPABASE_SERVICE_ROLE_KEY` missing |
| Products not appearing after publish | Verify `is_published = true` in Supabase DB; check browser network tab for RLS errors |
| Images not loading | Check the `product-images` bucket is set to Public; verify storage policy |
| Contact form says "delivery not configured" | Add `RESEND_API_KEY`, `CONTACT_FORM_TO`, and `CONTACT_FORM_FROM` to `.env.local` |
