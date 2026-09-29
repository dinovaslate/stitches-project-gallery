document.documentElement.classList.add('js');

const cards = [...document.querySelectorAll('.case')];
const filters = [...document.querySelectorAll('.filter')];
const status = document.getElementById('filter-status');
const lightbox = document.querySelector('.lightbox');
const preview = lightbox.querySelector('img');
const caption = lightbox.querySelector('p');
let lastTrigger = null;

function setFilter(value) {
  let count = 0;
  for (const card of cards) {
    const show = value === 'all' || card.dataset.filter === value;
    card.hidden = !show;
    if (show) {
      count++;
      card.classList.add('in-view');
    }
  }
  for (const button of filters) {
    const active = button.dataset.filter === value;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  status.textContent = `Showing ${count} ${value === 'all' ? '' : value + ' '}project${count === 1 ? '' : 's'}.`;
}

for (const button of filters) button.addEventListener('click', () => setFilter(button.dataset.filter));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -35px 0px', threshold: 0.06 });
  for (const item of document.querySelectorAll('.reveal')) observer.observe(item);
} else {
  for (const item of document.querySelectorAll('.reveal')) item.classList.add('in-view');
}

for (const shot of document.querySelectorAll('.shot')) {
  shot.addEventListener('click', () => {
    lastTrigger = shot;
    preview.src = shot.dataset.full;
    preview.alt = shot.dataset.caption;
    caption.textContent = shot.dataset.caption;
    lightbox.showModal();
  });
}

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => {
  preview.removeAttribute('src');
  if (lastTrigger) lastTrigger.focus();
});
