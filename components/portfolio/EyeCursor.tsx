"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export function EyeCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLSpanElement>(null);
  const rightPupilRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const leftPupil = leftPupilRef.current;
    const rightPupil = rightPupilRef.current;
    if (!cursor || !leftPupil || !rightPupil) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    const pupilTarget = { x: 0, y: 0 };
    const pupilCurrent = { x: 0, y: 0 };
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      pupilTarget.x = (event.clientX / window.innerWidth - .5) * 4.8;
      pupilTarget.y = (event.clientY / window.innerHeight - .5) * 3.4;
      const element = event.target instanceof Element ? event.target : null;
      cursor.style.opacity = element?.closest("[data-hero]") ? "1" : "0";
    };

    const onPointerLeave = () => {
      cursor.style.opacity = "0";
    };

    const animate = () => {
      current.x += (target.x - current.x) * .17;
      current.y += (target.y - current.y) * .17;
      pupilCurrent.x += (pupilTarget.x - pupilCurrent.x) * .13;
      pupilCurrent.y += (pupilTarget.y - pupilCurrent.y) * .13;

      cursor.style.transform = `translate3d(${current.x - 29}px, ${current.y - 15}px, 0)`;
      const pupilTransform = `translate(calc(-50% + ${pupilCurrent.x}px), calc(-50% + ${pupilCurrent.y}px))`;
      leftPupil.style.transform = pupilTransform;
      rightPupil.style.transform = pupilTransform;
      frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={cursorRef} className={styles.eyeCursor} aria-hidden="true">
      <span className={styles.eye}><span ref={leftPupilRef} className={styles.pupil} /></span>
      <span className={styles.eye}><span ref={rightPupilRef} className={styles.pupil} /></span>
    </div>
  );
}
