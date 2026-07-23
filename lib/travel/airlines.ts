/**
 * שמות חברות תעופה (באנגלית — מותג מוכר) לקודי IATA נפוצים.
 * fallback: הקוד עצמו. לוגואים דרך Travelpayouts (pics.avs.io).
 */
const NAMES: Record<string, string> = {
  LY: "El Al",
  IZ: "Arkia",
  "6H": "Israir",
  W6: "Wizz Air",
  W9: "Wizz Air",
  FR: "Ryanair",
  U2: "easyJet",
  TK: "Turkish Airlines",
  LH: "Lufthansa",
  AF: "Air France",
  BA: "British Airways",
  KL: "KLM",
  AZ: "ITA Airways",
  A3: "Aegean",
  OA: "Olympic Air",
  OS: "Austrian",
  LX: "Swiss",
  SN: "Brussels Airlines",
  UX: "Air Europa",
  IB: "Iberia",
  VY: "Vueling",
  HV: "Transavia",
  PC: "Pegasus",
  RO: "Tarom",
  JU: "Air Serbia",
  OU: "Croatia Airlines",
  BT: "airBaltic",
  EW: "Eurowings",
  DE: "Condor",
  WK: "Edelweiss",
  EK: "Emirates",
  QR: "Qatar Airways",
  EY: "Etihad",
  MS: "EgyptAir",
  RJ: "Royal Jordanian",
  UA: "United",
  DL: "Delta",
  AA: "American Airlines",
  AC: "Air Canada",
  SU: "Aeroflot",
  CY: "Cyprus Airways",
  GQ: "Sky Express",
  FZ: "flydubai",
};

export function airlineName(code: string): string {
  if (!code) return "";
  return NAMES[code.toUpperCase()] ?? code.toUpperCase();
}

/** לוגו חברת תעופה מ-Travelpayouts (ריבועי). */
export function airlineLogo(code: string): string {
  return `https://pics.avs.io/60/60/${code.toUpperCase()}.png`;
}
