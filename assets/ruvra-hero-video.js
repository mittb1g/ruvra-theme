// Activa solo los videos del hero cuyo contenedor está visible (computadora o celular).
(() => {
  const activate = () => {
    document.querySelectorAll('template[data-ruvra-hero-video]').forEach((template) => {
      const holder = template.parentElement;
      if (!holder || holder.offsetParent === null || getComputedStyle(holder).display === 'none') return;
      const video = template.content.firstElementChild?.cloneNode(true);
      if (!video) return;
      holder.querySelector('.ruvra-hero__video-poster')?.remove();
      template.replaceWith(video);
      video.play?.().catch(() => {});
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', activate);
  else activate();
  window.matchMedia('(min-width: 990px)').addEventListener('change', activate);
})();
