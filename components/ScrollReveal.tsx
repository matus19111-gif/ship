// components/ScrollReveal.tsx
"use client";
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const selector = "h1, h2, h3, p, .btn, .card, section > div";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
