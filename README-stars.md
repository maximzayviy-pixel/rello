# Telegram Stars (XTR) in Rello

For **digital goods**, Telegram Stars do **not** require a provider token.
Use Bot API with `currency: "XTR"` and **omit** `provider_token` for `sendInvoice` / `createInvoiceLink`.

Flow we use:
1) Client calls `/api/invoice/create` with amount in Stars.
2) Server calls **createInvoiceLink** (preferred). If it fails, fallback to **sendInvoice**.
3) In the WebApp, call `tg.openInvoice(link)` to open the Stars pay sheet.
4) On successful payment, Telegram sends an update; our `/api/payments/callback` marks it as `paid`, credits balance, and increases weekly pool.

Notes:
- WebApp must be opened **inside Telegram** for `openInvoice` to work best.
- For physical goods or legacy fiat providers, provider_token is still required — but **not** for Stars (XTR).
