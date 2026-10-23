/* ==========================================================================
   BNP PARIBAS — PRÊT ÉTUDIANT
   Script: script.js
   Vanilla ES2015+ — no dependencies.
   Modules: Mobile Nav · Accordion · Cookie Banner · Smooth Scroll · Header Shadow
   ========================================================================== */

(function () {
  "use strict";

  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* noop */ }
    }
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

  function initMobileNav() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector(".main-nav");
    if (!header || !toggle || !nav) return;

    function openNav() {
      header.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fermer le menu");
    }
    function closeNav() {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
    }
    function isOpen() { return header.classList.contains("nav-open"); }

    toggle.addEventListener("click", function () { isOpen() ? closeNav() : openNav(); });
    nav.addEventListener("click", function (event) { if (event.target.closest("a")) closeNav(); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) { closeNav(); toggle.focus(); }
    });
    document.addEventListener("click", function (event) {
      if (isOpen() && !header.contains(event.target)) closeNav();
    });
    const desktopQuery = window.matchMedia("(min-width: 769px)");
    const handleDesktop = function (e) { if (e.matches) closeNav(); };
    if (typeof desktopQuery.addEventListener === "function") desktopQuery.addEventListener("change", handleDesktop);
    else if (typeof desktopQuery.addListener === "function") desktopQuery.addListener(handleDesktop);
  }

  function initAccordions() {
    const groups = document.querySelectorAll("[data-accordion]");
    if (!groups.length) return;
    groups.forEach(function (group) {
      const triggers = group.querySelectorAll(".accordion-trigger");
      triggers.forEach(function (trigger) {
        const panelId = trigger.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;
        trigger.addEventListener("click", function () {
          const isExpanded = trigger.getAttribute("aria-expanded") === "true";
          triggers.forEach(function (otherTrigger) {
            if (otherTrigger === trigger) return;
            otherTrigger.setAttribute("aria-expanded", "false");
            const otherPanelId = otherTrigger.getAttribute("aria-controls");
            const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
            if (otherPanel) otherPanel.hidden = true;
          });
          if (isExpanded) {
            trigger.setAttribute("aria-expanded", "false");
            panel.hidden = true;
          } else {
            trigger.setAttribute("aria-expanded", "true");
            panel.hidden = false;
          }
        });
      });
    });
  }

  function initCookieBanner() {
    const banner = document.getElementById("cookieBanner");
    if (!banner) return;
    const STORAGE_KEY = "bnpp_cookie_consent";
    const acceptBtn = banner.querySelector("[data-cookie-accept]");
    const refuseBtn = banner.querySelector("[data-cookie-refuse]");
    if (storage.get(STORAGE_KEY)) {
      banner.classList.add("is-hidden");
      banner.setAttribute("aria-hidden", "true");
      return;
    }
    function dismiss(choice) {
      storage.set(STORAGE_KEY, choice);
      banner.classList.add("is-hidden");
      banner.setAttribute("aria-hidden", "true");
      window.setTimeout(function () { banner.hidden = true; }, 340);
    }
    if (acceptBtn) acceptBtn.addEventListener("click", () => dismiss("accepted"));
    if (refuseBtn) refuseBtn.addEventListener("click", () => dismiss("refused"));
  }

  function initSmoothScroll() {
    const header = document.querySelector(".site-header");
    document.addEventListener("click", function (event) {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#" || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
      window.scrollTo({ top: Math.max(targetY, 0), behavior: scrollBehavior });
      if (history.pushState) history.pushState(null, "", hash);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    let ticking = false;
    function update() {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function initCopyrightYear() {
    const els = document.querySelectorAll(".copyright-year");
    if (!els.length) return;
    const year = String(new Date().getFullYear());
    els.forEach(function (el) { el.textContent = year; });
  }

  function init() {
    initMobileNav();
    initAccordions();
    initCookieBanner();
    initSmoothScroll();
    initHeaderScroll();
    initCopyrightYear();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* ==========================================================================
   BNP PARIBAS — I18N CONTROLLER
   ========================================================================== */
(function () {
  "use strict";

  const STORAGE_KEY = "bnpp_lang";

  const EN = {
    "nav.particuliers": "Individuals",
    "nav.professionnels": "Professionals",
    "nav.entreprises": "Businesses",
    "nav.institutionnels": "Institutions",
    "util.espace_client": "Client area",
    "util.agences": "Branches",
    "a11y.search": "Search",
    "a11y.menu_open": "Open menu",
    "a11y.menu_close": "Close menu",
    "a11y.nav": "Main navigation",
    "a11y.breadcrumb": "Breadcrumb",
    "a11y.cookie_dialog": "Cookie management",

    "breadcrumb.home": "Home",
    "breadcrumb.borrow": "Borrowing",
    "breadcrumb.consumer_credit": "Consumer loans",
    "breadcrumb.student_loan": "Student loans",
    "breadcrumb.apply": "Online application",

    "hero.eyebrow": "Consumer credit",
    "hero.title": "Student loan: fund your studies",
    "hero.subtitle": "Up to €75,000 to fund your education, housing or equipment. Fixed rate, deferred repayment and no proof of use.",
    "hero.cta.simulate": "Simulate my loan",
    "hero.cta.apply": "Apply now",

    "apply.hero.eyebrow": "Student loan application",
    "apply.hero.title": "Complete your application in minutes",
    "apply.hero.subtitle": "Fill in the 5 steps below. Your information is processed securely and confidentially. At the end of the journey you can send your file to an advisor.",

    "trust.secure": "Secure connection",
    "trust.time": "5 minutes",

    "features.title": "The benefits of the BNP Paribas Student Loan",
    "feature1.title": "No proof of use required",
    "feature1.desc": "Use the funds freely: tuition fees, rent, IT equipment or everyday expenses.",
    "feature2.title": "Up to €75,000",
    "feature2.desc": "An amount suited to your study project, whatever the length of your course.",
    "feature3.title": "Deferred repayment",
    "feature3.desc": "Start repaying your loan at the end of your studies or as soon as you graduate.",
    "feature4.title": "Attractive fixed rate",
    "feature4.desc": "Your monthly payment stays fixed throughout the loan. No surprises, serene budgeting.",

    "sim.title": "Estimate your monthly payment in 2 minutes",
    "sim.desc": "Simulate your student loan free of charge and without obligation. Get an immediate indicative answer.",
    "sim.cta": "Simulate my student loan",
    "sim.micro": "Immediate indicative answer",

    "details.title": "Everything to know about the Student Loan",
    "details.acc1": "Loan characteristics",
    "details.acc2": "Eligibility requirements",
    "details.acc3": "Repayment terms",

    "faq.title": "Frequently asked questions",
    "faq.q1": "What is a student loan?",
    "faq.q2": "Do I need a guarantor to obtain a student loan?",
    "faq.q3": "When does repayment start?",
    "faq.q4": "Can I repay my loan early?",
    "faq.q5": "Can the student loan be combined with a scholarship?",
    "faq.q6": "How do I subscribe to the BNP Paribas Student Loan?",

    "related.title": "Also discover",
    "related.card1.title": "Personal Loan",
    "related.card1.desc": "Fund your personal projects with credit adapted to your needs.",
    "related.card2.title": "Student Account",
    "related.card2.desc": "A bank offer designed for students: card, app, benefits.",
    "related.card3.title": "Home Insurance",
    "related.card3.desc": "Protect your student accommodation from just a few euros per month.",
    "related.cta": "Learn more",

    "footer.col.particuliers": "Individuals",
    "footer.col.professionnels": "Professionals",
    "footer.col.bnpp": "BNP Paribas",
    "footer.col.services": "Services",
    "footer.link.comptes_cartes": "Accounts and cards",
    "footer.link.credits": "Loans",
    "footer.link.epargne": "Savings",
    "footer.link.assurances": "Insurances",
    "footer.link.comptes_pro": "Business accounts",
    "footer.link.financements": "Financing",
    "footer.link.assurances_pro": "Business insurance",
    "footer.link.qui_sommes_nous": "About us",
    "footer.link.carrieres": "Careers",
    "footer.link.presse": "Press",
    "footer.link.rse": "CSR",
    "footer.link.trouver_agence": "Find a branch",
    "footer.link.nous_contacter": "Contact us",
    "footer.link.aide": "Help",
    "footer.legal.mentions": "Legal notices",
    "footer.legal.privacy": "Privacy policy",
    "footer.legal.cookies": "Cookies",
    "footer.legal.accessibilite": "Accessibility",
    "footer.copyright.prefix": "© BNP Paribas",
    "footer.copyright.rights": "All rights reserved.",

    "cookie.text": "We use cookies to improve your experience and analyze our traffic. By continuing, you accept our cookie policy.",
    "cookie.accept": "Accept all",
    "cookie.refuse": "Refuse",

    "step1.label": "Personal information",
    "step2.label": "Residential address",
    "step3.label": "Academic background",
    "step4.label": "Financing project",
    "step5.label": "Review & send",

    "step1.badge": "Step 1 / 5",
    "step2.badge": "Step 2 / 5",
    "step3.badge": "Step 3 / 5",
    "step4.badge": "Step 4 / 5",
    "step5.badge": "Step 5 / 5",

    "step1.title": "Personal information",
    "step2.title": "Residential address",
    "step3.title": "Academic background",
    "step4.title": "Financing project",
    "step5.title": "Application summary",

    "step1.desc": "Let's start by getting to know you. This information helps us verify your identity.",
    "step2.desc": "Where do you live during your studies? This information helps us identify your regional branch.",
    "step3.desc": "Tell us about your studies. These elements determine the fit of your loan project.",
    "step4.desc": "Let's define together the amount and terms of your student loan.",
    "step5.desc": "Check the information below before validating your file.",

    "field.civilite": "Title",
    "field.prenom": "First name",
    "field.nom": "Last name",
    "field.date_naissance": "Date of birth",
    "field.lieu_naissance": "Place of birth",
    "field.nationalite": "Nationality",
    "field.email": "Email address",
    "field.telephone": "Mobile phone",
    "field.situation_familiale": "Family situation",
    "field.enfants": "Number of dependent children",
    "field.adresse": "Address (number and street)",
    "field.complement": "Address complement",
    "field.code_postal": "Postal code",
    "field.ville": "City",
    "field.pays": "Country",
    "field.type_logement": "Housing type",
    "field.logement_depuis": "Living there since",
    "field.loyer": "Monthly rent (€)",
    "field.etablissement": "Higher education institution",
    "field.autre_etablissement": "Specify your institution's name",
    "field.type_diplome": "Degree prepared",
    "field.domaine": "Field of study",
    "field.annee_etudes": "Year of study",
    "field.fin_etudes": "Expected end of studies",
    "field.rythme": "Study rhythm",
    "field.id_type": "Document type",
    "field.id_file": "Supporting document",
    "field.loan_type": "Loan type",
    "field.montant": "Desired amount",
    "field.montant_custom": "Or enter a custom amount:",
    "field.duree": "Repayment term",
    "field.differe": "Deferral type",
    "field.revenus": "Current monthly income",
    "field.garant": "Do you have a guarantor?",
    "field.credit_en_cours": "Do you already have a loan in progress?",

    "select.nationalite": "Select your nationality",
    "select.choose": "Choose an option",
    "select.choose_generic": "Select",
    "select.etablissement": "Select your institution",
    "select.revenus": "Select a range",

    "nationalite.francaise": "French",
    "nationalite.ue": "European Union (other)",
    "nationalite.hors_ue": "Non-EU",

    "situation.celibataire": "Single",
    "situation.concubinage": "Cohabiting / PACS",
    "situation.marie": "Married",
    "situation.divorce": "Divorced",
    "situation.veuf": "Widowed",

    "logement.parents": "With my parents",
    "logement.location": "Rented",
    "logement.crous": "CROUS residence",
    "logement.autre": "Other",

    "etablissement.autre": "My institution is not in the list",

    "diplome.licence": "Bachelor's",
    "diplome.master": "Master's",
    "diplome.bts": "BTS",
    "diplome.but": "BUT",
    "diplome.grande_ecole": "Grande école degree",
    "diplome.ingenieur": "Engineering degree",
    "diplome.doctorat": "Doctorate",
    "diplome.autre": "Other",

    "domaine.droit": "Law, political science",
    "domaine.eco_gestion": "Economics, management, business",
    "domaine.lettres_langues": "Literature, languages, arts",
    "domaine.sciences": "Sciences, technologies",
    "domaine.sante": "Health, medicine",
    "domaine.ingenierie": "Engineering",
    "domaine.info_numerique": "IT, digital",
    "domaine.sciences_sociales": "Social sciences",
    "domaine.education": "Education, teaching",

    "annee.1": "1st year",
    "annee.2": "2nd year",
    "annee.3": "3rd year",
    "annee.4": "4th year",
    "annee.5": "5th year",
    "annee.6plus": "6th year and above",

    "id.type.carte_etudiante": "Student card",
    "id.type.passeport": "Passport",
    "id.type.carte_identite": "ID card",
    "id.type.titre_sejour": "Residence permit",

    "duree.12": "12 months (1 year)",
    "duree.24": "24 months (2 years)",
    "duree.36": "36 months (3 years)",
    "duree.48": "48 months (4 years)",
    "duree.60": "60 months (5 years)",
    "duree.84": "84 months (7 years)",
    "duree.120": "120 months (10 years) — reduced monthly payment",

    "revenus.0": "No income",
    "revenus.moins_500": "Less than €500",
    "revenus.500_1000": "€500 – €1,000",
    "revenus.1000_1500": "€1,000 – €1,500",
    "revenus.1500_2500": "€1,500 – €2,500",
    "revenus.plus_2500": "More than €2,500",

    "hint.email": "A confirmation link will be sent to you.",
    "hint.loyer": "Leave blank if you are housed for free.",
    "hint.loan_type": "Choose the loan type that fits your project.",
    "hint.montant": "Choose the amount matching your project. You can adjust it with your advisor.",
    "hint.duree": "A longer term reduces your monthly payment.",
    "hint.duree.cap": "For amounts of €10,000 or more, the maximum repayment term is 24 months.",

    "civilite.madame": "Mrs",
    "civilite.monsieur": "Mr",
    "civilite.autre": "Other / Prefer not to say",
    "rythme.temps_plein": "Full-time",
    "rythme.alternance": "Apprenticeship",
    "rythme.stage": "Paid internship",
    "oui": "Yes",
    "non": "No",
    "garant.reflexion": "Considering",

    "differe.aucun.title": "No deferral",
    "differe.aucun.desc": "Immediate repayment after disbursement.",
    "differe.partiel.title": "Partial deferral",
    "differe.partiel.desc": "You only pay the interest during your studies.",
    "differe.total.title": "Full deferral",
    "differe.total.desc": "No repayment during your studies.",
    "differe.recommended": "Recommended",

    "loan.humanitaire.name": "Humanitarian student loan",
    "loan.humanitaire.ceiling": "Up to €15,000",
    "loan.humanitaire.desc": "For students involved in a social impact or solidarity project.",
    "loan.personnel_etudiant.name": "Personal student loan",
    "loan.personnel_etudiant.ceiling": "Up to €7,000",
    "loan.personnel_etudiant.desc": "To fund your everyday needs and equipment.",
    "loan.personnel_instantane.name": "Instant personal loan",
    "loan.personnel_instantane.ceiling": "Up to €3,000",
    "loan.personnel_instantane.desc": "For a one-off need, with a quick answer.",

    "id.verify.heading": "Student identity verification",
    "id.verify.desc": "For the Humanitarian student loan, identity verification is required. Choose the document type and upload it.",
    "id.file.choose": "Choose a file",

    "btn.continue.address": "Continue to address",
    "btn.continue.academic": "Continue to academic background",
    "btn.continue.financing": "Continue to financing",
    "btn.review": "Review my summary",
    "btn.back": "Back",
    "btn.modify": "Edit",
    "btn.submit": "Validate my application",

    "note.required": "* Required fields",
    "consent.text": "I agree that my personal data may be processed by BNP Paribas as part of my student loan application, in accordance with the privacy policy.",
    "legal.micro": "A loan commits you and must be repaid. Check your repayment capacity before committing. You have a legal withdrawal period of 14 days.",

    "warning.title": "Important: do not refresh this page",
    "warning.text": "Your progress will be lost if you refresh or close this page. Only one application per user is allowed: submitting multiple applications will defer all pending applications.",

    "agents.eyebrow": "Next step",
    "agents.title": "Your dedicated regional advisor",
    "agents.desc": "A BNP Paribas advisor specialized in student loans is available to support you. Contact them on WhatsApp by pasting the text you just copied.",
    "agents.whatsapp": "Contact on WhatsApp",
    "agents.offline": "Offline",
    "agents.contact": "Direct WhatsApp contact",
    "agents.role.f": "Student Loan Advisor (F)",
    "agents.role.m": "Student Loan Advisor (M)",

    "copy.button": "Copy my information",
    "copy.success": "Copied ✓",
    "copy.error": "Copy failed — select and copy manually",

    "readThis.label": "READ THIS",
    "readThis.title": "To finalize your application, follow these steps:",
    "readThis.step1": "Click \"Copy my information\"",
    "readThis.step2": "Contact one of our advisors below on WhatsApp",
    "readThis.step3": "Paste the copied text into the WhatsApp message field",
    "readThis.dismiss": "Understood",

    "instructions.afterCopy.title": "After copying your information",
    "instructions.afterCopy.body": "Paste the text directly into WhatsApp. Your advisor will process your application on receipt. No payment must be made before receiving the formalized offer.",

    "summary.ref": "Application reference",
    "summary.label.reference": "Reference",
    "summary.label.date": "Application date",
    "summary.section1": "1. Personal information",
    "summary.section2": "2. Residential address",
    "summary.section3": "3. Academic background",
    "summary.section4": "4. Financing project",
    "summary.label.civilite": "Title",
    "summary.label.prenom": "First name",
    "summary.label.nom": "Last name",
    "summary.label.date_naissance": "Date of birth",
    "summary.label.lieu_naissance": "Place of birth",
    "summary.label.nationalite": "Nationality",
    "summary.label.email": "Email",
    "summary.label.telephone": "Phone",
    "summary.label.situation": "Family situation",
    "summary.label.enfants": "Dependent children",
    "summary.label.adresse": "Address",
    "summary.label.complement": "Complement",
    "summary.label.code_postal": "Postal code",
    "summary.label.ville": "City",
    "summary.label.pays": "Country",
    "summary.label.type_logement": "Housing type",
    "summary.label.loyer": "Monthly rent",
    "summary.label.etablissement": "Institution",
    "summary.label.type_diplome": "Degree",
    "summary.label.domaine": "Field of study",
    "summary.label.annee_etudes": "Year",
    "summary.label.fin_etudes": "Expected end",
    "summary.label.rythme": "Rhythm",
    "summary.label.loan_type": "Loan type",
    "summary.label.montant": "Requested amount",
    "summary.label.duree": "Repayment term",
    "summary.label.differe": "Deferral",
    "summary.label.revenus": "Monthly income",
    "summary.label.garant": "Guarantor",
    "summary.label.credit": "Loan in progress",
    "summary.label.id_type": "ID document",
    "summary.label.etab_non_listed": "Institution not listed",

    "error.amount.required": "Please select a preset amount or enter a custom amount.",
    "error.amount.min": "The minimum amount is €500.",
    "error.amount.max": "The maximum amount for this loan type is €{max}."
  };

  let currentLang = "fr";
  const frCache = new WeakMap();
  const ariaCache = new WeakMap();
  const listeners = [];

  const storage = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* noop */ } }
  };

  function updateToggleAriaLabel(toggle) {
    if (!toggle) return;
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    const key = isOpen ? toggle.getAttribute("data-i18n-aria-label-open") : toggle.getAttribute("data-i18n-aria-label");
    if (!key) return;
    const frText = isOpen ? "Fermer le menu" : "Ouvrir le menu";
    const enText = EN[key] || frText;
    toggle.setAttribute("aria-label", currentLang === "en" ? enText : frText);
  }

  function watchMobileMenuI18n() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    if (!toggle) return;
    const observer = new MutationObserver(function () { updateToggleAriaLabel(toggle); });
    observer.observe(toggle, { attributes: true, attributeFilter: ["aria-expanded"] });
  }

  function applyLang(lang) {
    const isEn = lang === "en";
    currentLang = isEn ? "en" : "fr";
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      if (!frCache.has(el)) frCache.set(el, el.textContent);
      const frText = frCache.get(el);
      const enText = EN[key] || frText;
      el.textContent = isEn ? enText : frText;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      if (el.hasAttribute("data-i18n-aria-label-open")) return;
      const key = el.getAttribute("data-i18n-aria-label");
      if (!key) return;
      if (!ariaCache.has(el)) ariaCache.set(el, el.getAttribute("aria-label") || "");
      const frText = ariaCache.get(el);
      const enText = EN[key] || frText;
      el.setAttribute("aria-label", isEn ? enText : frText);
    });

    updateToggleAriaLabel(document.querySelector(".mobile-menu-toggle"));

    listeners.forEach(function (fn) { try { fn(currentLang); } catch (e) {} });
  }

  function initLangSwitch() {
    const btns = document.querySelectorAll(".lang-btn");
    if (!btns.length) return;
    btns.forEach(function (btn) {
      const isActive = btn.dataset.lang === currentLang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      btn.addEventListener("click", function () {
        const newLang = btn.dataset.lang;
        if (!newLang || newLang === currentLang) return;
        storage.set(STORAGE_KEY, newLang);
        btns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.lang === newLang ? "true" : "false"); });
        applyLang(newLang);
      });
    });
  }

  window.BNPPi18n = {
    get lang() { return currentLang; },
    t(key, frFallback) { if (currentLang === "fr") return frFallback; return EN[key] || frFallback; },
    onChange(fn) { if (typeof fn === "function") listeners.push(fn); },
    apply(lang) { applyLang(lang); }
  };

  function init() {
    const stored = storage.get(STORAGE_KEY);
    currentLang = stored === "en" ? "en" : "fr";
    initLangSwitch();
    watchMobileMenuI18n();
    applyLang(currentLang);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* ==========================================================================
   BNP PARIBAS — APPLICATION PAGE CONTROLLER
   ========================================================================== */
(function () {
  "use strict";

  const form = document.getElementById("loanApplicationForm");
  if (!form) return;

  /* ------------------------------------------------------------------------
     DYNAMIC STYLE INJECTION
     ------------------------------------------------------------------------ */
  function injectApplyStyles() {
    if (document.getElementById("applyDynamicStyles")) return;
    const style = document.createElement("style");
    style.id = "applyDynamicStyles";
    style.textContent = `
      .field-input.is-invalid,
      .field-select.is-invalid {
        border-color: #D14343 !important;
        box-shadow: 0 0 0 3px rgba(209, 67, 67, 0.12) !important;
      }
      .radio-group.is-invalid {
        outline: 2px dashed #D14343;
        outline-offset: 6px;
        border-radius: 8px;
        padding: 4px;
      }
      .checkbox-row.is-invalid { color: #D14343; }
      .btn.shake { animation: shake 380ms cubic-bezier(.36,.07,.19,.97) both; }
      @keyframes shake {
        10%, 90% { transform: translateX(-2px); }
        20%, 80% { transform: translateX(4px); }
        30%, 50%, 70% { transform: translateX(-6px); }
        40%, 60% { transform: translateX(6px); }
      }
      .btn-success {
        background-color: #007A4B !important;
        border-color: #007A4B !important;
        color: #fff !important;
      }
    `;
    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------------
     WARNING BANNER + REFRESH GUARD
     ------------------------------------------------------------------------ */
  function injectWarningStyles() {
    if (document.getElementById("formWarningStyles")) return;
    const style = document.createElement("style");
    style.id = "formWarningStyles";
    style.textContent = `
      .form-warning-banner {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        max-width: 900px;
        margin: 0 auto var(--space-md);
        padding: 1rem 1.25rem;
        background-color: #FFF4E5;
        border: 1px solid #F0C078;
        border-left: 4px solid #D97706;
        border-radius: var(--radius-lg);
        color: #7C4A03;
      }
      .form-warning-icon { flex-shrink: 0; color: #D97706; margin-top: 2px; }
      .form-warning-content { flex: 1; min-width: 0; }
      .form-warning-title {
        margin: 0 0 0.35em;
        font-size: 0.9375rem;
        font-weight: 700;
        color: #7C4A03;
        line-height: 1.3;
      }
      .form-warning-text { margin: 0; font-size: 0.8125rem; line-height: 1.55; color: #925A0F; }
      .form-warning-banner[hidden] { display: none !important; }
      @media (max-width: 768px) {
        .form-warning-banner { padding: 0.85rem 1rem; gap: 0.75rem; margin-bottom: var(--space-sm); }
        .form-warning-title { font-size: 0.875rem; }
        .form-warning-text { font-size: 0.75rem; }
        .form-warning-icon { width: 20px; height: 20px; }
      }
    `;
    document.head.appendChild(style);
  }

  function injectWarningBanner() {
    if (document.getElementById("formWarningBanner")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "container";
    wrapper.id = "formWarningBanner";
    const banner = document.createElement("div");
    banner.className = "form-warning-banner";
    banner.setAttribute("role", "note");
    banner.innerHTML = `
      <svg class="form-warning-icon" viewBox="0 0 24 24" width="22" height="22"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <div class="form-warning-content">
        <p class="form-warning-title" data-i18n="warning.title">Important : ne rafraîchissez pas cette page</p>
        <p class="form-warning-text" data-i18n="warning.text">Votre progression sera perdue si vous rafraîchissez ou fermez cette page. Une seule demande par utilisateur est autorisée : soumettre plusieurs demandes entraînera le report de toutes les demandes en cours.</p>
      </div>
    `;
    wrapper.appendChild(banner);
    const stepper = document.querySelector(".stepper");
    if (stepper && stepper.parentNode) stepper.parentNode.insertBefore(wrapper, stepper);
    else { const main = document.querySelector("main"); if (main) main.insertBefore(wrapper, main.firstChild); }
    if (window.BNPPi18n) window.BNPPi18n.apply(window.BNPPi18n.lang);
  }

  function initRefreshWarning() {
    const markDirty = () => { formDirty = true; };
    form.addEventListener("input", markDirty, true);
    form.addEventListener("change", markDirty, true);
    window.addEventListener("beforeunload", function (e) {
      if (submitted) return;
      if (!formDirty) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    });
  }

  /* ------------------------------------------------------------------------
     CONSTANTS
     ------------------------------------------------------------------------ */
  const STEP_SEGMENTS = {
    1: [
      { value: 12, min: 350, max: 750, message: "Vérification des champs…" },
      { value: 32, min: 450, max: 950, message: "Analyse des informations personnelles…" },
      { value: 54, min: 500, max: 1050, message: "Contrôle de cohérence…" },
      { value: 76, min: 400, max: 850, message: "Sécurisation des données…" },
      { value: 100, min: 280, max: 520, message: "Enregistrement…" },
    ],
    2: [
      { value: 15, min: 400, max: 820, message: "Vérification de l'adresse…" },
      { value: 40, min: 500, max: 950, message: "Identification de votre région…" },
      { value: 63, min: 450, max: 920, message: "Localisation des agences…" },
      { value: 87, min: 380, max: 740, message: "Préparation de la suite…" },
      { value: 100, min: 300, max: 550, message: "Enregistrement…" },
    ],
    3: [
      { value: 18, min: 420, max: 840, message: "Connexion aux bases académiques…" },
      { value: 43, min: 520, max: 1000, message: "Vérification de l'établissement…" },
      { value: 68, min: 480, max: 920, message: "Analyse du parcours…" },
      { value: 88, min: 400, max: 740, message: "Préparation du financement…" },
      { value: 100, min: 300, max: 500, message: "Enregistrement…" },
    ],
    4: [
      { value: 14, min: 380, max: 720, message: "Analyse du projet de financement…" },
      { value: 37, min: 520, max: 1000, message: "Calcul des mensualités…" },
      { value: 60, min: 500, max: 950, message: "Évaluation de la capacité de remboursement…" },
      { value: 84, min: 420, max: 800, message: "Préparation du récapitulatif…" },
      { value: 100, min: 300, max: 520, message: "Finalisation…" },
    ],
  };

  const SUBMIT_SEGMENTS = [
    { value: 10, min: 300, max: 700, message: "Vérification des données…" },
    { value: 28, min: 500, max: 1000, message: "Contrôle final du dossier…" },
    { value: 48, min: 420, max: 900, message: "Sécurisation des informations…" },
    { value: 72, min: 520, max: 1050, message: "Envoi vers le système central…" },
    { value: 90, min: 400, max: 800, message: "Génération de la référence…" },
    { value: 100, min: 300, max: 500, message: "Terminé" },
  ];

  const AGENT_SCAN_SEGMENTS = [
    { value: 12, min: 420, max: 900, message: "Connexion au réseau BNP Paribas…" },
    { value: 28, min: 500, max: 1100, message: "Identification de votre zone géographique…" },
    { value: 46, min: 620, max: 1250, message: "Recherche des conseillers disponibles…" },
    { value: 68, min: 520, max: 1050, message: "Filtrage par région…" },
    { value: 88, min: 420, max: 900, message: "Vérification des disponibilités…" },
    { value: 100, min: 300, max: 620, message: "Finalisation…" },
  ];

  const RADIO_LABELS = {
    civilite: {
      madame:   { fr: "Madame",                  en: "Mrs" },
      monsieur: { fr: "Monsieur",                en: "Mr" },
      autre:    { fr: "Autre / Ne pas préciser", en: "Other / Prefer not to say" }
    },
    type_logement: {
      parents:  { fr: "Chez mes parents", en: "With my parents" },
      location: { fr: "Location",         en: "Rented" },
      crous:    { fr: "Résidence CROUS",  en: "CROUS residence" },
      autre:    { fr: "Autre",            en: "Other" }
    },
    rythme: {
      "temps-plein": { fr: "Temps plein",                en: "Full-time" },
      alternance:    { fr: "Alternance / Apprentissage", en: "Apprenticeship" },
      stage:         { fr: "Stage rémunéré",             en: "Paid internship" }
    },
    differe: {
      aucun:   { fr: "Aucun différé",   en: "No deferral" },
      partiel: { fr: "Différé partiel", en: "Partial deferral" },
      total:   { fr: "Différé total",   en: "Full deferral" }
    },
    garant: {
      oui:       { fr: "Oui",         en: "Yes" },
      non:       { fr: "Non",         en: "No" },
      reflexion: { fr: "En réflexion", en: "Considering" }
    },
    credit_en_cours: {
      oui: { fr: "Oui", en: "Yes" },
      non: { fr: "Non", en: "No" }
    }
  };

  const LOAN_TYPES = {
    humanitaire: { ceiling: 15000, presets: [500, 2500, 5000, 7500, 10000, 15000] },
    "personnel-etudiant": { ceiling: 7000, presets: [500, 1500, 3000, 5000, 7000] },
    "personnel-instantane": { ceiling: 3000, presets: [500, 1500, 3000] }
  };

  const CAP_AMOUNT = 10000;
  const CAPPED_MAX_DURATION = 24;

  /* ------------------------------------------------------------------------
     AGENT NAME POOL + SHUFFLE
     ------------------------------------------------------------------------ */
  const AGENT_POOL_F = [
    "Sophie Laurent", "Camille Fournier", "Isabelle Moreau", "Nadia Leblanc",
    "Fatou Diop", "Sarah Roux", "Léa Garnier", "Émilie Chevalier"
  ];
  const AGENT_POOL_M = [
    "Thomas Moreau", "Amine Kaddour", "Youssef Benali", "Karim Haddad",
    "Julien Blanc", "Marc Petit", "Rachid Bouzid", "Antoine Lefèvre"
  ];

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getInitials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "??";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getAgentRoleText(gender) {
    const isEn = lang() === "en";
    if (gender === "f") return isEn ? "Student Loan Advisor (F)" : "Conseillère Prêt Étudiant";
    return isEn ? "Student Loan Advisor (M)" : "Conseiller Prêt Étudiant";
  }

  function shuffleAgentCards() {
    const cards = document.querySelectorAll(".agent-card");
    if (cards.length !== 3) return;

    const pool = shuffleArray([...AGENT_POOL_F, ...AGENT_POOL_M]).slice(0, 3);
    const activeIdx = Math.floor(Math.random() * 3);

    cards.forEach((card, idx) => {
      const name = pool[idx];
      const isFemale = AGENT_POOL_F.indexOf(name) !== -1;
      const gender = isFemale ? "f" : "m";
      const active = idx === activeIdx;

      const avatar = card.querySelector(".agent-avatar");
      if (avatar) avatar.textContent = getInitials(name);

      const nameEl = card.querySelector(".agent-info h3");
      if (nameEl) nameEl.textContent = name;

      card.dataset.gender = gender;

      const roleEl = card.querySelector(".agent-role");
      if (roleEl) {
        roleEl.removeAttribute("data-i18n");
        roleEl.textContent = getAgentRoleText(gender);
      }

      card.classList.toggle("is-offline", !active);

      const btn = card.querySelector(".btn-whatsapp");
      if (btn) {
        if (active) {
          btn.removeAttribute("aria-disabled");
          btn.removeAttribute("tabindex");
        } else {
          btn.setAttribute("aria-disabled", "true");
          btn.setAttribute("tabindex", "-1");
        }
      }

      let offlineLabel = card.querySelector(".agent-offline-label");
      if (!active) {
        if (!offlineLabel) {
          offlineLabel = document.createElement("span");
          offlineLabel.className = "agent-offline-label";
          const info = card.querySelector(".agent-info");
          if (info) info.appendChild(offlineLabel);
        }
        offlineLabel.textContent = lang() === "en" ? "Offline" : "Hors ligne";
      } else if (offlineLabel) {
        offlineLabel.remove();
      }
    });
  }

  function updateAgentRoles() {
    document.querySelectorAll(".agent-card").forEach((card) => {
      const gender = card.dataset.gender;
      if (!gender) return;
      const roleEl = card.querySelector(".agent-role");
      if (roleEl) {
        roleEl.removeAttribute("data-i18n");
        roleEl.textContent = getAgentRoleText(gender);
      }
      const offlineLabel = card.querySelector(".agent-offline-label");
      if (offlineLabel) {
        offlineLabel.textContent = lang() === "en" ? "Offline" : "Hors ligne";
      }
    });
  }

  /* ------------------------------------------------------------------------
     STATE
     ------------------------------------------------------------------------ */
  let submitted = false;
  let agentsRevealed = false;
  let currentReference = null;
  let activeStep = 1;
  let formDirty = false;

  /* ------------------------------------------------------------------------
     i18n BRIDGE
     ------------------------------------------------------------------------ */
  function lang() { return window.BNPPi18n ? window.BNPPi18n.lang : "fr"; }
  function t(key, frFallback) { return window.BNPPi18n ? window.BNPPi18n.t(key, frFallback) : frFallback; }

  /* ------------------------------------------------------------------------
     HELPERS
     ------------------------------------------------------------------------ */
  const escapeHtml = (str) => {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  const formatDate = (iso, langArg) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const locale = (langArg || lang()) === "en" ? "en-GB" : "fr-FR";
    return d.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatMontant = (n) => {
    if (!n && n !== 0) return "—";
    return Number(n).toLocaleString("fr-FR") + " €";
  };

  const generateReference = () => {
    const now = new Date();
    const stamp =
      String(now.getFullYear()).slice(-2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `PE-${stamp}-${rand}`;
  };

  const collectFormData = () => {
    const fd = new FormData(form);
    const data = {};
    for (const [key, val] of fd.entries()) {
      if (key in data) data[key] = [].concat(data[key], val);
      else data[key] = val;
    }
    return data;
  };

  const getSelectText = (id) => {
    const sel = document.getElementById(id);
    if (!sel) return "—";
    const opt = sel.options[sel.selectedIndex];
    return opt && opt.value ? opt.textContent.trim() : "—";
  };

  const getRadioLabel = (name) => {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    if (!checked) return "—";
    const map = RADIO_LABELS[name];
    if (!map) return checked.value;
    const entry = map[checked.value];
    if (!entry) return checked.value;
    return entry[lang()] || entry.fr || checked.value;
  };

  const getLoanType = () => {
    const checked = form.querySelector('input[name="loan_type"]:checked');
    return checked ? checked.value : null;
  };

  const getLoanTypeLabel = (type) => {
    if (!type) return "—";
    const key = {
      humanitaire: "loan.humanitaire.name",
      "personnel-etudiant": "loan.personnel_etudiant.name",
      "personnel-instantane": "loan.personnel_instantane.name"
    }[type];
    if (!key) return type;
    const fr = {
      humanitaire: "Prêt étudiant humanitaire",
      "personnel-etudiant": "Prêt personnel étudiant",
      "personnel-instantane": "Prêt personnel instantané"
    }[type];
    return t(key, fr);
  };

  const getCeiling = () => {
    const type = getLoanType();
    return type && LOAN_TYPES[type] ? LOAN_TYPES[type].ceiling : 0;
  };

  const getMontant = () => {
    const custom = document.getElementById("montant-custom");
    const customVal = custom ? Number(custom.value) : 0;
    const ceiling = getCeiling();
    if (customVal >= 500 && ceiling > 0 && customVal <= ceiling) return customVal;
    const preset = form.querySelector('input[name="montant"]:checked');
    return preset ? Number(preset.value) : 0;
  };

  const getEtablissementLabel = () => {
    const sel = document.getElementById("etablissement");
    if (!sel) return "—";
    if (sel.value === "autre") {
      const alt = document.getElementById("autre-etablissement");
      if (alt && alt.value) return alt.value;
      return t("summary.label.etab_non_listed", "Établissement non listé");
    }
    return getSelectText("etablissement");
  };

  const getAge = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age >= 0 && age < 120 ? age : null;
  };

  const getFullName = (data) => {
    const civ = getRadioLabel("civilite");
    const parts = [];
    if (civ && civ !== "—") parts.push(civ);
    if (data.prenom) parts.push(data.prenom);
    if (data.nom) parts.push(data.nom);
    return parts.join(" ");
  };

  /* ------------------------------------------------------------------------
     PROGRESS OVERLAY
     ------------------------------------------------------------------------ */
  function simulateProgress({ title, subtitle, segments, doneTitle, doneSubtitle }) {
    const overlay = document.getElementById("progressOverlay");
    if (!overlay) return Promise.resolve();

    const titleEl = document.getElementById("progressTitle");
    const subEl = document.getElementById("progressSub");
    const fillEl = document.getElementById("progressFill");
    const percentEl = document.getElementById("progressPercent");
    const trackEl = document.getElementById("progressBar");

    return new Promise((resolve) => {
      overlay.hidden = false;
      overlay.classList.remove("is-done");
      titleEl.textContent = title || "Traitement en cours…";
      subEl.textContent = subtitle || "Veuillez ne pas fermer cette page.";
      fillEl.style.width = "0%";
      percentEl.textContent = "0 %";
      trackEl.setAttribute("aria-valuenow", "0");

      void overlay.offsetHeight;
      overlay.classList.add("is-visible");

      let idx = 0;
      const advance = () => {
        if (idx >= segments.length) {
          overlay.classList.add("is-done");
          titleEl.textContent = doneTitle || "Terminé";
          subEl.textContent = doneSubtitle || "Redirection en cours…";
          trackEl.setAttribute("aria-valuenow", "100");
          percentEl.textContent = "100 %";
          window.setTimeout(() => {
            overlay.classList.remove("is-visible");
            overlay.classList.remove("is-done");
            window.setTimeout(() => { overlay.hidden = true; resolve(); }, 320);
          }, 900);
          return;
        }
        const seg = segments[idx];
        fillEl.style.width = seg.value + "%";
        percentEl.textContent = seg.value + " %";
        trackEl.setAttribute("aria-valuenow", String(seg.value));
        if (seg.message) subEl.textContent = seg.message;
        idx++;
        const delay = seg.min + Math.random() * (seg.max - seg.min);
        window.setTimeout(advance, delay);
      };
      window.setTimeout(advance, 350);
    });
  }

  /* ------------------------------------------------------------------------
     STEP NAVIGATION
     ------------------------------------------------------------------------ */
  function updateStepper(n) {
    document.querySelectorAll(".stepper-item").forEach((item, idx) => {
      const num = idx + 1;
      item.classList.remove("is-active", "is-complete");
      if (num < n) item.classList.add("is-complete");
      else if (num === n) item.classList.add("is-active");
    });
  }

  function scrollToStep() {
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;
    const anchor = document.querySelector(".stepper");
    if (!anchor) return;
    const y = anchor.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }

  function goToStep(n) {
    if (n < 1 || n > 5) return;
    activeStep = n;
    document.querySelectorAll(".form-step").forEach((step) => {
      step.hidden = true;
      step.classList.remove("is-active");
    });
    const target = document.querySelector(`.form-step[data-step="${n}"]`);
    if (target) { target.hidden = false; target.classList.add("is-active"); }
    if (n === 5) {
      if (!currentReference) currentReference = generateReference();
      buildSummary();
    }
    updateStepper(n);
    scrollToStep();
  }

  async function handleNext(currentStep, button) {
    const result = validateStep(currentStep);
    if (!result.valid) {
      button.classList.remove("shake");
      void button.offsetWidth;
      button.classList.add("shake");
      window.setTimeout(() => button.classList.remove("shake"), 400);
      if (result.firstInvalid) {
        const focusEl = result.firstInvalid.matches('input[type="radio"]')
          ? result.firstInvalid.closest("label")?.querySelector("input") || result.firstInvalid
          : result.firstInvalid;
        focusEl.focus();
      }
      return;
    }
    const originalHTML = button.innerHTML;
    button.disabled = true;
    button.innerHTML = "Vérification en cours…";
    await simulateProgress({
      title: "Traitement de vos informations…",
      subtitle: "Veuillez patienter pendant la vérification.",
      segments: STEP_SEGMENTS[currentStep],
      doneTitle: "Étape validée",
      doneSubtitle: "Passage à l'étape suivante…",
    });
    button.disabled = false;
    button.innerHTML = originalHTML;
    goToStep(currentStep + 1);
  }

  function handlePrev(currentStep) { goToStep(currentStep - 1); }

  function initStepNavigation() {
    form.addEventListener("click", (e) => {
      const nextBtn = e.target.closest("[data-next-step]");
      const prevBtn = e.target.closest("[data-prev-step]");
      if (nextBtn) handleNext(Number(nextBtn.dataset.nextStep), nextBtn);
      else if (prevBtn) handlePrev(Number(prevBtn.dataset.prevStep));
    });
    form.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || !e.target.matches("input")) return;
      if (activeStep >= 5) return;
      e.preventDefault();
      const nextBtn = document.querySelector(`[data-next-step="${activeStep}"]`);
      if (nextBtn) nextBtn.click();
    });
    updateStepper(1);
  }

  /* ------------------------------------------------------------------------
     VALIDATION
     ------------------------------------------------------------------------ */
  function markInvalid(el) {
    el.classList.add("is-invalid");
    if (el.type === "radio" || el.type === "checkbox") {
      const group = el.closest(".radio-group") || el.closest(".checkbox-row");
      if (group) group.classList.add("is-invalid");
    }
  }

  function clearInvalid(el) {
    el.classList.remove("is-invalid");
    const group = el.closest(".radio-group") || el.closest(".checkbox-row");
    if (group) group.classList.remove("is-invalid");
  }

  function validateStep(n) {
    const step = document.querySelector(`.form-step[data-step="${n}"]`);
    if (!step) return { valid: false, firstInvalid: null };
    let firstInvalid = null;

    step.querySelectorAll("input[required], select[required], textarea[required]").forEach((el) => {
      if (el.type === "radio" || el.type === "checkbox") return;
      if (el.type === "file") {
        if (!el.files || !el.files.length) { markInvalid(el); if (!firstInvalid) firstInvalid = el; }
        else clearInvalid(el);
        return;
      }
      const val = (el.value || "").trim();
      if (!val) { markInvalid(el); if (!firstInvalid) firstInvalid = el; }
      else clearInvalid(el);
    });

    const radioNames = new Set();
    step.querySelectorAll('input[type="radio"][required]').forEach((r) => radioNames.add(r.name));
    radioNames.forEach((name) => {
      const radios = step.querySelectorAll(`input[name="${name}"]`);
      const checked = step.querySelector(`input[name="${name}"]:checked`);
      if (!checked) { radios.forEach(markInvalid); if (!firstInvalid) firstInvalid = radios[0]; }
      else radios.forEach(clearInvalid);
    });

    step.querySelectorAll('input[type="checkbox"][required]').forEach((cb) => {
      if (!cb.checked) { markInvalid(cb); if (!firstInvalid) firstInvalid = cb; }
      else clearInvalid(cb);
    });

    if (n === 4) {
      const loanType = getLoanType();
      const custom = document.getElementById("montant-custom");
      const preset = step.querySelector('input[name="montant"]:checked');
      const customVal = custom ? Number(custom.value) : 0;
      const ceiling = getCeiling();
      const customValid = customVal >= 500 && ceiling > 0 && customVal <= ceiling;

      if (loanType && !preset && !customValid) {
        if (custom) markInvalid(custom);
        if (!firstInvalid) firstInvalid = custom;
        showAmountError(loanType);
      } else if (custom) {
        clearInvalid(custom);
        hideAmountError();
      }

      // Duration cap belt-and-suspenders
      const montant = getMontant();
      if (montant >= CAP_AMOUNT) {
        const dureeSel = document.getElementById("duree");
        if (dureeSel && dureeSel.value && Number(dureeSel.value) > CAPPED_MAX_DURATION) {
          markInvalid(dureeSel);
          if (!firstInvalid) firstInvalid = dureeSel;
        }
      }
    }
    return { valid: !firstInvalid, firstInvalid };
  }

  function validateAllSteps() {
    for (let i = 1; i <= 5; i++) {
      const result = validateStep(i);
      if (!result.valid) {
        goToStep(i);
        window.setTimeout(() => { if (result.firstInvalid) result.firstInvalid.focus(); }, 120);
        return false;
      }
    }
    return true;
  }

  /* ------------------------------------------------------------------------
     CONDITIONAL FIELDS
     ------------------------------------------------------------------------ */
  function initConditionalFields() {
    const sel = document.getElementById("etablissement");
    const wrap = document.getElementById("autreEtablissementWrap");
    const input = document.getElementById("autre-etablissement");
    if (!sel || !wrap || !input) return;
    sel.addEventListener("change", () => {
      const show = sel.value === "autre";
      wrap.hidden = !show;
      input.required = show;
      if (!show) input.value = "";
    });
  }

  /* ------------------------------------------------------------------------
     INSTITUTION SEARCH
     ------------------------------------------------------------------------ */
  function initInstitutionSearch() {
    const search = document.getElementById("etablissementSearch");
    const select = document.getElementById("etablissement");
    if (!search || !select) return;
    search.addEventListener("input", () => {
      const term = search.value.toLowerCase().trim();
      const noTerm = term.length === 0;
      Array.from(select.querySelectorAll("optgroup")).forEach((group) => {
        let anyVisible = false;
        Array.from(group.querySelectorAll("option")).forEach((opt) => {
          const matches = noTerm || opt.textContent.toLowerCase().includes(term);
          opt.hidden = !matches;
          opt.style.display = matches ? "" : "none";
          if (matches) anyVisible = true;
        });
        group.hidden = !noTerm && !anyVisible;
        group.style.display = noTerm || anyVisible ? "" : "none";
      });
    });
    select.addEventListener("change", () => { if (select.value) search.value = ""; });
  }

  /* ------------------------------------------------------------------------
     LOAN TYPE SELECTOR + AMOUNT PRESETS
     ------------------------------------------------------------------------ */
  const PRESET_DESCS = {
    humanitaire: {
      fr: ["Complément", "Rentrée", "Une année", "Logement + études", "Projet ambitieux", "Tous vos projets"],
      en: ["Top-up", "Back to school", "One year", "Housing + studies", "Ambitious project", "All your projects"]
    },
    "personnel-etudiant": {
      fr: ["Complément", "Rentrée", "Une année", "Projet ambitieux", "Tous vos projets"],
      en: ["Top-up", "Back to school", "One year", "Ambitious project", "All your projects"]
    },
    "personnel-instantane": {
      fr: ["Complément", "Rentrée", "Tous vos projets"],
      en: ["Top-up", "Back to school", "All your projects"]
    }
  };

  function getPresetDescs(type) {
    const pool = PRESET_DESCS[type] || PRESET_DESCS.humanitaire;
    return pool[lang()] || pool.fr;
  }

  function getPlafondLabel() {
    return lang() === "en" ? "Ceiling" : "Plafond";
  }

  function renderAmountCards(loanType) {
    const grid = document.getElementById("amountGrid");
    if (!grid) return;
    const cfg = LOAN_TYPES[loanType];
    if (!cfg) { grid.innerHTML = ""; return; }
    const descs = getPresetDescs(loanType);
    const plafondLabel = getPlafondLabel();
    const len = cfg.presets.length;
    grid.innerHTML = cfg.presets.map((amount, idx) => {
      const isTop = idx === len - 1;
      const desc = descs[idx] || "";
      const classes = ["amount-card"];
      if (isTop) classes.push("amount-card--max");
      const badge = isTop ? `<span class="amount-badge">${escapeHtml(plafondLabel)}</span>` : "";
      const requiredAttr = idx === 0 ? " required" : "";
      return `
        <label class="${classes.join(" ")}">
          ${badge}
          <input type="radio" name="montant" value="${amount}"${requiredAttr}>
          <span class="amount-card-body">
            <span class="amount-value">${Number(amount).toLocaleString("fr-FR")} €</span>
            <span class="amount-desc">${escapeHtml(desc)}</span>
          </span>
        </label>
      `;
    }).join("");
    applyDurationCap();
  }

  function toggleAmountSection(show) {
    const section = document.getElementById("amountSection");
    if (!section) return;
    section.hidden = !show;
  }

  function toggleIdVerifySection(loanType) {
    const section = document.getElementById("idVerifySection");
    const idType = document.getElementById("id-type");
    const idFile = document.getElementById("id-file");
    if (!section) return;
    const show = loanType === "humanitaire";
    section.hidden = !show;
    if (idType) idType.required = show;
    if (idFile) idFile.required = show;
    if (!show) {
      if (idType) idType.value = "";
      if (idFile) idFile.value = "";
      const nameEl = document.getElementById("idFileName");
      if (nameEl) {
        nameEl.hidden = true;
        const span = nameEl.querySelector("span");
        if (span) span.textContent = "";
      }
      const preview = document.getElementById("idFilePreview");
      if (preview) {
        preview.hidden = true;
        const img = preview.querySelector("img");
        if (img) img.removeAttribute("src");
      }
    }
  }

  function onLoanTypeChange(loanType) {
    toggleAmountSection(!!loanType);
    if (loanType && LOAN_TYPES[loanType]) {
      renderAmountCards(loanType);
      const custom = document.getElementById("montant-custom");
      if (custom) {
        custom.min = "500";
        custom.max = String(LOAN_TYPES[loanType].ceiling);
        custom.placeholder = `500 – ${LOAN_TYPES[loanType].ceiling.toLocaleString("fr-FR")}`;
        custom.value = "";
        clearInvalid(custom);
        hideAmountError();
      }
    } else {
      const grid = document.getElementById("amountGrid");
      if (grid) grid.innerHTML = "";
    }
    toggleIdVerifySection(loanType);
    applyDurationCap();
  }

  function initLoanTypeSelector() {
    form.querySelectorAll('input[name="loan_type"]').forEach((radio) => {
      radio.addEventListener("change", () => { if (radio.checked) onLoanTypeChange(radio.value); });
    });
    form.addEventListener("change", (e) => {
      const target = e.target;
      if (target.name === "montant" && target.type === "radio") {
        const custom = document.getElementById("montant-custom");
        if (custom) { custom.value = ""; clearInvalid(custom); hideAmountError(); }
        applyDurationCap();
      }
    });
  }

  /* ------------------------------------------------------------------------
     DURATION CAP — verified clean reimplementation
     Fires on: init, custom input, custom blur, preset change, loan-type
     change (via renderAmountCards), i18n change.
     ------------------------------------------------------------------------ */
  function applyDurationCap() {
    const dureeSelect = document.getElementById("duree");
    const hint = document.getElementById("dureeCapHint");
    if (!dureeSelect) return;

    const montant = getMontant();
    const shouldCap = montant >= CAP_AMOUNT;

    const longOptions = Array.from(dureeSelect.options).filter(
      (o) => o.value && Number(o.value) > CAPPED_MAX_DURATION
    );

    if (shouldCap) {
      // Reset before disable (prevents browser auto-selecting first enabled option)
      if (dureeSelect.value && Number(dureeSelect.value) > CAPPED_MAX_DURATION) {
        dureeSelect.value = String(CAPPED_MAX_DURATION);
      }
      longOptions.forEach((o) => { o.disabled = true; });
      // Second reset (belt-and-suspenders) — some browsers shift selection
      if (dureeSelect.value && Number(dureeSelect.value) > CAPPED_MAX_DURATION) {
        dureeSelect.value = String(CAPPED_MAX_DURATION);
      }
      if (hint) hint.hidden = false;
    } else {
      longOptions.forEach((o) => { o.disabled = false; });
      if (hint) hint.hidden = true;
    }
  }

  function initDurationCap() {
    const custom = document.getElementById("montant-custom");
    if (custom) {
      custom.addEventListener("input", applyDurationCap);
      custom.addEventListener("blur", applyDurationCap);
    }
    applyDurationCap();
  }

  /* ------------------------------------------------------------------------
     CUSTOM AMOUNT LIVE VALIDATION
     ------------------------------------------------------------------------ */
  function showAmountError(loanType) {
    const custom = document.getElementById("montant-custom");
    const err = document.getElementById("montant-custom-error");
    if (!custom || !err) return;
    const val = Number(custom.value);
    const ceiling = (LOAN_TYPES[loanType] || {}).ceiling || getCeiling();
    let msg = "";
    if (custom.value === "" || isNaN(val)) {
      msg = t("error.amount.required", "Veuillez sélectionner un montant prédéfini ou saisir un montant personnalisé.");
    } else if (val < 500) {
      msg = t("error.amount.min", "Le montant minimum est de 500 €.");
    } else if (ceiling > 0 && val > ceiling) {
      msg = t("error.amount.max", "Le montant maximum pour ce type de prêt est de {max} €.")
        .replace("{max}", ceiling.toLocaleString("fr-FR"));
    }
    if (msg) {
      err.textContent = msg; err.hidden = false;
      custom.classList.add("is-invalid"); custom.setAttribute("aria-invalid", "true");
    } else {
      err.hidden = true; err.textContent = "";
      custom.classList.remove("is-invalid"); custom.removeAttribute("aria-invalid");
    }
  }

  function hideAmountError() {
    const err = document.getElementById("montant-custom-error");
    const custom = document.getElementById("montant-custom");
    if (err) { err.hidden = true; err.textContent = ""; }
    if (custom) { custom.classList.remove("is-invalid"); custom.removeAttribute("aria-invalid"); }
  }

  function initCustomAmountValidation() {
    const custom = document.getElementById("montant-custom");
    if (!custom) return;
    custom.addEventListener("input", () => {
      const loanType = getLoanType();
      if (!loanType) return;
      if (custom.value && Number(custom.value) > 0) {
        form.querySelectorAll('input[name="montant"]').forEach((r) => (r.checked = false));
      }
      showAmountError(loanType);
    });
    custom.addEventListener("blur", () => {
      const loanType = getLoanType();
      if (!loanType) return;
      if (!custom.value && !form.querySelector('input[name="montant"]:checked')) {
        hideAmountError(); return;
      }
      showAmountError(loanType);
    });
  }

  /* ------------------------------------------------------------------------
     ID VERIFICATION FILE INPUT
     ------------------------------------------------------------------------ */
  function initIdFileInput() {
    const input = document.getElementById("id-file");
    const nameEl = document.getElementById("idFileName");
    const preview = document.getElementById("idFilePreview");
    const previewImg = preview ? preview.querySelector("img") : null;
    if (!input) return;
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) {
        if (nameEl) { nameEl.hidden = true; const span = nameEl.querySelector("span"); if (span) span.textContent = ""; }
        if (preview) preview.hidden = true;
        if (previewImg) previewImg.removeAttribute("src");
        return;
      }
      if (nameEl) { const span = nameEl.querySelector("span"); if (span) span.textContent = file.name; nameEl.hidden = false; }
      if (file.type && file.type.indexOf("image/") === 0 && preview && previewImg) {
        const url = URL.createObjectURL(file);
        previewImg.src = url;
        previewImg.onload = () => URL.revokeObjectURL(url);
        preview.hidden = false;
      } else if (preview) {
        preview.hidden = true;
        if (previewImg) previewImg.removeAttribute("src");
      }
    });
  }

  /* ------------------------------------------------------------------------
     SUMMARY GENERATOR
     ------------------------------------------------------------------------ */
  function getSummarySections() {
    const data = collectFormData();
    const montant = getMontant();
    const loanType = getLoanType();
    const loanTypeLabel = getLoanTypeLabel(loanType);

    const sections = [
      {
        title: t("summary.ref", "Référence dossier"),
        rows: [
          [t("summary.label.reference", "Référence"), currentReference || "—"],
          [t("summary.label.date", "Date de la demande"),
            new Date().toLocaleDateString(lang() === "en" ? "en-GB" : "fr-FR")],
        ],
      },
      {
        title: t("summary.section1", "1. Informations personnelles"),
        rows: [
          [t("summary.label.civilite", "Civilité"), getRadioLabel("civilite")],
          [t("summary.label.prenom", "Prénom"), data.prenom],
          [t("summary.label.nom", "Nom"), data.nom],
          [t("summary.label.date_naissance", "Date de naissance"), formatDate(data.date_naissance)],
          [t("summary.label.lieu_naissance", "Lieu de naissance"), data.lieu_naissance],
          [t("summary.label.nationalite", "Nationalité"), getSelectText("nationalite")],
          [t("summary.label.email", "Email"), data.email],
          [t("summary.label.telephone", "Téléphone"), data.telephone],
          [t("summary.label.situation", "Situation familiale"), getSelectText("situation-familiale")],
          [t("summary.label.enfants", "Enfants à charge"), data.enfants || "0"],
        ],
      },
      {
        title: t("summary.section2", "2. Coordonnées résidentielles"),
        rows: [
          [t("summary.label.adresse", "Adresse"), data.adresse],
          [t("summary.label.complement", "Complément"), data.complement_adresse || "—"],
          [t("summary.label.code_postal", "Code postal"), data.code_postal],
          [t("summary.label.ville", "Ville"), data.ville],
          [t("summary.label.pays", "Pays"), getSelectText("pays")],
          [t("summary.label.type_logement", "Type de logement"), getRadioLabel("type_logement")],
          [t("summary.label.loyer", "Loyer mensuel"), data.loyer ? data.loyer + " €" : "—"],
        ],
      },
      {
        title: t("summary.section3", "3. Parcours académique"),
        rows: [
          [t("summary.label.etablissement", "Établissement"), getEtablissementLabel()],
          [t("summary.label.type_diplome", "Diplôme préparé"), getSelectText("type-diplome")],
          [t("summary.label.domaine", "Domaine d'études"), getSelectText("domaine")],
          [t("summary.label.annee_etudes", "Année d'études"), getSelectText("annee-etudes")],
          [t("summary.label.fin_etudes", "Fin d'études prévue"),
            data.fin_etudes ? formatDate(data.fin_etudes + "-01") : "—"],
          [t("summary.label.rythme", "Rythme"), getRadioLabel("rythme")],
        ],
      },
      {
        title: t("summary.section4", "4. Projet de financement"),
        rows: [
          [t("summary.label.loan_type", "Type de prêt"), loanTypeLabel],
          [t("summary.label.montant", "Montant souhaité"), formatMontant(montant)],
          [t("summary.label.duree", "Durée de remboursement"), getSelectText("duree")],
          [t("summary.label.differe", "Type de différé"), getRadioLabel("differe")],
          [t("summary.label.revenus", "Revenus mensuels"), getSelectText("revenus")],
          [t("summary.label.garant", "Garant"), getRadioLabel("garant")],
          [t("summary.label.credit", "Crédit en cours"), getRadioLabel("credit_en_cours")],
        ],
      },
    ];

    if (loanType === "humanitaire") {
      sections[3].rows.push([
        t("summary.label.id_type", "Document d'identité"),
        getSelectText("id-type") || "—",
      ]);
    }
    return sections;
  }

  function buildSummary() {
    const container = document.getElementById("summaryGrid");
    if (!container) return;
    const sections = getSummarySections();
    container.innerHTML = sections.map((sec) => `
      <div class="summary-section">
        <h3>${escapeHtml(sec.title)}</h3>
        ${sec.rows.map(([label, value]) => `
          <div class="summary-row">
            <span class="summary-label">${escapeHtml(label)}</span>
            <span class="summary-value">${escapeHtml(value || "—")}</span>
          </div>`).join("")}
      </div>`).join("");
  }

  /* ------------------------------------------------------------------------
     COPY-INFO PAYLOAD
     ------------------------------------------------------------------------ */
  function generateCopyText() {
    const data = collectFormData();
    const montant = getMontant();
    const loanType = getLoanType();
    const loanTypeLabel = getLoanTypeLabel(loanType);
    const isEn = lang() === "en";
    const now = new Date();
    const loc = isEn ? "en-GB" : "fr-FR";
    const dateStr = now.toLocaleDateString(loc, { day: "2-digit", month: "2-digit", year: "numeric" });
    const age = getAge(data.date_naissance);
    const lines = [];

    const L = {
      heading:  isEn ? "BNP Paribas — Student loan application" : "BNP Paribas — Demande de prêt étudiant",
      ref:      isEn ? "Reference: " : "Référence : ",
      date:     isEn ? "Date: " : "Date : ",
      applicant:isEn ? "APPLICANT" : "DEMANDEUR",
      name:     isEn ? "Name: " : "Nom : ",
      age:      isEn ? "Age: " : "Âge : ",
      ageUnit:  isEn ? " years" : " ans",
      city:     isEn ? "City: " : "Ville : ",
      phone:    isEn ? "Phone: " : "Téléphone : ",
      email:    isEn ? "Email: " : "Email : ",
      request:  isEn ? "APPLICATION" : "DEMANDE",
      loanType: isEn ? "Loan type: " : "Type de prêt : ",
      amount:   isEn ? "Amount: " : "Montant : ",
      term:     isEn ? "Term: " : "Durée : ",
      deferral: isEn ? "Deferral: " : "Différé : ",
      income:   isEn ? "Income: " : "Revenus : ",
      guarantor:isEn ? "Guarantor: " : "Garant : ",
      education:isEn ? "EDUCATION" : "FORMATION",
      institution: isEn ? "Institution: " : "Établissement : ",
      degree:   isEn ? "Degree: " : "Diplôme : ",
      field:    isEn ? "Field: " : "Domaine : ",
      year:     isEn ? "Year: " : "Année : ",
      rhythm:   isEn ? "Rhythm: " : "Rythme : ",
      expectedEnd: isEn ? "Expected end: " : "Fin prévue : "
    };

    lines.push(L.heading);
    lines.push(L.ref + (currentReference || "—"));
    lines.push(L.date + dateStr);
    lines.push("");

    lines.push(L.applicant);
    const fullName = getFullName(data);
    if (fullName) lines.push(L.name + fullName);
    if (age !== null) lines.push(L.age + age + L.ageUnit);
    if (data.ville) lines.push(L.city + data.ville);
    if (data.telephone) lines.push(L.phone + data.telephone);
    if (data.email) lines.push(L.email + data.email);
    lines.push("");

    lines.push(L.request);
    if (loanTypeLabel && loanTypeLabel !== "—") lines.push(L.loanType + loanTypeLabel);
    if (montant) lines.push(L.amount + formatMontant(montant));
    const dureeText = getSelectText("duree");
    if (dureeText && dureeText !== "—") lines.push(L.term + dureeText);
    const differeText = getRadioLabel("differe");
    if (differeText && differeText !== "—") lines.push(L.deferral + differeText);
    const revenusText = getSelectText("revenus");
    if (revenusText && revenusText !== "—") lines.push(L.income + revenusText);
    const garantText = getRadioLabel("garant");
    if (garantText && garantText !== "—") lines.push(L.guarantor + garantText);
    lines.push("");

    lines.push(L.education);
    const etab = getEtablissementLabel();
    if (etab && etab !== "—") lines.push(L.institution + etab);
    const diplome = getSelectText("type-diplome");
    if (diplome && diplome !== "—") lines.push(L.degree + diplome);
    const domaine = getSelectText("domaine");
    if (domaine && domaine !== "—") lines.push(L.field + domaine);
    const annee = getSelectText("annee-etudes");
    if (annee && annee !== "—") lines.push(L.year + annee);
    const rythme = getRadioLabel("rythme");
    if (rythme && rythme !== "—") lines.push(L.rhythm + rythme);
    if (data.fin_etudes) lines.push(L.expectedEnd + formatDate(data.fin_etudes + "-01"));

    return lines.join("\n");
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* fall through */ }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.setAttribute("readonly", "");
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* ------------------------------------------------------------------------
     COPY BUTTON INJECTION + HANDLER
     ------------------------------------------------------------------------ */
  function injectCopyButton() {
    if (document.getElementById("copyCtaWrap")) return;
    const summary = document.getElementById("summaryGrid");
    if (!summary || !summary.parentNode) return;

    const wrap = document.createElement("div");
    wrap.className = "copy-cta-wrap";
    wrap.id = "copyCtaWrap";
    wrap.hidden = true;
    wrap.innerHTML = `
      <button type="button" class="btn btn-primary btn-lg btn-copy" id="copyInfoBtn">
        <span class="btn-copy-label" data-i18n="copy.button">Copier mes informations</span>
      </button>
    `;
    summary.parentNode.insertBefore(wrap, summary);

    const btn = wrap.querySelector("#copyInfoBtn");
    btn.addEventListener("click", handleCopyClick);
  }

  async function handleCopyClick() {
    const btn = document.getElementById("copyInfoBtn");
    if (!btn) return;
    const label = btn.querySelector(".btn-copy-label");
    const text = generateCopyText();
    const ok = await copyToClipboard(text);

    if (ok) {
      btn.classList.add("is-copied");
      if (label) {
        label.removeAttribute("data-i18n");
        label.textContent = t("copy.success", "Copié ✓");
      }
      window.setTimeout(() => {
        btn.classList.remove("is-copied");
        if (label) {
          label.setAttribute("data-i18n", "copy.button");
          label.textContent = t("copy.button", "Copier mes informations");
        }
      }, 2500);
    } else {
      if (label) {
        label.removeAttribute("data-i18n");
        label.textContent = t("copy.error", "Copie échouée — sélectionnez et copiez manuellement");
      }
      window.setTimeout(() => {
        if (label) {
          label.setAttribute("data-i18n", "copy.button");
          label.textContent = t("copy.button", "Copier mes informations");
        }
      }, 3500);
    }
  }
	function injectCopyButton() {
  if (document.getElementById("copyCtaWrap")) return;
  const summary = document.getElementById("summaryGrid");
  if (!summary || !summary.parentNode) return;

  const wrap = document.createElement("div");
  wrap.className = "copy-cta-wrap";
  wrap.id = "copyCtaWrap";
  wrap.hidden = true;
  wrap.innerHTML = `
    <button type="button" class="btn btn-primary btn-lg btn-copy" id="copyInfoBtn">
      <span class="btn-copy-label" data-i18n="copy.button">Copier mes informations</span>
    </button>
  `;
  summary.parentNode.insertBefore(wrap, summary);

  const btn = wrap.querySelector("#copyInfoBtn");
  btn.addEventListener("click", handleCopyClick);

  if (window.BNPPi18n) window.BNPPi18n.apply(window.BNPPi18n.lang);  // ← ADD THIS
}
  /* ------------------------------------------------------------------------
     READ-THIS MODAL (injected)
     ------------------------------------------------------------------------ */
  function injectReadThisModal() {
    if (document.getElementById("readThisModal")) return;

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "readThisModal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "readThisLabel");

    modal.innerHTML = `
      <div class="modal-backdrop" data-readthis-close></div>
      <div class="modal-panel">
        <div class="read-this-label" id="readThisLabel" data-i18n="readThis.label">READ THIS</div>
        <p class="read-this-title" data-i18n="readThis.title">Pour finaliser votre demande, suivez ces étapes :</p>
        <ol class="read-this-steps">
          <li data-i18n="readThis.step1">Cliquez sur « Copier mes informations »</li>
          <li data-i18n="readThis.step2">Contactez l'un de nos conseillers ci-dessous sur WhatsApp</li>
          <li data-i18n="readThis.step3">Collez le texte copié dans le champ de message de WhatsApp</li>
        </ol>
        <button type="button" class="btn btn-primary btn-lg" id="readThisDismiss" data-i18n="readThis.dismiss">J'ai compris</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelectorAll("[data-readthis-close]").forEach((el) => {
      el.addEventListener("click", () => closeReadThisModal(true));
    });
    const dismissBtn = modal.querySelector("#readThisDismiss");
    if (dismissBtn) dismissBtn.addEventListener("click", () => closeReadThisModal(true));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-visible")) closeReadThisModal(true);
    });

    if (window.BNPPi18n) window.BNPPi18n.apply(window.BNPPi18n.lang);
  }

  function openReadThisModal() {
    const modal = document.getElementById("readThisModal");
    if (!modal) return;
    modal.hidden = false;
    void modal.offsetHeight;
    modal.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closeReadThisModal(fromUser) {
    const modal = document.getElementById("readThisModal");
    if (!modal) return;
    modal.classList.remove("is-visible");
    document.body.style.overflow = "";
    window.setTimeout(() => { modal.hidden = true; }, 320);
    if (fromUser) revealAgentsAfterSubmit();
  }

  /* ------------------------------------------------------------------------
     SUBMIT FLOW
     ------------------------------------------------------------------------ */
  function setSubmitLoading(loading) {
    const btn = document.getElementById("submitApplication");
    if (!btn) return;
    const label = btn.querySelector(".btn-submit-label");
    const spinner = btn.querySelector(".btn-submit-spinner");
    if (loading) {
      btn.disabled = true;
      if (label) label.textContent = "Envoi en cours…";
      if (spinner) spinner.hidden = false;
    } else {
      btn.disabled = false;
      if (label) label.textContent = t("btn.submit", "Valider ma demande");
      if (spinner) spinner.hidden = true;
    }
  }

  function setSubmitSuccess() {
    const btn = document.getElementById("submitApplication");
    if (!btn) return;
    const label = btn.querySelector(".btn-submit-label");
    const spinner = btn.querySelector(".btn-submit-spinner");
    if (spinner) spinner.hidden = true;
    if (label) {
      label.textContent = "Demande envoyée ✓";
      label.removeAttribute("data-i18n");
    }
    btn.disabled = true;
    btn.classList.add("btn-success");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitted) return;
    if (!validateAllSteps()) return;

    setSubmitLoading(true);

    await simulateProgress({
      title: "Envoi de votre demande…",
      subtitle: "Traitement sécurisé de votre dossier.",
      segments: SUBMIT_SEGMENTS,
      doneTitle: "Dossier enregistré",
      doneSubtitle: "Finalisation…",
    });

    submitted = true;
    formDirty = false;

    const warning = document.getElementById("formWarningBanner");
    if (warning) warning.hidden = true;

    if (!currentReference) currentReference = generateReference();

    setSubmitSuccess();

    // Reshuffle agents for the post-submit reveal
    shuffleAgentCards();

    // Reveal the copy button (already injected at init)
    const copyWrap = document.getElementById("copyCtaWrap");
    if (copyWrap) copyWrap.hidden = false;

    // Show READ-THIS popup
    openReadThisModal();
  }

  function initSubmitFlow() {
    form.addEventListener("submit", handleSubmit);
  }

  /* ------------------------------------------------------------------------
     AGENTS REVEAL (after READ-THIS modal dismissed)
     ------------------------------------------------------------------------ */
  async function revealAgentsAfterSubmit() {
    if (agentsRevealed) return;

    await simulateProgress({
      title: "Recherche de conseillers régionaux…",
      subtitle: "Analyse de votre zone géographique.",
      segments: AGENT_SCAN_SEGMENTS,
      doneTitle: "Conseillers identifiés !",
      doneSubtitle: "Affichage des agents disponibles…",
    });

    agentsRevealed = true;

    const section = document.getElementById("agentsSection");
    if (!section) return;

    section.hidden = false;

    window.setTimeout(() => {
      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 0;
      const y = section.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }, 250);
  }

  /* ------------------------------------------------------------------------
     i18n LISTENER
     ------------------------------------------------------------------------ */
  function initLangListener() {
    if (!window.BNPPi18n) return;
    window.BNPPi18n.onChange(function () {
      const loanType = getLoanType();
      if (loanType) renderAmountCards(loanType);
      if (activeStep === 5) buildSummary();
      updateAgentRoles();

      // Copy button label — only update if not in the transient success/error state
      const copyBtn = document.getElementById("copyInfoBtn");
      if (copyBtn && !copyBtn.classList.contains("is-copied")) {
        const label = copyBtn.querySelector(".btn-copy-label");
        if (label && label.hasAttribute("data-i18n")) {
          label.textContent = t("copy.button", "Copier mes informations");
        }
      }

      applyDurationCap();
    });
  }

  /* ------------------------------------------------------------------------
     BOOTSTRAP
     ------------------------------------------------------------------------ */
  function init() {
    injectApplyStyles();
    injectWarningStyles();
    injectWarningBanner();
    initRefreshWarning();
    initStepNavigation();
    initConditionalFields();
    initInstitutionSearch();
    initLoanTypeSelector();
    initCustomAmountValidation();
    initDurationCap();
    initIdFileInput();
    initSubmitFlow();
    initLangListener();
    injectCopyButton();
    injectReadThisModal();
    shuffleAgentCards();
    goToStep(1);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();