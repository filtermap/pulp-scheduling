import { useState, useCallback, useEffect } from "react";

// Hooks FAQ – React
// https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node

type Position = {
  left: number;
  top: number;
};

const createPosition = (rect: DOMRectReadOnly): Position => ({
  left: window.scrollX + rect.left,
  top: window.scrollY + rect.top,
});

export const usePosition = (): [
  Position | undefined,
  (element: Element | null) => void
] => {
  const [position, setPosition] = useState<Position | undefined>();
  const [element, setElement] = useState<Element | undefined>();
  const ref = useCallback((element: Element | null) => {
    if (!element) return;
    setElement(element);
    setPosition(createPosition(element.getBoundingClientRect()));
  }, []);
  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries)
        setPosition(createPosition(entry.target.getBoundingClientRect()));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return [position, ref];
};
