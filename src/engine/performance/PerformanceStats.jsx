import { useEffect } from "react";
import Stats from "stats.js";

export default function PerformanceStats() {
  useEffect(() => {
    const stats = new Stats();

    stats.showPanel(0);

    stats.dom.style.position = "fixed";
    stats.dom.style.top = "10px";
    stats.dom.style.right = "10px";
    stats.dom.style.left = "auto";
    stats.dom.style.zIndex = "9999";

    document.body.appendChild(stats.dom);

    let animationId;

    const animate = () => {
      stats.begin();
      stats.end();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      stats.dom.remove();
    };
  }, []);

  return null;
}
