
const REVIEW_URL = "https://addons.mozilla.org/en-US/firefox/addon/chessbot/reviews/";
const WRAPPED_URL = "wrapped.html";
const SHARE_URL = "https://addons.mozilla.org/en-US/firefox/addon/chessbot/";

const translations = {
    "en-US": {
        nativeName: "English (US)",
        title: "ChessBot updated!",
        versionLabel: "Version",
        devIntro: `Hi! I am the developer of ChessBot, Bora. If you enjoy ChessBot, please <a href="${REVIEW_URL}">rate our extension</a>. It takes less than a minute, and helps me a lot 😊`,
        changelogLabel: "Changelog",
        item1: `♟ <a class="rainbow" href="${WRAPPED_URL}">Chess Wrapped is out</a>! Click it to see your beautiful stats!`,
        item2: "🎨 Small design updates",
        item3: "🐛 Bugs smashed",
        suggestionsLabel: "Suggestions",
        suggestionsText: `Do you have an 🤩 awesome idea? <a href="${SHARE_URL}">Share it</a> with us, maybe we will add it to the next ChessBot version.`,
        seeYouLabel: "See you next time",
        farewellText: "🏖️ Have fun, gain some elo, touch grass. And, don't cheat :-(",
        footer: "Translated into 🇺🇸 for you ❤️"
    },
    "en-GB": {
        nativeName: "English (British)",
        title: "ChessBot updated!",
        versionLabel: "Version",
        devIntro: `Hi! I am the developer of ChessBot, Bora. If you enjoy ChessBot, please <a href="${REVIEW_URL}">rate our extension</a>. It takes less than a minute, and helps me a lot 😊`,
        changelogLabel: "Changelog",
        item1: `♟ <a class="rainbow" href="${WRAPPED_URL}">Chess Wrapped is out</a>! Click it to see your beautiful stats!`,
        item2: "🎨 Small design updates",
        item3: "🐛 Bugs squashed",
        suggestionsLabel: "Suggestions",
        suggestionsText: `Do you have a 🤩 brilliant idea? <a href="${SHARE_URL}">Share it</a> with us, maybe we'll add it to the next ChessBot version.`,
        seeYouLabel: "See you next time",
        farewellText: "🏖️ Have fun, gain some elo, get some fresh air. And don't cheat :-(",
        footer: "Translated into 🇬🇧 for you ❤️"
    },
    "ru": {
        nativeName: "Русский",
        title: "ChessBot обновлён!",
        versionLabel: "Версия",
        devIntro: `Привет! Я разработчик ChessBot, Бора. Если вам нравится ChessBot, пожалуйста, <a href="${REVIEW_URL}">оцените наше расширение</a>. Это займёт меньше минуты и очень мне поможет 😊`,
        changelogLabel: "Список изменений",
        item1: `♟ <a class="rainbow" href="${WRAPPED_URL}">Chess Wrapped уже доступен</a>! Нажмите, чтобы посмотреть свою красивую статистику!`,
        item2: "🎨 Небольшие изменения дизайна",
        item3: "🐛 Исправлены ошибки",
        suggestionsLabel: "Предложения",
        suggestionsText: `Есть 🤩 отличная идея? <a href="${SHARE_URL}">Поделитесь ею</a> с нами — возможно, мы добавим её в следующую версию ChessBot.`,
        seeYouLabel: "До встречи",
        farewellText: "🏖️ Получайте удовольствие, повышайте свой рейтинг, выходите на свежий воздух. И не читерите :-(",
        footer: "Переведено на 🇷🇺 специально для вас ❤️"
    },
    "de": {
        nativeName: "Deutsch",
        title: "ChessBot aktualisiert!",
        versionLabel: "Version",
        devIntro: `Hallo! Ich bin Bora, der Entwickler von ChessBot. Wenn dir ChessBot gefällt, <a href="${REVIEW_URL}">bewerte bitte unsere Erweiterung</a>. Das dauert weniger als eine Minute und hilft mir sehr 😊`,
        changelogLabel: "Änderungsprotokoll",
        item1: `♟ <a class="rainbow" href="${WRAPPED_URL}">Chess Wrapped ist da</a>! Klicke darauf, um deine tollen Statistiken anzusehen!`,
        item2: "🎨 Kleine Design-Updates",
        item3: "🐛 Fehler behoben",
        suggestionsLabel: "Vorschläge",
        suggestionsText: `Hast du eine 🤩 großartige Idee? <a href="${SHARE_URL}">Teile sie</a> mit uns, vielleicht nehmen wir sie in die nächste ChessBot-Version auf.`,
        seeYouLabel: "Bis zum nächsten Mal",
        farewellText: "🏖️ Viel Spaß, sammle Elo-Punkte und geh mal an die frische Luft. Und bitte nicht schummeln :-(",
        footer: "Für dich ins Deutsche übersetzt 🇩🇪 ❤️"
    },
    "fr": {
        nativeName: "Français",
        title: "ChessBot mis à jour !",
        versionLabel: "Version",
        devIntro: `Salut ! Je suis Bora, le développeur de ChessBot. Si vous aimez ChessBot, merci de <a href="${REVIEW_URL}">noter notre extension</a>. Cela prend moins d'une minute et m'aide énormément 😊`,
        changelogLabel: "Journal des modifications",
        item1: `♟ <a class="rainbow" href="${WRAPPED_URL}">Chess Wrapped est disponible</a> ! Cliquez pour découvrir vos magnifiques statistiques !`,
        item2: "🎨 Petites améliorations du design",
        item3: "🐛 Bugs corrigés",
        suggestionsLabel: "Suggestions",
        suggestionsText: `Vous avez une 🤩 idée géniale ? <a href="${SHARE_URL}">Partagez-la</a> avec nous, nous l'ajouterons peut-être à la prochaine version de ChessBot.`,
        seeYouLabel: "À la prochaine",
        farewellText: "🏖️ Amusez-vous, gagnez de l'elo et prenez l'air. Et ne trichez pas :-(",
        footer: "Traduit en français pour vous 🇫🇷 ❤️"
    },
    "tr": {
        nativeName: "Türkçe",
        title: "ChessBot güncellendi!",
        versionLabel: "Sürüm",
        devIntro: `Selam! Ben ChessBot'un geliştiricisi Bora. ChessBot'tan keyif alıyorsan lütfen <a href="${REVIEW_URL}">eklentimizi değerlendir</a>. Bir dakikadan az sürer ve bana çok yardımcı olur 😊`,
        changelogLabel: "Değişiklik günlüğü",
        item1: `♟ <a class="rainbow" href="${WRAPPED_URL}">Chess Wrapped yayında</a>! Harika istatistiklerini görmek için tıkla!`,
        item2: "🎨 Küçük tasarım güncellemeleri",
        item3: "🐛 Hatalar giderildi",
        suggestionsLabel: "Öneriler",
        suggestionsText: `🤩 Harika bir fikrin mi var? Bizimle <a href="${SHARE_URL}">paylaş</a>, belki bir sonraki ChessBot sürümüne ekleriz.`,
        seeYouLabel: "Bir dahaki sefere görüşürüz",
        farewellText: "🏖️ İyi eğlenceler, biraz elo kas, biraz da çimene dokun. Ve hile yapma :-(",
        footer: "Senin için 🇹🇷 diline çevrildi ❤️"
    },
    "pl": {
        nativeName: "Polski",
        title: "ChessBot zaktualizowany!",
        versionLabel: "Wersja",
        devIntro: `Cześć! Jestem twórcą ChessBota, Bora. Jeśli podoba Ci się ChessBot, <a href="${REVIEW_URL}">oceń nasze rozszerzenie</a>. Zajmie to mniej niż minutę i bardzo mi pomoże 😊`,
        changelogLabel: "Lista zmian",
        item1: `♟ <a class="rainbow" href="${WRAPPED_URL}">Chess Wrapped jest już dostępny</a>! Kliknij, aby zobaczyć swoje piękne statystyki!`,
        item2: "🎨 Drobne zmiany w wyglądzie",
        item3: "🐛 Naprawiono błędy",
        suggestionsLabel: "Sugestie",
        suggestionsText: `Masz 🤩 świetny pomysł? <a href="${SHARE_URL}">Podziel się nim</a> z nami, może dodamy go do kolejnej wersji ChessBota.`,
        seeYouLabel: "Do zobaczenia następnym razem",
        farewellText: "🏖️ Baw się dobrze, zdobywaj elo i wyjdź na świeże powietrze. I nie oszukuj :-(",
        footer: "Przetłumaczone na polski specjalnie dla Ciebie 🇵🇱 ❤️"
    }
};

const SUPPORTED = Object.keys(translations);
const DEFAULT_LANG = "en-US";

function pickInitialLang() {
    const browserLangs = navigator.languages || [navigator.language || DEFAULT_LANG];
    for (const bl of browserLangs) {
        const exact = SUPPORTED.find(l => l.toLowerCase() === bl.toLowerCase());
        if (exact) return exact;
    }
    // fall back to matching just the base subtag (e.g. "de-AT" -> "de", "en-CA" -> "en-US")
    for (const bl of browserLangs) {
        const base = bl.split("-")[0].toLowerCase();
        const match = SUPPORTED.find(l => l.split("-")[0].toLowerCase() === base);
        if (match) return match;
    }
    return DEFAULT_LANG;
}

function applyLang(lang) {
    const t = translations[lang] || translations[DEFAULT_LANG];
    document.title = t.title;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key] !== undefined) el.innerHTML = t[key];
    });
    const select = document.getElementById("lang-select");
    if (select.value !== lang) select.value = lang;
}

function buildSelect() {
    const select = document.getElementById("lang-select");
    SUPPORTED.forEach(lang => {
        const opt = document.createElement("option");
        opt.value = lang;
        opt.textContent = translations[lang].nativeName;
        select.appendChild(opt);
    });
    select.addEventListener("change", () => applyLang(select.value));
}

buildSelect();
applyLang(pickInitialLang());