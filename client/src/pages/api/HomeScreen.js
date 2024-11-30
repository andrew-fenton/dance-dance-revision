import React from "react";
import styles from "@/styles/HomeScreen.module.css";

export default function HomeScreen() {
  return (
    <div className={styles.homeScreen}>
      <h1 className={styles.title}>Dance Dance Revolution</h1>
      <p className={styles.instruction}>Press Enter to Begin</p>
    </div>
  );
}
