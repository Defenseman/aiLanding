import styles from './SectionHeading.module.scss';

interface Props {
  index: string;
  kicker: string;
  title: React.ReactNode;
}

export default function SectionHeading({ index, kicker, title }: Props) {
  return (
    <header className={styles.head}>
      <div className={styles.meta}>
        <span className={styles.idx}>{index}</span>
        <span className={styles.kicker}>{kicker}</span>
      </div>
      <h2 className={styles.title}>{title}</h2>
    </header>
  );
}
