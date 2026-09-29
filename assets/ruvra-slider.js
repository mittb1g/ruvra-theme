// Slider del hero: scroll-snap nativo + puntos + autoplay que se pausa al interactuar.
if (!customElements.get('ruvra-slider')) {
  customElements.define(
    'ruvra-slider',
    class RuvraSlider extends HTMLElement {
      connectedCallback() {
        this.track = this.querySelector('[data-track]');
        this.slides = [...this.querySelectorAll('[data-slide]')];
        if (!this.track || this.slides.length < 2) return;

        this.current = 0;
        this.interval = parseInt(this.dataset.interval, 10) || 6000;
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.addEventListener('click', (event) => {
          const dot = event.target.closest('[data-dot]');
          if (!dot) return;
          this.goTo(parseInt(dot.dataset.dot, 10));
          this.stop();
        });

        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                this.setCurrent(this.slides.indexOf(entry.target));
              }
            });
          },
          { root: this.track, threshold: [0.6] }
        );
        this.slides.forEach((slide) => this.observer.observe(slide));

        if (this.dataset.autoplay === 'true' && !this.reduceMotion) {
          ['mouseenter', 'focusin', 'touchstart'].forEach((type) =>
            this.addEventListener(type, () => this.stop(), { passive: true })
          );
          this.start();
        }
      }

      disconnectedCallback() {
        this.stop();
        this.observer?.disconnect();
      }

      start() {
        this.stop();
        this.timer = setInterval(() => this.goTo((this.current + 1) % this.slides.length), this.interval);
      }

      stop() {
        clearInterval(this.timer);
      }

      goTo(index) {
        const slide = this.slides[index];
        if (!slide) return;
        this.track.scrollTo({ left: slide.offsetLeft, behavior: this.reduceMotion ? 'auto' : 'smooth' });
        this.setCurrent(index);
      }

      setCurrent(index) {
        if (index < 0) return;
        this.current = index;
        this.querySelectorAll('[data-dot]').forEach((dot) => {
          if (parseInt(dot.dataset.dot, 10) === index) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
      }
    }
  );
}
