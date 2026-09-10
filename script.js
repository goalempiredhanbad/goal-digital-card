/* ============================================================
   EDITABLE CONFIGURATION
   Original GOAL logo: assets/logo.png  (do not replace)
   Campus photographs: assets/facilities/
   ============================================================ */
const CONFIG = {
  phoneMedical: "9334098595",
  whatsappMedical: "9334098595",
  phoneMedicalAlt: "9308057050",
  phoneEngineering: "7488112425",
  whatsappEngineering: "7488112425",
  phoneEngineeringAlt: "9234300143",
  googleReviewUrl: "",
  googleMapsUrl: "",
  prospectusUrl: "#programs",
  siteUrl: ""
};

const GOOGLE_REVIEW_URL = CONFIG.googleReviewUrl;

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

function isSet(value) {
  return Boolean(String(value || "").trim());
}

function bindLink(id, href, enabled) {
  const el = document.getElementById(id);
  if (!el) return;
  if (enabled && href) {
    el.href = href;
    el.removeAttribute("aria-disabled");
  } else {
    el.href = "#";
    el.setAttribute("aria-disabled", "true");
  }
}

function waHref(number, text) {
  const n = digits(number);
  if (!n) return "";
  const base = "https://wa.me/" + n;
  return text ? base + "?text=" + encodeURIComponent(text) : base;
}

function isEngineering(program) {
  return /jee|iit|engineering/i.test(String(program || ""));
}

function applyMeta() {
  if (!CONFIG.siteUrl) return;
  const origin = CONFIG.siteUrl.replace(/\/$/, "");
  const image = origin + "/assets/logo.png";
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = origin + "/";
  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((tag) => {
    tag.setAttribute("content", image);
  });
}

function applyConfig() {
  const greeting = "Hello, I would like to know more about admissions at GOAL, Dhanbad.";
  const medicalWa = waHref(CONFIG.whatsappMedical, greeting);
  const engineeringWa = waHref(CONFIG.whatsappEngineering, greeting);
  const review = GOOGLE_REVIEW_URL.trim();
  const maps = CONFIG.googleMapsUrl.trim();
  const prospectus = CONFIG.prospectusUrl.trim() || "#programs";
  const medicalTel = CONFIG.phoneMedical ? "tel:" + CONFIG.phoneMedical : "";
  const engineeringTel = CONFIG.phoneEngineering ? "tel:" + CONFIG.phoneEngineering : "";

  bindLink("btnProspectus", prospectus, true);
  bindLink("btnGoogleReview", review, isSet(review));
  bindLink("btnMaps", maps, isSet(maps));
  bindLink("callMedical", medicalTel, isSet(medicalTel));
  bindLink("callEngineering", engineeringTel, isSet(engineeringTel));
  bindLink("waMedical", medicalWa, isSet(medicalWa));
  bindLink("waEngineering", engineeringWa, isSet(engineeringWa));
  bindLink("btnWhatsapp", medicalWa || engineeringWa, isSet(medicalWa || engineeringWa));
  bindLink("btnCall", medicalTel || engineeringTel, isSet(medicalTel || engineeringTel));
  bindLink("waFloat", medicalWa || engineeringWa, isSet(medicalWa || engineeringWa));
  applyMeta();
}

function handleMissingImages() {
  document.querySelectorAll(".shots img").forEach((img) => {
    img.addEventListener("error", () => {
      const figure = img.closest("figure");
      if (figure) figure.classList.add("is-empty");
    });
  });
}

function handleNav() {
  const links = Array.from(document.querySelectorAll(".dock a"));
  const map = {
    home: document.getElementById("home"),
    programs: document.getElementById("programs"),
    reviews: document.getElementById("reviews"),
    admission: document.getElementById("admission"),
    contact: document.getElementById("contact")
  };
  const order = ["contact", "admission", "reviews", "programs", "home"];

  const onScroll = () => {
    const marker = window.scrollY + window.innerHeight * 0.42;
    let current = "home";
    for (const key of order) {
      const section = map[key];
      if (section && section.offsetTop <= marker) {
        current = key;
        break;
      }
    }
    links.forEach((link) => link.classList.toggle("on", link.dataset.nav === current));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function handleSheet() {
  const sheet = document.getElementById("sheet");
  const close = document.getElementById("sheetClose");
  if (!sheet) return;

  const open = () => {
    sheet.hidden = false;
  };
  const hide = () => {
    sheet.hidden = true;
  };

  document.querySelectorAll(".js-enquire").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      open();
    });
  });
  close.addEventListener("click", hide);
  sheet.addEventListener("click", (event) => {
    if (event.target === sheet) hide();
  });
}

function handleEnquiry() {
  const form = document.getElementById("enquiry-form");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const studentName = String(data.get("studentName") || "").trim();
    const parentName = String(data.get("parentName") || "").trim();
    const studentClass = String(data.get("studentClass") || "").trim();
    const program = String(data.get("program") || "").trim();
    const mobile = String(data.get("mobile") || "").trim();

    if (!studentName || !parentName || !studentClass || !program || !mobile) {
      status.textContent = "Please complete all fields.";
      return;
    }

    const message = [
      "GOAL Dhanbad — Admission Enquiry",
      "Student Name: " + studentName,
      "Parent Name: " + parentName,
      "Class: " + studentClass,
      "Interested Programme: " + program,
      "Mobile: " + mobile
    ].join("\n");

    const number = isEngineering(program) ? CONFIG.whatsappEngineering : CONFIG.whatsappMedical;
    const href = waHref(number, message);
    if (!href) {
      status.textContent = "Add a WhatsApp number in CONFIG to send this enquiry.";
      return;
    }

    status.textContent = "Opening WhatsApp…";
    window.open(href, "_blank", "noopener");
  });
}

applyConfig();
handleMissingImages();
handleNav();
handleSheet();
handleEnquiry();
