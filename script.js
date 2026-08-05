/* ============================================================
   HELP! LIMPEZA ESPECIALIZADA - script.js
   - Menu mobile
   - Header com sombra ao rolar
   - Modal de imagem ampliada
   - Banner de política de privacidade (cookies / LGPD)
   - Formulário de contato (simulação)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- MENU MOBILE ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  /* ---------- HEADER SOMBRA AO ROLAR ---------- */
  const header = document.getElementById('header');
  const onScroll = function () {
    if (header) {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 18px rgba(83, 60, 150, 0.18)'
        : '0 2px 18px rgba(83, 60, 150, 0.08)';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- CARROSSEL FULL-WIDTH (3 BANNERS) ---------- */
  const heroCarousel = document.getElementById('heroCarousel');
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselDots = document.getElementById('carouselDots');

  if (carouselTrack && carouselSlides.length > 1) {
    let carouselIndex = 0;
    let carouselTimer = null;
    const AUTOPLAY_MS = 5000;

    function renderCarouselDots() {
      if (!carouselDots) return;
      carouselDots.innerHTML = '';
      carouselSlides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === carouselIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Ir para o banner ' + (i + 1));
        dot.addEventListener('click', function () {
          goToCarousel(i);
          restartCarouselAutoplay();
        });
        carouselDots.appendChild(dot);
      });
    }

    function goToCarousel(index) {
      carouselIndex = (index + carouselSlides.length) % carouselSlides.length;
      carouselTrack.style.transform = 'translateX(-' + (carouselIndex * 100) + '%)';
      Array.prototype.forEach.call(carouselDots.children, function (dot, i) {
        dot.classList.toggle('active', i === carouselIndex);
      });
    }

    function restartCarouselAutoplay() {
      if (carouselTimer) clearInterval(carouselTimer);
      carouselTimer = setInterval(function () {
        goToCarousel(carouselIndex + 1);
      }, AUTOPLAY_MS);
    }

    if (carouselPrev) carouselPrev.addEventListener('click', function () {
      goToCarousel(carouselIndex - 1);
      restartCarouselAutoplay();
    });
    if (carouselNext) carouselNext.addEventListener('click', function () {
      goToCarousel(carouselIndex + 1);
      restartCarouselAutoplay();
    });

    if (heroCarousel) {
      heroCarousel.addEventListener('mouseenter', function () {
        if (carouselTimer) clearInterval(carouselTimer);
      });
      heroCarousel.addEventListener('mouseleave', restartCarouselAutoplay);
    }

    let touchStartX = 0;
    carouselTrack.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carouselTrack.addEventListener('touchend', function (e) {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        goToCarousel(diff < 0 ? carouselIndex + 1 : carouselIndex - 1);
        restartCarouselAutoplay();
      }
    }, { passive: true });

    renderCarouselDots();
    goToCarousel(0);
    restartCarouselAutoplay();
  }

  /* ---------- MODAL DE GALERIA (POPUP COM VÁRIAS FOTOS) ---------- */
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalCounter = document.getElementById('modalCounter');
  const modalThumbs = document.getElementById('modalThumbs');
  const modalClose = document.getElementById('modalClose');
  const modalContent = document.getElementById('modalContent');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  const galleryFigures = document.querySelectorAll('.service-image[data-gallery]');
  let currentGallery = [];
  let currentIndex = 0;

  function setCurrentIndex(index) {
    if (!currentGallery.length) return;
    currentIndex = (index + currentGallery.length) % currentGallery.length;
    const img = currentGallery[currentIndex];
    modalImage.src = img.currentSrc || img.src;
    modalImage.alt = img.alt;
    modalCounter.textContent = (currentIndex + 1) + ' / ' + currentGallery.length;
    updateThumbs();
  }

  function updateThumbs() {
    if (!modalThumbs) return;
    Array.prototype.forEach.call(modalThumbs.children, function (thumb, i) {
      thumb.classList.toggle('active', i === currentIndex);
    });
  }

  function renderThumbs() {
    if (!modalThumbs) return;
    modalThumbs.innerHTML = '';
    currentGallery.forEach(function (img, i) {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'modal-thumb' + (i === currentIndex ? ' active' : '');
      thumb.setAttribute('aria-label', 'Ver foto ' + (i + 1));
      const mini = document.createElement('img');
      mini.src = img.currentSrc || img.src;
      mini.alt = img.alt;
      thumb.appendChild(mini);
      thumb.addEventListener('click', function () { setCurrentIndex(i); });
      modalThumbs.appendChild(thumb);
    });
  }

  function openModal(figure) {
    if (!imageModal || !modalImage || !modalCounter) return;
    currentGallery = Array.from(figure.querySelectorAll('img'));
    if (!currentGallery.length) return;

    const card = figure.closest('.service-card');
    const title = card ? card.querySelector('h3').textContent : 'Serviço';
    modalCaption.textContent = title;

    renderThumbs();
    setCurrentIndex(0);
    imageModal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    if (!imageModal) return;
    imageModal.hidden = true;
    document.body.style.overflow = '';
    modalImage.src = '';
    currentGallery = [];
    if (modalThumbs) modalThumbs.innerHTML = '';
  }

  galleryFigures.forEach(function (figure) {
    const countBadge = figure.querySelector('.service-count');
    if (countBadge) {
      countBadge.textContent = '';
      countBadge.appendChild(document.createTextNode(figure.querySelectorAll('img').length));
    }

    figure.addEventListener('click', function () {
      openModal(figure);
    });
    figure.setAttribute('tabindex', '0');
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', 'Abrir galeria de fotos');
    figure.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(figure);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalPrev) modalPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    setCurrentIndex(currentIndex - 1);
  });
  if (modalNext) modalNext.addEventListener('click', function (e) {
    e.stopPropagation();
    setCurrentIndex(currentIndex + 1);
  });

  if (imageModal) {
    imageModal.addEventListener('click', function (e) {
      if (!modalContent || e.target === imageModal) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!imageModal || imageModal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') setCurrentIndex(currentIndex + 1);
    if (e.key === 'ArrowLeft') setCurrentIndex(currentIndex - 1);
  });

  /* ---------- BANNER LGPD / COOKIES ---------- */
  const lgpdBanner = document.getElementById('lgpdBanner');
  const lgpdAccept = document.getElementById('lgpdAccept');
  const lgpdDecline = document.getElementById('lgpdDecline');
  const LGPD_KEY = 'help_lgpd_preference';

  function setLgpdPreference(value) {
    try {
      localStorage.setItem(LGPD_KEY, value);
    } catch (e) {
      /* storage indisponível: ignora silenciosamente */
    }
    if (lgpdBanner) lgpdBanner.classList.add('hidden');
  }

  if (lgpdBanner) {
    let stored = null;
    try {
      stored = localStorage.getItem(LGPD_KEY);
    } catch (e) {
      stored = null;
    }

    if (stored === 'accepted' || stored === 'declined') {
      lgpdBanner.classList.add('hidden');
    } else {
      lgpdBanner.classList.remove('hidden');
    }

    if (lgpdAccept) lgpdAccept.addEventListener('click', function () { setLgpdPreference('accepted'); });
    if (lgpdDecline) lgpdDecline.addEventListener('click', function () { setLgpdPreference('declined'); });
  }

  /* ---------- FORMULÁRIO DE CONTATO ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const mensagem = document.getElementById('mensagem').value.trim();

      const textoWhatsApp =
        'Olá! Gostaria de solicitar um orçamento.\n' +
        'Nome: ' + nome + '\n' +
        'E-mail: ' + email + '\n' +
        'Telefone: ' + telefone + '\n' +
        'Mensagem: ' + mensagem;

      const whatsappUrl =
        'https://wa.me/5500000000000?text=' + encodeURIComponent(textoWhatsApp);

      if (formStatus) {
        formStatus.textContent = 'Enviando...';
        formStatus.className = 'form-status';
      }

      setTimeout(function () {
        window.open(whatsappUrl, '_blank', 'noopener');
        contactForm.reset();
        if (formStatus) {
          formStatus.textContent = 'Obrigado! Abrimos o WhatsApp para finalizar seu contato.';
          formStatus.className = 'form-status success';
        }
        setTimeout(function () {
          if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
          }
        }, 6000);
      }, 400);
    });
  }

  /* ---------- POLÍTICA DE PRIVACIDADE (ancora lê o aviso) ---------- */
  const lgpdLink = document.getElementById('lgpdLink');
  if (lgpdLink) {
    lgpdLink.addEventListener('click', function (e) {
      e.preventDefault();
      alert(
        'Política de Privacidade\n\n' +
        'A Help! Limpeza Especializada valoriza a sua privacidade. ' +
        'Utilizamos cookies apenas para melhorar a sua experiência e analisar ' +
        'o tráfego do site. Nenhum dado pessoal é vendido ou compartilhado ' +
        'sem o seu consentimento.'
      );
    });
  }

});
