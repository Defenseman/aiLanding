import SectionHeading from './SectionHeading';
import styles from './Cases.module.scss';

interface Case {
  id: string;
  year: string;
  title: string;
  role: string;
  description: string;
  stack: string[];
  link?: { href: string; label: string };
}

const cases: Case[] = [
  {
    id: 'case-1',
    year: '2025',
    title: 'Платформа для карт и видеоаналитики',
    role: 'Frontend',
    description:
      'Веб-приложение для работы с видеопотоками и геопространственными данными. Делал фронтенд целиком: подключение HLS и низколатентного H.264 в браузере, настройка кодеков, 3D-слой поверх карты, SIP-телефония, realtime по WebSocket и SSE, кэширование тяжёлых запросов в IndexedDB. Продакшен, используется операторами ежедневно.',
    stack: [
      'Next.js 13',
      'TypeScript',
      'hls.js',
      'jmuxer',
      'mapbox-gl',
      'deck.gl',
      'react-three-fiber',
      'sip.js',
      'TanStack Query',
      'socket.io',
    ],
  },
  {
    id: 'case-2',
    year: '2025',
    title: 'Интерфейсы видеоаналитики парковок',
    role: 'Frontend',
    description:
      'Фронтенд для системы видеоаналитики: компоненты, формы, таблицы, фильтры, интеграция с REST и WebSocket-бэкендом. Состояния загрузки и ошибок, адаптив, поддержка нескольких ролей пользователей. Видео и аналитику отдавал бэкенд — на моей стороне был UI и работа с данными.',
    stack: ['React', 'TypeScript', 'REST', 'WebSocket', 'SCSS'],
  },
  {
    id: 'case-3',
    year: '2024',
    title: 'Сервис заказа пиццы (pet)',
    role: 'Fullstack',
    description:
      'Pet-проект на современном стеке. Полный цикл: каталог с фильтрами и сортировкой, конструктор пиццы (размер, тесто, ингредиенты), корзина, авторизация, оформление заказа и транзакционные письма пользователю. Делал, чтобы пощупать Next 15 и React 19 на реальном продукте — от схемы БД до писем.',
    stack: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'NextAuth',
      'Zustand',
      'React Hook Form + Zod',
      'Radix UI',
      'Tailwind v4',
      'Resend',
    ],
    link: { href: 'https://github.com/Defenseman/next-pizza', label: 'github' },
  },
  {
    id: 'case-4',
    year: '2026',
    title: 'Это тестовое',
    role: 'Fullstack',
    description:
      'Лендинг + NestJS API + AI-помощник. Сделан за несколько часов. Без шаблонов, всё руками (с помощью Claude как ассистента). Полный цикл: форма → валидация → SMTP → 2 письма + AI-чат поверх профиля.',
    stack: ['Next.js 14', 'NestJS', 'SCSS', 'Nodemailer', 'OpenAI'],
  },
];

export default function Cases() {
  return (
    <section id="cases" className={styles.section}>
      <div className="container">
        <SectionHeading
          index="04 / Кейсы"
          kicker="Selected work"
          title={
            <>
              Несколько проектов,<br />
              <em>где я приложил руку.</em>
            </>
          }
        />

        <div className={styles.list}>
          {cases.map((c) => (
            <article key={c.id} className={styles.case}>
              <div className={styles.meta}>
                <span className={styles.year}>{c.year}</span>
                <span className={styles.role}>{c.role}</span>
              </div>

              <div className={styles.body}>
                <h3 className={styles.title}>
                  {c.title}
                  {c.link && (
                    <a
                      href={c.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.linkArrow}
                      aria-label={c.link.label}
                    >
                      ↗
                    </a>
                  )}
                </h3>
                <p className={styles.desc}>{c.description}</p>
                <ul className={styles.stack}>
                  {c.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
