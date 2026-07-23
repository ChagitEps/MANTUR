/**
 * יעדי SEO להשקה (סעיף 6.9 באפיון). עמודי תוכן אינדקסביליים — מנוע התנועה
 * האורגנית. כל יעד: מדריך קצר + חיפוש מוטמע + טבלת טיסות זולות מ-TLV.
 */
export interface Destination {
  /** מזהה URL (אנגלית, kebab-case). */
  slug: string;
  /** קוד IATA של עיר היעד (לחיפוש טיסות). */
  code: string;
  /** שם עברי לתצוגה. */
  he: string;
  /** שם אנגלי (למטא / חיפוש). */
  en: string;
  /** תמונת יעד איכותית קבועה (Wikimedia, מאומתת). */
  image: string;
  /** תקציר פתיחה. */
  intro: string;
  /** מתי כדאי לטוס. */
  whenToFly: string;
  /** דברים לעשות. */
  whatToDo: string[];
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "budapest",
    code: "BUD",
    he: "בודפשט",
    en: "Budapest",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Hungarian_Parliament_Building_from_across_the_Danube%2C_2025-01-11.jpg/1280px-Hungarian_Parliament_Building_from_across_the_Danube%2C_2025-01-11.jpg",
    intro:
      "בירת הונגריה על גדות הדנובה — עיר זולה, יפהפייה ומלאת חיים, מהיעדים האהובים על ישראלים לחופשת עיר קצרה.",
    whenToFly:
      "אביב (אפריל–מאי) וסתיו (ספטמבר–אוקטובר) הם הזמנים הנעימים ביותר. החורף קר אבל קסום עם שווקי חג מולד; הקיץ חם ותוסס.",
    whatToDo: [
      "מרחצאות תרמליים היסטוריים (סצ'ני, גלרט)",
      "שיט ערב על הדנובה מול הפרלמנט המואר",
      "טירת בודה והרובע ההיסטורי",
      "שוק המרכזי הגדול (Nagycsarnok)",
      "ברים בחורבות (Ruin bars) ברובע היהודי",
    ],
  },
  {
    slug: "london",
    code: "LON",
    he: "לונדון",
    en: "London",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Tower_Bridge_at_Dawn.jpg/1280px-Tower_Bridge_at_Dawn.jpg",
    intro:
      "בירת בריטניה — מטרופולין ענק של תרבות, מוזיאונים, שופינג ותיאטרון. יעד קלאסי שאפשר לחזור אליו שוב ושוב.",
    whenToFly:
      "מאי–ספטמבר עם מזג אוויר נעים וימים ארוכים. דצמבר קסום עם תאורת חג ומזחלות; קחו מטרייה בכל עונה.",
    whatToDo: [
      "מוזיאונים חינמיים (British Museum, National Gallery)",
      "גלגל הענק London Eye וברפיפו על הטמזה",
      "שווקים (Camden, Borough Market)",
      "הצגה בווסט אנד",
      "פארקים מלכותיים (Hyde Park, Regent's Park)",
    ],
  },
  {
    slug: "rome",
    code: "ROM",
    he: "רומא",
    en: "Rome",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1280px-Colosseo_2020.jpg",
    intro:
      "העיר הנצחית — אלפיים שנות היסטוריה בכל פינה, אוכל איטלקי מושלם ואווירה שאין כמותה. חובה לכל חובב תרבות.",
    whenToFly:
      "אביב (אפריל–יוני) וסתיו (ספטמבר–אוקטובר) אידיאליים. יולי–אוגוסט חמים ועמוסים; החורף מתון ופחות צפוף.",
    whatToDo: [
      "הקולוסיאום והפורום הרומי",
      "מזרקת טרווי ומדרגות ספרד",
      "הוותיקן, כנסיית פטרוס הקדוש והקפלה הסיסטינית",
      "הפנתאון ורובע טרסטוורה",
      "פסטה, פיצה וג'לאטו אמיתיים",
    ],
  },
  {
    slug: "larnaca",
    code: "LCA",
    he: "לרנקה",
    en: "Larnaca",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Larnaca_01-2017_img27_Finikoudes.jpg/1280px-Larnaca_01-2017_img27_Finikoudes.jpg",
    intro:
      "העיר החופית בקפריסין — כ-40 דקות טיסה מתל אביב. ים, טיילת, מסעדות ואווירה נינוחה. הבריחה המושלמת לסוף שבוע.",
    whenToFly:
      "אביב עד סתיו (אפריל–אוקטובר) לים ולחופים. הקיץ חם ותוסס; החורף מתון ושקט.",
    whatToDo: [
      "הטיילת ומצודת לרנקה",
      "חופי הים התיכון",
      "כנסיית לזרוס הקדוש",
      "אגם המלח והפלמינגו",
      "טברנות ואוכל קפריסאי",
    ],
  },
  {
    slug: "athens",
    code: "ATH",
    he: "אתונה",
    en: "Athens",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/1029_Acropolis_of_Athens_in_Greece_at_night_Photo_by_Giles_Laurent.jpg/1280px-1029_Acropolis_of_Athens_in_Greece_at_night_Photo_by_Giles_Laurent.jpg",
    intro:
      "עריסת התרבות המערבית — אקרופוליס, היסטוריה עתיקה ואוכל יווני משובח, פחות משעתיים טיסה מתל אביב.",
    whenToFly:
      "אביב (אפריל–יוני) וסתיו (ספטמבר–אוקטובר) נעימים. הקיץ חם מאוד; החורף מתון.",
    whatToDo: [
      "האקרופוליס והפרתנון",
      "שכונת פלאקה העתיקה",
      "שוק מונסטיראקי",
      "מוזיאון האקרופוליס החדש",
      "שקיעה בקייפ סוניון",
    ],
  },
  {
    slug: "paris",
    code: "PAR",
    he: "פריז",
    en: "Paris",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/MG-Paris-Champ_de_Mars.jpg/1280px-MG-Paris-Champ_de_Mars.jpg",
    intro:
      "עיר האורות והרומנטיקה — אמנות, אופנה, קפה ואוכל. אחת מבירות התרבות הגדולות בעולם.",
    whenToFly:
      "אביב (אפריל–יוני) וסתיו נעימים. הקיץ עמוס תיירים; החורף קסום עם תאורת חג.",
    whatToDo: [
      "מגדל אייפל",
      "הלובר ומונה ליזה",
      "שאנז אליזה ושער הניצחון",
      "מונמארטר ובזיליקת סקרה-קר",
      "שייט על נהר הסן",
    ],
  },
  {
    slug: "barcelona",
    code: "BCN",
    he: "ברצלונה",
    en: "Barcelona",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Parc_guell_-_panoramio.jpg/1280px-Parc_guell_-_panoramio.jpg",
    intro:
      "בירת קטלוניה — אדריכלות מסחררת של גאודי, חופים, טאפאס וחיי לילה תוססים על חוף הים.",
    whenToFly:
      "מאי–יוני וספטמבר–אוקטובר אידיאליים. הקיץ חם ועמוס; החורף מתון.",
    whatToDo: [
      "סגרדה פמיליה",
      "פארק גואל",
      "שדרת לה ראמבלה",
      "הרובע הגותי",
      "חוף ברסלונטה",
    ],
  },
  {
    slug: "amsterdam",
    code: "AMS",
    he: "אמסטרדם",
    en: "Amsterdam",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Prinsengracht.jpg/1280px-Prinsengracht.jpg",
    intro:
      "עיר התעלות — אופניים, מוזיאונים עולמיים ואווירה קסומה. קומפקטית ומושלמת לחופשת עיר.",
    whenToFly:
      "אביב (אפריל–מאי, פריחת הצבעונים) והקיץ הנעים. החורף קר וקצר-יום.",
    whatToDo: [
      "שייט בתעלות",
      "מוזיאון ואן גוך",
      "בית אנה פרנק",
      "הרייקסמוזיאום",
      "שוק הפרחים הצף",
    ],
  },
  {
    slug: "prague",
    code: "PRG",
    he: "פראג",
    en: "Prague",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Prague_07-2016_view_from_Lesser_Town_Tower_of_Charles_Bridge_img3.jpg/1280px-Prague_07-2016_view_from_Lesser_Town_Tower_of_Charles_Bridge_img3.jpg",
    intro:
      "פנינה של מרכז אירופה — עיר עתיקה מהאגדות, גשרים, טירה ואווירה קסומה במחירים נוחים.",
    whenToFly:
      "אביב וסתיו נעימים. דצמבר קסום עם שווקי חג מולד; הקיץ תוסס.",
    whatToDo: [
      "גשר קארל",
      "טירת פראג",
      "כיכר העיר העתיקה והשעון האסטרונומי",
      "הרובע היהודי",
      "שיט על נהר הוולטבה",
    ],
  },
  {
    slug: "thessaloniki",
    code: "SKG",
    he: "סלוניקי",
    en: "Thessaloniki",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Tessaloniki_BW_2017-10-05_18-22-47.jpg/1280px-Tessaloniki_BW_2017-10-05_18-22-47.jpg",
    intro:
      "עיר הנמל הצפונית של יוון — טיילת ים ארוכה, אוכל יווני מעולה ואווירה צעירה ותוססת. כשעתיים טיסה מתל אביב.",
    whenToFly:
      "אביב (אפריל–יוני) וסתיו (ספטמבר–אוקטובר) נעימים במיוחד. הקיץ חם וחיי הלילה שוקקים; החורף מתון וגשום.",
    whatToDo: [
      "המגדל הלבן וטיילת הים",
      "העיר העתיקה (Ano Poli) והחומות",
      "רוטונדה וקשת גלריוס",
      "שוק מודיאנו והשווקים",
      "בתי קפה, בוזוקי ואוכל רחוב",
    ],
  },
  {
    slug: "batumi",
    code: "BUS",
    he: "בטומי",
    en: "Batumi",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Batumi_Skyline_%2831%29.jpg/1280px-Batumi_Skyline_%2831%29.jpg",
    intro:
      "עיר החוף של גאורגיה על הים השחור — קו רקיע מודרני, טיילת מרשימה, קזינו ומחירים נוחים. יעד אהוב על ישראלים.",
    whenToFly:
      "קיץ (יוני–ספטמבר) לים ולחוף. האביב והסתיו נעימים ושקטים יותר; החורף גשום ומתון.",
    whatToDo: [
      "טיילת הבולוואר לאורך הים",
      "פסל 'עלי וניניו' הנע",
      "העיר העתיקה וכיכר פיאצה",
      "רכבל ארגו לתצפית",
      "יינות ואוכל גאורגי (חצ'אפורי, ח'ינקלי)",
    ],
  },
  {
    slug: "tbilisi",
    code: "TBS",
    he: "טביליסי",
    en: "Tbilisi",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/View_of_Tbilisi_from_Tabori_Church_2023-10-08-2.jpg/1280px-View_of_Tbilisi_from_Tabori_Church_2023-10-08-2.jpg",
    intro:
      "בירת גאורגיה — עיר עתיקה וצבעונית של סמטאות, מרחצאות גופרית, יין ואוכל מצוין במחירים זולים. שער להרי הקווקז.",
    whenToFly:
      "אביב (מאי–יוני) וסתיו (ספטמבר–אוקטובר) אידיאליים. הקיץ חם; החורף קר ומושלג בהרים הסמוכים.",
    whatToDo: [
      "העיר העתיקה ומרחצאות אבנוטובני",
      "מבצר נריקלה והרכבל",
      "שדרת רוסתוולי",
      "כנסיית השילוש הקדוש (צמינדה סמבה)",
      "טיולי יום להרי הקווקז וקאזבגי",
    ],
  },
  {
    slug: "vienna",
    code: "VIE",
    he: "וינה",
    en: "Vienna",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Schoenbrunn_philharmoniker_2012.jpg/1280px-Schoenbrunn_philharmoniker_2012.jpg",
    intro:
      "בירת אוסטריה הקיסרית — ארמונות מפוארים, מוזיקה קלאסית, בתי קפה מסורתיים ואיכות חיים גבוהה. אלגנטית וקסומה.",
    whenToFly:
      "אביב וסתיו נעימים לטיולים. דצמבר קסום עם שווקי חג מולד; הקיץ חמים והפארקים פורחים.",
    whatToDo: [
      "ארמון שנברון וגניו",
      "ארמון הופבורג והרובע ההיסטורי",
      "אופרה וקונצרטים קלאסיים",
      "בתי קפה ווינאים ועוגת זאכר",
      "גלגל הענק בפראטר",
    ],
  },
  {
    slug: "milan",
    code: "MIL",
    he: "מילאנו",
    en: "Milan",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Milan_Cathedral_from_Piazza_del_Duomo.jpg/1280px-Milan_Cathedral_from_Piazza_del_Duomo.jpg",
    intro:
      "בירת האופנה והעיצוב של איטליה — קתדרלה מפוארת, שופינג ברמה עולמית, אמנות ואוכל צפון-איטלקי. שער לאגמי הצפון.",
    whenToFly:
      "אביב (אפריל–יוני) וסתיו (ספטמבר–אוקטובר) נעימים. הקיץ חם ולח; החורף קריר עם עונת שופינג ואופנה.",
    whatToDo: [
      "הדואומו והגג עם התצפית",
      "גלריית ויטוריו אמנואלה",
      "'הסעודה האחרונה' של דה וינצ'י",
      "רובע נאווילי והתעלות",
      "טיול יום לאגם קומו",
    ],
  },
  {
    slug: "santorini",
    code: "JTR",
    he: "סנטוריני",
    en: "Santorini",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/1000_Three_domes_of_Oia_in_Santorini_Photo_by_Giles_Laurent.jpg/1280px-1000_Three_domes_of_Oia_in_Santorini_Photo_by_Giles_Laurent.jpg",
    intro:
      "פנינת הקיקלאדס ביוון — בתים לבנים וכיפות כחולות על צוקי הקלדרה, שקיעות מרהיבות וחופים וולקניים. יעד רומנטי בהמלצה.",
    whenToFly:
      "מאי–יוני וספטמבר–אוקטובר אידיאליים (פחות עומס, מזג אוויר נעים). יולי–אוגוסט חמים ועמוסים מאוד.",
    whatToDo: [
      "שקיעה בכפר אויה (Oia)",
      "טיילת פירה על הקלדרה",
      "חופים וולקניים (Red Beach, Kamari)",
      "שיט לפי הרי הגעש והמעיינות החמים",
      "יקבים וטעימות יין מקומי",
    ],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

/** יעד לפי קוד IATA (לתמונה המאומתת בעמוד הטיסות). */
export function getDestinationByCode(code: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.code === code.toUpperCase());
}
