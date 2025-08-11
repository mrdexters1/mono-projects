import { Hero } from "@top/components/Hero";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        hardware - picker - ai
        <Hero />
      </main>
    </div>
  );
}
