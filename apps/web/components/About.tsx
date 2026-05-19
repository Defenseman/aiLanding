import SectionHeading from './SectionHeading';
import styles from './About.module.scss';

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className="container">
        <SectionHeading
          index="01 / Обо мне"
          kicker="Profile"
          title={
            <>
              Разработчик, который<br />
              <em>доводит до прода.</em>
            </>
          }
        />

        <div className={styles.grid}>
          <div className={styles.bio}>
            <p>
              Привет. Я <strong>Илья</strong> — fullstack-разработчик. 
              <strong>2 года</strong> делаю продукты
              на TypeScript: от лендингов и админок до интеграций с AI и
              платёжными системами.
            </p>
            <p>
              Мне важно не «закрыть таск», а сделать так, чтобы фича работала
              в реальных условиях — с обработкой ошибок, понятным UX и
              кодом, в котором завтра можно разобраться.
            </p>
            <p>
              Не боюсь лезть в чужой код, читать документацию и спрашивать,
              если что-то непонятно. Считаю, что 30 минут уточнений в начале
              экономят неделю переделок в конце.
            </p>
          </div>

          <aside className={styles.facts}>
            <div className={styles.factRow}>
              <span className={styles.factKey}>Локация</span>
              <span className={styles.factVal}>Астана · GMT+5</span>
            </div>
            <div className={styles.factRow}>
              <span className={styles.factKey}>Формат</span>
              <span className={styles.factVal}>Удалённый</span>
            </div>
            <div className={styles.factRow}>
              <span className={styles.factKey}>Английский</span>
              <span className={styles.factVal}>B2</span>
            </div>
            <div className={styles.factRow}>
              <span className={styles.factKey}>Открыт к</span>
              <span className={styles.factVal}>Fulltime, проектам, парт-тайму</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
