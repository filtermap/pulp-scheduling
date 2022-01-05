import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useHashFragment = (offset = 0) => {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const element = document.querySelector(hash);
    if (!element) return;
    window.scrollTo({
      behavior: "smooth",
      top: window.scrollY + element.getBoundingClientRect().top - offset,
    });
  }, [hash, offset]);
};
