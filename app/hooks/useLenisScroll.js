"use client";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export const useLenisScroll = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.5,
      smooth: true,
      smoothTouch: true,
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
};
