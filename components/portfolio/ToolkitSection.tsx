"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type WheelEvent } from "react";
import { tools } from "@/data/portfolio";
import { GlassTypography } from "@/src/components/GlassTypography";
import styles from "./Portfolio.module.css";

export function ToolkitSection() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wheelTarget = useRef(0);
  const wheelAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const [dragLimit, setDragLimit] = useState(0);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !trackRef.current) return;
      const nextLimit = Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth);
      setDragLimit(nextLimit);
      const nextX = Math.max(-nextLimit, Math.min(0, x.get()));
      x.set(nextX);
      wheelTarget.current = nextX;
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => {
      observer.disconnect();
      wheelAnimation.current?.stop();
    };
  }, [x]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (reduceMotion || dragLimit <= 0) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const next = Math.max(-dragLimit, Math.min(0, wheelTarget.current - delta * 1.15));
    if (next === wheelTarget.current) return;

    event.preventDefault();
    wheelAnimation.current?.stop();
    wheelTarget.current = next;
    wheelAnimation.current = animate(x, next, {
      type: "spring",
      stiffness: 150,
      damping: 24,
      mass: 0.55,
    });
  };

  return (
    <section id="toolkit" className={styles.toolkit} aria-labelledby="toolkit-title">
      <div className={styles.toolkitHeader}>
        <motion.h2
          id="toolkit-title"
          initial={{ opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .5 }}
          transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassTypography text="MY TOOLKIT" size="inherit" />
        </motion.h2>
      </div>

      <div ref={viewportRef} className={styles.toolViewport} onWheel={handleWheel}>
        <motion.div
          ref={trackRef}
          className={styles.toolTrack}
          style={{ x }}
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: -dragLimit, right: 0 }}
          dragElastic={0.06}
          dragTransition={{ bounceStiffness: 170, bounceDamping: 25, power: 0.22, timeConstant: 260 }}
          onDragStart={() => {
            wheelAnimation.current?.stop();
            wheelTarget.current = x.get();
          }}
          onDragEnd={() => { wheelTarget.current = x.get(); }}
        >
          {tools.map((tool) => (
            <motion.article
              key={tool.name}
              className={styles.toolCard}
              whileHover={reduceMotion ? undefined : { y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.toolMark}>{tool.mark}</div>
              <div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
