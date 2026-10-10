import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const artworks = [
  {
    id: 1, title: 'A Soft Place to Land', artist: 'Mara Voss', year: '2025', type: 'Painting', size: 'Oil on linen · 120 × 160 cm',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1100&q=88',
    note: 'Voss builds quiet, almost architectural spaces from memory, leaving the edges deliberately unresolved.'
  },
  {
    id: 2, title: 'Objects for an Empty Room', artist: 'Jules Okafor', year: '2024', type: 'Sculpture', size: 'Cast bronze · 42 × 28 × 19 cm',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1100&q=88',
    note: 'A study in weight and absence: familiar forms made strange through scale, material, and the space between them.'
  },
  {
    id: 3, title: 'Blue Hour, No. 06', artist: 'Inès Laurent', year: '2025', type: 'Photography', size: 'Archival pigment print · 80 × 110 cm',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1100&q=88',
    note: 'Laurent photographs the last moments of daylight, when colour softens and the ordinary becomes unfamiliar.'
  },
  {
    id: 4, title: 'The Garden Keeps Score', artist: 'Mara Voss', year: '2023', type: 'Painting', size: 'Acrylic and graphite on canvas · 90 × 120 cm',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1100&q=88',
    note: 'Layered marks gather like notes in a diary, tracing the shifting boundary between the natural and the imagined.'
  },
  {
    id: 5, title: 'Small Weather System', artist: 'Theo Watanabe', year: '2024', type: 'Sculpture', size: 'Pigmented plaster · variable dimensions',
    image: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=1100&q=88',
    note: 'A family of hand-formed objects that feel geological, but carry the delicate imperfections of a human touch.'
  },
  {
    id: 6, title: 'Everything, in Passing', artist: 'Inès Laurent', year: '2022', type: 'Photography', size: 'C-type print · 70 × 100 cm',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1100&q=88',
    note: 'An intimate sequence about what remains after a moment has already moved on.'
  }
];

const exhibitions = [
  { no: '01', label: 'CURRENT EXHIBITION', title: 'The Shape of Quiet', dates: '12 SEP — 02 NOV 2026', artists: 'Mara Voss · Jules Okafor · Theo Watanabe', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=88', alt: 'Contemporary abstract artwork in a gallery' },
  { no: '02', label: 'COMING NEXT', title: 'Almost Somewhere', dates: '14 NOV — 20 DEC 2026', artists: 'Inès Laurent · guest artists to be announced', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=88', alt: 'Colourful framed contemporary art in a gallery' }
];

function Arrow({ diagonal = false }) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className={diagonal ? 'arrow-icon diagonal' : 'arrow-icon'}><path d="M3.5 10h12M10 4.5l5.5 5.5-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

function App() {
  const [filter, setFilter] = useState('All works');
  const [selectedWork, setSelectedWork] = useState(null);
  const [visitOpen, setVisitOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visitSent, setVisitSent] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeExhibition, setActiveExhibition] = useState(0);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', date: '', guests: '2', note: '' });
  const heroRef = useRef(null);

  const filteredArtworks = useMemo(() => filter === 'All works' ? artworks : artworks.filter((art) => art.type === filter), [filter]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filter, selectedWork, visitOpen, menuOpen]);

  useEffect(() => {
    const locked = Boolean(selectedWork || visitOpen || menuOpen);
    document.body.classList.toggle('no-scroll', locked);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedWork(null); setVisitOpen(false); setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.classList.remove('no-scroll'); window.removeEventListener('keydown', onKeyDown); };
  }, [selectedWork, visitOpen, menuOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    let px = 0;
    let py = 0;
    const onMove = (event) => {
      const rect = hero.getBoundingClientRect();
      px = event.clientX - rect.left;
      py = event.clientY - rect.top;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        hero.style.setProperty('--sx', `${px}px`);
        hero.style.setProperty('--sy', `${py}px`);
      });
    };
    hero.addEventListener('pointermove', onMove);
    return () => {
      hero.removeEventListener('pointermove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const submitVisit = (event) => {
    event.preventDefault();
    setVisitSent(true);
  };

  const submitNewsletter = (event) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div className={`site-shell ${visible ? 'page-entered' : ''}`}>
      <div className="topline"><span>INDEPENDENT CONTEMPORARY ART</span><span className="topline-right">LONDON · EST. 2018 <i className="status-dot" /></span></div>
      <header className="site-header">
        <button className="wordmark" onClick={() => scrollTo('home')} aria-label="STILL/FORM home">STILL<span>/</span>FORM<sup>®</sup></button>
        <nav className="desktop-nav" aria-label="Main navigation">
          <button onClick={() => scrollTo('exhibitions')}>Exhibitions</button>
          <button onClick={() => scrollTo('collection')}>The collection</button>
          <button onClick={() => scrollTo('about')}>Our approach</button>
        </nav>
        <button className="header-visit" onClick={() => { setVisitOpen(true); setVisitSent(false); }}>Plan your visit <Arrow /></button>
        <button className={`menu-toggle ${menuOpen ? 'active' : ''}`} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </header>

      {menuOpen && <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation"><div className="mobile-menu-top"><span>STILL/FORM®</span><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><CloseIcon /></button></div><button onClick={() => scrollTo('exhibitions')}>Exhibitions <Arrow /></button><button onClick={() => scrollTo('collection')}>The collection <Arrow /></button><button onClick={() => scrollTo('about')}>Our approach <Arrow /></button><button className="mobile-menu-cta" onClick={() => { setMenuOpen(false); setVisitOpen(true); }}>Plan your visit <Arrow /></button><p>18 Mercer Street, London W1F 7ED<br />Tue — Sun · 10:00–18:00</p></div>}

      <main>
        <section className="hero" id="home" ref={heroRef}>
          <div className="hero-topline"><span className="eyebrow"><span className="eyebrow-mark">✳</span> ART, IN ANOTHER LIGHT</span><span className="hero-index">01 — 04 / OUR WORLD</span></div>
          <div className="hero-headline-wrap"><h1 className="hero-headline">Look a little<br /><em>closer.</em></h1><p className="hero-intro">A space for work that makes you pause.<br />Art that stays with you long after you leave.</p></div>
          <div className="hero-artwork-wrap">
            <div className="hero-side-note left-note"><span>FIG. 001</span><span>A STUDY IN STILLNESS</span></div>
            <div className="hero-artwork"><img src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1800&q=92" alt="Large abstract artwork in rich, expressive colours" /><div className="hero-artwork-overlay" /><div className="hero-image-label"><span>ON VIEW NOW</span><strong>The Shape of Quiet</strong><span>12 SEP — 02 NOV 2026</span></div><span className="hero-image-number">SF—001</span></div>
            <button className="hero-side-note right-note" onClick={() => scrollTo('exhibitions')}><span>DISCOVER THE EXHIBITION</span><span className="round-arrow"><Arrow diagonal /></span></button>
          </div>
          <div className="hero-bottomline"><span>ARTISTS FIRST. ALWAYS.</span><span>SCROLL TO EXPLORE <span className="scroll-line" /></span><span>51°30'26.4"N &nbsp; 0°08'02.1"W</span></div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>THE SHAPE OF QUIET <i>✳</i> NOW ON VIEW <i>✳</i> 12 SEP — 02 NOV 2026 <i>✳</i> 18 MERCER STREET, LONDON <i>✳</i> ADMISSION FREE <i>✳</i> THE SHAPE OF QUIET <i>✳</i> NOW ON VIEW <i>✳</i> 12 SEP — 02 NOV 2026 <i>✳</i> 18 MERCER STREET, LONDON <i>✳</i> ADMISSION FREE <i>✳</i> </span>
            <span>THE SHAPE OF QUIET <i>✳</i> NOW ON VIEW <i>✳</i> 12 SEP — 02 NOV 2026 <i>✳</i> 18 MERCER STREET, LONDON <i>✳</i> ADMISSION FREE <i>✳</i> THE SHAPE OF QUIET <i>✳</i> NOW ON VIEW <i>✳</i> 12 SEP — 02 NOV 2026 <i>✳</i> 18 MERCER STREET, LONDON <i>✳</i> ADMISSION FREE <i>✳</i> </span>
          </div>
        </div>

        <section className="statement section-pad" id="about">
          <div className="statement-meta reveal"><span className="section-number">( 01 )</span><span className="eyebrow">A DIFFERENT KIND OF GALLERY</span></div>
          <div className="statement-content reveal"><h2>Not more art.<br /><em>More feeling.</em></h2><div className="statement-copy"><p>We believe the best art doesn't ask for your attention. It earns it. STILL/FORM is an independent gallery built around artists with something to say, and the kind of work that gives you a reason to stay a little longer.</p><button className="text-link" onClick={() => scrollTo('collection')}>Get to know our world <Arrow /></button></div></div>
          <div className="statement-image-row reveal"><div className="statement-image"><img src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85" alt="An expressive painting, closely framed" loading="lazy" /></div><p className="image-caption">THE DETAILS ARE THE WHOLE POINT. <span>— STUDIO NOTES, NO. 04</span></p></div>
        </section>

        <section className="exhibitions section-pad" id="exhibitions">
          <div className="section-heading reveal"><div><span className="section-number">( 02 )</span><span className="eyebrow">WHAT'S HAPPENING</span></div><h2>In the <em>gallery.</em></h2><p>Two rooms. New perspectives.<br />Something worth coming out for.</p></div>
          <div className="exhibition-feature reveal">
            <div className="exhibition-image-wrap"><img key={exhibitions[activeExhibition].image} src={exhibitions[activeExhibition].image} alt={exhibitions[activeExhibition].alt} loading="lazy" /><span className="image-corner-label">STILL/FORM · EXHIBITION {exhibitions[activeExhibition].no}</span><span className="image-crosshair">+</span></div>
            <div className="exhibition-info"><span className="exhibition-tag"><span className="status-dot" /> {exhibitions[activeExhibition].label}</span><span className="exhibition-no">EXHIBITION {exhibitions[activeExhibition].no}</span><h3>{exhibitions[activeExhibition].title}</h3><span className="exhibition-dates">{exhibitions[activeExhibition].dates}</span><p>{exhibitions[activeExhibition].artists}</p><div className="exhibition-actions"><button className="button-dark" onClick={() => { setVisitOpen(true); setVisitSent(false); }}>Plan a visit <Arrow /></button><div className="exhibition-switcher"><button aria-label="Previous exhibition" onClick={() => setActiveExhibition((activeExhibition + exhibitions.length - 1) % exhibitions.length)}><span>←</span></button><span>0{activeExhibition + 1} <i>/</i> 0{exhibitions.length}</span><button aria-label="Next exhibition" onClick={() => setActiveExhibition((activeExhibition + 1) % exhibitions.length)}><span>→</span></button></div></div></div>
          </div>
          <div className="exhibition-bottom-note reveal"><span>THE GALLERY IS ALWAYS CHANGING.</span><span>COME SEE WHAT'S NEW <Arrow /></span></div>
        </section>

        <section className="collection section-pad" id="collection">
          <div className="section-heading collection-heading reveal"><div><span className="section-number">( 03 )</span><span className="eyebrow">SELECTED WORKS</span></div><h2>Made to be<br /><em>looked at.</em></h2><p>A rotating selection from the artists<br />we are proud to stand behind.</p></div>
          <div className="collection-toolbar reveal"><div className="filters" role="group" aria-label="Filter artworks">{['All works', 'Painting', 'Sculpture', 'Photography'].map((type) => <button key={type} className={filter === type ? 'active' : ''} aria-pressed={filter === type} onClick={() => setFilter(type)}>{type}</button>)}</div><span className="work-count">{String(filteredArtworks.length).padStart(2, '0')} WORKS</span></div>
          <div className="artwork-grid">{filteredArtworks.map((art, index) => <button className={`artwork-card reveal card-${index % 2 ? 'offset' : 'base'}`} key={art.id} onClick={() => setSelectedWork(art)} aria-label={`View ${art.title} by ${art.artist}`}><span className="artwork-img"><img src={art.image} alt={art.title} loading="lazy" /><span className="artwork-view">VIEW WORK <Arrow diagonal /></span><span className="artwork-edition">SF.0{art.id}</span></span><span className="artwork-card-meta"><span><strong>{art.title}</strong><em>{art.artist}</em></span><span className="artwork-year">{art.year}</span></span></button>)}</div>
          <div className="collection-end reveal"><span>GOOD ART MAKES ROOM FOR A SECOND LOOK.</span><button className="text-link" onClick={() => { setFilter('All works'); scrollTo('collection'); }}>Explore all works <Arrow /></button></div>
        </section>

        <section className="visit-band">
          <div className="visit-band-image"><img src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=88" alt="Sunlit gallery wall with contemporary artworks" loading="lazy" /></div>
          <div className="visit-band-content reveal"><span className="eyebrow"><span className="eyebrow-mark">✳</span> COME AS YOU ARE</span><h2>Art is better<br />in <em>person.</em></h2><p>Take the long way around. Find your own favourite.<br />Stay for five minutes or the whole afternoon.</p><button className="button-light" onClick={() => { setVisitOpen(true); setVisitSent(false); }}>Come by the gallery <Arrow /></button><span className="visit-band-stamp">NO TICKETS.<br />NO PRESSURE.<br />JUST ART.</span></div>
        </section>

        <section className="newsletter section-pad">
          <div className="newsletter-top reveal"><span className="section-number">( 04 )</span><span className="eyebrow">A LETTER FROM THE GALLERY</span></div><div className="newsletter-body reveal"><h2>Something good<br />in your <em>inbox.</em></h2><div className="newsletter-right"><p>New shows, notes from our artists, and things we think are worth looking at. Sent when we have something to say.</p>{subscribed ? <div className="newsletter-success"><span className="success-mark">✓</span><span>You're on the list. See you in your inbox.</span></div> : <form className="newsletter-form" onSubmit={submitNewsletter}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required /><button type="submit" aria-label="Subscribe to the newsletter"><Arrow /></button></form>}<span className="small-note">NO SPAM. NO NOISE. UNSUBSCRIBE ANYTIME.</span></div></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main"><div className="footer-brand"><button className="wordmark footer-wordmark" onClick={() => scrollTo('home')}>STILL<span>/</span>FORM<sup>®</sup></button><p>Independent art.<br />A little more considered.</p><span className="footer-location">LONDON · EVERYWHERE</span></div><div className="footer-column"><span className="footer-label">COME FIND US</span><p>18 Mercer Street<br />London W1F 7ED</p><button className="footer-link" onClick={() => { setVisitOpen(true); setVisitSent(false); }}>Plan your visit <Arrow /></button></div><div className="footer-column"><span className="footer-label">OPENING HOURS</span><p>Tuesday — Sunday<br />10:00 — 18:00<br /><span className="muted">Mondays, we make things.</span></p></div><div className="footer-column"><span className="footer-label">AROUND THE WEB</span><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <Arrow diagonal /></a><a href="https://www.are.na/" target="_blank" rel="noreferrer">Are.na <Arrow diagonal /></a><a href="mailto:hello@stillform.gallery">Email us <Arrow diagonal /></a></div></div>
        <div className="footer-bottom"><span>© STILL/FORM 2026</span><span>MADE WITH INTENTION, IN LONDON.</span><button onClick={() => scrollTo('home')}>BACK TO TOP ↑</button></div>
      </footer>

      {selectedWork && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedWork(null); }}><section className="art-modal" role="dialog" aria-modal="true" aria-labelledby="art-modal-title"><button className="modal-close" onClick={() => setSelectedWork(null)} aria-label="Close artwork details"><CloseIcon /></button><div className="art-modal-image"><img src={selectedWork.image} alt={selectedWork.title} /></div><div className="art-modal-copy"><span className="eyebrow">STILL/FORM COLLECTION · SF.0{selectedWork.id}</span><h2 id="art-modal-title">{selectedWork.title}</h2><p className="art-modal-artist">{selectedWork.artist}, {selectedWork.year}</p><p>{selectedWork.note}</p><div className="art-modal-spec"><span>{selectedWork.type}</span><span>{selectedWork.size}</span></div><button className="button-dark" onClick={() => { setSelectedWork(null); setVisitOpen(true); setVisitSent(false); }}>Enquire about this work <Arrow /></button></div></section></div>}

      {visitOpen && <div className="modal-backdrop visit-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setVisitOpen(false); }}><section className="visit-modal" role="dialog" aria-modal="true" aria-labelledby="visit-modal-title"><button className="modal-close" onClick={() => setVisitOpen(false)} aria-label="Close visit form"><CloseIcon /></button>{visitSent ? <div className="visit-success"><span className="success-mark large">✓</span><span className="eyebrow">REQUEST RECEIVED</span><h2>We'll save you<br /><em>a little space.</em></h2><p>Thanks, {form.name}. This demo has recorded your visit request locally. In a live site, the gallery team would follow up by email.</p><button className="button-dark" onClick={() => setVisitOpen(false)}>Back to the gallery <Arrow /></button></div> : <><span className="eyebrow"><span className="eyebrow-mark">✳</span> COME THROUGH</span><h2 id="visit-modal-title">Make a little<br /><em>time for art.</em></h2><p className="visit-modal-intro">Admission is free. Tell us when you're thinking of stopping by.</p><form className="visit-form" onSubmit={submitVisit}><div className="form-row"><label>Your name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="How should we greet you?" /></label><label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" /></label></div><div className="form-row"><label>Preferred date<input type="date" value={form.date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label><label>People<select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}><option value="1">Just me</option><option value="2">2 people</option><option value="3">3 people</option><option value="4">4 people</option><option value="5+">5 or more</option></select></label></div><label>Anything we should know? <span className="optional">OPTIONAL</span><textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="A particular artist, access needs, a question..." rows="2" /></label><button className="button-dark submit-visit" type="submit">Request a visit <Arrow /></button><span className="small-note">DEMO FORM · DOES NOT SEND REAL EMAILS OR BOOK A REAL APPOINTMENT</span></form></>}</section></div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
