const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// One progressive motion helper; content stays visible if animation fails.
function animate(element, frames, options) {
  if (reducedMotion.matches || !element.animate) return null;
  return element.animate(frames, {easing:'cubic-bezier(.2,.65,.3,1)', ...options});
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) document.getAnimations().forEach(animation => animation.finish());
});
const projects = {
  canopy:{name:'The Canopy Residences',location:'Balewadi, Pune · Signature residences',image:'residences',alt:'Illustrative apartment architecture with planted balconies',description:'An imagined collection of light-filled residences with generous balconies, calm interiors and landscaped spaces. Designed around the simple pleasure of coming home.',type:'3 & 4 bedrooms',area:'1,650–2,400 sq. ft.*',features:['Private balconies and generous living areas','Landscaped gardens and spaces to meet','A considered clubhouse and fitness space','Convenient access to the city']},
  grove:{name:'The Grove Villas',location:'Baner, Pune · Private villa collection',image:'hero',alt:'Illustrative private villa with a landscaped poolside terrace',description:'A private retreat with room to grow. This concept brings together open living, intimate courtyards and generous terraces for a life in balance.',type:'4 & 5 bedrooms',area:'3,200–4,500 sq. ft.*',features:['Private gardens and outdoor living','Double-height living spaces','Thoughtful indoor–outdoor connections','Flexible spaces for work and leisure']},
  one:{name:'Aurelia One',location:'Kharadi, Pune · Contemporary workspaces',image:'commercial',alt:'Illustrative boutique workspace with glass-fronted rooms and warm natural finishes',description:'A new perspective on the working day. An illustrative address for ambitious businesses, pairing contemporary architecture with a thoughtful workplace experience.',type:'Offices & retail',area:'800–3,000 sq. ft.*',features:['Flexible boutique office configurations','A welcoming arrival experience','Dedicated collaboration areas','Designed for connectivity and convenience']}
};
const imageWidths = {hero:[480,800,1200,1600],residences:[480,800,1200,1600],commercial:[480,800,1200,1600],living:[480,800,1200,1600],pool:[480,800,1200,1600]};
function setImage(image, name, alt, sizes) {
  image.sizes = sizes;
  image.srcset = imageWidths[name].map(width => `assets/optimized/${name}-${width}.webp ${width}w`).join(', ');
  image.src = `assets/optimized/${name}-800.webp`; image.alt = alt;
}
// Native modal semantics contain focus and make the background inert.
const returnTargets = new WeakMap();
function openDialog(dialog, returnTo = document.activeElement) {
  returnTargets.set(dialog, returnTo);
  if (!dialog.open) dialog.showModal();
  $('.dialog-scroll', dialog).scrollTop = 0;
  document.body.classList.add('modal-open');
  $('.dialog-close', dialog).focus({preventScroll:true});
}
function closeDialog(dialog, restoreFocus = true) {
  if (!restoreFocus) returnTargets.delete(dialog);
  dialog.close();
}
$$('dialog').forEach(dialog => {
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = $$('button, a[href], input, select, [tabindex="0"]', dialog).filter(el => !el.disabled && el.getClientRects().length);
    const index = controls.indexOf(document.activeElement);
    if ((event.shiftKey && index === 0) || (!event.shiftKey && index === controls.length - 1)) {
      event.preventDefault(); controls[event.shiftKey ? controls.length - 1 : 0].focus();
    }
  });
  $('.dialog-close', dialog).addEventListener('click', () => closeDialog(dialog));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(dialog);
  });
  dialog.addEventListener('close', () => {
    if (!$$('dialog[open]').length) {
      document.body.classList.remove('modal-open');
      const target = returnTargets.get(dialog);
      if (target?.isConnected) target.focus({preventScroll:true});
    }
  });
});
const menu = $('.menu-toggle');
const mobile = matchMedia('(max-width: 800px)');
function toggleMenu(expanded, restoreFocus = false) {
  menu.setAttribute('aria-expanded', String(expanded));
  menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  $('.nav').classList.toggle('open', expanded);
  document.body.classList.toggle('menu-open', expanded);
  $$('main, footer, .header > .brand, .header-cta').forEach(element => { element.inert = expanded; });
  if (restoreFocus) menu.focus();
}
menu.addEventListener('click', () => toggleMenu(menu.getAttribute('aria-expanded') !== 'true'));
mobile.addEventListener('change', () => toggleMenu(false));
$$('.nav a').forEach(link => link.addEventListener('click', () => {
  toggleMenu(false);
  const target = $(link.hash); target.tabIndex = -1; target.focus({preventScroll:true});
}));
document.addEventListener('keydown', event => {
  if (menu.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') { event.preventDefault(); toggleMenu(false, true); }
  if (event.key === 'Tab') {
    const controls = [...$$('.nav a'), menu];
    const index = controls.indexOf(document.activeElement);
    if ((!event.shiftKey && index === controls.length - 1) || (event.shiftKey && index === 0)) {
      event.preventDefault(); controls[event.shiftKey ? controls.length - 1 : 0].focus();
    }
  }
});
const grid = $('.project-grid');
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  if (button.getAttribute('aria-pressed') === 'true') return;
  $$('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  // Reserve natural collection height to prevent scroll jumps during filtering.
  const oldHeight = grid.getBoundingClientRect().height;
  if (!mobile.matches && !grid.style.minHeight) grid.style.minHeight = `${oldHeight}px`;
  let count = 0;
  $$('.project-card').forEach(card => {
    card.getAnimations().forEach(a => a.cancel());
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    $('img',card).sizes = button.dataset.filter === 'all' ? '(max-width: 480px) 86vw, (max-width: 1000px) 42vw, 28vw' : '(max-width: 480px) 86vw, (max-width: 800px) 86vw, 46vw';
    if (!card.hidden) { count++; animate(card, [{opacity:.25,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}], {duration:220}); }
  });
  grid.classList.toggle('single-result', count === 1);
  if (mobile.matches) animate(grid, [{height:`${oldHeight}px`,overflow:'clip'},{height:`${grid.getBoundingClientRect().height}px`,overflow:'clip'}],{duration:220});
  $('.project-count').textContent = `${String(count).padStart(2,'0')} ${count === 1 ? 'CURATED ADDRESS' : 'CURATED ADDRESSES'}`;
}));
let previousWidth = innerWidth;
addEventListener('resize', () => { if (innerWidth !== previousWidth) { grid.style.minHeight = ''; previousWidth = innerWidth; } });
let selectedProject = '';
$$('[data-project]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault(); selectedProject = button.dataset.project;
  const p = projects[selectedProject];
  $('#project-title').textContent = p.name; $('#detail-location').textContent = p.location;
  setImage($('#detail-image'), p.image, p.alt, '(max-width: 800px) 600px, 1200px');
  $('#detail-description').textContent = p.description;
  $('#detail-facts').replaceChildren(...[['COLLECTION',p.type],['ILLUSTRATIVE SIZE',p.area]].map(([label,value]) => {
    const el = document.createElement('div'), small = document.createElement('small'), span = document.createElement('span');
    small.textContent = label; span.textContent = value; el.append(small,span); return el;
  }));
  $('#detail-features').replaceChildren(...p.features.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  $$('select[name=interest]').forEach(select => { select.value = p.name; });
  $$('form').forEach(clearPreview); openDialog($('#project-dialog'));
}));
function enquire(interest, returnTo) {
  if (interest) $('#visit-form select').value = interest;
  clearPreview($('#visit-form')); openDialog($('#visit-dialog'), returnTo);
}
$$('[data-enquire]').forEach(button => button.addEventListener('click', () => enquire()));
$('#detail-enquire').addEventListener('click', () => {
  const trigger = returnTargets.get($('#project-dialog'));
  closeDialog($('#project-dialog'), false); enquire(projects[selectedProject].name, trigger);
});
function today() {
  const now = new Date();
  return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
}
$('#visit-form input[type=date]').min = today();
function clearPreview(form) { $('.form-status', form).textContent = ''; }
function fieldMessage(field) {
  if (field.validity.valueMissing || (field.name === 'name' && !field.value.trim())) return field.type === 'checkbox' ? 'Confirm that these details are for a local preview.' : `Enter ${field.name === 'date' ? 'a preferred visit date' : field.name === 'name' ? 'your name' : 'your email address'}.`;
  if (field.validity.typeMismatch) return 'Enter an email address like you@example.com.';
  if (field.validity.patternMismatch) return 'Use 7–20 characters: digits, spaces, +, ( ), or a hyphen.';
  if (field.validity.rangeUnderflow) return 'Choose today or a future date for this preview.';
  if (field.validity.badInput) return 'Enter a valid date.';
  return field.validity.valid ? '' : 'Check this field and try again.';
}
$$('form').forEach(form => {
  const fields = $$('input, select', form), summary = document.createElement('p');
  summary.className = 'form-errors'; summary.id = `${form.id}-errors`; summary.setAttribute('role','alert');
  form.insertBefore(summary, $('button[type=submit]', form));
  fields.forEach((field,index) => {
    field.id ||= `${form.id}-field-${index}`;
    const error = document.createElement('span'); error.id = `${field.id}-error`; error.className = 'field-error';
    field.setAttribute('aria-describedby', error.id); field.closest('label').append(error);
    field.addEventListener('input', () => {
      clearPreview(form); if (field.hasAttribute('aria-invalid')) validateField(field);
      if (fields.every(f => !fieldMessage(f))) summary.textContent = '';
    });
    field.addEventListener('change', () => clearPreview(form));
  });
  function validateField(field) {
    const message = fieldMessage(field); $(`#${field.id}-error`).textContent = message;
    if (message) field.setAttribute('aria-invalid','true'); else field.removeAttribute('aria-invalid');
    return !message;
  }
  // Leave native validation intact until enhancements are ready.
  form.noValidate = true;
  $('button[type=submit]',form).disabled = false;
  form.addEventListener('submit', event => {
    event.preventDefault(); clearPreview(form);
    if (form.id === 'visit-form') $('input[type=date]',form).min = today();
    const invalid = fields.filter(field => !validateField(field));
    if (invalid.length) {
      summary.textContent = `Please check ${invalid.length === 1 ? 'the highlighted field' : `the ${invalid.length} highlighted fields`}. Nothing has been sent.`;
      invalid[0].focus(); return;
    }
    summary.textContent = ''; const data = new FormData(form);
    const date = data.has('date') ? ` on ${new Date(data.get('date')+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}` : '';
    const phone = data.get('phone')?.trim();
    $('.form-status',form).textContent = `Preview ready, ${data.get('name').trim()}: ${data.get('interest')}${date}. Email: ${data.get('email')}.${phone ? ` Phone: ${phone}.` : ''} Demo only — no enquiry has been sent, no booking made, and no details saved.`;
  });
});
const heroSlides = [
  {image:'hero',caption:'THE GROVE COLLECTION',location:'Private villas · Baner, Pune',alt:projects.grove.alt},
  {image:'residences',caption:'THE CANOPY RESIDENCES',location:'Signature residences · Balewadi, Pune',alt:projects.canopy.alt},
  {image:'living',caption:'THE ART OF LIVING WELL',location:'Thoughtful spaces · The Aurelia collection',alt:'Illustrative contemporary interiors with natural light'}
];
let heroIndex = 0, heroRequest = 0, heroAnimation;
let heroActive = $('#hero-image'), heroStandby = document.createElement('img');
heroStandby.className = 'hero-image hero-standby'; heroStandby.alt = ''; heroStandby.setAttribute('aria-hidden','true');
heroActive.after(heroStandby);
async function showHero(delta) {
  heroIndex = (heroIndex + delta + heroSlides.length) % heroSlides.length;
  const request = ++heroRequest, slide = heroSlides[heroIndex];
  if (heroAnimation) { heroAnimation.finish(); await heroAnimation.finished.catch(()=>{}); }
  setImage(heroStandby, slide.image, slide.alt, '(max-width: 800px) 1200px, 100vw');
  try { await heroStandby.decode(); } catch { return; }
  if (request !== heroRequest) return;
  heroStandby.style.zIndex = '1'; heroActive.style.zIndex = '0';
  heroStandby.removeAttribute('aria-hidden'); heroActive.setAttribute('aria-hidden','true');
  $('#hero-caption').textContent = slide.caption; $('#hero-location').textContent = slide.location;
  $('#slide-index').textContent = String(heroIndex + 1).padStart(2,'0');
  heroAnimation = animate(heroStandby, [{opacity:0},{opacity:1}], {duration:600});
  heroStandby.style.opacity = '1';
  if (heroAnimation) await heroAnimation.finished.catch(()=>{});
  heroActive.style.opacity = '0'; [heroActive,heroStandby] = [heroStandby,heroActive]; heroAnimation = null;
}
$('#hero-prev').addEventListener('click', () => showHero(-1)); $('#hero-next').addEventListener('click', () => showHero(1));
const gallery = [
  {image:'pool',title:'Space to unwind',alt:'Illustrative landscaped pool and contemporary residence'},
  {image:'living',title:'Room to feel at home',alt:'Illustrative open living spaces and natural materials'},
  {image:'hero',title:'Closer to the outdoors',alt:projects.grove.alt}
];
let galleryIndex = 0;
function showGallery(delta = 0) {
  galleryIndex = (galleryIndex + delta + gallery.length) % gallery.length;
  const s = gallery[galleryIndex]; setImage($('#gallery-image'),s.image,s.alt,'(max-width: 480px) 800px, 92vw');
  $('#gallery-title').textContent = s.title; $('#gallery-count').textContent = `${galleryIndex + 1} / ${gallery.length}`;
}
$$('[data-gallery]').forEach(button => button.addEventListener('click', () => { showGallery(); openDialog($('#gallery-dialog')); }));
$('#gallery-prev').addEventListener('click', () => showGallery(-1)); $('#gallery-next').addEventListener('click', () => showGallery(1));
$('#privacy-button').addEventListener('click', () => openDialog($('#privacy-dialog')));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    const children = entry.target.matches('.principles') ? [...entry.target.children] : [entry.target];
    children.forEach((child,index) => animate(child,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:Math.min(index*55,165)}));
  }), {threshold:.12});
  $$('.story-images, .story-copy, .section-heading, .project-grid, .living-content > *, .principles, .contact-copy, .enquiry-form').forEach(element => observer.observe(element));
}
