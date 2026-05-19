# Лендинг-визитка разработчика

Тестовое задание: лендинг-презентация себя как разработчика + рабочая форма обратной связи + AI-помощник.

**Деплой:** https://[ВАШ_ДОМЕН].vercel.app

---

## Что внутри

Полный цикл `frontend → API → обработка ошибок → результат`:

- **Лендинг** — Next.js 14 (App Router), TypeScript, SCSS modules. 6 секций, адаптивная вёрстка, sticky-навигация, анимации.
- **Форма обратной связи** — валидация на клиенте (Zod + React Hook Form) и сервере (class-validator), состояния `idle / loading / success / error`, honeypot против ботов.
- **NestJS API** — два эндпоинта (`POST /api/contact`, `POST /api/chat`), глобальный exception filter, rate limiting, CORS.
- **Почта** — после отправки формы уходит два письма: владельцу сайта и копия пользователю. Транспорт — Nodemailer + SMTP (Resend / Gmail / Mailtrap — на выбор).
- **AI-помощник** — плавающий чат-виджет в углу. Спрашивает про опыт/стек/проекты; backend проксирует запросы в OpenAI с системным промптом, основанным на «карточке» разработчика.

---

## Стек

| Слой | Технологии |
| --- | --- |
| Frontend | Next.js 14 (App Router), TypeScript, SCSS Modules, React Hook Form, Zod |
| Backend | NestJS 10, class-validator, Nodemailer, @nestjs/throttler |
| AI | OpenAI SDK (gpt-4o-mini по умолчанию, легко заменить на Anthropic) |
| Деплой | Vercel (frontend) + Railway / Render (backend) |
| Прочее | npm workspaces, ESLint, dotenv |

---

## Структура проекта

```
landing/
├── apps/
│   ├── web/                       # Next.js frontend
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # сборка секций
│   │   ├── components/
│   │   │   ├── Nav.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Stack.tsx
│   │   │   ├── HowIWork.tsx
│   │   │   ├── Cases.tsx
│   │   │   ├── Contact.tsx        # форма
│   │   │   ├── ChatWidget.tsx     # AI-чат
│   │   │   ├── Footer.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   └── *.module.scss
│   │   ├── lib/api.ts             # типизированный API-клиент
│   │   ├── styles/
│   │   │   ├── globals.scss       # дизайн-токены, base
│   │   │   └── _mixins.scss
│   │   └── package.json
│   │
│   └── api/                       # NestJS backend
│       ├── src/
│       │   ├── main.ts            # bootstrap, CORS, validation pipe
│       │   ├── app.module.ts      # throttler, modules
│       │   ├── common/
│       │   │   └── http-exception.filter.ts
│       │   ├── contact/
│       │   │   ├── contact.dto.ts       # class-validator
│       │   │   ├── mailer.service.ts    # Nodemailer
│       │   │   ├── contact.service.ts   # 2 письма (owner + user)
│       │   │   ├── contact.controller.ts
│       │   │   └── contact.module.ts
│       │   └── chat/
│       │       ├── chat.dto.ts
│       │       ├── persona.ts           # данные для AI
│       │       ├── chat.service.ts      # OpenAI proxy
│       │       ├── chat.controller.ts
│       │       └── chat.module.ts
│       └── package.json
│
├── package.json                   # workspaces
└── README.md
```

---

## Запуск локально

### 1. Требования

- Node.js >= 18.17
- npm >= 9
- SMTP-аккаунт (Resend / Gmail App Password / Mailtrap)
- OpenAI API key (опционально — без него AI-чат вернёт `503`, остальное работает)

### 2. Установка

```bash
git clone https://github.com/USERNAME/landing.git
cd landing
npm install
```

`npm install` поднимет зависимости для обоих workspace-ов сразу.

### 3. Переменные окружения

**`apps/api/.env`** — скопируй из `.env.example` и заполни:

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000

# SMTP — пример для Resend
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASSWORD=re_xxx_your_api_key

MAIL_FROM="Landing Bot <noreply@yourdomain.com>"
OWNER_EMAIL=you@yourdomain.com

OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o-mini
```

**`apps/web/.env.local`**:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Старт

В двух терминалах:

```bash
# терминал 1 — API
npm run dev:api

# терминал 2 — фронт
npm run dev:web
```

- Фронтенд: http://localhost:3000
- API: http://localhost:4000/api

### 5. Тест формы вручную

```bash
curl -X POST http://localhost:4000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Тест",
    "phone": "+7 999 000-00-00",
    "email": "you@yourdomain.com",
    "comment": "Привет"
  }'
# → { "ok": true }
```

Через 5–10 секунд два письма должны прийти: одно на `OWNER_EMAIL`, второе — на email из формы.

---

## Как реализована форма

**На фронте (`components/Contact.tsx`):**

1. `react-hook-form` управляет состоянием полей и валидацией.
2. `zod` через `@hookform/resolvers/zod` описывает схему — те же правила, что и на бэке (имя 2–80, телефон по regex, email, комментарий до 2000).
3. Скрытое поле `website` — honeypot: реальные пользователи его не видят (off-screen), боты заполняют → запрос принимается, но письмо не уходит.
4. Состояния кнопки и формы: `idle` → `loading` (спиннер + disabled) → `success` (зелёный блок с сообщением, форма очищена) или `error` (красный блок с текстом ошибки, форма не очищена — можно попробовать снова).
5. Сетевые ошибки (`fetch` бросает) и серверные ошибки (не-2xx ответ) обрабатываются единообразно в `lib/api.ts`.

**На бэке (`apps/api/src/contact/`):**

1. `ContactDto` валидирует входящие данные через `class-validator` + `class-transformer` (trim, lowercase email). При невалидных данных NestJS вернёт `400` с массивом сообщений.
2. `ContactService`:
   - Проверяет honeypot — если заполнен, возвращает `{ ok: true }`, ничего не отправляя.
   - Формирует HTML и plain-text версии письма (с экранированием пользовательского ввода — XSS-защита в письмах).
   - Через `MailerService` (Nodemailer SMTP transport) отправляет письмо владельцу с `Reply-To: <email пользователя>` — можно отвечать в один клик.
   - Отправляет копию пользователю.
3. `ThrottlerGuard` ограничивает: 5 запросов в минуту на IP.
4. `HttpExceptionFilter` приводит все ошибки к единому JSON-формату: `{ ok: false, statusCode, code, message, path, timestamp }`.

---

## AI-помощник

**Что делает:** маленький чат в правом нижнем углу. Отвечает на вопросы про разработчика на основе фиксированной «карточки» (файл `apps/api/src/chat/persona.ts`).

**Как работает:**

1. Фронт (`components/ChatWidget.tsx`) хранит историю сообщений в локальном state. Открывается по кнопке, есть 4 подсказки-кнопки для быстрого старта.
2. При отправке шлёт `POST /api/chat` с последними ≤12 турнами диалога.
3. Бэк (`chat.service.ts`) собирает system prompt из `persona.ts` + историю и вызывает OpenAI Chat Completions API (`gpt-4o-mini`, temperature `0.4`, max 500 токенов).
4. System prompt инструктирует модель:
   - отвечать только по данным из persona;
   - не выдумывать факты;
   - если вопрос не по теме — мягко возвращать к теме разработчика;
   - отвечать на языке пользователя.
5. Rate limit: 20 сообщений в минуту на IP.
6. На фронте — состояния `loading` (typing-индикатор с тремя точками), `error` (красный блок внутри чата), кнопка очистки диалога.

**Чтобы заменить OpenAI на Anthropic:** в `chat.service.ts` импортируй `@anthropic-ai/sdk`, замени вызов на `client.messages.create({...})`, передай system prompt отдельным полем. Структура остаётся та же.

---

## Деплой

### Frontend → Vercel

1. Запушить репозиторий в GitHub.
2. На vercel.com → New Project → выбрать репозиторий.
3. Root Directory: `apps/web`. Build/Output Vercel определит сам (Next.js).
4. Environment variables: `NEXT_PUBLIC_API_URL = https://<your-api-domain>/api`.
5. Deploy.

### Backend → Railway

1. На railway.app → New Project → Deploy from GitHub → выбрать репозиторий.
2. Root Directory: `apps/api`.
3. Build Command: `npm install && npm run build`.
4. Start Command: `npm run start:prod`.
5. Variables — все из `apps/api/.env.example`, важно: `CORS_ORIGIN` = домен Vercel.
6. Railway выдаст public URL — его прописать в `NEXT_PUBLIC_API_URL` на Vercel.

Альтернативы: Render, Fly.io, любой VPS — `npm run build && node dist/main.js`.

---

## Что делалось с помощью ИИ

**Использовал:** Claude (Anthropic) — в основном для каркаса. Cursor — для рутинных правок на месте.

**Что доверил ИИ:**

- Каркас секций фронта по плану (Hero, About, Stack, How I Work, Cases) — структура JSX + первичный SCSS. Дальше шлифовал руками.
- Черновик SCSS-токенов и mixins.
- HTML-шаблоны писем (с моей правкой стилей и экранирования).
- Первичный текст persona и подсказок для AI-чата.
- README черновик — потом переписал под фактическую реализацию.

**Что собирал и отлаживал руками:**

- Архитектура монорепо (npm workspaces vs Turborepo — выбрал workspaces ради простоты).
- Логика отправки двух писем + `Reply-To`, экранирование пользовательского ввода в HTML.
- Состояния формы и обработка ошибок (`lib/api.ts` нормализует и сетевые, и HTTP-ошибки в один тип `ApiError`).
- Throttler-конфигурация (разные лимиты на `/contact` и `/chat`).
- System prompt для AI-чата — несколько итераций, чтобы модель не уходила в галлюцинации и не «продавала» меня агрессивно.
- Honeypot + rate limit как минимальная защита от спама без капчи.
- Адаптив — все брейкпоинты руками, проверял в DevTools.

**Что пришлось исправлять после ИИ:**

- Первая версия `Hero` от модели была «слишком AI-aesthetic» — generic purple gradient на белом. Полностью переделал в тёмную editorial-эстетику с serif-заголовком и моноширинной метой.
- В первой версии формы не было `aria-invalid`, `aria-live` для ошибок и `role="status"/"alert"` для блоков успеха/ошибки — добавил руками для доступности.
- ИИ предложил использовать `localStorage` для истории чата — убрал, оставил только in-memory: SSR-проблемы + лишняя сложность для тестового.
- Модель ставила `axios` — заменил на нативный `fetch`: меньше зависимостей, для двух запросов хватит.

---

## Что оценивать

- **Frontend:** структура компонентов, SCSS modules без классов-каши, типизация, адаптив, состояния, доступность (semantic HTML, ARIA, focus styles).
- **API:** DTO с валидацией, разделение слоёв (controller / service / mailer), глобальный exception filter, rate limiting, чистый ответ при ошибках.
- **Полный цикл:** заполнение формы → клиентская валидация → POST → серверная валидация → SMTP → два письма → success-состояние на фронте. Если SMTP лежит — `error`-состояние с понятным текстом.
- **AI:** не игрушка, а реальный прокси с system prompt, ограничениями и rate limit.
- **Самостоятельность:** в README выше — что писал ИИ, что я.

---

## Контакты

- Email: [EMAIL]
- Telegram: [@TELEGRAM]
- GitHub: [github.com/USERNAME]
