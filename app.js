const sourceDecks = window.EVOL_DATA.decks;
const sourceGames = window.EVOL_GAMES;

const slideNode = document.getElementById("slide");
const schemeNavNode = document.getElementById("scheme-nav");
const currentNode = document.getElementById("current");
const totalNode = document.getElementById("total");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const languageButtons = document.querySelectorAll("[data-lang]");
const languageSwitchNode = document.querySelector(".language-switch");
const contactNode = document.querySelector(".contact-link");
const topToolsNode = document.querySelector(".top-tools");

let language = initialLanguage();
let decks = localizeDecks(sourceDecks);
let games = localizeGames(sourceGames);
let section = initialSection();
let deckIndex = 0;
let index = 0;
let gameModeId = "closer";
let currentGame = null;
let gameScore = { correct: 0, total: 0 };
let chainSelection = [];
let selectedGameLevels = new Set(["easy", "medium", "hard"]);
let gameProgress = {};
let chainPointerDrag = null;
let suppressChainClick = false;
let presentationMode = initialPresentationMode();
let gameFocusIndex = 0;
let preferredGameFocus = null;

function initialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = normalizeLanguage(params.get("lang"));
  if (fromUrl) return fromUrl;

  try {
    return normalizeLanguage(window.localStorage.getItem("evol-lang")) || "ru";
  } catch {
    return "ru";
  }
}

function initialSection() {
  const params = new URLSearchParams(window.location.search);
  return params.get("section") === "games" ? "games" : "slides";
}

function initialPresentationMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("play") === "full";
}

function normalizeLanguage(value) {
  return value === "en" || value === "ru" ? value : null;
}

function t(value) {
  if (language !== "en") return value;
  return window.EVOL_I18N?.en?.[value] || value;
}

function localizeDecks(rawDecks) {
  return localizeValue(rawDecks);
}

function localizeGames(rawGames) {
  return localizeValue(rawGames);
}

function localizeValue(value) {
  if (typeof value === "string") return t(value);
  if (Array.isArray(value)) return value.map(localizeValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeValue(item)]));
}

function setLanguage(nextLanguage, updateUrl = true) {
  const normalized = normalizeLanguage(nextLanguage) || "ru";
  language = normalized;
  decks = localizeDecks(sourceDecks);
  games = localizeGames(sourceGames);
  currentGame = null;
  chainSelection = [];
  gameProgress = {};
  index = Math.max(0, Math.min(decks[deckIndex].slides.length - 1, index));

  document.documentElement.lang = language;
  try {
    window.localStorage.setItem("evol-lang", language);
  } catch {
    // The site still works if storage is unavailable.
  }

  if (updateUrl) {
    updateSectionUrl();
  }

  updateStaticText();
  updatePresentationState();
  render();
}

function updateStaticText() {
  document.title = language === "en" ? "Major Forks in Evolution" : "Основные развилки эволюции";
  languageSwitchNode?.setAttribute("aria-label", language === "en" ? "Language" : "Язык");
  schemeNavNode.setAttribute("aria-label", t("Схемы"));
  prevButton.setAttribute("aria-label", t("Предыдущий слайд"));
  nextButton.setAttribute("aria-label", t("Следующий слайд"));
  document.querySelector(".progress")?.setAttribute("aria-label", t("Номер слайда"));
  contactNode?.setAttribute("aria-label", t("Контакт"));
  const contactText = contactNode?.querySelector(".contact-text");
  if (contactText) contactText.textContent = t("Написать");
  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.setAttribute("aria-label", button.dataset.lang === "en" ? t("английский") : t("русский"));
  });
}

function iconSvg(kind, caption) {
  const title = escapeHtml(caption);
  const scenes = {
    cell: `
      <ellipse cx="360" cy="260" rx="230" ry="176" fill="#f6d978" class="outline"/>
      <ellipse cx="364" cy="258" rx="98" ry="82" fill="#e56f5d" class="outline"/>
      <circle cx="321" cy="204" r="18" fill="#247d74"/>
      <circle cx="468" cy="226" r="24" fill="#247d74"/>
      <circle cx="255" cy="300" r="26" fill="#247d74"/>
      <path d="M235 183c38 22 77 24 116 4M430 326c-44-24-88-24-132 0" class="thin"/>
      <circle cx="405" cy="252" r="12" class="shine"/>
    `,
    sponge: `
      <path d="M285 414c-30-76-48-150-36-229 9-58 49-94 95-70 28-69 104-46 112 21 46-15 88 21 83 80-7 81-35 145-51 198z" fill="#e66a50" class="outline"/>
      <ellipse cx="360" cy="113" rx="54" ry="27" fill="#f6d978" class="outline"/>
      <circle cx="310" cy="210" r="15" fill="#ffd9bd"/>
      <circle cx="410" cy="205" r="18" fill="#ffd9bd"/>
      <circle cx="368" cy="284" r="22" fill="#ffd9bd"/>
      <circle cx="460" cy="300" r="14" fill="#ffd9bd"/>
      <path d="M224 419h282" class="thin"/>
    `,
    starfish: `
      <path d="M360 86l58 133 145-14-109 97 47 139-141-74-141 74 47-139-109-97 145 14z" fill="#e56f5d" class="outline"/>
      <circle cx="360" cy="292" r="72" fill="#f6a063" class="outline"/>
      <circle cx="331" cy="278" r="10" class="eye"/>
      <circle cx="389" cy="278" r="10" class="eye"/>
      <path d="M329 318c22 18 43 18 62 0" class="thin"/>
      <circle cx="360" cy="153" r="13" fill="#f6d978"/>
      <circle cx="234" cy="242" r="12" fill="#f6d978"/>
      <circle cx="486" cy="242" r="12" fill="#f6d978"/>
    `,
    lancelet: `
      <path d="M103 276c126-104 334-139 506-15-149 129-385 125-506 15z" fill="#f2c777" class="outline"/>
      <path d="M128 274c105-41 273-65 433-16" class="thin"/>
      <path d="M587 260l70-76c14 72 4 132-30 181z" fill="#82b7b0" class="outline"/>
      <circle cx="222" cy="245" r="9" class="eye"/>
      <path d="M283 223c48 34 90 35 126 2" class="thin"/>
    `,
    craniate: `
      <path d="M125 297c89-97 271-127 423-62l85-59c2 70-11 130-48 180-174 75-368 34-460-59z" fill="#7cb8c5" class="outline"/>
      <path d="M150 293c70-64 161-86 277-71" class="thin"/>
      <path d="M144 294c54-62 122-86 202-73-12 80-82 105-202 73z" class="bone"/>
      <circle cx="225" cy="264" r="14" class="eye"/>
      <path d="M177 323c34 21 77 23 126 6" class="thin"/>
    `,
    jawfish: `
      <path d="M102 284c94-97 307-124 448-34l75-65c12 82 2 143-34 190-159 68-382 41-489-91z" fill="#86bfc8" class="outline"/>
      <path d="M160 282c45-42 102-63 172-61" class="bone"/>
      <path d="M154 306l132 4-80 52z" fill="#f6d978" class="outline"/>
      <circle cx="230" cy="244" r="15" class="eye"/>
      <path d="M306 328c50 20 100 19 148-1" class="thin"/>
    `,
    bonyfish: `
      <path d="M101 275c118-116 332-115 482 2-148 116-364 121-482-2z" fill="#5aa7c8" class="outline"/>
      <path d="M573 276l83-81c17 75 10 139-21 193z" fill="#f4c663" class="outline"/>
      <path d="M303 175c44 29 88 31 132 4l-41 75z" fill="#f4c663" class="outline"/>
      <path d="M306 377c45-30 91-31 136-3l-48-77z" fill="#f4c663" class="outline"/>
      <circle cx="210" cy="253" r="14" class="eye"/>
      <path d="M254 299h88M368 292h88" class="thin"/>
    `,
    coelacanth: `
      <path d="M95 272c125-112 330-119 481-7-137 126-360 134-481 7z" fill="#486b8e" class="outline"/>
      <path d="M565 265l75-92 32 92-34 91z" fill="#7fc0a3" class="outline"/>
      <ellipse cx="362" cy="375" rx="77" ry="36" fill="#7fc0a3" class="outline" transform="rotate(-17 362 375)"/>
      <ellipse cx="407" cy="159" rx="72" ry="34" fill="#7fc0a3" class="outline" transform="rotate(16 407 159)"/>
      <circle cx="203" cy="246" r="14" class="eye"/>
      <path d="M260 236c82 41 169 42 260 2" class="thin"/>
    `,
    tiktaalik: `
      <path d="M118 289c86-108 265-139 417-74 71 31 77 102 10 145-134 86-325 62-427-71z" fill="#7ca56b" class="outline"/>
      <path d="M119 289c66-52 143-71 232-60" class="bone"/>
      <circle cx="213" cy="253" r="15" class="eye"/>
      <path d="M238 321c47 19 93 18 138-4" class="thin"/>
      <path d="M277 352c-48 25-78 53-91 84M434 356c42 34 71 68 86 102" class="thin"/>
      <path d="M181 437h92M483 458h91" class="thin"/>
    `,
    amniote: `
      <ellipse cx="356" cy="309" rx="161" ry="118" fill="#f6ead2" class="outline"/>
      <path d="M204 385c42-74 105-111 188-112 83 0 139 37 168 112" fill="none" class="thin"/>
      <path d="M153 301c77-67 188-91 330-71 53 8 86 31 99 70" fill="#83ae73" class="outline"/>
      <path d="M224 361c-34 24-61 53-82 87M477 359c35 25 61 53 80 86" class="thin"/>
      <circle cx="250" cy="260" r="13" class="eye"/>
      <path d="M290 298c42 16 84 17 126 1" class="thin"/>
    `,
    sailSynapsid: `
      <path d="M147 337c90-102 264-125 389-62 67 34 82 90 37 137-116 93-331 73-426-75z" fill="#b98559" class="outline"/>
      <path d="M287 267c23-84 55-134 96-151 54 45 83 99 88 161z" fill="#e36d55" class="outline"/>
      <circle cx="227" cy="296" r="14" class="eye"/>
      <path d="M266 359l-49 92M436 362l53 91" class="thin"/>
      <path d="M188 453h83M468 454h89" class="thin"/>
      <path d="M268 338c45 19 94 18 146-3" class="thin"/>
    `,
    cynodont: `
      <path d="M130 321c92-106 266-134 391-69 73 38 81 115 17 160-129 91-317 56-408-91z" fill="#a87955" class="outline"/>
      <path d="M168 307c62-48 137-66 224-54" class="bone"/>
      <circle cx="230" cy="278" r="14" class="eye"/>
      <path d="M193 228l-48-55M248 217l-18-68" class="thin"/>
      <path d="M273 363l-55 78M450 370l54 85" class="thin"/>
      <path d="M205 444h77M489 456h81" class="thin"/>
      <path d="M262 329c33 23 73 24 121 5" class="thin"/>
    `,
    smallMammal: `
      <path d="M147 329c74-91 236-117 361-58 67 32 81 91 33 137-117 86-308 63-394-79z" fill="#a87955" class="outline"/>
      <circle cx="233" cy="288" r="14" class="eye"/>
      <path d="M188 244l-43-68M244 236l-18-74" class="thin"/>
      <path d="M280 362l-54 82M438 365l55 82" class="thin"/>
      <path d="M206 446h83M475 449h91" class="thin"/>
      <path d="M270 328c35 22 76 23 124 3" class="thin"/>
      <path d="M548 327c44 1 76 19 95 55" class="thin"/>
    `,
    primate: `
      <ellipse cx="354" cy="250" rx="122" ry="104" fill="#9c7553" class="outline"/>
      <circle cx="309" cy="235" r="15" class="eye"/>
      <circle cx="398" cy="235" r="15" class="eye"/>
      <path d="M315 290c30 20 62 20 94 0" class="thin"/>
      <path d="M252 330c-48 42-77 88-86 139M462 330c48 42 77 88 86 139" class="thin"/>
      <path d="M263 367c-47 5-91 1-131-13M450 366c47 6 91 2 132-12" class="thin"/>
      <circle cx="247" cy="246" r="29" fill="#b98559" class="outline"/>
      <circle cx="461" cy="246" r="29" fill="#b98559" class="outline"/>
    `,
    human: `
      <circle cx="360" cy="141" r="55" fill="#c79068" class="outline"/>
      <path d="M360 198v150M286 258c50 25 99 25 148 0M324 349l-48 105M396 349l50 105" class="thin"/>
      <path d="M265 454h81M420 454h83" class="thin"/>
      <circle cx="340" cy="133" r="8" class="eye"/>
      <circle cx="381" cy="133" r="8" class="eye"/>
      <path d="M338 163c16 12 32 12 48 0" class="thin"/>
    `,
    lizard: `
      <path d="M122 315c79-112 265-144 421-68 59 29 68 83 23 125-124 93-339 68-444-57z" fill="#6fa36d" class="outline"/>
      <path d="M522 254c45-52 87-83 126-94 4 62-12 110-48 145" class="thin"/>
      <circle cx="222" cy="281" r="14" class="eye"/>
      <path d="M281 369l-56 88M432 370l61 88" class="thin"/>
      <path d="M206 459h86M478 459h94" class="thin"/>
      <path d="M258 325c44 20 91 19 142-2" class="thin"/>
    `,
    crocodile: `
      <path d="M91 312c108-96 326-113 491-39 51 23 58 67 16 98-154 72-384 51-507-59z" fill="#688b58" class="outline"/>
      <path d="M526 277l101-48 36 56-133 22" fill="#688b58" class="outline"/>
      <circle cx="205" cy="280" r="13" class="eye"/>
      <path d="M238 329c71 20 154 20 249 0M287 371l-43 67M452 370l53 69" class="thin"/>
      <path d="M222 439h76M489 441h87" class="thin"/>
    `,
    bigDino: `
      <path d="M135 316c80-111 253-144 394-75 70 34 82 93 29 139-122 97-320 70-423-64z" fill="#b98a55" class="outline"/>
      <path d="M198 258l-63-70M245 240l-17-83M292 231l31-78" class="thin"/>
      <circle cx="218" cy="280" r="13" class="eye"/>
      <path d="M295 365l-50 100M440 365l52 100" class="thin"/>
      <path d="M222 466h85M472 466h91" class="thin"/>
      <path d="M261 328c39 20 84 20 134 0" class="thin"/>
    `,
    sauropod: `
      <ellipse cx="389" cy="330" rx="171" ry="91" fill="#7aa56b" class="outline"/>
      <path d="M245 307c-4-92 28-151 96-178 16 59 3 111-39 158" class="thin"/>
      <circle cx="329" cy="146" r="31" fill="#7aa56b" class="outline"/>
      <path d="M538 306c51-39 92-64 124-75 1 57-21 100-66 131" class="thin"/>
      <path d="M300 397l-18 76M406 408l-10 74M491 394l26 79" class="thin"/>
      <path d="M259 475h65M374 482h62M499 474h68" class="thin"/>
      <circle cx="319" cy="139" r="7" class="eye"/>
    `,
    bird: `
      <path d="M192 315c93-105 255-122 374-50-100 112-285 138-374 50z" fill="#5aa7c8" class="outline"/>
      <path d="M328 299c-64-73-80-136-48-188 75 46 116 108 122 186" fill="#f6c15b" class="outline"/>
      <path d="M543 263l96-42-34 88z" fill="#f6c15b" class="outline"/>
      <circle cx="234" cy="284" r="13" class="eye"/>
      <path d="M327 385l-26 74M402 379l27 80" class="thin"/>
      <path d="M275 461h67M409 461h71" class="thin"/>
    `,
    archosaur: `
      <path d="M124 319c80-120 256-156 400-82 65 34 76 96 26 144-114 110-323 82-426-62z" fill="#6fa36d" class="outline"/>
      <path d="M497 240c42-53 82-86 121-99 5 65-10 115-45 150" class="thin"/>
      <circle cx="214" cy="279" r="14" class="eye"/>
      <path d="M284 365l-24 100M423 369l23 100" class="thin"/>
      <path d="M231 466h90M419 470h91" class="thin"/>
      <path d="M253 322c41 22 88 22 139 0" class="thin"/>
    `,
    dinoform: `
      <path d="M141 311c80-112 247-143 382-82 69 31 88 82 57 137-101 119-316 101-439-55z" fill="#d28d4d" class="outline"/>
      <path d="M529 239c45-60 82-93 112-98 4 56-12 104-48 144" class="thin"/>
      <path d="M252 371l-34 101M406 368l52 101" class="thin"/>
      <path d="M193 472h91M443 470h99" class="thin"/>
      <path d="M352 256l39-98 36 105" fill="#f6d978" class="outline"/>
      <circle cx="221" cy="278" r="13" class="eye"/>
      <path d="M263 326c43 19 88 19 134 0" class="thin"/>
    `,
    theropod: `
      <path d="M151 302c72-123 246-158 387-80 72 40 79 105 18 154-121 98-316 69-405-74z" fill="#c85848" class="outline"/>
      <path d="M523 228c56-69 101-104 135-107-2 70-24 123-66 160" class="thin"/>
      <path d="M288 371l-52 105M415 365l55 109" class="thin"/>
      <path d="M199 477h93M451 476h93" class="thin"/>
      <path d="M381 226c25-28 48-54 68-78 31 39 43 79 36 121" fill="#f1c15c" class="outline"/>
      <circle cx="225" cy="266" r="14" class="eye"/>
      <path d="M257 311c43 22 91 21 145-1" class="thin"/>
      <path d="M347 358l-79-40M458 349l72-49" class="thin"/>
    `,
    tree: `
      <path d="M358 442c-10-103-7-190 9-262" class="outline" fill="none"/>
      <path d="M361 273c-70-58-141-91-213-99M371 247c74-80 145-123 214-130M357 344c-74-19-140-17-197 6M372 327c88-33 162-39 222-18" class="thin"/>
      <circle cx="139" cy="172" r="47" fill="#e56f5d" class="outline"/>
      <circle cx="592" cy="118" r="51" fill="#7fc0a3" class="outline"/>
      <circle cx="161" cy="352" r="44" fill="#f6c15b" class="outline"/>
      <circle cx="599" cy="309" r="45" fill="#5aa7c8" class="outline"/>
      <circle cx="368" cy="173" r="56" fill="#a87955" class="outline"/>
      <path d="M280 443h168" class="thin"/>
    `,
  };

  return `
    <svg class="creature" viewBox="0 0 720 520" role="img" aria-label="${title}">
      <title>${title}</title>
      ${scenes[kind]}
    </svg>
  `;
}

function render() {
  updatePresentationState();
  if (section === "games") {
    renderGames();
    return;
  }

  const deck = decks[deckIndex];
  const slide = deck.slides[index];
  slideNode.style.setProperty("--bg-a", slide.colors[0]);
  slideNode.style.setProperty("--bg-b", slide.colors[1]);

  slideNode.innerHTML = `
    <article class="slide">
      ${timeline(deck, slide)}
      <div class="copy">
        <div class="kicker">${escapeHtml(slide.kicker)}</div>
        <h1 class="title">${escapeHtml(slide.title)}</h1>
        <p class="subtitle">${escapeHtml(slide.subtitle)}</p>
        ${infoGrid(slide, deck)}
        ${successGrid(slide)}
      </div>
      <div class="stage ${slide.mainPhoto ? "has-main-photo" : ""} ${slide.mainPhoto?.silhouette ? "main-is-silhouette" : ""}">
        ${memorySymbol(slide, deck)}
        <div class="stage-photos">
          ${photoCard(slide.mainPhoto, "main-photo")}
          ${photoCard(slide.sidePhoto, "side-photo")}
        </div>
        ${iconSvg(slide.scene, slide.caption)}
        <div class="caption">${escapeHtml(slide.caption)}</div>
      </div>
    </article>
  `;

  currentNode.textContent = String(index + 1);
  totalNode.textContent = String(deck.slides.length);
  prevButton.disabled = deckIndex === 0 && index === 0;
  nextButton.disabled = deckIndex === decks.length - 1 && index === deck.slides.length - 1;
  document.querySelector(".controls")?.classList.remove("hidden");
  renderSchemeNav();
}

function infoGrid(slide, deck) {
  const labels = { ...(deck.infoLabels || {}), ...(slide.infoLabels || {}) };
  const items = [
    [labels.novelty || t("Новшество"), slide.novelty || slide.improvement],
    [labels.main || t("Основная ветка"), slide.mainBranch || slide.caption],
    [labels.side || t("Боковая ветка"), slide.sideBranch || slide.side],
    [labels.effect || t("Что дало"), slide.effect || slide.noveltyDescription || slide.subtitle],
  ].filter(([, value]) => value);

  return `
    <div class="info-grid">
      ${items
        .map(
          ([label, value]) => `
            <div class="info-card">
              <strong>${escapeHtml(label)}</strong>
              <span>${escapeHtml(value)}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function successGrid(slide) {
  if (!slide.success) return "";
  const items = [
    [t("Основная"), slide.success.main],
    [t("Боковая"), slide.success.side],
  ].filter(([, value]) => value);

  if (!items.length) return "";

  return `
    <div class="success-grid" aria-label="Успешность веток">
      ${items
        .map(
          ([label, value]) => `
            <div class="success-card">
              <strong>${escapeHtml(label)}</strong>
              <span>${escapeHtml(value)}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function photoCard(photo, className) {
  if (!photo) return "";
  return `
    <figure class="photo-card ${className} ${photo.silhouette ? "silhouette-photo" : ""}">
      <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.label)}" loading="eager" />
      <figcaption>${escapeHtml(photo.label)}</figcaption>
    </figure>
  `;
}

function memorySymbol(slide, deck) {
  if (!deck.showSlideSymbol || !slide.marker) return "";
  const label = slide.symbolLabel || slide.novelty || slide.improvement || slide.title;
  return `
    <figure class="memory-symbol" aria-label="${escapeHtml(t("Символ вехи"))}">
      <div class="memory-symbol-icon">${markerSvg(slide.marker)}</div>
      <figcaption>${escapeHtml(label)}</figcaption>
    </figure>
  `;
}

function timeline(deck, slide) {
  const dot = timelinePosition(deck, slide.timeMa);
  const eras = timelineBands(deck, deck.eras || [], "era-band");
  const markers = timelineMarkers(deck, slide);
  const periods = (deck.periods || [])
    .map((period) => timelineBand(deck, period, "period-band", 3.5))
    .join("");
  const ticks = deck.ticks
    .map(
      (tick) => `
        <span class="time-tick" style="left: ${timelinePosition(deck, tick.ma)}%">
          <i></i><b>${escapeHtml(tick.label)}</b>
        </span>
      `,
    )
    .join("");

  return `
    <div class="timeline ${markers ? "with-markers" : ""}" aria-label="${escapeHtml(t("Ось времени"))}">
      <div class="timeline-head">
        <span>${escapeHtml(deck.timelineKicker || t("примерная точка разделения"))}</span>
        <strong>${escapeHtml(slide.timeLabel || formatMa(slide.timeMa))}</strong>
      </div>
      <div class="era-row" aria-label="Эры">${eras}</div>
      <div class="period-row" aria-label="Периоды">${periods}</div>
      <div class="timeline-track">
        ${markers}
        ${ticks}
        <span class="time-dot" style="left: ${dot}%"></span>
      </div>
    </div>
  `;
}

function renderGames() {
  if (!currentGame || currentGame.modeId !== gameModeId) {
    nextGameQuestion();
  }
  if (presentationMode && !preferredGameFocus && !document.activeElement?.closest(".game-screen")) {
    preferredGameFocus = gameQuestionFocusSelector();
  }

  slideNode.style.setProperty("--bg-a", "#d9e8d2");
  slideNode.style.setProperty("--bg-b", "#eadcc4");
  document.querySelector(".controls")?.classList.add("hidden");
  renderSchemeNav();

  const mode = games.modes.find((item) => item.id === gameModeId) || games.modes[0];
  const modeButtons = games.modes
    .map(
      (item) => `
        <button class="game-mode-button ${item.id === gameModeId ? "active" : ""}" type="button" data-game-mode="${escapeHtml(item.id)}" aria-pressed="${item.id === gameModeId}">
          ${escapeHtml(item.title)}
        </button>
      `,
    )
    .join("");
  const levelButtons = games.levels
    .map(
      (level) => `
        <button class="game-level-button ${selectedGameLevels.has(level.id) ? "active" : ""}" type="button" data-game-level="${escapeHtml(level.id)}" aria-pressed="${selectedGameLevels.has(level.id)}">
          ${escapeHtml(level.title)}
        </button>
      `,
    )
    .join("");

  slideNode.innerHTML = `
    <article class="game-screen">
      <header class="game-header">
        <div>
          <div class="kicker">${escapeHtml(t("Тренировка"))}</div>
          <h1 class="game-title">${escapeHtml(t("Игры про эволюцию"))}</h1>
          <p class="subtitle">${escapeHtml(mode.hint)}</p>
        </div>
        <div class="game-header-actions">
          <button class="game-fullscreen-button" type="button" data-game-fullscreen>
            ${escapeHtml(presentationMode ? t("Обычный режим") : t("Во весь экран"))}
          </button>
          <div class="game-score" aria-label="${escapeHtml(t("Счет"))}">
            <strong>${gameScore.correct}</strong><span>/</span><strong>${gameScore.total}</strong>
          </div>
        </div>
      </header>
      <nav class="game-modes" aria-label="${escapeHtml(t("Режимы игры"))}">
        ${modeButtons}
      </nav>
      <div class="game-levels" aria-label="${escapeHtml(t("Уровни вопросов"))}">
        <span>${escapeHtml(t("Уровень"))}</span>
        ${levelButtons}
      </div>
      ${gameModeId === "chain" ? chainGameMarkup(mode) : choiceGameMarkup(mode)}
    </article>
  `;
  updateGameFocus();
}

function choiceGameMarkup(mode) {
  const question = currentGame.question;
  if (!question) return emptyGameMarkup();
  const pair = question.pair.map((id) => games.cards[id]);
  const answers = currentGame.answers;

  return `
    <section class="game-panel">
      <div class="game-question">
        <strong>${escapeHtml(question.prompt)}</strong>
        <span>${escapeHtml(gameStatusText() || t("Выбери ответ"))}</span>
      </div>
      <div class="game-creatures">
        ${pair.map((card) => creatureChoiceCard(card)).join("")}
      </div>
      <div class="game-answers">
        ${answers.map((answer) => answerButton(answer)).join("")}
      </div>
      ${gameFeedbackMarkup()}
    </section>
  `;
}

function chainGameMarkup(mode) {
  const question = currentGame.question;
  if (!question) return emptyGameMarkup();
  const selected = new Set(chainSelection);
  const bankItems = currentGame.shuffled.filter((item) => !selected.has(item));

  return `
    <section class="game-panel">
      <div class="game-question">
        <strong>${escapeHtml(question.prompt)}</strong>
        <span>${escapeHtml(gameStatusText() || t("Нажимай по порядку"))}</span>
      </div>
      <div class="chain-board">
        <div class="chain-zone chain-target" data-chain-drop="chain">
          <strong>${escapeHtml(t("Цепочка"))}</strong>
          <div class="chain-items">
            ${chainDropSlot(0)}
            ${
              chainSelection.length
                ? chainSelection.map((item, i) => `${chainPlacedItem(item, i)}${chainDropSlot(i + 1)}`).join("")
                : `<span class="chain-empty">${escapeHtml(t("Перетащи сюда первый шаг"))}</span>`
            }
          </div>
        </div>
        <div class="chain-zone chain-bank" data-chain-drop="bank">
          <strong>${escapeHtml(t("Варианты"))}</strong>
          <div class="chain-options">
            ${
              bankItems.length
                ? bankItems.map((item) => chainBankItem(item)).join("")
                : `<span class="chain-empty">${escapeHtml(t("Все шаги уже в цепочке"))}</span>`
            }
          </div>
        </div>
      </div>
      ${gameFeedbackMarkup()}
    </section>
  `;
}

function chainDropSlot(index) {
  return `<span class="chain-drop-slot" data-chain-insert="${index}" aria-label="${escapeHtml(t("Место в цепочке"))}"></span>`;
}

function chainPlacedItem(item, index) {
  return `
    <button class="chain-button chain-placed" type="button" data-chain-index="${index}" data-chain-value="${escapeHtml(item)}" data-chain-remove="${index}" ${currentGame.result ? "disabled" : ""}>
      <span>${index + 1}.</span> ${escapeHtml(item)}
    </button>
  `;
}

function chainBankItem(item) {
  return `
    <button class="chain-button" type="button" data-chain-item="${escapeHtml(item)}" data-chain-value="${escapeHtml(item)}" ${currentGame.result ? "disabled" : ""}>
      ${escapeHtml(item)}
    </button>
  `;
}

function emptyGameMarkup() {
  return `
    <section class="game-panel">
      <div class="game-question">
        <strong>${escapeHtml(t("Нет вопросов для выбранных уровней"))}</strong>
        <span>${escapeHtml(t("Выбери другой уровень"))}</span>
      </div>
    </section>
  `;
}

function creatureChoiceCard(card) {
  return `
    <figure class="game-creature-card">
      <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.name)}" />
      <figcaption>
        <strong>${escapeHtml(card.name)}</strong>
        <span>${escapeHtml(card.note)}</span>
      </figcaption>
    </figure>
  `;
}

function answerButton(answer) {
  const isAnswered = Boolean(currentGame.result);
  const isCorrect = currentGame.correctValue === answer.value;
  const className = isAnswered ? (isCorrect ? "correct" : currentGame.chosen === answer.value ? "wrong" : "") : "";
  return `
    <button class="game-answer ${className}" type="button" data-game-answer="${escapeHtml(answer.value)}" data-focus-value="${escapeHtml(answer.value)}" ${isAnswered ? "disabled" : ""}>
      ${escapeHtml(answer.label)}
    </button>
  `;
}

function gameFeedbackMarkup() {
  if (!currentGame.result) {
    return `
      <div class="game-actions">
        <button class="game-next" type="button" data-game-next>${escapeHtml(t("Новый вопрос"))}</button>
      </div>
    `;
  }

  return `
    <div class="game-feedback ${currentGame.result}">
      <strong>${escapeHtml(currentGame.result === "correct" ? t("Верно") : t("Пока нет"))}</strong>
      <span>${escapeHtml(currentGame.question.explanation)}</span>
      <button class="game-next" type="button" data-game-next>${escapeHtml(t("Следующий вопрос"))}</button>
    </div>
  `;
}

function setGameMode(modeId) {
  gameModeId = modeId;
  currentGame = null;
  chainSelection = [];
  preferredGameFocus = presentationMode ? gameQuestionFocusSelector() : "[data-game-mode].active";
  render();
}

function nextGameQuestion() {
  const question = nextQuestionForCurrentSettings();
  chainSelection = [];
  currentGame = {
    modeId: gameModeId,
    question,
    answers: question ? gameAnswers(gameModeId, question) : [],
    correctValue: question ? gameCorrectValue(gameModeId, question) : null,
    result: null,
    chosen: null,
    shuffled: question?.items ? shuffle(question.items) : [],
    phase: question?.phase,
  };
}

function nextQuestionForCurrentSettings() {
  const questions = eligibleQuestions();
  if (!questions.length) return null;
  const byId = Object.fromEntries(questions.map((question) => [question.id, question]));
  const state = progressState();

  while (state.freshQueue.length && !byId[state.freshQueue[0]]) state.freshQueue.shift();
  while (state.retryQueue.length && !byId[state.retryQueue[0]]) state.retryQueue.shift();

  if (!state.freshQueue.length && !state.retryQueue.length) {
    state.freshQueue = shuffle(questions.map((question) => question.id));
    state.completedOnce = state.completedOnce || state.rounds > 0;
    state.rounds += 1;
  }

  let phase = "fresh";
  let id = state.freshQueue.shift();
  if (!id && state.retryQueue.length) {
    phase = "retry";
    id = state.retryQueue.shift();
  }
  if (!id) return null;

  return { ...byId[id], phase };
}

function eligibleQuestions() {
  const levels = selectedGameLevels.size ? selectedGameLevels : new Set(games.levels.map((level) => level.id));
  return generatedGameQuestions(gameModeId).filter((question) => levels.has(question.level || "easy"));
}

function generatedGameQuestions(modeId) {
  if (modeId === "ancestor") return generatedAncestorQuestions();
  if (modeId === "chain") return generatedChainQuestions();
  return generatedCloserQuestions();
}

function gameCards() {
  return Object.entries(games.cards)
    .map(([id, card]) => ({ id, ...card }))
    .filter((card) => Array.isArray(card.path) && card.path.length);
}

function generatedCloserQuestions() {
  const targetId = games.target || "human";
  const target = games.cards[targetId];
  if (!target) return [];
  const cards = gameCards().filter((card) => card.id !== targetId);
  const questions = [];

  for (let i = 0; i < cards.length; i += 1) {
    for (let j = i + 1; j < cards.length; j += 1) {
      const a = cards[i];
      const b = cards[j];
      const aDepth = commonPrefix(a.path, target.path).length;
      const bDepth = commonPrefix(b.path, target.path).length;
      if (aDepth === bDepth) continue;
      const answer = aDepth > bDepth ? a : b;
      const other = answer === a ? b : a;
      const answerAncestor = lastCommonRank(answer.path, target.path);
      const otherAncestor = lastCommonRank(other.path, target.path);
      questions.push({
        id: `closer:${a.id}:${b.id}`,
        level: hardestLevel(a.level, b.level),
        pair: [a.id, b.id],
        answer: answer.id,
        prompt: t("Кто ближе к человеку?"),
        explanation: `${answer.name} ${t("ближе к человеку")}: ${t("общий предок")} - ${answerAncestor}. ${other.name}: ${t("более ранняя развилка")} - ${otherAncestor}.`,
      });
    }
  }

  return questions;
}

function generatedAncestorQuestions() {
  const cards = gameCards();
  const questions = [];

  for (let i = 0; i < cards.length; i += 1) {
    for (let j = i + 1; j < cards.length; j += 1) {
      const a = cards[i];
      const b = cards[j];
      const answer = lastCommonRank(a.path, b.path);
      if (!answer || answer === "жизнь" || answer === "life") continue;
      questions.push({
        id: `ancestor:${a.id}:${b.id}`,
        level: hardestLevel(a.level, b.level),
        pair: [a.id, b.id],
        prompt: t("Где последний общий предок?"),
        options: ancestorOptions(answer, a.path, b.path),
        answer,
        explanation: `${a.name} ${t("и")} ${b.name}: ${t("последний общий предок")} - ${answer}.`,
      });
    }
  }

  return questions;
}

function generatedChainQuestions() {
  return gameCards()
    .filter((card) => card.id !== "bacteria")
    .map((card) => {
      const items = chainItemsForCard(card);
      return {
        id: `chain:${card.id}:${items.length}`,
        level: card.level || "easy",
        prompt: `${t("Собери путь")}: ${card.name}`,
        items,
        explanation: `${t("Правильный путь")}: ${items.join(" → ")}.`,
      };
    })
    .filter((question) => question.items.length >= 3);
}

function chainItemsForCard(card) {
  const level = selectedChainLevel();
  const limit = games.levels.find((item) => item.id === level)?.maxRankCount || 8;
  const source = level === "easy" && card.keyRanks ? card.keyRanks : card.path;
  return reducePath(source, limit);
}

function selectedChainLevel() {
  const order = ["easy", "medium", "hard"];
  return order.filter((level) => selectedGameLevels.has(level)).pop() || "easy";
}

function reducePath(path, limit) {
  const unique = [...new Set(path)];
  if (unique.length <= limit) return unique;
  const result = [unique[0]];
  const middleSlots = Math.max(0, limit - 2);
  for (let i = 1; i <= middleSlots; i += 1) {
    const index = Math.round((i * (unique.length - 1)) / (middleSlots + 1));
    if (!result.includes(unique[index])) result.push(unique[index]);
  }
  const last = unique[unique.length - 1];
  if (!result.includes(last)) result.push(last);
  return result;
}

function ancestorOptions(answer, firstPath, secondPath) {
  const pool = [...new Set([...firstPath, ...secondPath])].filter((item) => item !== answer);
  const answerIndex = Math.max(firstPath.indexOf(answer), secondPath.indexOf(answer));
  const nearby = pool
    .map((item) => ({ item, distance: Math.abs(Math.max(firstPath.indexOf(item), secondPath.indexOf(item)) - answerIndex) }))
    .filter(({ item }) => item !== "жизнь" && item !== "life")
    .sort((a, b) => a.distance - b.distance)
    .map(({ item }) => item);
  return shuffle([answer, ...nearby.slice(0, 3)]);
}

function commonPrefix(first, second) {
  const result = [];
  const length = Math.min(first.length, second.length);
  for (let i = 0; i < length; i += 1) {
    if (first[i] !== second[i]) break;
    result.push(first[i]);
  }
  return result;
}

function lastCommonRank(first, second) {
  const prefix = commonPrefix(first, second);
  return prefix[prefix.length - 1] || "";
}

function hardestLevel(...levels) {
  const order = ["easy", "medium", "hard"];
  return levels.reduce((hardest, level) => (order.indexOf(level) > order.indexOf(hardest) ? level : hardest), "easy");
}

function progressState() {
  const key = `${gameModeId}:${[...selectedGameLevels].sort().join(",")}`;
  if (!gameProgress[key]) {
    gameProgress[key] = { freshQueue: [], retryQueue: [], rounds: 0, completedOnce: false };
  }
  return gameProgress[key];
}

function gameStatusText() {
  if (!currentGame?.question) return "";
  if (currentGame.phase === "retry") return t("Повторяем ошибку");
  const state = progressState();
  const total = eligibleQuestions().length;
  const done = Math.max(0, total - state.freshQueue.length);
  if (state.rounds > 1) return t("Все вопросы уже были, пошел новый круг");
  return `${t("Новые вопросы")}: ${done}/${total}`;
}

function gameAnswers(modeId, question) {
  if (modeId === "ancestor") {
    return shuffle(question.options).map((option) => ({ value: option, label: option }));
  }
  if (modeId === "chain") return [];
  return shuffle(question.pair).map((id) => ({ value: id, label: games.cards[id].name }));
}

function gameCorrectValue(modeId, question) {
  if (modeId === "chain") return question.items.join("|");
  return question.answer;
}

function chooseGameAnswer(value) {
  if (!currentGame || currentGame.result) return;
  currentGame.chosen = value;
  currentGame.result = value === currentGame.correctValue ? "correct" : "wrong";
  rememberGameResult(currentGame);
  gameScore.total += 1;
  if (currentGame.result === "correct") gameScore.correct += 1;
  preferredGameFocus = "[data-game-next]";
  render();
}

function chooseChainItem(value) {
  if (!currentGame || currentGame.result || chainSelection.includes(value)) return;
  chainSelection.push(value);
  checkChainIfComplete();
  preferredGameFocus = `[data-chain-value="${cssEscape(value)}"]`;
  render();
}

function moveChainItem(value, nextIndex) {
  if (!currentGame || currentGame.result) return;
  const previousIndex = chainSelection.indexOf(value);
  if (previousIndex !== -1) chainSelection.splice(previousIndex, 1);
  const boundedIndex = Math.max(0, Math.min(chainSelection.length, nextIndex));
  chainSelection.splice(boundedIndex, 0, value);
  checkChainIfComplete();
  preferredGameFocus = `[data-chain-value="${cssEscape(value)}"]`;
  render();
}

function removeChainItem(index) {
  if (!currentGame || currentGame.result) return;
  const value = chainSelection[index];
  chainSelection.splice(index, 1);
  preferredGameFocus = value ? `[data-chain-value="${cssEscape(value)}"]` : null;
  render();
}

function checkChainIfComplete() {
  if (!currentGame?.question || chainSelection.length !== currentGame.question.items.length) return;
  const chosen = chainSelection.join("|");
  currentGame.chosen = chosen;
  currentGame.result = chosen === currentGame.correctValue ? "correct" : "wrong";
  rememberGameResult(currentGame);
  gameScore.total += 1;
  if (currentGame.result === "correct") gameScore.correct += 1;
}

function rememberGameResult(game) {
  if (!game.question?.id || game.result !== "wrong") return;
  const state = progressState();
  if (!state.retryQueue.includes(game.question.id)) {
    state.retryQueue.push(game.question.id);
  }
}

function toggleGameLevel(levelId) {
  if (selectedGameLevels.has(levelId)) {
    if (selectedGameLevels.size === 1) return;
    selectedGameLevels.delete(levelId);
  } else {
    selectedGameLevels.add(levelId);
  }
  currentGame = null;
  chainSelection = [];
  preferredGameFocus = `[data-game-level="${cssEscape(levelId)}"]`;
  render();
}

function setPresentationMode(nextValue, requestFullscreen = false) {
  presentationMode = Boolean(nextValue);
  if (presentationMode) preferredGameFocus = gameQuestionFocusSelector();
  updateSectionUrl();
  updatePresentationState();
  if (requestFullscreen && presentationMode && document.fullscreenEnabled && !document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      // The browser may reject fullscreen outside a trusted click; CSS presentation mode still works.
    });
  }
  if (!presentationMode && document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
  render();
}

function gameQuestionFocusSelector() {
  return gameModeId === "chain" ? ".chain-bank .chain-button, .chain-target .chain-placed, [data-game-next]" : ".game-answer, [data-game-next]";
}

function updatePresentationState() {
  document.body.classList.toggle("game-presentation", section === "games" && presentationMode);
}

function updateGameFocus() {
  if (section !== "games") return;
  const focusables = gameFocusables();
  focusables.forEach((item) => item.setAttribute("tabindex", "-1"));
  if (!focusables.length) return;

  let nextIndex = Math.min(gameFocusIndex, focusables.length - 1);
  if (preferredGameFocus) {
    const preferredIndex = focusables.findIndex((item) => item.matches(preferredGameFocus));
    if (preferredIndex !== -1) nextIndex = preferredIndex;
    preferredGameFocus = null;
  }

  gameFocusIndex = Math.max(0, nextIndex);
  const active = focusables[gameFocusIndex];
  active.setAttribute("tabindex", "0");
  if (presentationMode || document.activeElement?.closest(".game-screen")) {
    active.focus({ preventScroll: true });
  }
}

function gameFocusables() {
  return [...slideNode.querySelectorAll(".game-screen button:not(:disabled)")].filter((item) => item.offsetParent !== null);
}

function moveGameFocus(delta) {
  const focusables = gameFocusables();
  if (!focusables.length) return;
  const currentIndex = focusables.indexOf(document.activeElement);
  gameFocusIndex = currentIndex === -1 ? gameFocusIndex : currentIndex;
  gameFocusIndex = (gameFocusIndex + delta + focusables.length) % focusables.length;
  focusables.forEach((item) => item.setAttribute("tabindex", "-1"));
  focusables[gameFocusIndex].setAttribute("tabindex", "0");
  focusables[gameFocusIndex].focus({ preventScroll: true });
}

function activateGameFocus() {
  const active = document.activeElement?.closest(".game-screen button:not(:disabled)");
  if (active) active.click();
}

function moveFocusedChainItem(delta) {
  const active = document.activeElement?.closest("[data-chain-index]");
  if (!active || currentGame?.result) return false;
  const index = Number(active.dataset.chainIndex);
  const value = chainSelection[index];
  if (!value) return false;
  moveChainItem(value, index + delta);
  return true;
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(String(value));
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function timelineMarkers(deck, activeSlide) {
  if (!deck.showTimelineMarkers) return "";
  return deck.slides
    .map((slide, slideIndex) => ({ slide, slideIndex }))
    .filter(({ slide }) => slide.marker && slide.timeMa)
    .map(({ slide, slideIndex }, markerIndex) => {
      const left = timelinePosition(deck, slide.timeMa);
      const lane = markerLane(left, markerIndex);
      const isActive = slide === activeSlide;
      return `
        <button
          class="timeline-marker ${isActive ? "active" : ""}"
          type="button"
          data-slide="${slideIndex}"
          style="left: ${left}%; --lane: ${lane}"
          title="${escapeHtml(slide.title)}: ${escapeHtml(slide.novelty || slide.improvement)}"
          aria-label="${escapeHtml(slide.title)}"
        >
          ${markerSvg(slide.marker)}
        </button>
      `;
    })
    .join("");
}

function markerLane(left, markerIndex) {
  if (left > 83) return markerIndex % 4;
  if (left > 60) return markerIndex % 3;
  return 1;
}

function markerSvg(kind) {
  const icons = {
    nucleus: `
      <circle cx="18" cy="18" r="11" />
      <circle cx="18" cy="18" r="4" class="mark-accent" />
      <path d="M8 17c5-4 14-4 20 0M10 24c6 3 12 3 16 0" />
    `,
    leaf: `
      <path d="M8 24c10 1 18-5 20-17C17 8 9 14 8 24z" />
      <path d="M11 23c5-5 9-8 15-13" />
    `,
    chloroplast: `
      <ellipse cx="18" cy="18" rx="12" ry="8" />
      <path d="M8 18c5-4 15-4 20 0M9 21c5 3 13 3 18 0M10 15c5-3 11-3 16 0" />
      <circle cx="25" cy="13" r="2" class="mark-accent" />
    `,
    algae: `
      <circle cx="18" cy="18" r="11" />
      <circle cx="14" cy="14" r="2" class="mark-accent" />
      <circle cx="22" cy="14" r="2" class="mark-accent" />
      <circle cx="13" cy="22" r="2" class="mark-accent" />
      <circle cx="23" cy="22" r="2" class="mark-accent" />
      <path d="M18 7v22M7 18h22" />
    `,
    chara: `
      <path d="M18 6v25" />
      <path d="M18 12c-5-2-8-1-11 2M18 12c5-2 8-1 11 2" />
      <path d="M18 19c-5-2-8-1-11 2M18 19c5-2 8-1 11 2" />
      <circle cx="18" cy="12" r="1.7" class="mark-accent" />
      <circle cx="18" cy="19" r="1.7" class="mark-accent" />
    `,
    spore: `
      <circle cx="18" cy="18" r="8" />
      <circle cx="11" cy="11" r="3" class="mark-accent" />
      <circle cx="27" cy="12" r="2.5" />
      <circle cx="10" cy="27" r="2.5" />
      <circle cx="28" cy="26" r="3" class="mark-accent" />
    `,
    vascular: `
      <path d="M18 31V7" />
      <path d="M12 31V14M24 31V14" />
      <path d="M12 17c-4-2-6-5-5-9 5 0 8 3 11 9" />
      <path d="M24 17c4-2 6-5 5-9-5 0-8 3-11 9" />
      <circle cx="18" cy="10" r="2" class="mark-accent" />
    `,
    fern: `
      <path d="M18 31C17 20 20 12 28 6" />
      <path d="M19 25c-4-1-7 0-10 3M20 21c-5-2-8-1-11 1M21 17c-5-2-8-2-12-1" />
      <path d="M22 14c3-1 6-1 9 1M24 11c2-2 5-3 8-3" />
      <circle cx="18" cy="30" r="1.6" class="mark-accent" />
    `,
    seed: `
      <path d="M18 6c8 6 9 18 0 27C9 24 10 12 18 6z" />
      <path d="M18 9c-1 8-1 14 0 21M13 20c3-1 7-1 10 0" />
      <circle cx="18" cy="15" r="2" class="mark-accent" />
    `,
    fruit: `
      <circle cx="18" cy="20" r="9" />
      <path d="M18 11c1-4 3-6 6-7M18 11c-3-4-6-5-9-4" />
      <path d="M21 7c3-1 6 0 8 3-4 2-7 1-8-3z" />
      <circle cx="15" cy="18" r="1.5" class="mark-accent" />
    `,
    grass: `
      <path d="M18 31V8M13 31c1-9 2-15 5-23M23 31c-1-9-2-15-5-23" />
      <path d="M12 13c-3 2-5 5-6 9M24 13c3 2 5 5 6 9" />
      <path d="M18 9l-3-4M18 9l3-4" class="mark-accent" />
    `,
    fungus: `
      <path d="M8 17c2-7 17-8 20 0-4 2-15 2-20 0z" />
      <path d="M16 18h5l2 11h-9z" />
    `,
    bilateral: `
      <path d="M18 6v24" />
      <path d="M18 9c-8 3-10 9-6 15 3 3 5 4 6 6 1-2 3-3 6-6 4-6 2-12-6-15z" />
    `,
    fork: `
      <path d="M18 29V15" />
      <path d="M18 15L9 7M18 15l9-8" />
      <circle cx="9" cy="7" r="2" class="mark-accent" />
      <circle cx="27" cy="7" r="2" class="mark-accent" />
    `,
    chord: `
      <path d="M7 22c8-7 16-7 22 0" />
      <path d="M8 17c7 5 14 5 22 0" />
      <path d="M11 12h14" />
    `,
    skull: `
      <path d="M10 18c0-7 5-11 8-11s8 4 8 11c0 4-2 6-5 7v4h-6v-4c-3-1-5-3-5-7z" />
      <circle cx="15" cy="18" r="1.7" class="mark-accent" />
      <circle cx="21" cy="18" r="1.7" class="mark-accent" />
    `,
    jaw: `
      <path d="M8 13c6-5 16-5 21 0" />
      <path d="M9 15c4 11 13 14 20 6" />
      <path d="M14 17l2 5M19 18v6M24 17l-2 5" />
    `,
    bone: `
      <path d="M10 13a4 4 0 1 1 5-5l13 13a4 4 0 1 1-5 5L10 13z" />
      <path d="M8 10l4 4M24 22l4 4" />
    `,
    fin: `
      <path d="M7 19c8-9 18-9 24 0-7 9-17 9-24 0z" />
      <path d="M18 19l7-8M18 19l8 7" />
    `,
    limb: `
      <path d="M10 9c6 5 9 10 9 18" />
      <path d="M19 27l-7 3M19 27l3 5M19 27l7-1" />
    `,
    egg: `
      <path d="M18 6c6 0 10 8 10 15 0 6-4 9-10 9S8 27 8 21C8 14 12 6 18 6z" />
      <path d="M13 22c4 2 7 2 10 0" />
    `,
    split: `
      <path d="M18 30V8" />
      <path d="M18 16c-4 0-7-2-10-6M18 16c4 0 7-2 10-6" />
      <path d="M8 10l2-4M28 10l-2-4" />
    `,
    star: `
      <path d="M18 5l3 9 9 3-9 3-3 11-3-11-9-3 9-3z" />
      <path d="M8 8l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
    `,
    earth: `
      <circle cx="18" cy="18" r="12" />
      <path d="M8 17c5 2 8 1 11-2 3-2 6-2 9 1" />
      <path d="M13 27c2-4 4-6 8-6 3 0 5-2 7-5" />
    `,
    microbe: `
      <circle cx="18" cy="18" r="9" />
      <path d="M8 10l3 3M27 10l-3 3M8 26l3-3M27 26l-3-3" />
      <circle cx="16" cy="17" r="1.8" class="mark-accent" />
      <circle cx="22" cy="20" r="1.4" class="mark-accent" />
    `,
    dino: `
      <path d="M7 23c4-8 13-11 22-5 2 2 3 4 1 6-6 5-17 4-23-1z" />
      <path d="M27 17l5-5M13 25l-3 5M23 25l4 5" />
      <circle cx="13" cy="20" r="1.5" class="mark-accent" />
    `,
    ape: `
      <circle cx="18" cy="14" r="8" />
      <path d="M10 24c5 4 11 4 16 0M9 15l-4 5M27 15l4 5" />
      <circle cx="15" cy="13" r="1.3" class="mark-accent" />
      <circle cx="21" cy="13" r="1.3" class="mark-accent" />
    `,
    tool: `
      <path d="M11 7l14 6-5 17-10-8z" />
      <path d="M14 12l8 4M12 20l8 5" />
    `,
    paint: `
      <path d="M8 25c5-9 14-15 23-17-2 9-8 17-18 22z" />
      <path d="M11 24l-4 5M18 18l5 5" />
    `,
    fire: `
      <path d="M18 31c-6-3-8-8-5-13 2-3 5-4 5-10 7 5 10 11 7 17-1 3-3 5-7 6z" />
      <path d="M18 28c-3-2-4-5-2-8 3 2 5 4 4 7" class="mark-accent" />
    `,
    grain: `
      <path d="M18 30V7" />
      <path d="M18 12c-5-1-8-4-9-8 5 1 8 4 9 8zM18 17c5-1 8-4 9-8-5 1-8 4-9 8zM18 22c-5-1-8-4-9-8 5 1 8 4 9 8z" />
    `,
    city: `
      <path d="M7 30V14l6-4 6 4v16M19 30V11l5-4 5 4v19" />
      <path d="M11 18h2M11 23h2M23 16h2M23 22h2" />
    `,
    book: `
      <path d="M7 9h10c2 0 3 1 3 3v20c0-2-1-3-3-3H7z" />
      <path d="M20 12c0-2 1-3 3-3h9v20h-9c-2 0-3 1-3 3" />
      <path d="M11 15h5M11 20h5M24 15h4M24 20h4" />
    `,
    machine: `
      <rect x="7" y="11" width="22" height="15" rx="3" />
      <path d="M12 30h12M18 26v4M11 16h7M11 21h12" />
      <circle cx="25" cy="17" r="1.7" class="mark-accent" />
    `,
    human: `
      <circle cx="18" cy="9" r="5" />
      <path d="M18 14v12M11 19h14M15 31l3-5 4 5" />
    `,
    ocean: `
      <path d="M5 24c3-3 6-3 9 0s6 3 9 0 6-3 9 0" />
      <path d="M6 17c4-4 8-4 12 0s8 4 12 0" />
      <circle cx="24" cy="10" r="3" class="mark-accent" />
    `,
    oxygen: `
      <circle cx="13" cy="18" r="6" />
      <circle cx="25" cy="18" r="6" />
      <path d="M18 18h2M9 8l3 4M28 8l-3 4M18 28v4" />
    `,
    animal: `
      <path d="M8 22c4-7 13-9 20-4 2 2 2 5 0 7-6 5-17 4-20-3z" />
      <path d="M13 25l-3 5M24 25l4 5M27 17l4-3" />
      <circle cx="13" cy="19" r="1.5" class="mark-accent" />
    `,
    flower: `
      <circle cx="18" cy="16" r="3" class="mark-accent" />
      <circle cx="18" cy="8" r="5" />
      <circle cx="26" cy="16" r="5" />
      <circle cx="18" cy="24" r="5" />
      <circle cx="10" cy="16" r="5" />
      <path d="M18 27v5M18 30c4-1 7-3 9-7" />
    `,
    mammal: `
      <path d="M8 23c4-8 15-10 23-3 2 4-1 8-7 9-8 1-15-1-16-6z" />
      <path d="M12 16l-3-6M18 15l1-7M14 27l-3 4M25 27l4 4" />
      <circle cx="13" cy="20" r="1.4" class="mark-accent" />
    `,
    monkey: `
      <circle cx="18" cy="15" r="7" />
      <circle cx="9" cy="16" r="4" />
      <circle cx="27" cy="16" r="4" />
      <path d="M14 22c3 3 7 3 10 0M12 29c5 3 11 3 16 0" />
      <circle cx="15" cy="14" r="1.3" class="mark-accent" />
      <circle cx="21" cy="14" r="1.3" class="mark-accent" />
    `,
    footprint: `
      <path d="M14 14c4-5 11-1 10 5-1 7-7 12-12 9-4-3-2-9 2-14z" />
      <circle cx="12" cy="8" r="2" class="mark-accent" />
      <circle cx="17" cy="6" r="2" class="mark-accent" />
      <circle cx="22" cy="8" r="2" class="mark-accent" />
    `,
    handaxe: `
      <path d="M18 5c8 6 10 17 0 30C8 22 10 11 18 5z" />
      <path d="M18 8v26M13 16l10-4M12 23l12-4" />
    `,
    torch: `
      <path d="M15 16c-2-4 1-7 3-11 5 4 8 8 5 14-2 4-7 4-8 1z" />
      <path d="M14 18h8l-3 13h-4z" />
      <path d="M18 18c-2-2-1-5 2-7" class="mark-accent" />
    `,
    family: `
      <circle cx="13" cy="10" r="4" />
      <circle cx="24" cy="11" r="4" />
      <circle cx="19" cy="20" r="3" class="mark-accent" />
      <path d="M13 14v13M24 15v12M19 23v7M8 21h10M21 21h8" />
    `,
    migration: `
      <path d="M7 25c6-8 13-12 22-12" />
      <path d="M24 8l6 5-6 5" />
      <circle cx="8" cy="26" r="2" class="mark-accent" />
      <circle cx="16" cy="18" r="2" class="mark-accent" />
    `,
    cave: `
      <path d="M6 30c1-12 6-20 12-24 7 4 11 12 12 24z" />
      <path d="M13 30v-8c0-4 10-4 10 0v8" />
      <path d="M13 15l5 3 5-3" />
    `,
    climate: `
      <path d="M7 23c4 3 8 3 12 0s8-3 12 0" />
      <path d="M11 10l3 5M21 8v7M29 10l-3 5" />
      <circle cx="11" cy="28" r="2" class="mark-accent" />
      <circle cx="24" cy="28" r="2" class="mark-accent" />
    `,
    village: `
      <path d="M7 18l8-7 8 7v12H7z" />
      <path d="M21 20l5-4 5 4v10h-8" />
      <path d="M12 30v-7h6v7M8 13h24" />
    `,
    bronze: `
      <path d="M18 6v24" />
      <path d="M10 14h16l-4 5h-8z" />
      <path d="M13 30h10M15 8h6" />
      <circle cx="18" cy="14" r="2" class="mark-accent" />
    `,
    empire: `
      <path d="M7 30h26M10 26V14M18 26V14M26 26V14" />
      <path d="M6 14l12-8 12 8z" />
      <path d="M12 30v-4h16v4" />
    `,
    print: `
      <path d="M9 9h18v10H9z" />
      <path d="M7 19h22v9H7z" />
      <path d="M11 28h14v4H11zM13 13h10M12 23h16" />
    `,
    factory: `
      <path d="M6 30V18l8 5v-5l8 5v-8h8v15z" />
      <path d="M22 15V8h6v7M10 27h2M17 27h2M24 27h2" />
      <path d="M9 11c2-4 5-4 7 0" />
    `,
    computer: `
      <rect x="7" y="8" width="22" height="16" rx="2" />
      <path d="M14 30h8M18 24v6M12 14h5M12 18h12" />
    `,
    radio: `
      <rect x="7" y="14" width="22" height="14" rx="3" />
      <path d="M12 14L25 6M12 20h8M12 24h6" />
      <circle cx="24" cy="22" r="3" class="mark-accent" />
    `,
    network: `
      <circle cx="18" cy="18" r="3" class="mark-accent" />
      <circle cx="8" cy="10" r="3" />
      <circle cx="29" cy="11" r="3" />
      <circle cx="10" cy="28" r="3" />
      <circle cx="29" cy="28" r="3" />
      <path d="M11 12l5 4M26 13l-6 4M12 26l5-5M27 26l-7-5" />
    `,
    phone: `
      <rect x="12" y="5" width="12" height="28" rx="3" />
      <path d="M16 9h4M17 29h2" />
    `,
    cloud: `
      <path d="M11 26c-4 0-6-3-5-7 1-3 4-5 8-4 2-5 10-5 12 1 4 0 7 3 7 7s-3 6-7 6H11z" />
      <path d="M14 21h14" />
    `,
    ai: `
      <rect x="9" y="9" width="18" height="18" rx="4" />
      <path d="M14 21l3-8h2l3 8M15 18h6M26 5v4M26 27v4M10 5v4M10 27v4M5 10h4M27 10h4M5 26h4M27 26h4" />
      <circle cx="18" cy="25" r="1.8" class="mark-accent" />
    `,
    worm: `
      <path d="M6 24c5-8 12-11 19-9 5 1 7 5 5 9-3 5-12 6-21 1" />
      <path d="M12 20l3 5M18 17l3 8M24 17l2 6" />
      <circle cx="10" cy="23" r="1.4" class="mark-accent" />
    `,
    slug: `
      <path d="M7 25c5-8 16-10 24-3 0 5-5 8-14 8H7z" />
      <path d="M13 18L9 10M17 17l2-8M9 10h-3M19 9h3" />
      <circle cx="9" cy="10" r="1.2" class="mark-accent" />
      <circle cx="19" cy="9" r="1.2" class="mark-accent" />
    `,
    insect: `
      <ellipse cx="18" cy="18" rx="5" ry="8" />
      <circle cx="18" cy="8" r="4" />
      <path d="M13 16L7 12M13 20L6 20M13 23L8 29M23 16l6-4M23 20h7M23 23l5 6M15 5l-3-4M21 5l3-4" />
    `,
    spider: `
      <circle cx="18" cy="18" r="5" />
      <ellipse cx="18" cy="25" rx="6" ry="5" />
      <path d="M13 17L6 12M13 20L5 20M14 23L7 28M23 17l7-5M23 20h8M22 23l7 5" />
      <circle cx="16" cy="16" r="1.2" class="mark-accent" />
      <circle cx="20" cy="16" r="1.2" class="mark-accent" />
    `,
    fish: `
      <path d="M6 19c7-7 17-7 25 0-8 7-18 7-25 0z" />
      <path d="M28 19l5-6v12zM16 19l5-6M16 19l5 6" />
      <circle cx="12" cy="17" r="1.3" class="mark-accent" />
    `,
    frog: `
      <ellipse cx="18" cy="20" rx="9" ry="7" />
      <circle cx="13" cy="13" r="4" />
      <circle cx="23" cy="13" r="4" />
      <path d="M11 24l-5 5M25 24l5 5M14 22c3 2 6 2 9 0" />
      <circle cx="13" cy="12" r="1.2" class="mark-accent" />
      <circle cx="23" cy="12" r="1.2" class="mark-accent" />
    `,
    bird: `
      <path d="M7 22c6-8 16-9 24-3-6 8-17 10-24 3z" />
      <path d="M24 18l7-5-2 8M15 23c-2 4-4 6-7 8M20 24l3 7" />
      <circle cx="12" cy="20" r="1.3" class="mark-accent" />
    `,
    exoskeleton: `
      <path d="M18 5c7 3 10 8 10 15 0 6-4 10-10 12C12 30 8 26 8 20c0-7 3-12 10-15z" />
      <path d="M18 6v25M10 17h16M12 24h12" />
    `,
    sixlegs: `
      <circle cx="18" cy="16" r="5" />
      <path d="M18 21v8M13 15L7 11M13 18L6 19M13 21L8 27M23 15l6-4M23 18l7 1M23 21l5 6" />
      <circle cx="18" cy="8" r="3" class="mark-accent" />
    `,
    wing: `
      <path d="M18 18C12 8 6 7 5 15c-1 7 6 10 13 3z" />
      <path d="M18 18c6-10 12-11 13-3 1 7-6 10-13 3z" />
      <path d="M18 18v12" />
    `,
    molt: `
      <path d="M10 12c5-6 14-6 19 0-4 5-14 5-19 0z" />
      <path d="M18 13v18M10 25c5 4 11 4 16 0" />
      <path d="M7 8l4 4M29 8l-4 4" />
    `,
    metamorphosis: `
      <path d="M6 24c4-5 8-6 12-3" />
      <path d="M18 21c4-9 10-12 15-8-2 7-7 11-15 8z" />
      <circle cx="9" cy="24" r="2" class="mark-accent" />
      <path d="M15 12h7M19 8v8" />
    `,
    beetle: `
      <ellipse cx="18" cy="20" rx="7" ry="9" />
      <path d="M18 11v18M11 18H7M25 18h4M12 23H7M24 23h5M14 11l-3-5M22 11l3-5" />
      <circle cx="18" cy="8" r="3" class="mark-accent" />
    `,
    mosquito: `
      <path d="M12 20h10M22 20l10-5" />
      <ellipse cx="17" cy="18" rx="4" ry="7" />
      <path d="M15 14L8 7M19 14l7-7M14 22l-6 6M20 22l6 6" />
      <circle cx="11" cy="20" r="2" class="mark-accent" />
    `,
    butterfly: `
      <path d="M18 18C12 7 5 8 6 17c1 7 7 8 12 1z" />
      <path d="M18 18c6-11 13-10 12-1-1 7-7 8-12 1z" />
      <path d="M18 18v12M15 8l-3-4M21 8l3-4" />
    `,
    ant: `
      <circle cx="10" cy="19" r="4" />
      <circle cx="18" cy="18" r="4" />
      <circle cx="26" cy="17" r="4" />
      <path d="M14 20L8 27M18 22v8M22 20l6 7M24 13l5-5M9 15L5 9" />
      <circle cx="28" cy="16" r="1.1" class="mark-accent" />
    `,
    child: `
      <circle cx="18" cy="9" r="5" />
      <path d="M18 14v10M12 18h12M15 30l3-6 4 6" />
      <path d="M10 8c3-4 6-5 8-5s5 1 8 5" class="mark-accent" />
    `,
  };

  return `
    <svg viewBox="0 0 36 36" aria-hidden="true">
      ${icons[kind] || icons.fork}
    </svg>
  `;
}

function timelineBands(deck, bands, className) {
  return bands.map((band) => timelineBand(deck, band, className, 5)).join("");
}

function timelineBand(deck, band, className, minLabelWidth) {
  const left = timelinePosition(deck, band.start);
  const right = timelinePosition(deck, band.end);
  const width = Math.max(1.2, right - left);
  const label = band.short || band.label;
  const title = band.full || band.label;

  return `
    <span class="${className}" title="${escapeHtml(title)}" style="left: ${left}%; width: ${width}%">
      ${width > minLabelWidth ? `<b>${escapeHtml(label)}</b>` : ""}
    </span>
  `;
}

function timelinePosition(deck, ma) {
  if (deck.scale === "log") {
    const start = Math.log(deck.range.start);
    const end = Math.log(deck.range.end);
    return Math.max(0, Math.min(100, ((start - Math.log(ma)) / (start - end)) * 100));
  }
  const span = deck.range.start - deck.range.end;
  return Math.max(0, Math.min(100, ((deck.range.start - ma) / span) * 100));
}

function formatMa(ma) {
  if (language === "en") {
    if (ma >= 1000) return `~${(ma / 1000).toFixed(1)} billion years ago`;
    if (ma >= 1) return `~${ma} million years ago`;
    if (ma >= 0.001) return `~${Math.round(ma * 1000).toLocaleString("en-US")} thousand years ago`;
    return `~${Math.round(ma * 1000000).toLocaleString("en-US")} years ago`;
  }
  if (ma >= 1000) return `~${(ma / 1000).toFixed(1).replace(".", ",")} млрд лет назад`;
  if (ma >= 1) return `~${ma} млн лет назад`;
  if (ma >= 0.001) return `~${Math.round(ma * 1000).toLocaleString("ru-RU")} тыс. лет назад`;
  return `~${Math.round(ma * 1000000).toLocaleString("ru-RU")} лет назад`;
}

function renderSchemeNav() {
  const deckButtons = decks
    .map(
      (deck, i) => `
        <button class="scheme-button ${section === "slides" && i === deckIndex ? "active" : ""}" type="button" data-deck="${i}" aria-pressed="${section === "slides" && i === deckIndex}">
          <span>${escapeHtml(deck.label)}</span>
        </button>
      `,
    )
    .join("");

  schemeNavNode.innerHTML = `
    ${deckButtons}
    <button class="scheme-button ${section === "games" ? "active" : ""}" type="button" data-section="games" aria-pressed="${section === "games"}">
      <span>${escapeHtml(t("Игры"))}</span>
    </button>
  `;
}

function setDeck(nextDeckIndex, nextSlideIndex = 0) {
  section = "slides";
  deckIndex = Math.max(0, Math.min(decks.length - 1, nextDeckIndex));
  index = Math.max(0, Math.min(decks[deckIndex].slides.length - 1, nextSlideIndex));
  updateSectionUrl();
  updatePresentationState();
  render();
}

function setGamesSection() {
  section = "games";
  updateSectionUrl();
  updatePresentationState();
  render();
}

function updateSectionUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  if (section === "games") {
    url.searchParams.set("section", "games");
  } else {
    url.searchParams.delete("section");
  }
  if (section === "games" && presentationMode) {
    url.searchParams.set("play", "full");
  } else {
    url.searchParams.delete("play");
  }
  window.history.replaceState({}, "", url);
}

function go(delta) {
  if (section === "games") return;
  const deck = decks[deckIndex];
  const next = index + delta;
  if (next < 0 && deckIndex > 0) {
    setDeck(deckIndex - 1, decks[deckIndex - 1].slides.length - 1);
    return;
  }
  if (next >= deck.slides.length && deckIndex < decks.length - 1) {
    setDeck(deckIndex + 1, 0);
    return;
  }
  index = Math.max(0, Math.min(deck.slides.length - 1, next));
  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

prevButton.addEventListener("click", () => go(-1));
nextButton.addEventListener("click", () => go(1));
schemeNavNode.addEventListener("click", (event) => {
  const sectionButton = event.target.closest("[data-section='games']");
  if (sectionButton) {
    setGamesSection();
    return;
  }

  const button = event.target.closest("[data-deck]");
  if (!button) return;
  setDeck(Number(button.dataset.deck), 0);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

slideNode.addEventListener("click", (event) => {
  if (suppressChainClick && event.target.closest("[data-chain-value]")) {
    event.preventDefault();
    return;
  }

  const modeButton = event.target.closest("[data-game-mode]");
  if (modeButton) {
    setGameMode(modeButton.dataset.gameMode);
    return;
  }

  const levelButton = event.target.closest("[data-game-level]");
  if (levelButton) {
    toggleGameLevel(levelButton.dataset.gameLevel);
    return;
  }

  const answerButton = event.target.closest("[data-game-answer]");
  if (answerButton) {
    chooseGameAnswer(answerButton.dataset.gameAnswer);
    return;
  }

  const chainButton = event.target.closest("[data-chain-item]");
  if (chainButton) {
    chooseChainItem(chainButton.dataset.chainItem);
    return;
  }

  const chainRemoveButton = event.target.closest("[data-chain-remove]");
  if (chainRemoveButton) {
    removeChainItem(Number(chainRemoveButton.dataset.chainRemove));
    return;
  }

  if (event.target.closest("[data-game-next]")) {
    nextGameQuestion();
    preferredGameFocus = gameModeId === "chain" ? ".chain-bank .chain-button" : ".game-answer";
    render();
    return;
  }

  if (event.target.closest("[data-game-fullscreen]")) {
    setPresentationMode(!presentationMode, true);
    return;
  }

  const button = event.target.closest("[data-slide]");
  if (!button) return;
  setDeck(deckIndex, Number(button.dataset.slide));
});

document.addEventListener("keydown", (event) => {
  if (section === "games") {
    if (event.key === "Escape") {
      event.preventDefault();
      setPresentationMode(false);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateGameFocus();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (!moveFocusedChainItem(-1)) moveGameFocus(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (!moveFocusedChainItem(1)) moveGameFocus(1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveGameFocus(-1);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveGameFocus(1);
      return;
    }
    if (event.key === "Backspace" || event.key === "Delete") {
      const active = document.activeElement?.closest("[data-chain-index]");
      if (active) {
        event.preventDefault();
        removeChainItem(Number(active.dataset.chainIndex));
      }
    }
    return;
  }
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    go(1);
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    go(-1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    setDeck(deckIndex, 0);
  }
  if (event.key === "End") {
    event.preventDefault();
    setDeck(deckIndex, decks[deckIndex].slides.length - 1);
  }
});

document.addEventListener("fullscreenchange", () => {
  if (presentationMode && !document.fullscreenElement) {
    setPresentationMode(false);
  }
});

slideNode.addEventListener("pointerdown", (event) => {
  const item = event.target.closest("[data-chain-value]");
  if (!item || currentGame?.result || event.button !== 0) return;
  chainPointerDrag = {
    value: item.dataset.chainValue,
    startX: event.clientX,
    startY: event.clientY,
    pointerId: event.pointerId,
    item,
    ghost: null,
    moved: false,
  };
  item.setPointerCapture?.(event.pointerId);
});

slideNode.addEventListener("pointermove", (event) => {
  if (!chainPointerDrag || chainPointerDrag.pointerId !== event.pointerId) return;
  const dx = event.clientX - chainPointerDrag.startX;
  const dy = event.clientY - chainPointerDrag.startY;
  if (!chainPointerDrag.moved && Math.hypot(dx, dy) < 6) return;

  event.preventDefault();
  chainPointerDrag.moved = true;
  ensureChainDragGhost(event);
  moveChainDragGhost(event);
  updateChainDropHighlight(event.clientX, event.clientY);
});

slideNode.addEventListener("pointerup", (event) => {
  finishChainPointerDrag(event);
});

slideNode.addEventListener("pointercancel", () => {
  clearChainPointerDrag();
});

slideNode.addEventListener("dragstart", (event) => {
  const item = event.target.closest("[data-chain-value]");
  if (!item || currentGame?.result) return;
  event.dataTransfer.setData("text/plain", item.dataset.chainValue);
  event.dataTransfer.effectAllowed = "move";
  item.classList.add("dragging");
});

slideNode.addEventListener("dragend", (event) => {
  event.target.closest("[data-chain-value]")?.classList.remove("dragging");
  slideNode.querySelectorAll(".drag-over").forEach((node) => node.classList.remove("drag-over"));
});

slideNode.addEventListener("dragover", (event) => {
  const dropTarget = event.target.closest("[data-chain-insert], [data-chain-drop]");
  if (!dropTarget || currentGame?.result) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  slideNode.querySelectorAll(".drag-over").forEach((node) => {
    if (node !== dropTarget) node.classList.remove("drag-over");
  });
  dropTarget.classList.add("drag-over");
});

slideNode.addEventListener("dragleave", (event) => {
  event.target.closest("[data-chain-insert], [data-chain-drop]")?.classList.remove("drag-over");
});

slideNode.addEventListener("drop", (event) => {
  const value = event.dataTransfer.getData("text/plain");
  if (!value || currentGame?.result) return;
  const insertTarget = event.target.closest("[data-chain-insert]");
  const bankTarget = event.target.closest("[data-chain-drop='bank']");
  if (!insertTarget && !bankTarget) return;

  event.preventDefault();
  slideNode.querySelectorAll(".drag-over").forEach((node) => node.classList.remove("drag-over"));

  if (bankTarget) {
    const previousIndex = chainSelection.indexOf(value);
    if (previousIndex !== -1) removeChainItem(previousIndex);
    return;
  }

  moveChainItem(value, Number(insertTarget.dataset.chainInsert));
});

function ensureChainDragGhost(event) {
  if (chainPointerDrag.ghost) return;
  const ghost = chainPointerDrag.item.cloneNode(true);
  ghost.classList.add("chain-drag-ghost");
  ghost.style.width = `${chainPointerDrag.item.getBoundingClientRect().width}px`;
  document.body.appendChild(ghost);
  chainPointerDrag.ghost = ghost;
  chainPointerDrag.item.classList.add("dragging");
  document.body.classList.add("chain-dragging");
  moveChainDragGhost(event);
}

function moveChainDragGhost(event) {
  if (!chainPointerDrag?.ghost) return;
  chainPointerDrag.ghost.style.transform = `translate(${event.clientX + 10}px, ${event.clientY + 10}px)`;
}

function finishChainPointerDrag(event) {
  if (!chainPointerDrag || chainPointerDrag.pointerId !== event.pointerId) return;
  const drag = chainPointerDrag;
  const moved = drag.moved;
  const target = moved ? chainDropTargetAt(event.clientX, event.clientY) : null;

  clearChainPointerDrag();

  if (!moved) return;
  event.preventDefault();
  suppressChainClick = true;
  window.setTimeout(() => {
    suppressChainClick = false;
  }, 0);

  if (!target) return;
  if (target.type === "bank") {
    const previousIndex = chainSelection.indexOf(drag.value);
    if (previousIndex !== -1) removeChainItem(previousIndex);
    return;
  }
  moveChainItem(drag.value, target.index);
}

function clearChainPointerDrag() {
  if (!chainPointerDrag) return;
  chainPointerDrag.item.classList.remove("dragging");
  chainPointerDrag.ghost?.remove();
  chainPointerDrag = null;
  document.body.classList.remove("chain-dragging");
  slideNode.querySelectorAll(".drag-over").forEach((node) => node.classList.remove("drag-over"));
}

function updateChainDropHighlight(x, y) {
  const target = chainDropTargetAt(x, y);
  slideNode.querySelectorAll(".drag-over").forEach((node) => node.classList.remove("drag-over"));
  target?.node.classList.add("drag-over");
}

function chainDropTargetAt(x, y) {
  const node = document.elementFromPoint(x, y);
  const insert = node?.closest("[data-chain-insert]");
  if (insert) return { type: "chain", index: Number(insert.dataset.chainInsert), node: insert };
  const bank = node?.closest("[data-chain-drop='bank']");
  if (bank) return { type: "bank", node: bank };
  const chain = node?.closest("[data-chain-drop='chain']");
  if (chain) return { type: "chain", index: chainSelection.length, node: chain };
  return null;
}

setLanguage(language);
