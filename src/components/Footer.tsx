import styles from './Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <span className={styles.dot} />
          <span className="mono">Илья · Fullstack Developer</span>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <a href="mailto:work@ilyanesterov.com">Email</a>
          <a href="https://t.me/@Defenseman25" target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a
            href="https://github.com/Defenseman"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ilya-nesterov-716345334"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </nav>

        <div className={styles.right}>
          <span>© {year}</span>
          <a href="#top" className={styles.top}>
            Наверх ↑
          </a>
        </div>
      </div>

      <div className={styles.colophon}>
        <span>Сделано на Next.js 14 · NestJS · SCSS</span>
        <span>Шрифты: Fraunces / JetBrains Mono</span>
      </div>
    </footer>
  );
}
