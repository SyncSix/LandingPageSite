'use strict';

const menuButton = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

if (menuButton && navLinks) {
  const mobileBreakpoint = window.matchMedia('(max-width: 980px)');

  function closeMenu({ restoreFocus = false } = {}) {
    const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
    navLinks.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    if (restoreFocus && wasOpen) menuButton.focus();
  }

  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    navLinks.classList.toggle('is-open', willOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu({ restoreFocus: true });
  });

  document.addEventListener('click', event => {
    if (!menuButton.contains(event.target) && !navLinks.contains(event.target)) closeMenu();
  });

  mobileBreakpoint.addEventListener?.('change', () => closeMenu());
}


const profiles = {
  aluno: {
    image: 'assets/tela-aluno.png',
    alt: 'Tela inicial do aluno no sistema SITE',
    title: 'Tudo o que o aluno precisa acompanhar.',
    description: 'Visualize seu progresso, monitore documentos e descubra suas próximas ações em uma interface organizada.',
    tags: ['Progresso', 'Documentos', 'Atividades']
  },
  professor: {
    image: 'assets/tela-professor.png',
    alt: 'Tela inicial do professor no sistema SITE',
    title: 'Mais clareza para acompanhar seus alunos.',
    description: 'Consulte a situação da turma, identifique prioridades e acompanhe documentos e avaliações em um só painel.',
    tags: ['Alunos', 'Avaliações', 'Relatórios']
  },
  coordenacao: {
    image: 'assets/tela-coordenacao.png',
    alt: 'Tela inicial de coordenação no sistema SITE',
    title: 'Organização para a gestão acadêmica.',
    description: 'Acompanhe cadastros, liberações de acesso e vínculos institucionais por meio de uma visão administrativa.',
    tags: ['Cadastros', 'Acessos', 'Vínculos']
  }
};

const tabs = [...document.querySelectorAll('.interface-tab')];
const previewImg = document.getElementById('interfaceImage');
const previewTitle = document.getElementById('interfaceTitle');
const previewDescription = document.getElementById('interfaceDescription');
const previewTags = document.getElementById('interfaceTags');

function selectProfile(profileName, focus = false) {
  const data = profiles[profileName];
  if (!data || !previewImg) return;
  previewImg.src = data.image;
  previewImg.alt = data.alt;
  previewTitle.textContent = data.title;
  previewDescription.textContent = data.description;
  previewTags.replaceChildren(...data.tags.map(name => {
    const tag = document.createElement('span');
    tag.textContent = name;
    return tag;
  }));
  tabs.forEach(tab => {
    const active = tab.dataset.profile === profileName;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProfile(tab.dataset.profile));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
      (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    selectProfile(tabs[nextIndex].dataset.profile, true);
  });
});

if (window.IntersectionObserver) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

function handleScroll() {
  backToTop?.classList.toggle('is-visible', window.scrollY > 750);
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
