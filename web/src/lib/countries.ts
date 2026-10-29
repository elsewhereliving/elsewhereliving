// Country list for the searchable "Where are you from?" dropdown on
// /development/. English names come from Intl.DisplayNames at build time, so
// only ISO 3166 codes live here (uninhabited territories left out).
const CODES = `AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IQ IR IS IT JE JM JO JP KE KG
KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU
MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW
SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG
US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW`.split(/\s+/);

// Extra words a visitor might type that the official name doesn't contain.
const ALIASES: Record<string, string> = {
  US: "USA America United States",
  GB: "UK England Scotland Wales Britain Great Britain",
  AE: "UAE Dubai Abu Dhabi Emirates",
  NL: "Holland",
  KR: "Korea",
  CZ: "Czech Republic",
  RU: "Russian Federation",
  HK: "Hong Kong",
  MO: "Macau Macao",
  MM: "Burma",
  CI: "Ivory Coast",
  TR: "Turkey Türkiye",
};

// Friendlier display names where the CLDR one is awkward.
const NAMES: Record<string, string> = { HK: "Hong Kong", MO: "Macau" };

export interface Country { name: string; search: string }

const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function getCountries(): Country[] {
  const dn = new Intl.DisplayNames(["en"], { type: "region" });
  return CODES.map((c) => {
    const name = NAMES[c] || dn.of(c) || c;
    return { name, search: fold(`${name} ${ALIASES[c] || ""}`) };
  }).sort((a, b) => a.name.localeCompare(b.name, "en"));
}
