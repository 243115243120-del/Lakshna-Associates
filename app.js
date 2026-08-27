import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut, updateProfile, setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, getDocs, query, orderBy, updateDoc, doc,
  serverTimestamp, arrayUnion, getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
await setPersistence(auth, browserLocalPersistence);

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = (v="") => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const fmtDate = v => {
  const d = v?.toDate ? v.toDate() : new Date(v);
  return isNaN(d) ? "—" : d.toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});
};

const logo = "assets/ChatGPT_Image_Jun_8__2026__06_18_08_PM.png";
const projectImages = [
  ["assets/ChatGPT_Image_Jun_13__2026__02_34_21_PM-1.png","G+3 Residential Building","Residential","Chennai, Tamil Nadu","3D Elevation Design, BOQ, Cost Estimation, Structural Consultancy"],
  ["assets/ChatGPT_Image_Jun_13__2026__02_33_03_PM-1.png","Modern Duplex Villa","Residential","Chennai, Tamil Nadu","3D Elevation Design, BOQ, BBS, Construction Design"],
  ["assets/WhatsApp_Image_2026-06-08_at_11.32.10__1_-1.jpeg","JR-ONE Kothari Factory – Phase I","Industrial","Eraiyur, Tamil Nadu","PMC, BOQ, Structural Consultancy, Project Documentation"]
];
const gallery = [
  ["assets/ChatGPT_Image_Jun_13__2026__02_34_21_PM.png","3D elevation – G+3 residential building design, Chennai","Completed Projects"],
  ["assets/ChatGPT_Image_Jun_13__2026__02_33_03_PM.png","3D elevation – modern duplex villa design, Chennai","Completed Projects"],
  ["assets/Screenshot_2026-06-08_190928.png","AutoCAD floor plan – Ground Floor & First Floor layout drawings","Structural Drawings"],
  ["assets/WhatsApp_Image_2026-06-08_at_11.32.11__1_.jpeg","JR-ONE Kothari Factory – industrial inauguration event setup","Construction Sites"],
  ["assets/WhatsApp_Image_2026-06-08_at_11.32.10__1_.jpeg","JR-ONE Kothari Factory – Phase I inauguration gate, Tamil Nadu","Construction Sites"],
  ["assets/WhatsApp_Image_2026-06-08_at_11.32.10.jpeg","JR-ONE Kothari Factory – industrial facility inauguration ceremony","Completed Projects"],
  ["assets/WhatsApp_Image_2026-06-08_at_11.32.06__2_.jpeg","JR-ONE Kothari Factory – completed industrial warehouse floor inspection","Completed Projects"],
  ["assets/WhatsApp_Image_2026-06-08_at_11.32.06__1_.jpeg","JR-ONE Kothari Factory – client handover and project walkthrough","Completed Projects"]
];

const services = [
["BOQ (Bill of Quantities)","Comprehensive itemized list of materials, parts, and labour required for a project with detailed cost breakdown."],
["Cost Estimation","Accurate project cost forecasting using market rates, specifications, and engineering standards."],
["Quantity Take-Off","Precise extraction of quantities from drawings and specifications for all construction elements."],
["Tender Documentation","Complete tender preparation including technical specifications, drawings, and supporting documents."],
["Interim & Final Billing","Running account bills, final bills, deviation statements, and reconciliation for project settlements."],
["Bar Bending Schedule","Detailed BBS for reinforcement steel with accurate bar lengths, weights, and cutting schedules."],
["Site Engineering Support","On-site technical guidance, quality checks, and engineering solutions throughout project execution."],
["Project Management Consultancy","End-to-end PMC services covering planning, monitoring, coordination, and project delivery."],
["Structural Consultancy","Expert structural analysis, design review, and recommendations for safe, code-compliant structures."],
["Construction Design Services","Architectural and structural design development from concept to construction-ready drawings."],
["Project Documentation","Systematic compilation of project records, as-built drawings, and compliance documentation."],
["Planning & Scheduling","Detailed project schedules using CPM/PERT, resource planning, and milestone tracking."]
];

function renderSite() {
  document.title = "Lakshna Associates | Engineering Consultancy";
  $("#app").innerHTML = `
  <div class="topbar"><div class="container topbar-inner">
    <span>4/227, First Floor, Kokilambal Nagar, Thoraipakkam, Chennai – 600097</span>
    <div class="top-links"><a href="tel:+919840642266">☎ +91 9840642266</a><a href="https://wa.me/919840642266" target="_blank">WhatsApp</a><a href="https://instagram.com/lakshna_associates" target="_blank">Instagram</a></div>
  </div></div>
  <header id="header"><div class="container nav">
    <a class="brand" href="#home"><img src="${logo}" alt="Lakshna Associates"></a>
    <nav id="desktop-nav">
      ${["Home","About","Services","Projects","Gallery","Contact"].map(x=>`<a href="#${x.toLowerCase()}">${x}</a>`).join("")}
    </nav>
    <a class="btn btn-lime nav-cta" href="#contact">Get Estimate</a>
    <button id="menu-btn" class="icon-btn" aria-label="Open menu">☰</button>
  </div><div id="mobile-menu" class="mobile-menu">
    ${["Home","About","Services","Projects","Gallery","Contact"].map(x=>`<a href="#${x.toLowerCase()}">${x}</a>`).join("")}
    <a class="btn btn-lime" href="#contact">Get Estimate</a>
  </div></header>

  <main>
  <section id="home" class="hero">
    <div class="hero-glow"></div><div class="container hero-grid">
      <div class="reveal">
        <div class="eyebrow dark">ENGINEERING CONSULTANCY</div>
        <h1>Accurate Estimates.<br><span>Better Planning.</span><br>Stronger Projects.</h1>
        <p class="hero-copy">Lakshna Associates provides reliable estimation, quantity take-off, project documentation, design, and construction consultancy services for residential, commercial, industrial, and infrastructure projects.</p>
        <div class="hero-points">${["BOQ Preparation","Cost Estimation","Structural Consultancy","PMC Services"].map(x=>`<span>✓ ${x}</span>`).join("")}</div>
        <div class="hero-actions"><a class="btn btn-lime" href="#contact">Request Consultation <b>→</b></a><a class="btn btn-outline" href="#projects">▣ View Projects</a></div>
      </div>
      <div class="stats-card reveal delay">
        <div class="stats-grid">${[["250+","Projects Delivered"],["10+","Years Experience"],["99.8%","Accuracy Rate"],["100+","Happy Clients"]].map(s=>`<div class="stat"><strong>${s[0]}</strong><small>${s[1]}</small></div>`).join("")}</div>
        <div class="quick-call"><span>☎</span><div><b>Call for Estimate</b><a href="tel:+919840642266">+91 9840642266</a></div></div>
      </div>
    </div>
    <div class="scroll-cue">Scroll Down <i></i></div>
  </section>

  <section id="about" class="section white"><div class="container about-grid">
    <div class="about-visual reveal"><div class="about-collage">
      <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&h=500&fit=crop&auto=format" alt="Engineer reviewing plans">
      <img src="https://images.unsplash.com/photo-1694521787162-5373b598945c?w=700&h=500&fit=crop&auto=format" alt="Construction team">
      <img src="https://images.unsplash.com/photo-1542621334-a254cf47733d?w=700&h=500&fit=crop&auto=format" alt="Engineering drawings">
      <img src="https://images.unsplash.com/photo-1608303588026-884930af2559?w=700&h=500&fit=crop&auto=format" alt="Blueprint review">
    </div><div class="experience"><strong>10+</strong><span>Years of Excellence</span></div></div>
    <div class="reveal delay"><div class="eyebrow">ABOUT US</div><h2>Engineering Expertise <br><span>You Can Rely On</span></h2>
      <p>Lakshna Associates specializes in quantity estimation, BOQ preparation, project planning, billing support, construction design, and engineering consultancy. We help architects, builders, contractors, developers, and consultants execute projects efficiently with accurate documentation and cost planning.</p>
      <p>Based in Chennai, our team combines deep technical knowledge with hands-on site experience to deliver reports that are precise, actionable, and deadline-ready — serving clients across Tamil Nadu and beyond.</p>
      <div class="highlight-grid">${[
        ["◉","Expert Team","Qualified civil engineers & estimators"],["⌖","Quality Focus","ISO-aligned documentation standards"],["▤","Detailed Reports","Comprehensive BOQ & billing sheets"],["↘","Cost Optimization","Value engineering for savings"],["◷","On-Time Delivery","Committed project timelines"],["★","Proven Track Record","250+ successfully delivered projects"]
      ].map(x=>`<div class="highlight"><b>${x[0]}</b><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join("")}</div>
    </div>
  </div></section>

  <section id="services" class="section soft"><div class="container"><div class="section-head reveal"><div class="eyebrow">OUR SERVICES</div><h2>Engineering Services Built for <span>Better Outcomes</span></h2><p>From initial estimation to final documentation, we support every stage of your project with precision and professionalism.</p></div>
  <div class="service-grid">${services.map((s,i)=>`<article class="service-card reveal" style="--d:${i*35}ms"><div class="service-icon">${String(i+1).padStart(2,"0")}</div><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p><span class="learn">Explore service →</span></article>`).join("")}</div></div></section>

  <section id="projects" class="section white"><div class="container"><div class="section-head reveal"><div class="eyebrow">OUR PORTFOLIO</div><h2>Featured <span>Projects</span></h2><p>A showcase of our engineering consultancy work across diverse sectors.</p></div>
    <div class="filters">${["All","Residential","Industrial"].map(x=>`<button class="filter ${x==="All"?"active":""}" data-filter="${x}">${x}</button>`).join("")}</div>
    <div id="project-grid" class="project-grid">${projectImages.map(p=>`<article class="project-card reveal" data-category="${p[2]}"><div class="project-image"><img src="${p[0]}" alt="${esc(p[1])}"><span>${p[2]}</span></div><div class="project-body"><h3>${esc(p[1])}</h3><p>⌖ ${esc(p[3])}</p><small>⚒ ${esc(p[4])}</small></div></article>`).join("")}</div>
  </div></section>

  <section id="gallery" class="section soft"><div class="container"><div class="section-head reveal"><div class="eyebrow">PROJECT GALLERY</div><h2>Work That Speaks <span>for Itself</span></h2><p>Explore selected designs, drawings, construction sites and completed work.</p></div>
    <div class="gallery-grid">${gallery.map((g,i)=>`<button class="gallery-item reveal" data-index="${i}"><img src="${g[0]}" alt="${esc(g[1])}"><span>${g[2]}</span><b>＋</b></button>`).join("")}</div>
  </div></section>

  <section class="section white why"><div class="container why-grid"><div class="reveal"><div class="eyebrow">WHY CHOOSE US</div><h2>Precision, Transparency & <span>Engineering Expertise</span></h2><p>We combine technical knowledge, practical site experience and disciplined documentation to help clients make confident project decisions.</p><a href="#contact" class="btn btn-navy">Talk to an Engineer →</a></div>
    <div class="feature-list">${[
      ["99.8%","Accuracy Rate","Accurate Quantities","Precision measurement techniques and advanced software ensure dependable quantity take-offs."],
      ["250+","Reports Delivered","User-Friendly Reports","Clear Excel/PDF-ready reporting that architects, contractors and clients can act on quickly."],
      ["48hr","Avg. Turnaround","Fast Turnaround","Our workflow is structured to deliver comprehensive reports within committed deadlines."],
      ["15–20%","Average Cost Savings","Cost Control","Value engineering and cost comparisons help reduce avoidable budget overruns."],
      ["10+","Years Experience","Engineering Expertise","Civil engineering knowledge combined with real construction site experience."],
      ["100+","Happy Clients","Reliable Consultancy","Consistency, transparency and professional accountability build long-term relationships."]
    ].map(f=>`<div class="feature reveal"><div class="feature-stat"><strong>${f[0]}</strong><small>${f[1]}</small></div><div><h3>${f[2]}</h3><p>${f[3]}</p></div></div>`).join("")}</div>
  </div></section>

  <section id="contact" class="section soft"><div class="container"><div class="section-head reveal"><div class="eyebrow">GET IN TOUCH</div><h2>Request a <span>Consultation</span></h2><p>Tell us about your project and we'll connect you with the right engineering expert.</p></div>
    <div class="contact-grid"><aside><div class="consult-card"><h3>Why consult with us?</h3><p>Our team responds within 24 hours with a tailored estimate and consultation plan.</p>${["Initial consultation","No hidden charges","Expert engineering team","Detailed project proposal","Pan-India project support"].map(x=>`<div class="check">✓ <span>${x}</span></div>`).join("")}</div><div class="direct-card"><b>Prefer to call us directly?</b><a href="tel:+919840642266">☎ <span>Primary Contact<br><strong>+91 9840642266</strong></span></a><a class="wa" href="https://wa.me/919840642266" target="_blank">◉ Chat on WhatsApp</a></div></aside>
      <div id="contact-form-wrap" class="form-card reveal"><form id="contact-form"><div class="form-grid">
        <label>Full Name *<input name="name" required placeholder="Your full name"></label>
        <label>Phone Number *<input name="phone" required placeholder="+91 XXXXX XXXXX"></label>
        <label>Email Address<input type="email" name="email" placeholder="you@example.com"></label>
        <label>Location<input name="location" placeholder="Project location"></label>
        <label>Project Type *<select name="projectType" required><option value="">Select project type</option>${["Residential","Commercial","Industrial","Infrastructure","Renovation","Other"].map(x=>`<option>${x}</option>`).join("")}</select></label>
        <label>Service Required *<select name="service" required><option value="">Select a service</option>${services.map(x=>`<option>${esc(x[0])}</option>`).join("")}</select></label>
      </div><label>Project Description<textarea name="message" rows="6" placeholder="Tell us briefly about your project, scope, area, timeline, etc."></textarea></label>
      <div id="form-error" class="form-message error" hidden></div><button class="btn btn-navy full" id="submit-btn">Submit Consultation Request <span>→</span></button>
      </form></div>
    </div>
  </div></section>

  <section id="location" class="section soft"><div class="container"><div class="section-head reveal"><div class="eyebrow">FIND US</div><h2>Our <span>Location</span></h2></div>
    <div class="location-grid"><div class="location-info">
      <div class="info-card"><b>⌖ Office Address</b><p>4/227, First Floor,<br>Kokilambal Nagar,<br>Thoraipakkam,<br>Chennai – 600097</p></div>
      <div class="info-card"><b>☎ Phone Numbers</b><p><a href="tel:+919840642266">+91 9840642266</a><br><a href="tel:+919176333072">+91 9176333072</a></p></div>
      <div class="info-card"><b>✉ Email</b><p><a href="mailto:lakshnaassociates@gmail.com">lakshnaassociates@gmail.com</a></p></div>
      <div class="loc-actions"><a class="btn btn-navy full" target="_blank" href="https://maps.google.com/?q=S.R.Lakshna+Gents+P.G,+Kokilambal+Nagar,+Thoraipakkam,+Chennai">⌖ Get Directions</a><a class="btn btn-lime full" target="_blank" href="https://maps.google.com/?q=S.R.Lakshna+Gents+P.G,+Kokilambal+Nagar,+Thoraipakkam,+Chennai">↗ Open in Google Maps</a></div>
    </div><div class="map-wrap"><iframe title="Lakshna Associates location" src="https://maps.google.com/maps?q=S.R.Lakshna+Gents+P.G,+Kokilambal+Nagar,+Thoraipakkam,+Chennai+600097&output=embed&z=17" loading="lazy"></iframe></div></div>
    <div class="contact-strip"><a href="tel:+919840642266"><b>☎</b><span>Call Now<small>+91 9840642266</small></span></a><a href="https://wa.me/919840642266" target="_blank"><b>◉</b><span>WhatsApp<small>Chat with us</small></span></a><a href="mailto:lakshnaassociates@gmail.com"><b>✉</b><span>Email Us<small>lakshnaassociates@gmail.com</small></span></a></div>
  </div></section>
  </main>

  <footer><div class="footer-cta"><div class="container footer-cta-inner"><div><h3>Ready to Start Your Project?</h3><p>Get an estimate and consultation within 24 hours.</p></div><div><a class="btn btn-lime" href="#contact">Get Estimate →</a><a class="btn btn-footer" href="tel:+919840642266">☎ Call Now</a></div></div></div>
  <div class="container footer-main"><div><img class="footer-logo" src="${logo}" alt="Lakshna Associates"><p>Chennai's trusted engineering consultancy for accurate estimation, BOQ, structural consultancy, and project management.</p><div class="social"><a href="https://instagram.com/lakshna_associates" target="_blank">Instagram</a><a href="https://wa.me/919840642266" target="_blank">WhatsApp</a><a href="https://maps.google.com/?q=Thoraipakkam,Chennai" target="_blank">Maps</a></div></div>
  <div><h4>Quick Links</h4>${["Home","About","Services","Projects","Gallery","Contact"].map(x=>`<a href="#${x.toLowerCase()}">${x}</a>`).join("")}</div>
  <div><h4>Services</h4>${["BOQ Preparation","Cost Estimation","Quantity Take-Off","Bar Bending Schedule","Structural Consultancy","PMC Services","Project Documentation","Planning & Scheduling"].map(x=>`<span>${x}</span>`).join("")}</div>
  <div><h4>Contact Information</h4><p>4/227, First Floor, Kokilambal Nagar,<br>Thoraipakkam, Chennai – 600097</p><a href="tel:+919840642266">+91 9840642266</a><a href="tel:+919176333072">+91 9176333072</a><a href="mailto:lakshnaassociates@gmail.com">lakshnaassociates@gmail.com</a></div></div>
  <div class="copyright">© 2026 Lakshna Associates. All rights reserved. <a href="#admin">Admin Portal</a></div></footer>

  <div id="lightbox" class="lightbox" hidden><button id="lb-close">×</button><button id="lb-prev">‹</button><div><img id="lb-image"><p id="lb-caption"></p></div><button id="lb-next">›</button></div>
  <div class="wa-float"><button id="wa-toggle">◉</button><div id="wa-panel" hidden><div class="wa-head"><b>Lakshna Associates</b><small>Typically replies instantly</small></div><div class="wa-body"><p>Hi! How can we help with your project?</p><a href="https://wa.me/919840642266?text=Hello%20Lakshna%20Associates%2C%20I%20would%20like%20a%20project%20consultation." target="_blank">Start WhatsApp Chat →</a></div></div></div>
  `;
  bindSite();
}

function bindSite() {
  const header = $("#header");
  window.addEventListener("scroll",()=>header.classList.toggle("scrolled",scrollY>30));
  $("#menu-btn").onclick=()=>$("#mobile-menu").classList.toggle("open");
  $$("a[href^='#']").forEach(a=>a.addEventListener("click",()=>$("#mobile-menu")?.classList.remove("open")));

  $$(".filter").forEach(btn=>btn.onclick=()=>{
    $$(".filter").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
    const f=btn.dataset.filter;
    $$(".project-card").forEach(card=>card.style.display=(f==="All"||card.dataset.category===f)?"block":"none");
  });

  let current=0;
  const showLightbox=i=>{
    current=(i+gallery.length)%gallery.length;
    $("#lb-image").src=gallery[current][0]; $("#lb-image").alt=gallery[current][1]; $("#lb-caption").textContent=gallery[current][1];
    $("#lightbox").hidden=false; document.body.classList.add("modal-open");
  };
  $$(".gallery-item").forEach(b=>b.onclick=()=>showLightbox(+b.dataset.index));
  $("#lb-close").onclick=()=>{$("#lightbox").hidden=true;document.body.classList.remove("modal-open")};
  $("#lb-prev").onclick=()=>showLightbox(current-1); $("#lb-next").onclick=()=>showLightbox(current+1);
  document.addEventListener("keydown",e=>{if($("#lightbox").hidden)return;if(e.key==="Escape")$("#lb-close").click();if(e.key==="ArrowLeft")$("#lb-prev").click();if(e.key==="ArrowRight")$("#lb-next").click()});

  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
  $$(".reveal").forEach(x=>obs.observe(x));

  $("#wa-toggle").onclick=()=>$("#wa-panel").hidden=!$("#wa-panel").hidden;
  $("#contact-form").addEventListener("submit", submitQuery);
}

async function submitQuery(e) {
  e.preventDefault();
  const btn=$("#submit-btn"), error=$("#form-error");
  btn.disabled=true; btn.innerHTML="Submitting…"; error.hidden=true;
  const data=Object.fromEntries(new FormData(e.currentTarget).entries());
  try {
    await addDoc(collection(db,"queries"), {
      ...data, status:"new", submittedAt:serverTimestamp(), replies:[]
    });
    $("#contact-form-wrap").innerHTML=`<div class="success-card"><div class="success-icon">✓</div><h3>Query Submitted!</h3><p>Thank you for reaching out. Our team will contact you within 24 hours with a detailed consultation plan.</p><button class="btn btn-navy" id="another-query">Submit Another Query</button></div>`;
    $("#another-query").onclick=()=>location.reload();
  } catch(err) {
    console.error(err);
    error.textContent = "Unable to submit right now. Please check the Firebase setup or contact us directly.";
    error.hidden=false; btn.disabled=false; btn.innerHTML="Submit Consultation Request →";
  }
}

function renderAdminLogin(message="") {
  $("#app").innerHTML=`<div class="admin-shell"><div class="admin-card">
    <a class="admin-back" href="#home">← Back to website</a><div class="admin-logo"><img src="${logo}" alt=""></div>
    <div class="eyebrow">SECURE ADMIN PORTAL</div><h1>Business Dashboard</h1><p class="muted">Lakshna Associates · Firebase Cloud</p>
    ${message?`<div class="notice">${esc(message)}</div>`:""}
    <div class="auth-tabs"><button class="auth-tab active" data-tab="login">Sign In</button><button class="auth-tab" data-tab="signup">Create Account</button></div>
    <form id="auth-form"><div id="signup-name" hidden><label>Full Name<input name="name" placeholder="Your name"></label></div>
      <label>Email<input type="email" name="email" required placeholder="admin@example.com"></label>
      <label>Password<input type="password" name="password" required minlength="6" placeholder="••••••••"></label>
      <div id="signup-confirm" hidden><label>Confirm Password<input type="password" name="confirm" minlength="6"></label></div>
      <div id="auth-error" class="form-message error" hidden></div><button class="btn btn-navy full" id="auth-submit">Sign In to Dashboard</button>
    </form>
    <button id="forgot" class="text-btn">Forgot password?</button>
    <p class="tiny">Admin access is protected by Firebase Authentication + Firestore Security Rules. Creating an account alone does not grant admin access.</p>
  </div></div>`;
  let mode="login";
  $$(".auth-tab").forEach(tab=>tab.onclick=()=>{mode=tab.dataset.tab;$$(".auth-tab").forEach(x=>x.classList.toggle("active",x===tab));$("#signup-name").hidden=mode!=="signup";$("#signup-confirm").hidden=mode!=="signup";$("#auth-submit").textContent=mode==="login"?"Sign In to Dashboard":"Create Admin Account";$("#auth-error").hidden=true});
  $("#forgot").onclick=async()=>{const email=$('#auth-form [name=email]').value.trim();if(!email)return alert("Enter your email first.");try{await sendPasswordResetEmail(auth,email);alert("Password reset email sent.");}catch(e){alert(e.message)}};
  $("#auth-form").onsubmit=async e=>{
    e.preventDefault(); const fd=new FormData(e.currentTarget), email=fd.get("email"), pass=fd.get("password"), err=$("#auth-error"), submit=$("#auth-submit");
    err.hidden=true;submit.disabled=true;submit.textContent=mode==="login"?"Signing in…":"Creating account…";
    try{
      if(mode==="login"){await signInWithEmailAndPassword(auth,email,pass);}
      else {
        if(pass!==fd.get("confirm")) throw new Error("Passwords do not match.");
        const cred=await createUserWithEmailAndPassword(auth,email,pass);
        if(fd.get("name")) await updateProfile(cred.user,{displayName:fd.get("name")});
        await signOut(auth);
        renderAdminLogin("Account created. Ask the site owner to add your UID to Firestore admins/{UID}, then sign in.");
      }
    }catch(ex){err.textContent=ex.message;err.hidden=false;submit.disabled=false;submit.textContent=mode==="login"?"Sign In to Dashboard":"Create Admin Account";}
  };
}

async function checkAdmin(user) {
  const snap=await getDoc(doc(db,"admins",user.uid));
  return snap.exists();
}

async function renderDashboard(user) {
  $("#app").innerHTML=`<div class="dashboard"><header class="dash-top"><div><img src="${logo}" alt=""><b>Admin Dashboard</b><span>Firebase Cloud</span></div><div><button id="refresh" class="dash-btn">↻ Refresh</button><button id="logout" class="dash-btn lime">Logout</button></div></header>
  <main class="dash-main"><div id="dash-error" class="notice" hidden></div><div id="stats" class="dash-stats"></div>
  <div class="dash-toolbar"><div id="status-tabs"></div><span id="last-refresh"></span></div><div id="queries" class="query-list"></div></main>
  <div id="query-modal" class="modal" hidden></div><div id="reply-modal" class="modal" hidden></div></div>`;
  $("#logout").onclick=()=>signOut(auth);
  $("#refresh").onclick=loadQueries;
  await loadQueries();

  async function loadQueries(){
    $("#queries").innerHTML='<div class="loading">Loading enquiries from Firestore…</div>';
    try{
      const snap=await getDocs(query(collection(db,"queries"),orderBy("submittedAt","desc")));
      const items=snap.docs.map(d=>({id:d.id,...d.data()}));
      draw(items);
      $("#last-refresh").textContent="Updated "+new Date().toLocaleTimeString("en-IN");
    }catch(e){
      console.error(e); $("#dash-error").textContent="Could not load enquiries. Check Firestore rules and that this account exists in admins/{UID}.";$("#dash-error").hidden=false;
    }
  }
  function draw(items){
    const counts={all:items.length,new:items.filter(x=>x.status==="new").length,in_progress:items.filter(x=>x.status==="in_progress").length,responded:items.filter(x=>x.status==="responded").length};
    $("#stats").innerHTML=Object.entries(counts).map(([k,v])=>`<div class="dash-stat"><small>${k.replace("_"," ")}</small><strong>${v}</strong></div>`).join("");
    $("#status-tabs").innerHTML=`<button class="dtab active" data-f="all">All (${counts.all})</button><button class="dtab" data-f="new">New (${counts.new})</button><button class="dtab" data-f="in_progress">In Progress (${counts.in_progress})</button><button class="dtab" data-f="responded">Responded (${counts.responded})</button>`;
    const render=filter=>{
      $$(".dtab").forEach(b=>b.classList.toggle("active",b.dataset.f===filter));
      const list=filter==="all"?items:items.filter(x=>x.status===filter);
      $("#queries").innerHTML=list.length?list.map(q=>`<article class="query-card"><div class="query-main"><div class="query-title"><div><h3>${esc(q.name)}</h3><small>${esc(q.email||"No email")} · ${esc(q.phone)}</small></div><span class="status ${q.status}">${q.status.replace("_"," ")}</span></div><div class="query-meta"><span>▣ ${esc(q.service)}</span><span>⌖ ${esc(q.location||"—")}</span><span>◷ ${fmtDate(q.submittedAt)}</span></div><p>${esc(q.message||"No description")}</p></div><div class="query-actions"><button data-view="${q.id}">View</button><button data-status="${q.id}">Change Status</button>${q.email?`<button class="reply-btn" data-reply="${q.id}">Reply</button>`:""}</div></article>`).join(""):'<div class="empty">No enquiries in this filter.</div>';
      $$("[data-view]").forEach(b=>b.onclick=()=>showQuery(items.find(q=>q.id===b.dataset.view)));
      $$("[data-status]").forEach(b=>b.onclick=async()=>{const q=items.find(q=>q.id===b.dataset.status);const next=q.status==="new"?"in_progress":q.status==="in_progress"?"responded":"new";await updateDoc(doc(db,"queries",q.id),{status:next});await loadQueries()});
      $$(".reply-btn").forEach(b=>b.onclick=()=>showReply(items.find(q=>q.id===b.dataset.reply)));
    };
    $$(".dtab").forEach(b=>b.onclick=()=>render(b.dataset.f)); render("all");
  }
  async function showQuery(q){
    $("#query-modal").innerHTML=`<div class="modal-box"><button class="modal-x" data-close>×</button><div class="eyebrow">CLIENT ENQUIRY</div><h2>${esc(q.name)}</h2><div class="detail-grid"><div><b>Phone</b><a href="tel:${esc(q.phone)}">${esc(q.phone)}</a></div><div><b>Email</b><a href="mailto:${esc(q.email)}">${esc(q.email||"—")}</a></div><div><b>Project Type</b><span>${esc(q.projectType)}</span></div><div><b>Service</b><span>${esc(q.service)}</span></div><div><b>Location</b><span>${esc(q.location||"—")}</span></div><div><b>Submitted</b><span>${fmtDate(q.submittedAt)}</span></div></div><h4>Project Description</h4><p class="detail-message">${esc(q.message||"—")}</p><h4>Reply History</h4>${(q.replies||[]).length?(q.replies||[]).map(r=>`<div class="reply-history"><b>${esc(r.subject)}</b><small>${fmtDate(r.sentAt)}</small><p>${esc(r.message)}</p></div>`).join(""):'<p class="muted">No replies recorded.</p'}<div class="modal-actions"><button class="btn btn-navy" data-reply-from-detail="${q.id}">Reply</button></div></div>`;
    $("#query-modal").hidden=false; $("[data-close]",$("#query-modal")).onclick=()=>$("#query-modal").hidden=true;
    $("[data-reply-from-detail]",$("#query-modal")).onclick=()=>{ $("#query-modal").hidden=true; showReply(q); };
  }
  function showReply(q){
    const subject=`Re: ${q.service} – ${q.projectType} Project Enquiry`;
    $("#reply-modal").innerHTML=`<div class="modal-box"><button class="modal-x" data-close>×</button><div class="eyebrow">CLIENT REPLY</div><h2>Reply to ${esc(q.name)}</h2><form id="reply-form"><label>Subject<input name="subject" value="${esc(subject)}" required></label><label>Message<textarea name="message" rows="11" required>Dear ${esc(q.name)},

Thank you for reaching out to Lakshna Associates.

Regarding your enquiry for ${esc(q.service)} (${esc(q.projectType)} project in ${esc(q.location||"your location")}), we would be happy to assist you.

[Your reply here]

Please feel free to contact us for any further queries.

Warm regards,
Lakshna Associates
+91 9840642266</textarea></label><div class="reply-note">Firebase/Firestore records the reply history. Because Firebase's free client SDK does not send email by itself, the button below opens your email client with the message addressed to the client.</div><div class="modal-actions"><button type="button" class="btn btn-footer" data-close>Cancel</button><button class="btn btn-navy">Open Email & Record Reply</button></div></form></div>`;
    $("#reply-modal").hidden=false; $("[data-close]",$("#reply-modal")).onclick=()=>$("#reply-modal").hidden=true;
    $("#reply-form").onsubmit=async e=>{
      e.preventDefault(); const fd=new FormData(e.currentTarget), sub=fd.get("subject"), msg=fd.get("message");
      if(!q.email){alert("This client did not provide an email address.");return;}
      const reply={subject:sub,message:msg,sentAt:new Date().toISOString(),sentBy:auth.currentUser.email||""};
      await updateDoc(doc(db,"queries",q.id),{status:"responded",replies:arrayUnion(reply)});
      window.location.href=`mailto:${encodeURIComponent(q.email)}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(msg)}`;
      $("#reply-modal").hidden=true; loadQueries();
    };
  }
}

function route() {
  const isAdmin=location.hash==="#admin" || location.pathname.endsWith("/admin") || new URLSearchParams(location.search).get("page")==="admin";
  if(isAdmin){ if(auth.currentUser){checkAdmin(auth.currentUser).then(ok=>ok?renderDashboard(auth.currentUser):renderAdminLogin("This account is authenticated but is not listed in Firestore admins/{UID}."));} else renderAdminLogin(); }
  else renderSite();
}
onAuthStateChanged(auth, user=>{ if(location.hash==="#admin" || location.pathname.endsWith("/admin") || new URLSearchParams(location.search).get("page")==="admin"){if(user){checkAdmin(user).then(ok=>ok?renderDashboard(user):renderAdminLogin("This account is authenticated but is not listed in Firestore admins/{UID}."));}else renderAdminLogin();}});
window.addEventListener("hashchange",route);
route();
