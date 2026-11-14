const API_BASE = "https://example.invalid"; // analytics backend removed in this fork
const STORAGE_INSTALL_ID_KEY = "umbraInstallId";
const STORY_MS = 6500;

// Placeholders in {braces} are filled in by fmt(). Labels avoid count-dependent nouns so they read
// correctly in every language; units (hours, years) go through Intl, which handles plurals.
const translations = {
    "en-US": {
        nativeName: "English (US)",
        title: "ChessBot Wrapped 🎁",
        loading: "🎁 Unwrapping your stats…",
        notFound: "♟️ No games yet! Play a few games with ChessBot and come back.",
        closed: "👋 ChessBot Wrapped is over. See you next time!",
        error: "😢 Couldn't load your stats. Please try again later.",
        hint: "👆 Tap right for next, left for back · hold to pause",
        replay: "🔁 Watch again",
        gamesLabel: "🎮 Games played with ChessBot",
        bullet: "Bullet", blitz: "Blitz", rapid: "Rapid",
        favoriteTc: "Your favorite is {tc}!",
        footAvid: "🔥 You're an avid ChessBot fan!",
        footAverage: "😐 Your stats are... average.",
        footPlayMore: "🐌 Play more chess!",
        winsLabel: "🏆 Games won",
        winsSub: "…and how you won them",
        noWins: "No wins yet, but your comeback starts now 💪",
        checkmate: "♚ Checkmate", resignation: "🏳️ Resignation", timeout: "⏰ Timeout",
        abandonment: "🏃 Abandonment", draw: "🤝 Draw", unknown: "❓ Other",
        timeLabel: "⏳ Approx. time spent with ChessBot",
        timeSub: "Movies you could've watched instead: {n} 🍿",
        eloLabel: "📊 Your average Elo with ChessBot",
        eloSub: "at an average depth of {d} 🧠",
        latestLabel: "📅 Your latest ChessBot game",
        openingLabel: "♟️ Your favorite opening",
        praise: ["Brilliant!", "Iconic!", "Bold!", "Classy!"],
        ageLabel: "🎂 Your chess age",
        ageYoung: "⚡ Fast, fearless and full of energy!",
        ageMid: "⚖️ Perfectly balanced, as all things should be.",
        ageOld: "🧙 Wise, patient and calculating.",
        predictedLabel: "🔮 Your predicted Elo",
        predictedSub: "Keep climbing! 📈",
        final: "You may have had lots of blunders {blunder}, but you're a brilliant {brilliant} person.",
        finalThanks: "Thanks for playing with ChessBot ❤️",
        footer: "Translated into 🇺🇸 for you ❤️"
    },
    "en-GB": {
        nativeName: "English (British)",
        title: "ChessBot Wrapped 🎁",
        loading: "🎁 Unwrapping your stats…",
        notFound: "♟️ No games yet! Play a few games with ChessBot and come back.",
        closed: "👋 ChessBot Wrapped is over. See you next time!",
        error: "😢 Couldn't load your stats. Please try again later.",
        hint: "👆 Tap right for next, left for back · hold to pause",
        replay: "🔁 Watch again",
        gamesLabel: "🎮 Games played with ChessBot",
        bullet: "Bullet", blitz: "Blitz", rapid: "Rapid",
        favoriteTc: "Your favourite is {tc}!",
        footAvid: "🔥 You're an avid ChessBot fan!",
        footAverage: "😐 Your stats are... average.",
        footPlayMore: "🐌 Play more chess!",
        winsLabel: "🏆 Games won",
        winsSub: "…and how you won them",
        noWins: "No wins yet, but your comeback starts now 💪",
        checkmate: "♚ Checkmate", resignation: "🏳️ Resignation", timeout: "⏰ Timeout",
        abandonment: "🏃 Abandonment", draw: "🤝 Draw", unknown: "❓ Other",
        timeLabel: "⏳ Approx. time spent with ChessBot",
        timeSub: "Films you could've watched instead: {n} 🍿",
        eloLabel: "📊 Your average Elo with ChessBot",
        eloSub: "at an average depth of {d} 🧠",
        latestLabel: "📅 Your latest ChessBot game",
        openingLabel: "♟️ Your favourite opening",
        praise: ["Brilliant!", "Iconic!", "Bold!", "Splendid!"],
        ageLabel: "🎂 Your chess age",
        ageYoung: "⚡ Fast, fearless and full of energy!",
        ageMid: "⚖️ Perfectly balanced, as all things should be.",
        ageOld: "🧙 Wise, patient and calculating.",
        predictedLabel: "🔮 Your predicted Elo",
        predictedSub: "Keep climbing! 📈",
        final: "You may have had lots of blunders {blunder}, but you're a brilliant {brilliant} person.",
        finalThanks: "Cheers for playing with ChessBot ❤️",
        footer: "Translated into 🇬🇧 for you ❤️"
    },
    "ru": {
        nativeName: "Русский",
        title: "ChessBot Wrapped 🎁",
        loading: "🎁 Распаковываем вашу статистику…",
        notFound: "♟️ Пока нет партий! Сыграйте несколько партий с ChessBot и возвращайтесь.",
        closed: "👋 ChessBot Wrapped завершён. До встречи!",
        error: "😢 Не удалось загрузить статистику. Попробуйте позже.",
        hint: "👆 Нажмите справа — дальше, слева — назад · удерживайте для паузы",
        replay: "🔁 Посмотреть снова",
        gamesLabel: "🎮 Сыграно партий с ChessBot",
        bullet: "Пуля", blitz: "Блиц", rapid: "Рапид",
        favoriteTc: "Ваш любимый контроль — {tc}!",
        footAvid: "🔥 Вы настоящий фанат ChessBot!",
        footAverage: "😐 Ваша статистика... средняя.",
        footPlayMore: "🐌 Играйте больше!",
        winsLabel: "🏆 Победы",
        winsSub: "…и как вы их добились",
        noWins: "Побед пока нет, но ваш камбэк начинается сейчас 💪",
        checkmate: "♚ Мат", resignation: "🏳️ Сдача", timeout: "⏰ Время",
        abandonment: "🏃 Уход из игры", draw: "🤝 Ничья", unknown: "❓ Другое",
        timeLabel: "⏳ Примерное время с ChessBot",
        timeSub: "Фильмов, которые можно было посмотреть: {n} 🍿",
        eloLabel: "📊 Ваш средний рейтинг Эло с ChessBot",
        eloSub: "при средней глубине {d} 🧠",
        latestLabel: "📅 Ваша последняя партия с ChessBot",
        openingLabel: "♟️ Ваш любимый дебют",
        praise: ["Блестяще!", "Легендарно!", "Смело!", "Стильно!"],
        ageLabel: "🎂 Ваш шахматный возраст",
        ageYoung: "⚡ Быстрый, бесстрашный и полный энергии!",
        ageMid: "⚖️ Идеальный баланс, как и должно быть.",
        ageOld: "🧙 Мудрый, терпеливый и расчётливый.",
        predictedLabel: "🔮 Ваш прогнозируемый рейтинг",
        predictedSub: "Продолжайте расти! 📈",
        final: "Возможно, у вас было много зевков {blunder}, но вы блестящий {brilliant} человек.",
        finalThanks: "Спасибо, что играете с ChessBot ❤️",
        footer: "Переведено на 🇷🇺 специально для вас ❤️"
    },
    "de": {
        nativeName: "Deutsch",
        title: "ChessBot Wrapped 🎁",
        loading: "🎁 Deine Statistiken werden ausgepackt…",
        notFound: "♟️ Noch keine Partien! Spiel ein paar Partien mit ChessBot und komm wieder.",
        closed: "👋 ChessBot Wrapped ist vorbei. Bis zum nächsten Mal!",
        error: "😢 Deine Statistiken konnten nicht geladen werden. Bitte versuch es später erneut.",
        hint: "👆 Rechts tippen für weiter, links für zurück · gedrückt halten zum Pausieren",
        replay: "🔁 Nochmal ansehen",
        gamesLabel: "🎮 Partien mit ChessBot gespielt",
        bullet: "Bullet", blitz: "Blitz", rapid: "Schnellschach",
        favoriteTc: "Dein Favorit ist {tc}!",
        footAvid: "🔥 Du bist ein echter ChessBot-Fan!",
        footAverage: "😐 Deine Statistiken sind... durchschnittlich.",
        footPlayMore: "🐌 Spiel mehr Schach!",
        winsLabel: "🏆 Gewonnene Partien",
        winsSub: "…und wie du sie gewonnen hast",
        noWins: "Noch keine Siege, aber dein Comeback beginnt jetzt 💪",
        checkmate: "♚ Schachmatt", resignation: "🏳️ Aufgabe", timeout: "⏰ Zeitüberschreitung",
        abandonment: "🏃 Spielabbruch", draw: "🤝 Remis", unknown: "❓ Sonstiges",
        timeLabel: "⏳ Ungefähre Zeit mit ChessBot",
        timeSub: "Filme, die du stattdessen hättest schauen können: {n} 🍿",
        eloLabel: "📊 Deine durchschnittliche Elo mit ChessBot",
        eloSub: "bei einer durchschnittlichen Tiefe von {d} 🧠",
        latestLabel: "📅 Deine letzte ChessBot-Partie",
        openingLabel: "♟️ Deine Lieblingseröffnung",
        praise: ["Brillant!", "Legendär!", "Mutig!", "Stilvoll!"],
        ageLabel: "🎂 Dein Schachalter",
        ageYoung: "⚡ Schnell, furchtlos und voller Energie!",
        ageMid: "⚖️ Perfekt ausbalanciert, wie alles sein sollte.",
        ageOld: "🧙 Weise, geduldig und berechnend.",
        predictedLabel: "🔮 Deine vorhergesagte Elo",
        predictedSub: "Weiter so! 📈",
        final: "Du hattest vielleicht viele Patzer {blunder}, aber du bist ein brillanter {brilliant} Mensch.",
        finalThanks: "Danke, dass du mit ChessBot spielst ❤️",
        footer: "Für dich ins Deutsche übersetzt 🇩🇪 ❤️"
    },
    "fr": {
        nativeName: "Français",
        title: "ChessBot Wrapped 🎁",
        loading: "🎁 Déballage de vos statistiques…",
        notFound: "♟️ Pas encore de parties ! Jouez quelques parties avec ChessBot et revenez.",
        closed: "👋 ChessBot Wrapped est terminé. À la prochaine !",
        error: "😢 Impossible de charger vos statistiques. Réessayez plus tard.",
        hint: "👆 Touchez à droite pour avancer, à gauche pour revenir · maintenez pour mettre en pause",
        replay: "🔁 Revoir",
        gamesLabel: "🎮 Parties jouées avec ChessBot",
        bullet: "Bullet", blitz: "Blitz", rapid: "Rapide",
        favoriteTc: "Votre préféré : {tc} !",
        footAvid: "🔥 Vous êtes un vrai fan de ChessBot !",
        footAverage: "😐 Vos statistiques sont... moyennes.",
        footPlayMore: "🐌 Jouez plus aux échecs !",
        winsLabel: "🏆 Parties gagnées",
        winsSub: "…et comment vous les avez gagnées",
        noWins: "Pas encore de victoire, mais votre remontée commence maintenant 💪",
        checkmate: "♚ Échec et mat", resignation: "🏳️ Abandon", timeout: "⏰ Temps écoulé",
        abandonment: "🏃 Partie quittée", draw: "🤝 Nulle", unknown: "❓ Autre",
        timeLabel: "⏳ Temps approximatif passé avec ChessBot",
        timeSub: "Films que vous auriez pu regarder à la place : {n} 🍿",
        eloLabel: "📊 Votre Elo moyen avec ChessBot",
        eloSub: "à une profondeur moyenne de {d} 🧠",
        latestLabel: "📅 Votre dernière partie avec ChessBot",
        openingLabel: "♟️ Votre ouverture préférée",
        praise: ["Brillant !", "Légendaire !", "Audacieux !", "Élégant !"],
        ageLabel: "🎂 Votre âge aux échecs",
        ageYoung: "⚡ Rapide, intrépide et plein d'énergie !",
        ageMid: "⚖️ Parfaitement équilibré, comme tout devrait l'être.",
        ageOld: "🧙 Sage, patient et calculateur.",
        predictedLabel: "🔮 Votre Elo prévu",
        predictedSub: "Continuez à grimper ! 📈",
        final: "Vous avez peut-être fait beaucoup de gaffes {blunder}, mais vous êtes une personne brillante {brilliant}.",
        finalThanks: "Merci de jouer avec ChessBot ❤️",
        footer: "Traduit en français pour vous 🇫🇷 ❤️"
    },
    "tr": {
        nativeName: "Türkçe",
        title: "ChessBot Wrapped 🎁",
        loading: "🎁 İstatistiklerin açılıyor…",
        notFound: "♟️ Henüz oyun yok! ChessBot ile birkaç oyun oyna ve geri gel.",
        closed: "👋 ChessBot Wrapped sona erdi. Bir dahaki sefere görüşürüz!",
        error: "😢 İstatistiklerin yüklenemedi. Lütfen daha sonra tekrar dene.",
        hint: "👆 İleri için sağa, geri için sola dokun · duraklatmak için basılı tut",
        replay: "🔁 Tekrar izle",
        gamesLabel: "🎮 ChessBot ile oynanan oyunlar",
        bullet: "Bullet", blitz: "Blitz", rapid: "Rapid",
        favoriteTc: "Favorin: {tc}!",
        footAvid: "🔥 Tam bir ChessBot hayranısın!",
        footAverage: "😐 İstatistiklerin... ortalama.",
        footPlayMore: "🐌 Daha çok satranç oyna!",
        winsLabel: "🏆 Kazanılan oyunlar",
        winsSub: "…ve onları nasıl kazandığın",
        noWins: "Henüz galibiyet yok, ama geri dönüşün şimdi başlıyor 💪",
        checkmate: "♚ Şah mat", resignation: "🏳️ Terk", timeout: "⏰ Süre bitti",
        abandonment: "🏃 Oyunu bırakma", draw: "🤝 Beraberlik", unknown: "❓ Diğer",
        timeLabel: "⏳ ChessBot ile geçen yaklaşık süre",
        timeSub: "Bunun yerine izleyebileceğin film sayısı: {n} 🍿",
        eloLabel: "📊 ChessBot ile ortalama Elo'n",
        eloSub: "ortalama {d} derinlikte 🧠",
        latestLabel: "📅 Son ChessBot oyunun",
        openingLabel: "♟️ Favori açılışın",
        praise: ["Muhteşem!", "Efsane!", "Cesur!", "Şık!"],
        ageLabel: "🎂 Satranç yaşın",
        ageYoung: "⚡ Hızlı, korkusuz ve enerji dolu!",
        ageMid: "⚖️ Her şeyin olması gerektiği gibi, mükemmel dengede.",
        ageOld: "🧙 Bilge, sabırlı ve hesapçı.",
        predictedLabel: "🔮 Tahmini Elo'n",
        predictedSub: "Tırmanmaya devam! 📈",
        final: "Belki çok fazla hata {blunder} yaptın, ama sen muhteşem {brilliant} birisin.",
        finalThanks: "ChessBot ile oynadığın için teşekkürler ❤️",
        footer: "Senin için 🇹🇷 diline çevrildi ❤️"
    },
    "pl": {
        nativeName: "Polski",
        title: "ChessBot Wrapped 🎁",
        loading: "🎁 Rozpakowujemy Twoje statystyki…",
        notFound: "♟️ Brak partii! Zagraj kilka partii z ChessBotem i wróć.",
        closed: "👋 ChessBot Wrapped dobiegł końca. Do zobaczenia!",
        error: "😢 Nie udało się wczytać statystyk. Spróbuj ponownie później.",
        hint: "👆 Stuknij po prawej, aby przejść dalej, po lewej, aby wrócić · przytrzymaj, aby zatrzymać",
        replay: "🔁 Obejrzyj ponownie",
        gamesLabel: "🎮 Partie rozegrane z ChessBotem",
        bullet: "Bullet", blitz: "Blitz", rapid: "Szachy szybkie",
        favoriteTc: "Twój ulubiony to {tc}!",
        footAvid: "🔥 Jesteś zagorzałym fanem ChessBota!",
        footAverage: "😐 Twoje statystyki są... przeciętne.",
        footPlayMore: "🐌 Graj więcej w szachy!",
        winsLabel: "🏆 Wygrane partie",
        winsSub: "…i jak je wygrałeś",
        noWins: "Jeszcze bez wygranych, ale Twój powrót zaczyna się teraz 💪",
        checkmate: "♚ Mat", resignation: "🏳️ Poddanie", timeout: "⏰ Koniec czasu",
        abandonment: "🏃 Opuszczenie gry", draw: "🤝 Remis", unknown: "❓ Inne",
        timeLabel: "⏳ Przybliżony czas z ChessBotem",
        timeSub: "Filmy, które mogłeś obejrzeć zamiast tego: {n} 🍿",
        eloLabel: "📊 Twoje średnie Elo z ChessBotem",
        eloSub: "przy średniej głębokości {d} 🧠",
        latestLabel: "📅 Twoja ostatnia partia z ChessBotem",
        openingLabel: "♟️ Twój ulubiony debiut",
        praise: ["Genialnie!", "Legendarnie!", "Odważnie!", "Z klasą!"],
        ageLabel: "🎂 Twój szachowy wiek",
        ageYoung: "⚡ Szybki, nieustraszony i pełen energii!",
        ageMid: "⚖️ Idealnie zrównoważony, tak jak wszystko powinno być.",
        ageOld: "🧙 Mądry, cierpliwy i wyrachowany.",
        predictedLabel: "🔮 Twoje przewidywane Elo",
        predictedSub: "Wspinaj się dalej! 📈",
        final: "Może popełniłeś wiele podstawek {blunder}, ale jesteś genialną {brilliant} osobą.",
        finalThanks: "Dzięki za grę z ChessBotem ❤️",
        footer: "Przetłumaczone na polski specjalnie dla Ciebie 🇵🇱 ❤️"
    }
};

const SUPPORTED = Object.keys(translations);
const DEFAULT_LANG = "en-US";
let lang = DEFAULT_LANG;
const t = (key) => translations[lang][key] ?? translations[DEFAULT_LANG][key];
const fmt = (template, values) => template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? "");
const num = (value, options) => new Intl.NumberFormat(lang, options).format(value);

// ── Stat calculations (client-side) ─────────────────────────────────────

// Same depth -> Elo table as popup.js; depths in between are interpolated, beyond 24 clamps.
const DEPTH_ELO = [
    [1, 1400], [2, 1480], [3, 1560], [4, 1640], [5, 1720], [6, 1800], [7, 1880], [8, 1960],
    [9, 2040], [10, 2120], [11, 2200], [12, 2280], [13, 2360], [14, 2440], [15, 2520], [16, 2600],
    [17, 2680], [18, 2760], [19, 2840], [20, 2900], [21, 2925], [22, 2950], [23, 2975], [24, 3000]
];

function eloFromDepth(depth) {
    if (depth <= DEPTH_ELO[0][0]) return DEPTH_ELO[0][1];
    for (let i = 1; i < DEPTH_ELO.length; i++) {
        const [d1, e1] = DEPTH_ELO[i];
        if (depth <= d1) {
            const [d0, e0] = DEPTH_ELO[i - 1];
            return Math.round(e0 + (e1 - e0) * (depth - d0) / (d1 - d0));
        }
    }
    return DEPTH_ELO[DEPTH_ELO.length - 1][1];
}

// Rough length of a whole game (both clocks of a typical 1|0, 5|0, 10|0), in minutes.
// Games with an unknown time control aren't counted.
const GAME_MINUTES = { bullet: 2, blitz: 10, rapid: 20 };
const TIME_CONTROLS = ["bullet", "blitz", "rapid"];
const TC_EMOJI = { bullet: "🚀", blitz: "⚡", rapid: "⏱️" };
const TC_AGE = { bullet: 19, blitz: 27, rapid: 37 };
const OPENING_AGE = {
    e2e4: 24, d2d4: 35, c2c4: 41, g1f3: 38, b2b3: 46, f2f4: 29, g2g3: 36, b1c3: 31, b2b4: 22,
    e7e5: 27, c7c5: 25, d7d5: 33, g8f6: 35, e7e6: 40, c7c6: 43, g7g6: 28, d7d6: 38, f7f5: 23
};

// Seeded by installId so the "random" parts stay the same every time the user opens the page.
function seededRandom(seed) {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
}

function computeStats(data, installId) {
    const random = seededRandom(installId);
    const games = data.games || {};
    const timed = TIME_CONTROLS.reduce((sum, tc) => sum + (games[tc] || 0), 0);
    const total = timed + (games.unknown || 0);
    const favoriteTc = timed ? TIME_CONTROLS.reduce((a, b) => (games[b] || 0) > (games[a] || 0) ? b : a) : null;
    const minutes = TIME_CONTROLS.reduce((sum, tc) => sum + (games[tc] || 0) * GAME_MINUTES[tc], 0);
    const avgElo = eloFromDepth(Number(data.avgDepth) || 0);

    const tcAge = timed ? TIME_CONTROLS.reduce((sum, tc) => sum + TC_AGE[tc] * (games[tc] || 0), 0) / timed : 30;
    const openingAge = OPENING_AGE[data.favoriteOpening] ?? 32;
    const noise = (random() - 0.5) * 8;
    const chessAge = Math.round(Math.min(80, Math.max(12, tcAge * 0.6 + openingAge * 0.4 + noise)));

    return {
        games, total, timed, favoriteTc, minutes, avgElo, chessAge,
        wins: data.wins || {},
        avgDepth: Number(data.avgDepth) || 0,
        favoriteOpening: data.favoriteOpening,
        lastPlayed: data.lastPlayed ? new Date(data.lastPlayed) : null,
        predictedElo: Math.ceil(avgElo + random() * 200),
        praiseIndex: Math.floor(random() * 4)
    };
}

// ── Slides ──────────────────────────────────────────────────────────────

function footnote(total) {
    if (total > 20) return t("footAvid");
    if (total >= 10) return t("footAverage");
    return t("footPlayMore");
}

function gamesSlide(s) {
    const max = Math.max(1, ...TIME_CONTROLS.map(tc => s.games[tc] || 0));
    const bars = TIME_CONTROLS.map(tc => `
        <div class="bar-col">
            <span class="bar-value">${num(s.games[tc] || 0)}</span>
            <div class="bar${tc === s.favoriteTc ? " fav" : ""}" data-height="${Math.max(4, (s.games[tc] || 0) / max * 150)}px"></div>
            <span class="bar-name">${TC_EMOJI[tc]} ${t(tc)}</span>
        </div>`).join("");
    return `
        <p class="label">${t("gamesLabel")}</p>
        <p class="big">${num(s.total)}</p>
        <div class="bars">${bars}</div>
        ${s.favoriteTc ? `<p class="medium">${fmt(t("favoriteTc"), { tc: `${TC_EMOJI[s.favoriteTc]} ${t(s.favoriteTc)}` })}</p>` : ""}
        <p class="small">${footnote(s.total)}</p>`;
}

function winsSlide(s) {
    const entries = Object.entries(s.wins).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, n]) => sum + n, 0);
    if (!total) {
        return `<p class="label">${t("winsLabel")}</p><p class="big">0</p><p class="sub">${t("noWins")}</p>`;
    }
    const rows = entries.map(([reason, n]) => `
        <div class="hbar-row">
            <span class="name">${t(reason) ?? reason}</span>
            <div class="hbar-track"><div class="hbar-fill" data-width="${n / entries[0][1] * 100}%"></div></div>
            <span class="count">${num(n)}</span>
        </div>`).join("");
    return `
        <p class="label">${t("winsLabel")}</p>
        <p class="big">${num(total)}</p>
        <p class="sub">${t("winsSub")}</p>
        <div class="hbars">${rows}</div>`;
}

function timeSlide(s) {
    const hours = s.minutes / 60;
    const value = hours >= 1
        ? num(Math.round(hours * 10) / 10, { style: "unit", unit: "hour", unitDisplay: "long" })
        : num(s.minutes, { style: "unit", unit: "minute", unitDisplay: "long" });
    return `
        <p class="emoji-hero">⏳</p>
        <p class="label">${t("timeLabel")}</p>
        <p class="big">${value}</p>
        <p class="sub">${fmt(t("timeSub"), { n: num(Math.floor(hours / 2)) })}</p>`;
}

function eloSlide(s) {
    return `
        <p class="emoji-hero">📊</p>
        <p class="label">${t("eloLabel")}</p>
        <p class="big">${num(s.avgElo)}</p>
        <p class="sub">${fmt(t("eloSub"), { d: num(s.avgDepth, { maximumFractionDigits: 1 }) })}</p>`;
}

function latestSlide(s) {
    const days = Math.round((s.lastPlayed - Date.now()) / 86400000);
    const relative = new Intl.RelativeTimeFormat(lang, { numeric: "auto" }).format(days, "day");
    const date = new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(s.lastPlayed);
    return `
        <p class="emoji-hero">📅</p>
        <p class="label">${t("latestLabel")}</p>
        <p class="medium" style="font-size: 34px;">${date}</p>
        <p class="sub">${relative}</p>`;
}

const START_POSITION = [
    "rnbqkbnr", "pppppppp", "........", "........", "........", "........", "PPPPPPPP", "RNBQKBNR"
];
const GLYPH = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
const SVG_NS = "http://www.w3.org/2000/svg";

// Arrow geometry copied from engine.js so it looks exactly like Umbra's in-game arrow.
function arrowPolygon(fromSq, toSq, flipped) {
    const CELL = 12.5;
    const point = (sq) => {
        let file = sq.charCodeAt(0) - 97, rank = Number(sq[1]) - 1;
        if (flipped) { file = 7 - file; rank = 7 - rank; }
        return { x: (file + 0.5) * CELL, y: 100 - (rank + 0.5) * CELL };
    };
    const from = point(fromSq), to = point(toSq);
    const rot = (Math.atan2(to.x - from.x, -(to.y - from.y)) * 180 / Math.PI) - 180;
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    const baseY = from.y + 4.5, tipY = baseY + length - 6;
    const points = [
        [from.x - 1.375, baseY], [from.x - 1.375, tipY], [from.x - 3.25, tipY], [from.x, tipY + 4.5],
        [from.x + 3.25, tipY], [from.x + 1.375, tipY], [from.x + 1.375, baseY]
    ].map(p => p.join(" ")).join(", ");
    return `<polygon class="arrow" points="${points}" transform="rotate(${rot} ${from.x} ${from.y})" style="fill: rgba(255,170,0,0.8)"></polygon>`;
}

function openingSlide(s) {
    const move = s.favoriteOpening;
    const from = move.slice(0, 2), to = move.slice(2, 4);
    const flipped = from[1] === "7" || from[1] === "8"; // black's move: show black at the bottom
    let squares = "";
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const rankIdx = flipped ? 7 - row : row;          // index into START_POSITION (rank 8 first)
            const fileIdx = flipped ? 7 - col : col;
            const sq = String.fromCharCode(97 + fileIdx) + (8 - rankIdx);
            const piece = START_POSITION[rankIdx][fileIdx];
            const light = (rankIdx + fileIdx) % 2 === 0;
            const glyph = piece === "." ? "" :
                `<span class="${piece === piece.toUpperCase() ? "pc-w" : "pc-b"}">${GLYPH[piece.toLowerCase()]}&#xFE0E;</span>`;
            squares += `<div class="sq ${light ? "light" : "dark"}${sq === from || sq === to ? " hl" : ""}">${glyph}</div>`;
        }
    }
    return `
        <p class="label">${t("openingLabel")}</p>
        <p class="move-tag">${move}</p>
        <div class="board">${squares}<svg xmlns="${SVG_NS}" viewBox="0 0 100 100">${arrowPolygon(from, to, flipped)}</svg></div>
        <p class="medium">✨ ${t("praise")[s.praiseIndex]} ✨</p>`;
}

function ageSlide(s) {
    const blurb = s.chessAge < 26 ? t("ageYoung") : s.chessAge < 36 ? t("ageMid") : t("ageOld");
    return `
        <p class="emoji-hero">🎂</p>
        <p class="label">${t("ageLabel")}</p>
        <p class="big">${num(s.chessAge, { style: "unit", unit: "year", unitDisplay: "long" })}</p>
        <p class="sub">${blurb}</p>`;
}

function predictedSlide(s) {
    return `
        <p class="emoji-hero">🔮</p>
        <p class="label">${t("predictedLabel")}</p>
        <p class="big">${num(s.predictedElo)}</p>
        <p class="sub">${t("predictedSub")}</p>`;
}

function finalSlide() {
    return `
        <p class="final-text">${fmt(t("final"), {
            blunder: `<span class="badge blunder">!?</span>`,
            brilliant: `<span class="badge brilliant">!!</span>`
        })}</p>
        <p class="sub">${t("finalThanks")}</p>
        <button id="replay" type="button">${t("replay")}</button>`;
}

function messageSlide(key) {
    return `<p class="medium">${t(key)}</p>`;
}

// ── Story player ────────────────────────────────────────────────────────

const slideEl = document.getElementById("slide");
const progressEl = document.getElementById("progress");
const storyEl = document.getElementById("story");
let slides = [];          // functions returning HTML
let index = 0;
let elapsed = 0;
let paused = false;
let lastFrame = null;
let stats = null;
let message = "loading";  // shown while there are no slides

function buildSlides() {
    slides = [gamesSlide, winsSlide, timeSlide, eloSlide];
    if (stats.lastPlayed) slides.push(latestSlide);
    if (stats.favoriteOpening) slides.push(openingSlide);
    slides.push(ageSlide, predictedSlide, finalSlide);
    progressEl.innerHTML = slides.map(() => `<div class="seg"><div></div></div>`).join("");
}

function render(animate = true) {
    if (!slides.length) {
        slideEl.innerHTML = messageSlide(message);
        return;
    }
    slideEl.innerHTML = slides[index](stats);
    if (animate) {
        slideEl.classList.remove("enter");
        void slideEl.offsetWidth; // restart the entrance animation
        slideEl.classList.add("enter");
    }
    // let the browser paint the zero state first so the bars/arrow animate in
    requestAnimationFrame(() => requestAnimationFrame(() => {
        slideEl.querySelectorAll("[data-height]").forEach(el => { el.style.height = el.dataset.height; });
        slideEl.querySelectorAll("[data-width]").forEach(el => { el.style.width = el.dataset.width; });
        slideEl.querySelector(".board")?.classList.add("shown");
    }));
    document.getElementById("replay")?.addEventListener("click", (event) => {
        event.stopPropagation();
        go(0);
    });
    updateProgress();
}

function updateProgress() {
    [...progressEl.children].forEach((seg, i) => {
        const fill = i < index ? 1 : i > index ? 0 : Math.min(1, elapsed / STORY_MS);
        seg.firstElementChild.style.width = `${fill * 100}%`;
    });
}

function go(next) {
    index = Math.max(0, Math.min(slides.length - 1, next));
    elapsed = 0;
    render();
}

function tick(now) {
    if (lastFrame !== null && !paused && !document.hidden && slides.length) {
        elapsed += now - lastFrame;
        if (elapsed >= STORY_MS && index < slides.length - 1) go(index + 1);
        else updateProgress();
    }
    lastFrame = now;
    requestAnimationFrame(tick);
}

// Tap left third = back, elsewhere = forward; press and hold = pause (like Instagram stories).
let pressStart = 0;
storyEl.addEventListener("pointerdown", () => { pressStart = Date.now(); paused = true; });
storyEl.addEventListener("pointerup", (event) => {
    paused = false;
    if (!slides.length || Date.now() - pressStart > 250 || event.target.closest("button")) return;
    const rect = storyEl.getBoundingClientRect();
    go(event.clientX - rect.left < rect.width / 3 ? index - 1 : index + 1);
});
storyEl.addEventListener("pointerleave", () => { paused = false; });
document.addEventListener("keydown", (event) => {
    if (!slides.length) return;
    if (event.key === "ArrowRight") go(index + 1);
    else if (event.key === "ArrowLeft") go(index - 1);
    else if (event.key === " ") { event.preventDefault(); paused = !paused; }
});

// ── Data ────────────────────────────────────────────────────────────────

function getInstallId() {
    return new Promise((resolve) => {
        try {
            chrome.storage.local.get([STORAGE_INSTALL_ID_KEY], (stored) => resolve(stored?.[STORAGE_INSTALL_ID_KEY] || null));
        } catch {
            resolve(null);
        }
    });
}

async function load() {
    const installId = "676c5bae5c024a6394be8648ac94123e";
    if (!installId) {
        message = "notFound";
        return render();
    }
    try {
        const response = await fetch(`${API_BASE}/wrapped/${encodeURIComponent(installId)}`);
        if (response.status === 404) message = "notFound";
        else if (response.status === 410) message = "closed";
        else if (!response.ok) message = "error";
        else {
            stats = computeStats(await response.json(), installId);
            buildSlides();
            go(0);
            return;
        }
    } catch (error) {
        console.warn("ChessBot Wrapped failed to load.", error);
        message = "error";
    }
    render();
}

// ── Language (same behaviour as changelog.js) ───────────────────────────

function pickInitialLang() {
    const browserLangs = navigator.languages || [navigator.language || DEFAULT_LANG];
    for (const bl of browserLangs) {
        const exact = SUPPORTED.find(l => l.toLowerCase() === bl.toLowerCase());
        if (exact) return exact;
    }
    for (const bl of browserLangs) {
        const base = bl.split("-")[0].toLowerCase();
        const match = SUPPORTED.find(l => l.split("-")[0].toLowerCase() === base);
        if (match) return match;
    }
    return DEFAULT_LANG;
}

function applyLang(next) {
    lang = translations[next] ? next : DEFAULT_LANG;
    document.title = t("title");
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t(key) !== undefined) el.innerHTML = t(key);
    });
    const select = document.getElementById("lang-select");
    if (select.value !== lang) select.value = lang;
    render(false);
}

function buildSelect() {
    const select = document.getElementById("lang-select");
    SUPPORTED.forEach(code => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = translations[code].nativeName;
        select.appendChild(opt);
    });
    select.addEventListener("change", () => applyLang(select.value));
}

buildSelect();
applyLang(pickInitialLang());
requestAnimationFrame(tick);
load();
