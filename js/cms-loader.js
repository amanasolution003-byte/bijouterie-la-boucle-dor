// ============================================
// Chargeur de contenu - La Boucle d'Or
// Rend les pages depuis les fichiers JSON edites
// via Decap CMS (admin/index.html).
// Si un JSON est introuvable, le contenu HTML
// de la page reste affiche (secours).
// ============================================

(function() {
  'use strict';

  var isSubPage = /\/pages\//.test(location.pathname);
  var base = isSubPage ? '../' : '';
  var slug = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/i, '');

  function fetchJSON(url) {
    return fetch(url).then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function getIconSvg(type) {
    switch (type) {
      case 'whatsapp':
        return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
      case 'facebook':
        return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
      case 'address':
        return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
      case 'email':
        return '&#9993;';
      case 'hours':
        return '&#9200;';
      case 'phone':
      default:
        return '&#9742;';
    }
  }

  function iconClass(type) {
    if (type === 'whatsapp') return ' contact-icon-wa';
    if (type === 'facebook') return ' contact-icon-fb';
    if (type === 'address') return ' contact-icon-gm';
    return '';
  }

  function renderSettings(s) {
    var hero = document.querySelector('.hero');
    if (hero) {
      if (s.hero && s.hero.image) {
        var img = base + s.hero.image;
        hero.style.background =
          "linear-gradient(rgba(10,10,10,0.55), rgba(10,10,10,0.55)), url('" + img + "') center/cover no-repeat";
      }
      var h1 = hero.querySelector('h1');
      var p = hero.querySelector('p');
      if (h1 && s.hero && s.hero.title) h1.textContent = s.hero.title;
      if (p && s.hero && s.hero.subtitle) p.textContent = s.hero.subtitle;
      var btn = hero.querySelector('.btn');
      if (btn && s.hero && s.hero.button) btn.textContent = s.hero.button;
    }

    var colTitle = document.querySelector('#collections .section-title');
    var colSub = document.querySelector('#collections .section-subtitle');
    if (colTitle && s.collections && s.collections.title) colTitle.textContent = s.collections.title;
    if (colSub && s.collections && s.collections.subtitle) colSub.textContent = s.collections.subtitle;

    var abTitle = document.querySelector('#a-propos .section-title');
    var abSub = document.querySelector('#a-propos .section-subtitle');
    if (abTitle && s.about && s.about.title) abTitle.textContent = s.about.title;
    if (abSub && s.about && s.about.subtitle) abSub.textContent = s.about.subtitle;
    if (s.about) {
      var box = document.querySelector('#a-propos .about-text');
      if (box && s.about.paragraphs && s.about.paragraphs.length) {
        box.innerHTML = s.about.paragraphs.map(function(par) { return '<p>' + par + '</p>'; }).join('') +
          (s.about.button ? '<a href="' + (s.about.buttonLink || '#contact') + '" class="btn">' + s.about.button + '</a>' : '');
      }
    }

    var tesTitle = document.querySelector('#avis .section-title');
    var tesSub = document.querySelector('#avis .section-subtitle');
    if (tesTitle && s.testimonials && s.testimonials.title) tesTitle.textContent = s.testimonials.title;
    if (tesSub && s.testimonials && s.testimonials.subtitle) tesSub.textContent = s.testimonials.subtitle;
    if (s.testimonials && s.testimonials.items && s.testimonials.items.length) {
      var tGrid = document.querySelector('.testimonials-grid');
      if (tGrid) {
        tGrid.innerHTML = s.testimonials.items.map(function(t) {
          return '<div class="testimonial-card"><p>' + t.text + '</p><div class="author">- ' + t.author + '</div></div>';
        }).join('');
      }
    }

    var coTitle = document.querySelector('#contact .section-title');
    var coSub = document.querySelector('#contact .section-subtitle');
    if (coTitle && s.contact && s.contact.title) coTitle.textContent = s.contact.title;
    if (coSub && s.contact && s.contact.subtitle) coSub.textContent = s.contact.subtitle;
    if (s.contact && s.contact.items && s.contact.items.length) {
      var cGrid = document.querySelector('.contact-grid');
      if (cGrid) {
        cGrid.innerHTML = s.contact.items.map(function(it) {
          var value = it.link
            ? '<a href="' + it.link + '" target="_blank" rel="noopener" class="contact-value">' + it.value + '</a>'
            : '<p class="contact-value">' + it.value + '</p>';
          return '<div class="contact-item"><div class="contact-icon' + iconClass(it.icon) + '">' +
            getIconSvg(it.icon) + '</div><p class="contact-label">' + it.label + '</p>' + value + '</div>';
        }).join('');
      }
    }

    if (s.site && s.site.logo) {
      var logo = document.querySelector('.logo');
      if (logo) logo.textContent = s.site.logo;
    }
    if (s.site && s.site.footer) {
      var foot = document.querySelector('.footer p');
      if (foot) foot.textContent = s.site.footer;
    }
    if (s.site && s.site.title) {
      document.title = s.site.title;
    }
  }

  function renderCollections(data) {
    if (!data || !data.items || !data.items.length) return;
    var grid = document.querySelector('.collections-grid');
    if (!grid) return;
    grid.innerHTML = data.items.map(function(c) {
      return '<a href="' + base + c.page + '" class="collection-card">' +
        '<img src="' + base + c.image + '" alt="' + c.title + '" class="card-img">' +
        '<div class="card-body"><h3>' + c.title + '</h3><p>' + c.description + '</p></div></a>';
    }).join('');
  }

  function renderProducts(data) {
    var pTitle = document.querySelector('.page-header h1');
    var pSub = document.querySelector('.page-header p');
    if (pTitle && data.pageTitle) pTitle.textContent = data.pageTitle;
    if (pSub && data.subtitle) pSub.textContent = data.subtitle;

    var grid = document.querySelector('.product-grid');
    if (!grid || !data.products || !data.products.length) return;
    grid.innerHTML = data.products.map(function(p) {
      return '<div class="product-card"><img src="' + base + p.image + '" alt="' + p.title + '">' +
        '<div class="p-body"><h3>' + p.title + '</h3><a href="#" class="btn">Voir detail</a></div></div>';
    }).join('');
  }

  function apply(renderFn, data) {
    try { renderFn(data); } catch (e) { console.error('Erreur rendu:', e); }
  }

  // --- Loader principal ---
  var settingsPromise = fetchJSON(base + 'content/settings.json').catch(function() { return null; });
  var collectionsPromise = fetchJSON(base + 'content/collections.json').catch(function() { return null; });
  var productsPromise = null;

  if (slug !== 'index' && slug !== '') {
    productsPromise = fetchJSON(base + 'content/products/' + slug + '.json').catch(function() { return null; });
  }

  settingsPromise.then(function(s) { if (s) apply(renderSettings, s); });
  collectionsPromise.then(function(c) { if (c) apply(renderCollections, c); });
  if (productsPromise) {
    productsPromise.then(function(p) { if (p) apply(renderProducts, p); });
  }
})();