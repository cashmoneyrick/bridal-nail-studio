import { useEffect, useRef } from "react";

/**
 * Hook that adds scroll-triggered reveal animations via IntersectionObserver.
 * Adds 'revealed' class to the element when it enters the viewport.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="reveal">...</div>
 *
 * CSS classes (defined in index.css):
 *   .reveal        — fade up animation
 *   .reveal-scale  — scale-in animation
 *   .reveal-children — staggered children reveal
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("not-revealed");
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
        ...options,
      }
    );

    // Mark as not-revealed initially
    el.classList.add("not-revealed");

    observer.observe(el);

    // Check if already in viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.remove("not-revealed");
      el.classList.add("revealed");
      observer.unobserve(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Hook for observing multiple elements (e.g., a list of cards).
 * Returns a callback ref to attach to each child element.
 */
export function useScrollRevealAll(options?: IntersectionObserverInit) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("not-revealed");
            entry.target.classList.add("revealed");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
        ...options,
      }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const observe = (el: HTMLElement | null) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  };

  return observe;
}

export default useScrollReveal;
