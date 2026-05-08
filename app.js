const slides = [
  {
    kicker: "Старт большой линии",
    title: "Клетка с ядром",
    subtitle: "Среди бактерий и архей появляется эукариотическая клетка: внутри есть ядро и маленькие энергетические станции.",
    improvement: "ядро + органеллы",
    side: "Рядом остались бактерии и археи: маленькие, древние и очень успешные.",
    caption: "Главный герой: эукариотическая клетка",
    scene: "cell",
    colors: ["#e9f2da", "#f3dfc2"],
  },
  {
    kicker: "Растения / грибы / животные",
    title: "Животная ветка",
    subtitle: "Наша линия выбирает быть животными: искать еду, двигаться и чувствовать мир вокруг.",
    improvement: "движение + чувства",
    side: "Растения кормятся светом. Грибы растут нитями и всасывают готовую пищу.",
    caption: "Представитель: простое морское животное",
    scene: "sponge",
    colors: ["#cfe8e1", "#f6d9b8"],
  },
  {
    kicker: "Первичноротые / вторичноротые",
    title: "Новый план зародыша",
    subtitle: "У вторичноротых тело собирается по плану, из которого позже выйдут иглокожие, хордовые и мы.",
    improvement: "другой план развития",
    side: "Первичноротые дали насекомых, пауков, улиток, осьминогов и множество других животных.",
    caption: "Представитель: морская звезда",
    scene: "starfish",
    colors: ["#d7eef3", "#f7cfbf"],
  },
  {
    kicker: "Членистоногие и моллюски / линия к хордовым",
    title: "Вдоль тела появляется струна",
    subtitle: "У хордовых возникает хорда: упругая внутренняя опора вдоль спины, рядом с нервной трубкой.",
    improvement: "хорда",
    side: "В стороне сияют панцири членистоногих и раковины моллюсков.",
    caption: "Представитель: ланцетник",
    scene: "lancelet",
    colors: ["#dbeed2", "#c7dfef"],
  },
  {
    kicker: "Бесчерепные / черепные",
    title: "Появляется черепушка",
    subtitle: "Передний конец тела получает защиту для мозга и органов чувств. Голова становится важным центром.",
    improvement: "череп",
    side: "Бесчерепные вроде ланцетника остаются простыми хордовыми без настоящей головы.",
    caption: "Представитель: раннее черепное",
    scene: "craniate",
    colors: ["#f0dfc6", "#c9e4e2"],
  },
  {
    kicker: "Бесчелюстные / челюстноротые",
    title: "Появляются челюсти",
    subtitle: "Рот становится хватательным. Можно кусать, удерживать добычу и есть более разнообразную пищу.",
    improvement: "челюсти",
    side: "Бесчелюстные линии похожи на миног: рот есть, но настоящих челюстей нет.",
    caption: "Представитель: древняя челюстная рыба",
    scene: "jawfish",
    colors: ["#d6edf1", "#f2e0b5"],
  },
  {
    kicker: "Хрящевые / костные позвоночные",
    title: "Костная линия",
    subtitle: "Наша ветка идет через костных позвоночных: внутри появляется прочная костная опора.",
    improvement: "кости",
    side: "Акулы и скаты остались на хрящевой стороне: гибкие, быстрые и очень удачные.",
    caption: "Представитель: костная рыба",
    scene: "bonyfish",
    colors: ["#cce7f2", "#efe0a9"],
  },
  {
    kicker: "Лучеперые / лопастеперые",
    title: "Плавники на мясистых лопастях",
    subtitle: "Лопастеперые получают плавники с внутренними костями. Это будущая основа для конечностей.",
    improvement: "плавник с костями внутри",
    side: "Лучеперые рыбы стали самой многочисленной рыбной веткой в современных морях и реках.",
    caption: "Представитель: латимерия",
    scene: "coelacanth",
    colors: ["#d0e2f0", "#cfe5c7"],
  },
  {
    kicker: "Водные лопастеперые / четвероногие",
    title: "Первые шаги на мелководье",
    subtitle: "У четвероногих плавники превращаются в конечности. Тело уже может опираться на дно.",
    improvement: "четыре конечности",
    side: "Часть лопастеперых осталась в воде и продолжила рыбную жизнь.",
    caption: "Представитель: тиктаалик",
    scene: "tiktaalik",
    colors: ["#d9e7cc", "#d8edf0"],
  },
  {
    kicker: "Амфибийная линия / амниоты",
    title: "Яйцо с защитой",
    subtitle: "Амниоты получают яйцо и оболочки для зародыша. Размножение меньше зависит от воды.",
    improvement: "амниотическое яйцо",
    side: "Амфибии по-прежнему крепко связаны с водой и влажными местами.",
    caption: "Представитель: ранний амниот",
    scene: "amniote",
    colors: ["#f1dfb8", "#d4ead3"],
  },
  {
    kicker: "Синапсиды / завропсиды",
    title: "Ветка к млекопитающим",
    subtitle: "Синапсиды постепенно усиливают челюсть, меняют зубы и идут к шерсти, теплу и молоку.",
    improvement: "разные зубы + теплокровность",
    side: "Завропсиды дадут ящериц, змей, крокодилов, динозавров и птиц.",
    caption: "Представитель: цинодонт",
    scene: "cynodont",
    colors: ["#eadfca", "#cfe3d8"],
  },
  {
    kicker: "Боковая ветка: завропсиды",
    title: "Архозавры отделяются",
    subtitle: "В завропсидной стороне архозавры получают более вертикальную стойку ног и мощный шаг.",
    improvement: "ноги под телом",
    side: "Лепидозавры идут к ящерицам, змеям и гаттерии.",
    caption: "Представитель: ранний архозавр",
    scene: "archosaur",
    colors: ["#d5ead0", "#efdab7"],
  },
  {
    kicker: "Псевдозухии / птичья линия архозавров",
    title: "Линия к динозаврам",
    subtitle: "Одна архозавровая ветка ведет к крокодилам, другая к птерозаврам, динозаврам и птицам.",
    improvement: "легкий быстрый скелет",
    side: "Псевдозухии включают крокодилью линию и их древних родственников.",
    caption: "Представитель: ранний динозавроморф",
    scene: "dinoform",
    colors: ["#e8d7bd", "#c9e6e0"],
  },
  {
    kicker: "Птицетазовые / ящеротазовые динозавры",
    title: "Динозавры расходятся",
    subtitle: "Птицетазовые дают стегозавров, трицератопсов и утконосых. Ящеротазовые ведут к завроподам, тероподам и птицам.",
    improvement: "новые типы таза и ходьбы",
    side: "Птицы сидят внутри теропод: это живые динозавры.",
    caption: "Представитель: маленький теропод",
    scene: "theropod",
    colors: ["#f0d2bd", "#d3e6f0"],
  },
  {
    kicker: "Финал",
    title: "Развилки остаются рядом",
    subtitle: "Эволюция не лестница. На каждой развилке одна линия идет дальше в нашем рассказе, а соседние линии живут своей успешной жизнью.",
    improvement: "родство вместо лестницы",
    side: "Для малыша можно повторять: новое не делает старое плохим, оно просто открывает другой путь.",
    caption: "Главный герой: большое древо жизни",
    scene: "tree",
    colors: ["#dfe8c7", "#d7e2ef"],
  },
];

const slideNode = document.getElementById("slide");
const currentNode = document.getElementById("current");
const totalNode = document.getElementById("total");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let index = 0;
totalNode.textContent = slides.length;

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
    cynodont: `
      <path d="M130 321c92-106 266-134 391-69 73 38 81 115 17 160-129 91-317 56-408-91z" fill="#a87955" class="outline"/>
      <path d="M168 307c62-48 137-66 224-54" class="bone"/>
      <circle cx="230" cy="278" r="14" class="eye"/>
      <path d="M193 228l-48-55M248 217l-18-68" class="thin"/>
      <path d="M273 363l-55 78M450 370l54 85" class="thin"/>
      <path d="M205 444h77M489 456h81" class="thin"/>
      <path d="M262 329c33 23 73 24 121 5" class="thin"/>
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
  const slide = slides[index];
  slideNode.style.setProperty("--bg-a", slide.colors[0]);
  slideNode.style.setProperty("--bg-b", slide.colors[1]);

  slideNode.innerHTML = `
    <article class="slide">
      <div class="copy">
        <div class="kicker">${escapeHtml(slide.kicker)}</div>
        <h1 class="title">${escapeHtml(slide.title)}</h1>
        <p class="subtitle">${escapeHtml(slide.subtitle)}</p>
        <div class="fact-row">
          <div class="fact"><strong>Новшество</strong> ${escapeHtml(slide.improvement)}</div>
        </div>
        <div class="side-note">${escapeHtml(slide.side)}</div>
      </div>
      <div class="stage">
        ${iconSvg(slide.scene, slide.caption)}
        <div class="caption">${escapeHtml(slide.caption)}</div>
      </div>
    </article>
  `;

  currentNode.textContent = String(index + 1);
  prevButton.disabled = index === 0;
  nextButton.disabled = index === slides.length - 1;
}

function go(delta) {
  index = Math.max(0, Math.min(slides.length - 1, index + delta));
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
    index = 0;
    render();
  }
  if (event.key === "End") {
    event.preventDefault();
    index = slides.length - 1;
    render();
  }
});

render();
