/**
 * Persona — the data the AI assistant uses to answer questions about the developer.
 * Edit this file with your real info before deploying.
 */
export const PERSONA = `
Имя: Илья
Роль: Fullstack Developer (Frontend-heavy)
Опыт: 2 года коммерческой разработки
Локация: Астана, готов к удалёнке.

Стек:
- Frontend: TypeScript, React 18 / 19, Next.js 13/14/15 (App Router, RSC), SCSS / CSS Modules / Tailwind (включая v4), Zustand, Redux Toolkit, React Hook Form, Zod, Radix UI
- Видео / геоданные / 3D: hls.js, jmuxer (H.264 в браузере), mapbox-gl, maplibre-gl, deck.gl, react-three-fiber, three.js
- Realtime / связь: WebSocket (socket.io), SSE, SIP (sip.js)
- Backend: Node.js, NestJS, Express, REST, базовый GraphQL, NextAuth, Prisma
- БД: PostgreSQL, MongoDB, Redis, IndexedDB на клиенте (idb-keyval)
- Серверный кэш / state: TanStack Query (+ persister), Zustand
- Почта: Resend + React Email, Nodemailer
- DevOps / tools: Docker, GitHub Actions, Vercel, Railway, Nginx
- AI: OpenAI / Anthropic SDK, embeddings, tool calling, RAG-сценарии

Направления:
- Лендинги и маркетинговые сайты с быстрой загрузкой и SSR
- Внутренние панели и админки (формы, таблицы, фильтры, авторизация)
- AI-фичи поверх существующих продуктов (чаты, помощники, summary)

Подход к задачам:
1. Сначала уточняю требования и ограничения (сроки, аудитория, метрика успеха).
2. Делаю короткий план: что именно делаю, какие границы, что НЕ делаю.
3. Пишу минимально достаточное решение, потом усиливаю.
4. Всегда добавляю обработку ошибок и состояния loading/success/error.
5. Документирую решения в README и комментариях там, где код неочевиден.

Как использую AI:
- Claude / GPT для рефакторинга, ревью кода, написания тестов, генерации типов из API-ответов.
- Cursor / Claude Code как ежедневный инструмент — пишу промпты, контролирую результат, не доверяю слепо.
- Для тестового задания: каркас компонентов, типы DTO и черновики SCSS написал с AI, валидацию и почтовую логику собирал и отлаживал руками.

Проекты (примеры):

- Проект 1 (рабочий, в проде). Веб-платформа для работы с картами и видеоаналитикой.
  Что делал: фронт целиком на Next.js 13 + TS. Интеграция с видеопотоками — HLS через
  hls.js и низколатентный H.264 через jmuxer + socket.io, настройка кодеков под разные
  источники. Геослой на mapbox-gl + maplibre-gl + deck.gl, 3D-сцены поверх карты через
  react-three-map / @react-three/fiber. Работа с SIP-телефонией через sip.js, realtime
  по WebSocket и SSE (event-source-polyfill). Кеширование тяжёлых запросов на TanStack
  Query + persister в IndexedDB (idb-keyval). i18n, темизация, экспорт сцен в PNG через
  html2canvas. Результат: продакшен-проект, которым пользуются операторы каждый день.

- Проект 2 (рабочий, фронт). Интерфейсы для системы видеоаналитики парковок.
  Что делал: только фронтенд — компоненты, формы, таблицы, интеграция с REST/WS-бэкендом,
  состояния загрузки и ошибок, адаптив. Без видео-кодеков на стороне браузера: в этом
  проекте видео и аналитику отдавал бэк, мне доставались UI и работа с данными.

- Проект 3 (pet, e-commerce). Сервис заказа пиццы.
  Что делал самостоятельно: Next.js 15 (App Router) + React 19, БД на PostgreSQL через
  Prisma (схема, миграции, сиды), авторизация на NextAuth, корзина и фильтры на Zustand,
  формы и валидация — React Hook Form + Zod, UI на Radix + Tailwind v4, транзакционные
  письма через Resend + React Email, тостеры (react-hot-toast), карточки доставки через
  react-dadata. Зачем делал: проверял на себе современный стек Next 15 / React 19 и
  собрал полный цикл — каталог → конструктор пиццы → корзина → оплата (заглушка) →
  письма пользователю.

Контакты:
- Email: worknesterov@yandex.kz
- Telegram: @Defenseman25
- GitHub: github.com/Defenseman
`;
