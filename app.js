const { decks } = window.EVOL_DATA;

const slideNode = document.getElementById("slide");
const schemeNavNode = document.getElementById("scheme-nav");
const currentNode = document.getElementById("current");
const totalNode = document.getElementById("total");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let deckIndex = 0;
let index = 0;

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
        ${infoGrid(slide)}
        ${successGrid(slide)}
      </div>
      <div class="stage ${slide.mainPhoto ? "has-main-photo" : ""} ${slide.mainPhoto?.silhouette ? "main-is-silhouette" : ""}">
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
  renderSchemeNav();
}

function infoGrid(slide) {
  const items = [
    ["Новшество", slide.novelty || slide.improvement],
    ["Основная ветка", slide.mainBranch || slide.caption],
    ["Боковая ветка", slide.sideBranch || slide.side],
    ["Что дало", slide.effect || slide.noveltyDescription || slide.subtitle],
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
    ["Основная", slide.success.main],
    ["Боковая", slide.success.side],
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

function timeline(deck, slide) {
  const dot = timelinePosition(deck, slide.timeMa);
  const eras = timelineBands(deck, deck.eras || [], "era-band");
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
    <div class="timeline" aria-label="Ось времени">
      <div class="timeline-head">
        <span>примерная точка разделения</span>
        <strong>${escapeHtml(slide.timeLabel || formatMa(slide.timeMa))}</strong>
      </div>
      <div class="era-row" aria-label="Эры">${eras}</div>
      <div class="period-row" aria-label="Периоды">${periods}</div>
      <div class="timeline-track">
        ${ticks}
        <span class="time-dot" style="left: ${dot}%"></span>
      </div>
    </div>
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
  return ma >= 1000 ? `~${(ma / 1000).toFixed(1)} млрд лет назад` : `~${ma} млн лет назад`;
}

function renderSchemeNav() {
  schemeNavNode.innerHTML = decks
    .map(
      (deck, i) => `
        <button class="scheme-button ${i === deckIndex ? "active" : ""}" type="button" data-deck="${i}" aria-pressed="${i === deckIndex}">
          <span>${escapeHtml(deck.label)}</span>
        </button>
      `,
    )
    .join("");
}

function setDeck(nextDeckIndex, nextSlideIndex = 0) {
  deckIndex = Math.max(0, Math.min(decks.length - 1, nextDeckIndex));
  index = Math.max(0, Math.min(decks[deckIndex].slides.length - 1, nextSlideIndex));
  render();
}

function go(delta) {
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
  const button = event.target.closest("[data-deck]");
  if (!button) return;
  setDeck(Number(button.dataset.deck), 0);
});

document.addEventListener("keydown", (event) => {
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

render();
