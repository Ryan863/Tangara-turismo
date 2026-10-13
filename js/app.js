(function () {
  'use strict';
  var D = window.TANGARA;
  if (!D) return;

  var CONFIG = {
    // Cole aqui a URL de incorporação (iframe) da câmera ao vivo do Morro Agudo quando disponível.
    cameraUrl: '',
    lat: D.morroAgudo.lat,
    lng: D.morroAgudo.lng
  };

  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 1024);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Data Atual no Topbar ---------- */
  var now = new Date();
  var today = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var todayEl = $('#today');
  if (todayEl) todayEl.textContent = today.charAt(0).toUpperCase() + today.slice(1);
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = now.getFullYear();

  /* ---------- Funções Utilitárias ---------- */
  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function mapLink(x) {
    return x.ll ? 'https://www.google.com/maps/search/?api=1&query=' + x.ll[0] + ',' + x.ll[1] : null;
  }

  /* ---------- Gerador de Cards ---------- */
  function card(x, isRoute) {
    var actions = '';
    if (x.wa) {
      actions += '<a class="chip chip--wa" href="' + x.wa + '" target="_blank" rel="noopener" aria-label="Falar no WhatsApp com ' + esc(x.n) + '"><span>WhatsApp</span></a>';
    }
    var m = mapLink(x);
    if (m) {
      actions += '<a class="chip chip--map" href="' + m + '" target="_blank" rel="noopener" aria-label="Abrir rota no mapa para ' + esc(x.n) + '"><span>Como chegar</span></a>';
    }

    var cardClass = isRoute ? 'card card--route tilt' : 'card tilt';
    var imgHtml = x.img
      ? '<img src="' + x.img + '" alt="' + esc(x.n) + '" loading="lazy" width="640" height="400" onerror="this.onerror=null;this.classList.add(\'img-fallback\')">'
      : '<div class="img-placeholder"><span>' + esc(x.tag) + '</span></div>';

    return '<article class="' + cardClass + '" data-cat="' + x.cat + '" data-search="' + esc((x.n + ' ' + x.d + ' ' + x.tag).toLowerCase()) + '">' +
      '<div class="card__media">' +
        imgHtml +
        '<span class="card__tag">' + esc(x.tag) + '</span>' +
      '</div>' +
      '<div class="card__body">' +
        '<h3>' + esc(x.n) + '</h3>' +
        '<p>' + esc(x.d) + '</p>' +
        (actions ? '<div class="card__act">' + actions + '</div>' : '') +
      '</div>' +
      '<span class="spot"></span>' +
    '</article>';
  }

  function fill(id, arr) {
    var el = $(id);
    if (el) el.innerHTML = arr.map(function(item) { return card(item, false); }).join('');
  }

  /* ---------- População dos Grids ---------- */
  fill('#gridCultura', D.cultura);
  fill('#gridVinho', D.vinho);
  fill('#gridNatureza', D.natureza);

  fill('#gridComer', D.comer.map(function (x) {
    if (!x.wa) x.wa = 'https://wa.me/554935327468?text=' + encodeURIComponent('Olá! Vim pelo Portal de Turismo de Tangará e gostaria de informações sobre ' + x.n + '.');
    return x;
  }));

  fill('#gridFicar', D.ficar.map(function (x) {
    if (!x.wa) x.wa = 'https://wa.me/554935327468?text=' + encodeURIComponent('Olá! Gostaria de informações sobre hospedagem no Portal de Tangará: ' + x.n + '.');
    return x;
  }));

  fill('#gridClube', D.clube);
  fill('#gridEvento', D.evento);

  // Circuito de Caravaggio com numeração clara de paradas
  var caravaggioEl = $('#gridCaravaggio');
  if (caravaggioEl) {
    caravaggioEl.innerHTML = D.caravaggio.map(function (x, i) {
      var num = String(i + 1).padStart(2, '0');
      return '<li class="stop" data-cat="caravaggio" data-search="' + esc((x.n + ' ' + x.d + ' ' + x.tag).toLowerCase()) + '">' +
        '<div class="stop__badge" aria-label="Parada ' + num + '"><span class="stop__badge-num">' + num + '</span><span class="stop__badge-txt">PARADA</span></div>' +
        card(x, true) +
      '</li>';
    }).join('');
  }

  // Lista dos 7 Capitéis
  var capiteisEl = $('#listCapiteis');
  if (capiteisEl) {
    capiteisEl.innerHTML = D.capiteis.map(function (c) {
      var parts = c.split(' · ');
      var n = parts[0] || '';
      var title = parts[1] || c;
      return '<li data-cat="natureza" data-search="capitel ' + esc(c.toLowerCase()) + '">' +
        '<span><b>' + esc(n) + '</b>' + esc(title) + '</span>' +
      '</li>';
    }).join('');
  }

  /* ---------- Menu Mobile & Header ---------- */
  var burger = $('#burger'), menu = $('#menu'), header = $('#header');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('is-active', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });

    $$('#menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function onScrollHdr() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }
  }
  window.addEventListener('scroll', onScrollHdr, { passive: true });
  onScrollHdr();

  /* ---------- Scroll Suave & Lenis (Apenas Desktop) ---------- */
  var lenis = null;
  var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  // Inicializa Lenis somente no Desktop onde há mouse wheel e sem problemas de touch
  if (!reduced && !isTouch && typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        smoothTouch: false
      });
      if (hasGsap) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    } catch (e) {
      console.warn('Lenis não pôde ser iniciado, usando scroll nativo:', e);
    }
  }

  // Links com âncora suave
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = $(id);
      if (!target) return;
      e.preventDefault();
      var offset = (id === '#inicio') ? 0 : -85;
      if (lenis) {
        lenis.scrollTo(target, { offset: offset });
      } else {
        var y = target.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      }
    });
  });

  /* ---------- Animações GSAP Seguras (Sem travar opacidade) ---------- */
  if (hasGsap && !reduced) {
    // Hero intro
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.line__in', { yPercent: 100, duration: 1, stagger: 0.12, delay: 0.1 })
      .from('.hero .reveal', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
      .from('.live-card', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.capsule', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5');

    // Parallax no Desktop
    if (!isTouch) {
      gsap.to('#heroBg', {
        yPercent: 15,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Revelação segura: anima se ScrollTrigger acionar, MAS os itens já possuem opacity 1 no CSS
    if (!isTouch) {
      $$('.section .sec-head').forEach(function (head) {
        gsap.from(head, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: head, start: 'top 92%', once: true }
        });
      });
    }
  }

  // Garantia de segurança: garante que todos os cards e elementos estejam 100% visíveis
  setTimeout(function () {
    $$('.card, .stop, .reveal, .svc, .dl').forEach(function (el) {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
    if (hasGsap) ScrollTrigger.refresh();
  }, 300);

  /* ---------- Efeito Tilt 3D / Spotlight no Desktop ---------- */
  if (!reduced && !isTouch && window.matchMedia('(hover: hover)').matches) {
    $$('.tilt').forEach(function (c) {
      var spot = $('.spot', c);
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        var rx = ((y / r.height) - 0.5) * -7, ry = ((x / r.width) - 0.5) * 7;
        c.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
        if (spot) spot.style.background = 'radial-gradient(280px circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,.32), transparent 70%)';
      });
      c.addEventListener('pointerleave', function () {
        c.style.transform = '';
        if (spot) spot.style.background = 'none';
      });
    });
  }

  /* ---------- Busca Inteligente em Tempo Real ---------- */
  var allSearchItems = $$('.card, .stop, #listCapiteis li');
  var qInput = $('#q'), catSelect = $('#cat'), searchStatus = $('#searchStatus');

  function runSearch() {
    var q = (qInput ? qInput.value : '').trim().toLowerCase();
    var cat = catSelect ? catSelect.value : '';
    var count = 0, firstMatch = null;

    var norm = function (s) {
      return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    var nq = norm(q);

    allSearchItems.forEach(function (el) {
      el.classList.remove('hit', 'dim');
    });

    if (!q && !cat) {
      if (searchStatus) searchStatus.textContent = '';
      return;
    }

    var seenStops = new Set();
    allSearchItems.forEach(function (el) {
      var c = el.dataset.cat || '';
      var s = norm(el.dataset.search || el.textContent.toLowerCase());
      var matchesCat = (!cat || c === cat);
      var matchesQuery = (!q || s.indexOf(nq) > -1);
      var ok = matchesCat && matchesQuery;

      if (ok) {
        el.classList.add('hit');
        var host = el.closest('.stop') || el;
        if (!seenStops.has(host)) {
          seenStops.add(host);
          count++;
          if (!firstMatch) firstMatch = host;
        }
      } else {
        el.classList.add('dim');
      }
    });

    if (searchStatus) {
      searchStatus.textContent = count > 0
        ? count + ' atrativo(s) encontrado(s). Role a página para ver os destaques.'
        : 'Nenhum atrativo encontrado para "' + q + '". Tente outra palavra-chave.';
    }

    if (firstMatch) {
      var offset = -140;
      if (lenis) {
        lenis.scrollTo(firstMatch, { offset: offset });
      } else {
        var topPos = firstMatch.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top: topPos, behavior: reduced ? 'auto' : 'smooth' });
      }
    }
  }

  var searchForm = $('#searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      runSearch();
    });
  }
  if (qInput) qInput.addEventListener('input', runSearch);
  if (catSelect) catSelect.addEventListener('change', runSearch);

  /* ---------- Transmissão da Câmera ao Vivo ---------- */
  if (CONFIG.cameraUrl) {
    var frameEl = $('#camFrame');
    var fallbackEl = $('#camFallback');
    if (frameEl) {
      var iframe = document.createElement('iframe');
      iframe.src = CONFIG.cameraUrl;
      iframe.title = 'Câmera ao vivo do Morro Agudo';
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      frameEl.appendChild(iframe);
      if (fallbackEl) fallbackEl.style.display = 'none';
    }
  }

  /* ---------- Telemetria Climática (Open-Meteo) ---------- */
  function dirTxt(d) {
    return ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'][Math.round(d / 45) % 8];
  }
  function setT(id, val) {
    var el = $(id);
    if (el) el.textContent = val;
  }

  function loadWeather() {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + CONFIG.lat + '&longitude=' + CONFIG.lng +
      '&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kmh&timezone=America%2FSao_Paulo';

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var c = data && data.current;
        if (!c) return;
        var wind = Math.round(c.wind_speed_10m);
        var gust = Math.round(c.wind_gusts_10m);
        var temp = Math.round(c.temperature_2m);
        var dir = Math.round(c.wind_direction_10m);

        setT('#tWind', wind);
        setT('#tGust', gust);
        setT('#tTemp', temp);
        setT('#tDir', dir + '°');
        setT('#tDirTxt', dirTxt(dir));

        setT('#heroWind', wind);
        setT('#heroTemp', temp);

        var needle = $('#needle');
        if (needle) {
          needle.style.transform = 'translate(-50%, -100%) rotate(' + ((dir + 180) % 360) + 'deg)';
        }

        var hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        setT('#tSrc', 'Telemetria meteorológica oficial Tangará (1.075 m) · atualizado às ' + hora + '.');
      })
      .catch(function () {
        setT('#tSrc', 'Dados climáticos temporariamente indisponíveis.');
      });
  }
  loadWeather();
  setInterval(loadWeather, 10 * 60 * 1000);

  /* ---------- Mapa Interativo (Leaflet) ---------- */
  if (typeof L !== 'undefined' && $('#map')) {
    var map = L.map('map', { scrollWheelZoom: false }).setView([-27.085, -51.25], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap colaboradores'
    }).addTo(map);

    var pinColors = {
      caravaggio: '#4A0E17',
      natureza: '#2f7d4f',
      cultura: '#0F4C81',
      vinho: '#7a1d2b',
      comer: '#C92A2A',
      ficar: '#b9770e',
      clube: '#5b3fa0'
    };
    var layerLabels = {
      caravaggio: 'Circuito Caravaggio',
      natureza: 'Caminhos da Natureza',
      cultura: 'História & Lazer',
      vinho: 'Enoturismo',
      comer: 'Gastronomia',
      ficar: 'Hospedagem',
      clube: 'Aventura'
    };

    var groups = {};
    Object.keys(pinColors).forEach(function (k) {
      groups[k] = L.layerGroup().addTo(map);
      var items = D[k] || [];
      items.forEach(function (x) {
        if (!x.ll) return;
        var ic = L.divIcon({
          className: 'pin',
          html: '<i style="background:' + pinColors[k] + '"></i>',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });
        var link = mapLink(x);
        var popup = '<b>' + esc(x.n) + '</b><br><small>' + esc(x.d) + '</small>' +
          (link ? '<br><a href="' + link + '" target="_blank" rel="noopener" style="font-weight:600;color:#0F4C81;display:inline-block;margin-top:4px;">Como chegar →</a>' : '');
        L.marker(x.ll, { icon: ic, title: x.n }).bindPopup(popup).addTo(groups[k]);
      });
    });

    // Marcador de destaque: Morro Agudo
    var ma = D.morroAgudo;
    if (ma) {
      L.marker([ma.lat, ma.lng], {
        icon: L.divIcon({ className: 'pin pin--peak', html: '<i></i>', iconSize: [30, 30], iconAnchor: [15, 15] })
      }).bindPopup('<b>' + ma.n + '</b><br>Altitude: 1.075 m<br><a href="https://www.google.com/maps/search/?api=1&query=' + ma.lat + ',' + ma.lng + '" target="_blank" rel="noopener" style="font-weight:600;color:#C92A2A;display:inline-block;margin-top:4px;">Como chegar ao pico →</a>').addTo(map);
    }

    // Traçado do Circuito de Caravaggio
    var rotaCaravaggio = D.caravaggio.filter(function (x) { return x.ll; }).map(function (x) { return x.ll; });
    if (rotaCaravaggio.length > 1) {
      L.polyline(rotaCaravaggio, { color: '#4A0E17', weight: 4, dashArray: '6 8', opacity: 0.8 }).bindTooltip('Rota do Circuito de Caravaggio (28 km)').addTo(map);
    }

    // Filtros visuais do mapa
    var fb = $('#mapFilters');
    if (fb) {
      fb.innerHTML = '';
      Object.keys(groups).forEach(function (k) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mf on';
        btn.setAttribute('aria-pressed', 'true');
        btn.innerHTML = '<i style="background:' + pinColors[k] + '"></i>' + layerLabels[k];
        btn.addEventListener('click', function () {
          var on = btn.classList.toggle('on');
          btn.setAttribute('aria-pressed', on);
          on ? map.addLayer(groups[k]) : map.removeLayer(groups[k]);
        });
        fb.appendChild(btn);
      });
    }

    map.once('focus', function () { map.scrollWheelZoom.enable(); });
  }

  window.addEventListener('load', function () {
    if (hasGsap) ScrollTrigger.refresh();
  });
})();
