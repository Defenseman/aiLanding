import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.meta}>
          <span className={styles.statusDot} />
          <span className="mono">Открыт к предложениям · Remote / Гибрид</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.line}>Строю</span>
          <span className={styles.line}>
            <em className={styles.em}>интерфейсы</em>
          </span>
          <span className={styles.line}>и API,</span>
          <span className={styles.line}>
            которые <span className={styles.accent}>работают</span>.
          </span>
        </h1>

        <p className={styles.subtitle}>
          Fullstack-разработчик. Делаю продукты от Figma-макета до прод-деплоя:
          Next.js на фронте, NestJS на бэке, AI там, где это реально полезно,
          а не для галочки.
        </p>

        <div className={styles.actions}>
          <a href="#cases" className={styles.btnPrimary}>
            Посмотреть кейсы
            <span aria-hidden>→</span>
          </a>
          <a href="#contact" className={styles.btnGhost}>
            Написать
          </a>
        </div>

        <div className={styles.stats}>
          <div>
            <div className={styles.statNum}>2 +</div>
            <div className={styles.statLabel}>лет в разработке</div>
          </div>
          <div>
            <div className={styles.statNum}>3</div>
            <div className={styles.statLabel}>проектов в проде</div>
          </div>
          <div>
            <div className={styles.statNum}>TS / Node</div>
            <div className={styles.statLabel}>основной стек</div>
          </div>
        </div>
      </div>
    </section>
  );
}
