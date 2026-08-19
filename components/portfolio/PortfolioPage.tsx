import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { Hero } from "./Hero";
import { ProjectsSection } from "./ProjectsSection";
import { ToolkitSection } from "./ToolkitSection";
import styles from "./Portfolio.module.css";

export function PortfolioPage() {
  return (
    <main className={styles.site}>
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <ToolkitSection />
      <ContactSection />
    </main>
  );
}
