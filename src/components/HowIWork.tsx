import SectionHeading from './SectionHeading';
import styles from './HowIWork.module.scss';

const steps = [
  {
    n: '01',
    title: 'Уточняю задачу',
    text: 'Прежде чем писать код — задаю вопросы. Цель, аудитория, метрика успеха, ограничения, что точно НЕ нужно. 30 минут уточнений экономят неделю переделок.',
  },
  {
    n: '02',
    title: 'Делаю короткий план',
    text: 'Декомпозирую задачу на 3–7 шагов. Согласую план с тимлидом или клиентом до старта. Если задача большая — разбиваю на итерации с понятным результатом на каждой.',
  },
  {
    n: '03',
    title: 'Пишу минимально достаточное решение',
    text: 'Сначала работающая основа, потом усиление. Не переусложняю архитектуру наперёд — добавляю слои абстракции, когда это нужно для второго или третьего use-case.',
  },
  {
    n: '04',
    title: 'Покрываю краевые случаи',
    text: 'Loading, success, error, empty state, медленная сеть, отвалившийся API. Обработка ошибок и UX-состояния — это не «потом», это часть фичи.',
  },
  {
    n: '05',
    title: 'Документирую',
    text: 'README с командами запуска, комментарии в неочевидных местах, осмысленные сообщения коммитов. Кодовая база должна быть понятна тому, кто откроет её через полгода.',
  },
];

export default function HowIWork() {
  return (
    <section id="how" className={styles.section}>
      <div className="container">
        <SectionHeading
          index="03 / Процесс"
          kicker="How I work"
          title={
            <>
              Меньше героизма,<br />
              <em>больше понятных шагов.</em>
            </>
          }
        />

        <ol className={styles.steps}>
          {steps.map((s) => (
            <li key={s.n} className={styles.step}>
              <div className={styles.num}>{s.n}</div>
              <div className={styles.body}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.aiBlock}>
          <div className={styles.aiTag}>
            <span className={styles.dot} />
            <span>AI в работе</span>
          </div>
          <h3 className={styles.aiTitle}>
            ИИ — это инструмент. Не сеньор-разработчик.
          </h3>
          <div className={styles.aiGrid}>
            <div>
              <h4>Где помогает</h4>
              <ul>
                <li>Каркас компонентов и типы по описанию API.</li>
                <li>Поиск по чужой кодовой базе и объяснение неизвестных кусков.</li>
                <li>Рефакторинг, тесты, регулярки, миграции.</li>
                <li>Тексты для лендингов, README, коммитов.</li>
              </ul>
            </div>
            <div>
              <h4>Что не отдаю</h4>
              <ul>
                <li>Архитектурные решения и выбор подходов.</li>
                <li>Финальное ревью кода — глазами, не «согласен».</li>
                <li>Логику обработки ошибок и безопасность.</li>
                <li>Общение с клиентом и постановка задач.</li>
              </ul>
            </div>
          </div>
          <p className={styles.aiNote}>
            Использую Claude, GPT, Cursor каждый день. Но если что-то не понимаю —
            разбираюсь сам, а не копирую ответ модели.
          </p>
        </div>
      </div>
    </section>
  );
}
