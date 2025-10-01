# Rello Hotfix

1) **Open in Telegram**: The WebApp must be launched from the bot (`t.me/<BOT_USERNAME>/app`). If you open the Vercel URL in Safari/Chrome, `initData` will be empty and `/api/auth/verify` will return 401.
2) **Stars/XTR**: No `provider_token`. We use `createInvoiceLink` → `tg.openInvoice(link)`.
3) **DB**: Use a valid Postgres URL (Vercel Postgres/Neon). Avoid `api.pooler.supabase.com` — it's not a valid hostname.

Apply files in this patch over your repo and redeploy.
