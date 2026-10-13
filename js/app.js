(function () {
  'use strict';
  var D = window.TANGARA;
  var CONFIG = {
    // Cole aqui a URL de incorporação (iframe) da câmera ao vivo do Morro Agudo.
    cameraUrl: '',
    lat: D.morroAgudo.lat,
    lng: D.morroAgudo.lng
  };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Datas ---------- */
  var now = new Date();
  var today = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('#today').textContent = today.charAt(0).toUpperCase() + today.slice(1);
  $('#year').textContent = now.getFullYear();

  /* ---------- Cards ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mapLink(x) { return x.ll ? 'https://www.google.com/maps/search/?api=1&query=' + x.ll[0] + ',' + x.ll[1] : null; }

  function card(x) {
    var actions = '';
    if (x.wa) actions += '<a class="chip chip--wa" href="' + x.wa + '" target="_blank" rel="noopener">WhatsApp</a>';
    var m = mapLink(x);
    if (m) actions += '<a class="chip" href="' + m + '" target="_blank" rel="noopener">Como chegar</a>';
    return '<article class="card tilt" data-cat="' + x.cat + '" data-search="' + esc((x.n + ' ' + x.d + ' ' + x.tag).toLowerCase()) + '">' +
      '<div class="card__media"><img src="' + x.img + '" alt="' + esc(x.n) + '" loading="lazy" width="640" height="420" onerror="this.parentNode.classList.add(\'noimg\');this.remove()">' +
      '<span class="card__tag">' + esc(x.tag) + '</span></div>' +
      '<div class="card__body"><h3>' + esc(x.n) + '</h3><p>' + esc(x.d) + '</p>' +
      (actions ? '<div class="card__act">' + actions + '</div>' : '') + '</div><span class="spot"></span></article>';
  }
  function fill(id, arr) { var el = $(id); if (el) el.innerHTML = arr.map(card).join(''); }

  fill('#gridCultura', D.cultura);
  fill('#gridVinho', D.vinho);
  fill('#gridNatureza', D.natureza);
  fill('#gridComer', D.comer.map(function (x) { if (!x.wa) x.wa = 'https://wa.me/554935327468?text=' + encodeURIComponent('Olá! Vim pelo Portal de Turismo e gostaria de informações sobre ' + x.n + '.'); return x; }));
  fill('#gridFicar', D.ficar.map(function (x) { if (!x.wa) x.wa = 'https://wa.me/554935327468?text=' + encodeURIComponent('Olá! Gostaria de informações sobre hospedagem: ' + x.n + '.'); return x; }));
  fill('#gridClube', D.clube);
  fill('#gridEvento', D.evento);

  $('#gridCaravaggio').innerHTML = D.caravaggio.map(function (x, i) {
    return '<li class="stop" data-cat="caravaggio" data-search="' + esc((x.n + ' ' + x.d + ' ' + x.tag).toLowerCase()) + '">' +
      '<span class="stop__n">' + String(i + 1).padStart(2, '0') + '</span>' + card(x).replace('class="card tilt"', 'class="card tilt card--wine"') + '</li>';
  }).join('');

  $('#listCapiteis').innerHTML = D.capiteis.map(function (c) {
    return '<li data-cat="natureza" data-search="capitel ' + esc(c.toLowerCase()) + '"><span>' + esc(c) + '</span></li>';
  }).join('');
  // O número já vem no texto; ajusta visual
  $$('#listCapiteis li span').forEach(function (s) {
    var p = s.textContent.split(' · ');
    s.innerHTML = '<b>' + p[0] + '</b>' + p[1];
  });

  /* ---------- Menu mobile & header ---------- */
  var burger = $('#burger'), menu = $('#menu'), header = $('#header');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });
  function onScrollHdr() { header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScrollHdr, { passive: true }); onScrollHdr();

  /* ---------- Lenis + GSAP ---------- */
  var lenis = null;
  var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = $(id); if (!t) return;
      e.preventDefault();
      var off = id === '#inicio' ? 0 : -80;
      if (lenis) lenis.scrollTo(t, { offset: off }); else t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  if (hasGsap && !reduced) {
    // Hero intro
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.line__in', { yPercent: 110, duration: 1.2, stagger: 0.14, delay: 0.15 })
      .from('.hero .reveal', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.7')
      .from('.live-card', { y: 40, opacity: 0, duration: 1 }, '-=0.8')
      .from('.capsule', { y: 30, opacity: 0, duration: 0.9 }, '-=0.6');

    // Parallax
    gsap.to('#heroBg', { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__in', { yPercent: -8, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

    // Reveals
    $$('.section .reveal').forEach(function (el) {
      gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    // Stagger de cards
    $$('.grid').forEach(function (g) {
      gsap.from($$('.card', g), { y: 50, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: g, start: 'top 85%', once: true } });
    });
    gsap.from('.stop', { x: -40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.route', start: 'top 80%', once: true } });
    gsap.from('#listCapiteis li', { scale: 0.85, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(1.6)', scrollTrigger: { trigger: '#listCapiteis', start: 'top 85%', once: true } });
    gsap.fromTo('.route', { '--line': 0 }, { '--line': 1, ease: 'none', scrollTrigger: { trigger: '.route', start: 'top 70%', end: 'bottom 70%', scrub: true } });
  } else {
    $$('.reveal').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    document.documentElement.classList.add('no-motion');
  }

  /* ---------- Tilt 3D + Spotlight ---------- */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    $$('.tilt').forEach(function (c) {
      var spot = $('.spot', c);
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        var rx = ((y / r.height) - 0.5) * -8, ry = ((x / r.width) - 0.5) * 8;
        c.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
        if (spot) spot.style.background = 'radial-gradient(260px circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,.28), transparent 70%)';
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; if (spot) spot.style.background = 'none'; });
    });
  }

  /* ---------- Busca ---------- */
  var items = $$('.card, .stop, #listCapiteis li');
  function runSearch() {
    var q = $('#q').value.trim().toLowerCase(), cat = $('#cat').value, n = 0, first = null;
    var norm = function (s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
    var nq = norm(q);
    items.forEach(function (el) { el.classList.remove('hit', 'dim'); });
    if (!q && !cat) { $('#searchStatus').textContent = ''; return; }
    var seen = new Set();
    items.forEach(function (el) {
      var host = el.closest('.stop') || el;
      var c = el.dataset.cat, s = norm(el.dataset.search || el.textContent.toLowerCase());
      var ok = (!cat || c === cat) && (!q || s.indexOf(nq) > -1);
      if (ok) { el.classList.add('hit'); if (!seen.has(host)) { seen.add(host); n++; if (!first) first = el; } }
      else if (!el.closest('.stop') || el.classList.contains('stop')) el.classList.add('dim');
    });
    $('#searchStatus').textContent = n ? n + ' resultado(s) destacado(s). Role a página para ver.' : 'Nada encontrado. Tente outro termo.';
    if (first) { var t = first; if (lenis) lenis.scrollTo(t, { offset: -200 }); else t.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }); }
  }
  $('#searchForm').addEventListener('submit', function (e) { e.preventDefault(); runSearch(); });
  $('#q').addEventListener('input', function () { if (!this.value) runSearch(); });

  /* ---------- Câmera ---------- */
  if (CONFIG.cameraUrl) {
    var f = document.createElement('iframe');
    f.src = CONFIG.cameraUrl; f.title = 'Câmera ao vivo do Morro Agudo'; f.loading = 'lazy'; f.allow = 'autoplay; fullscreen'; f.allowFullscreen = true;
    $('#camFrame').appendChild(f); $('#camFallback').style.display = 'none';
  }

  /* ---------- Telemetria (Open-Meteo) ---------- */
  function dirTxt(d) { return ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'][Math.round(d / 45) % 8]; }
  function setT(id, v) { var e = $(id); if (e) e.textContent = v; }
  function loadWeather() {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + CONFIG.lat + '&longitude=' + CONFIG.lng +
      '&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kmh&timezone=America%2FSao_Paulo';
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      var c = j.current; if (!c) throw 0;
      var w = Math.round(c.wind_speed_10m), g = Math.round(c.wind_gusts_10m), t = Math.round(c.temperature_2m), d = Math.round(c.wind_direction_10m);
      setT('#tWind', w); setT('#tGust', g); setT('#tTemp', t); setT('#tDir', d + '°'); setT('#tDirTxt', dirTxt(d));
      setT('#heroWind', w); setT('#heroTemp', t);
      $('#needle').style.transform = 'translate(-50%,-100%) rotate(' + ((d + 180) % 360) + 'deg)';
      setT('#tSrc', 'Modelo Open-Meteo · atualizado ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + '. Não substitui a leitura de estação no local.');
    }).catch(function () { setT('#tSrc', 'Dados indisponíveis no momento.'); });
  }
  loadWeather(); setInterval(loadWeather, 10 * 60 * 1000);

  /* ---------- Mapa Leaflet ---------- */
  if (typeof L !== 'undefined') {
    var map = L.map('map', { scrollWheelZoom: false }).setView([-27.085, -51.25], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(map);
    var colors = { caravaggio: '#4A0E17', natureza: '#2f7d4f', cultura: '#0F4C81', vinho: '#7a1d2b', comer: '#C92A2A', ficar: '#b9770e', clube: '#5b3fa0' };
    var labels = { caravaggio: 'Circuito de Caravaggio', natureza: 'Natureza', cultura: 'Cultura', vinho: 'Enoturismo', comer: 'Comer', ficar: 'Ficar', clube: 'Aventura' };
    var groups = {};
    ['caravaggio', 'natureza', 'cultura', 'vinho', 'comer', 'ficar', 'clube'].forEach(function (k) {
      groups[k] = L.layerGroup().addTo(map);
      D[k].forEach(function (x) {
        if (!x.ll) return;
        var ic = L.divIcon({ className: 'pin', html: '<i style="background:' + colors[k] + '"></i>', iconSize: [20, 20], iconAnchor: [10, 10] });
        L.marker(x.ll, { icon: ic, title: x.n }).bindPopup('<b>' + esc(x.n) + '</b><br>' + esc(x.d) + '<br><a href="' + mapLink(x) + '" target="_blank" rel="noopener">Como chegar</a>').addTo(groups[k]);
      });
    });
    var ma = D.morroAgudo;
    L.marker([ma.lat, ma.lng], { icon: L.divIcon({ className: 'pin pin--peak', html: '<i></i>', iconSize: [28, 28], iconAnchor: [14, 14] }) }).bindPopup('<b>' + ma.n + '</b>').addTo(map);
    // Traçado do Circuito de Caravaggio
    L.polyline(D.caravaggio.filter(function (x) { return x.ll; }).map(function (x) { return x.ll; }), { color: '#4A0E17', weight: 3, dashArray: '6 8', opacity: .7 }).addTo(map);
    // Referência SC-453 (traçado esquemático)
    L.polyline([[-27.1450, -51.2850], [-27.1100, -51.2550], [D.center[0], D.center[1]], [-27.0850, -51.2150]], { color: '#0F4C81', weight: 4, opacity: .55 }).bindTooltip('SC-453 (traçado esquemático)').addTo(map);

    var fb = $('#mapFilters');
    Object.keys(groups).forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'mf on'; b.setAttribute('aria-pressed', 'true');
      b.innerHTML = '<i style="background:' + colors[k] + '"></i>' + labels[k];
      b.addEventListener('click', function () {
        var on = b.classList.toggle('on'); b.setAttribute('aria-pressed', on);
        on ? map.addLayer(groups[k]) : map.removeLayer(groups[k]);
      });
      fb.appendChild(b);
    });
    map.once('focus', function () { map.scrollWheelZoom.enable(); });
    if (hasGsap) ScrollTrigger.create({ trigger: '#map', start: 'top bottom', once: true, onEnter: function () { map.invalidateSize(); } });
  }

  window.addEventListener('load', function () { if (hasGsap) ScrollTrigger.refresh(); });
})();
