// Slogan tipo máquina de escribir. El cursor es el cuadrado del logo: titila mientras escribe
// y, cuando la frase termina en punto, se queda quieto como punto final.
if (!customElements.get('ruvra-typewriter')) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  customElements.define(
    'ruvra-typewriter',
    class RuvraTypewriter extends HTMLElement {
      connectedCallback() {
        const lineEls = [...this.querySelectorAll('.ruvra-slogan__line')];
        if (!lineEls.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Reservamos el alto final para que la página no salte mientras escribe.
        const heading = this.querySelector('.ruvra-slogan__h');
        heading.style.minHeight = `${heading.offsetHeight}px`;

        this.speed = { slow: 95, normal: 65, fast: 40 }[this.dataset.speed] || 65;
        this.alternates = (this.dataset.alternates || '')
          .split('|')
          .map((text) => text.trim())
          .filter(Boolean);
        this.lines = lineEls.map((el) => ({ el, text: el.dataset.text || '' }));
        this.lines.forEach(({ el }) => (el.textContent = ''));
        this.classList.add('is-typing');
        this.run();
      }

      render(el, typed, withCaret) {
        const endsWithDot = typed.endsWith('.');
        el.textContent = endsWithDot ? typed.slice(0, -1) : typed;
        if (endsWithDot) {
          const period = document.createElement('i');
          period.className = 'ruvra-slogan__sq';
          el.append(period);
        } else if (withCaret) {
          const caret = document.createElement('i');
          caret.className = 'ruvra-slogan__sq is-caret';
          el.append(caret);
        }
      }

      async type(el, text) {
        for (let i = 1; i <= text.length; i++) {
          this.render(el, text.slice(0, i), true);
          const char = text[i - 1];
          await wait(char === ' ' ? this.speed * 1.6 : this.speed + Math.random() * this.speed * 0.6);
        }
      }

      async erase(el, text) {
        for (let i = text.length - 1; i >= 0; i--) {
          this.render(el, text.slice(0, i), true);
          await wait(this.speed * 0.45);
        }
      }

      async run() {
        await wait(450);
        for (const line of this.lines) {
          this.render(line.el, '', true);
          await wait(300);
          await this.type(line.el, line.text);
          await wait(line.text.endsWith('.') ? 350 : 150);
        }

        if (this.alternates.length < 2) return;
        const last = this.lines[this.lines.length - 1];
        let index = 0;
        while (this.isConnected) {
          await wait(2600);
          await this.erase(last.el, this.alternates[index]);
          index = (index + 1) % this.alternates.length;
          await wait(350);
          await this.type(last.el, this.alternates[index]);
        }
      }
    }
  );
}
