import SectionHeading from './SectionHeading';
import styles from './Stack.module.scss';

const groups = [
  {
    title: 'Frontend',
    items: [
      'TypeScript',
      'React 18 / 19',
      'Next.js 13 / 14 / 15',
      'SCSS / CSS Modules',
      'Tailwind (v3 / v4)',
      'React Hook Form + Zod',
      'Zustand',
      'Radix UI',
    ],
  },
  {
    title: 'Видео · Maps · 3D',
    items: [
      'hls.js',
      'jmuxer (H.264 в браузере)',
      'mapbox-gl',
      'maplibre-gl',
      'deck.gl',
      'react-three-fiber',
      'three.js',
      'WebSocket / SSE',
    ],
  },
  {
    title: 'Backend · DB',
    items: [
      'Node.js',
      'NestJS',
      'Next.js API routes',
      'NextAuth',
      'Prisma',
      'PostgreSQL',
      'TanStack Query (+ persister)',
      'Resend + React Email',
    ],
  },
  {
    title: 'AI · Tools',
    items: [
      'OpenAI SDK',
      'Anthropic SDK',
      'Cursor / Claude Code',
      'Git / GitHub',
      'Docker',
      'GitHub Actions',
      'Vercel',
      'Figma',
    ],
  },
];

export default function Stack() {
  return (
    <section id="stack" className={styles.section}>
      <div className="container">
        <SectionHeading
          index="02 / Стек"
          kicker="Toolkit"
          title={
            <>
              Не язык — <em>инструмент.</em>
              <br />
              Беру тот, что подходит.
            </>
          }
        />

        <div className={styles.grid}>
          {groups.map((g) => (
            <div key={g.title} className={styles.group}>
              <div className={styles.groupHead}>
                <span className={styles.groupTitle}>{g.title}</span>
                <span className={styles.count}>{g.items.length}</span>
              </div>
              <ul className={styles.list}>
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
