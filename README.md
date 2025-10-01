# Rello — Telegram Stars (XTR) Corgi Pet Game

WebApp игра для Telegram: пополняй баланс **Stars/XTR**, кликай, улучшай корги-питомца и соревнуйся в еженедельном топе — победитель получает **50% пула**.

## Стек
- Next.js (App Router) + TypeScript, Tailwind
- Vercel (Serverless, Cron)
- Vercel Postgres (или любой Postgres)
- Vercel KV (опционально, rate-limit)
- Telegram WebApp + Payments (Stars/XTR)

## Быстрый старт
1. **Создай бота** в @BotFather
   - `/newbot` → получи `BOT_TOKEN`, `BOT_USERNAME`
   - Включи **Payments** (Stars/XTR) → `PAYMENT_PROVIDER_TOKEN`
   - В разделе Web App укажи домен Vercel и стартовую страницу `/`
2. **Склонируй проект** и установи зависимости:
   ```bash
   pnpm i    # или npm/yarn
   cp .env.example .env.local
   ```
3. **Заполни .env.local** (BOT_TOKEN, PAYMENT_PROVIDER_TOKEN, NEXT_PUBLIC_WEBAPP_TITLE, DB и т.д.)
4. **База данных**: на Vercel создай **Postgres** и скопируй переменные.
5. **Локальный запуск**:
   ```bash
   pnpm dev
   ```
   Открой бота → кнопку **Open WebApp**.
6. **Деплой на Vercel**:
   - Импортируй репозиторий → Deploy
   - Перенеси переменные из `.env.local` в Project Settings → Environment Variables
7. **Вебхук платежей**: укажи `https://<vercel-domain>/api/payments/callback`
8. **Крон на выплаты** (еженедельно, напр. Пн 00:05 UTC): `GET https://<vercel-domain>/api/cron/payout`

## Игровая логика
- **Пополнение XTR** → баланс → 50% всех за неделю в призовой фонд
- **Рост корги**: XP за клики, апгрейды повышают `tap_power`/`tap_multiplier`
- **Топы**: недельный (по росту), общий (по XP)
- **Приз**: 50% пула прошлой недели победителю

## Античит
- Серверная верификация Telegram `initData` (HMAC)
- Rate limit 8 кликов/сек через Vercel KV
- Серверный подсчёт XP

## Настройка апгрейдов
Создай записи в таблице `upgrades`:
```sql
insert into upgrades (code, title, description, price_xtr, effect)
values
('tap_power_1', 'Сила клика +1', 'Каждый клик даёт больше XP', 50, '{"tap_power":1}'),
('mult_1', 'Множитель +1', 'Увеличивает общий множитель', 120, '{"tap_multiplier":1}');
```
