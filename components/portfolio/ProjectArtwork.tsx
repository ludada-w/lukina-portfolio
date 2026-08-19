import type { Project } from "@/data/portfolio";
import styles from "./Portfolio.module.css";

export function ProjectArtwork({ variant }: { variant: Project["visual"] }) {
  if (variant === "interface") {
    return (
      <div className={`${styles.projectArtwork} ${styles.interfaceArtwork}`} aria-hidden="true">
        <div className={styles.appWindow}>
          <div className={styles.appTopbar}><span /><span>PROJECT / 01</span><i /></div>
          <div className={styles.interfaceGrid}>
            <div className={styles.coachPanel}>
              <small>PLACEHOLDER LABEL</small>
              <strong>Project visual placeholder.</strong>
              <div className={styles.coachMessage}>Short project description goes here.</div>
            </div>
            <div className={styles.energyPanel}>
              <span className={styles.energyRing}><i>00</i></span>
              <small>PLACEHOLDER</small>
            </div>
            <div className={styles.mealPanel}>
              <span><i>01</i> Item</span>
              <span><i>02</i> Item</span>
              <span><i>03</i> Item</span>
            </div>
          </div>
        </div>
        <span className={styles.artworkNote}>PROJECT VISUAL</span>
      </div>
    );
  }

  if (variant === "system") {
    return (
      <div className={`${styles.projectArtwork} ${styles.researchArtwork}`} aria-hidden="true">
        <div className={styles.researchMap}>
          <div className={styles.researchHead}><span>PROJECT OVERVIEW</span><i>PLACEHOLDER</i></div>
          <div className={styles.signalCanvas}>
            <span className={`${styles.signalNode} ${styles.nodeOne}`}>ITEM 01</span>
            <span className={`${styles.signalNode} ${styles.nodeTwo}`}>ITEM 02</span>
            <span className={`${styles.signalNode} ${styles.nodeThree}`}>ITEM 03</span>
            <span className={`${styles.signalNode} ${styles.nodeFour}`}>PROJECT</span>
            <i className={styles.signalLineOne} />
            <i className={styles.signalLineTwo} />
            <i className={styles.signalLineThree} />
          </div>
          <div className={styles.findingRows}>
            <span><i>01</i> Placeholder <b>00</b></span>
            <span><i>02</i> Placeholder <b>00</b></span>
            <span><i>03</i> Placeholder <b>00</b></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.projectArtwork} ${styles.contentArtwork}`} aria-hidden="true">
      <div className={styles.contentBoard}>
        <div className={styles.contentRail}>
          <span>ITEM 01</span><span>ITEM 02</span><span>ITEM 03</span><span>ITEM 04</span>
        </div>
        <div className={styles.contentDocument}>
          <small>PROJECT / 03</small>
          <strong>Project visual placeholder.</strong>
          <p>Short project description goes here.</p>
          <div><i /><i /><i /></div>
        </div>
        <div className={styles.qualityPanel}>
          <small>PLACEHOLDER</small>
          <span><i>Item 01</i><b>00</b></span>
          <span><i>Item 02</i><b>00</b></span>
          <span><i>Item 03</i><b>00</b></span>
        </div>
      </div>
    </div>
  );
}
