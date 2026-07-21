/**
 * שמות חברות תעופה בעברית לקודי IATA נפוצים (בדגש על יעדים מישראל).
 * fallback: הקוד עצמו. לוגואים דרך Travelpayouts (pics.avs.io).
 */
const NAMES: Record<string, string> = {
  LY: "אל על",
  IZ: "ארקיע",
  "6H": "ישראייר",
  W6: "ויז אייר",
  W9: "ויז אייר",
  FR: "ריאנאייר",
  U2: "איזיג׳ט",
  TK: "טורקיש איירליינס",
  LH: "לופטהנזה",
  AF: "אייר פראנס",
  BA: "בריטיש איירווייז",
  KL: "KLM",
  AZ: "ITA איירווייז",
  A3: "אג׳יאן",
  OA: "אולימפיק",
  OS: "אוסטריאן איירליינס",
  LX: "סוויס",
  SN: "בריסל איירליינס",
  UX: "אייר אירופה",
  IB: "איבריה",
  VY: "וואוֹלינג",
  HV: "טרנסוויה",
  PC: "פגסוס",
  RO: "טארום",
  JU: "אייר סרביה",
  OU: "קרואטיה איירליינס",
  BT: "אייר בולטיק",
  EW: "יורוווינגס",
  DE: "קונדור",
  WK: "אדלווייס",
  EK: "אמירטס",
  QR: "קטאר איירווייז",
  EY: "אתיחאד",
  MS: "מצריים איר",
  RJ: "רויאל ג׳ורדניאן",
  UA: "יונייטד",
  DL: "דלתא",
  AA: "אמריקן איירליינס",
  AC: "אייר קנדה",
  SU: "אירופלוט",
};

export function airlineName(code: string): string {
  if (!code) return "";
  return NAMES[code.toUpperCase()] ?? code.toUpperCase();
}

/** לוגו חברת תעופה מ-Travelpayouts (ריבועי). */
export function airlineLogo(code: string): string {
  return `https://pics.avs.io/60/60/${code.toUpperCase()}.png`;
}
