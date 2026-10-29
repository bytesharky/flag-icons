    (function () {
      const cfg = {
        threshold: 300
      };
      const btn = document.getElementById('backTop');
      if (!btn) return;

      let rafId = null;
      const duration = 460;

      const throttle = (fn, delay = 100) => {
        let last = 0;
        return (...args) => {
          const now = Date.now();
          if (now - last >= delay) {
            last = now;
            fn.apply(this, args);
          }
        }
      }

      const getScroller = () => document.scrollingElement || document.documentElement;

      function toggleBtn() {
        const scroller = getScroller();
        const scrollY = scroller.scrollTop;
        btn.classList.toggle('show', scrollY > cfg.threshold);
      }
      const toggleThrottled = throttle(toggleBtn);

      function goTop() {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        const scroller = getScroller();
        const startY = scroller.scrollTop;
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          scroller.scrollTop = startY * (1 - ease);

          if (progress < 1) {
            rafId = requestAnimationFrame(animate);
          } else {
            rafId = null;
          }
        }
        rafId = requestAnimationFrame(animate);
      }

      window.addEventListener('scroll', toggleThrottled, {passive: true});
      btn.addEventListener('click', goTop);
      toggleBtn();
    })();