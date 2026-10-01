// Geography and school boards for the Greater Toronto Area (GTA): Toronto plus the regions of Peel, York,
// Durham and Halton. Only public, Catholic and French-language boards (no private schools).
// Kept free of imports so any module (and the API) can use it.

const x = (es, en, fr) => ({ es, en, fr });

export const REGION_ORDER = ["toronto", "peel", "york", "durham", "halton"];
export const REGIONS = {
  toronto: x("Toronto", "Toronto", "Toronto"),
  peel: x("Peel (Mississauga, Brampton, Caledon)", "Peel (Mississauga, Brampton, Caledon)", "Peel (Mississauga, Brampton, Caledon)"),
  york: x("York (Markham, Vaughan, Richmond Hill…)", "York (Markham, Vaughan, Richmond Hill…)", "York (Markham, Vaughan, Richmond Hill…)"),
  durham: x("Durham (Oshawa, Whitby, Ajax, Pickering…)", "Durham (Oshawa, Whitby, Ajax, Pickering…)", "Durham (Oshawa, Whitby, Ajax, Pickering…)"),
  halton: x("Halton (Oakville, Burlington, Milton…)", "Halton (Oakville, Burlington, Milton…)", "Halton (Oakville, Burlington, Milton…)"),
};
// Short region names for chips and the questionnaire.
export const REGION_SHORT = {
  toronto: x("Toronto", "Toronto", "Toronto"), peel: x("Peel", "Peel", "Peel"), york: x("York", "York", "York"),
  durham: x("Durham", "Durham", "Durham"), halton: x("Halton", "Halton", "Halton"),
};

/** "System" groups the boards for colours, the legend and the questionnaire. */
export const SYSTEM_ORDER = ["public", "catholic", "french"];
export const SYSTEMS = {
  public: x("Público", "Public", "Public"),
  catholic: x("Católico", "Catholic", "Catholique"),
  french: x("Francófono", "French-language", "De langue française"),
};
export const SYSTEM_COLOR = { public: "#0A7BB8", catholic: "#6D3DF2", french: "#C2287E" };
// Legacy CSS tokens (board-dpcdsb / board-peel / board-fr) are kept per system so the stylesheet is unchanged.
const SYSTEM_CLASS = { catholic: "dpcdsb", public: "peel", french: "fr" };

// full: official name. dir: where the board lists its schools. regions: where its secondary schools are.
export const BOARD_META = {
  peel: { system: "public", full: "Peel District School Board", name: x("Peel (público)", "Peel (public)", "Peel (public)"), site: "https://www.peelschools.org/" },
  dpcdsb: { system: "catholic", full: "Dufferin-Peel Catholic District School Board", name: x("DPCDSB (católico)", "DPCDSB (Catholic)", "DPCDSB (catholique)"), site: "https://www.dpcdsb.org/schools/school-directory" },
  tdsb: { system: "public", full: "Toronto District School Board", name: x("TDSB (público)", "TDSB (public)", "TDSB (public)"), site: "https://www.tdsb.on.ca/Find-a-School" },
  tcdsb: { system: "catholic", full: "Toronto Catholic District School Board", name: x("TCDSB (católico)", "TCDSB (Catholic)", "TCDSB (catholique)"), site: "https://www.tcdsb.org/schools" },
  yrdsb: { system: "public", full: "York Region District School Board", name: x("YRDSB (público)", "YRDSB (public)", "YRDSB (public)"), site: "https://www.yrdsb.ca/schools/" },
  ycdsb: { system: "catholic", full: "York Catholic District School Board", name: x("YCDSB (católico)", "YCDSB (Catholic)", "YCDSB (catholique)"), site: "https://www.ycdsb.ca/schools/" },
  ddsb: { system: "public", full: "Durham District School Board", name: x("DDSB (público)", "DDSB (public)", "DDSB (public)"), site: "https://www.ddsb.ca/schools" },
  dcdsb: { system: "catholic", full: "Durham Catholic District School Board", name: x("DCDSB (católico)", "DCDSB (Catholic)", "DCDSB (catholique)"), site: "https://www.dcdsb.ca/schools" },
  kprdsb: { system: "public", full: "Kawartha Pine Ridge District School Board (Clarington)", name: x("KPRDSB (público, Clarington)", "KPRDSB (public, Clarington)", "KPRDSB (public, Clarington)"), site: "https://www.kprschools.ca/" },
  pvnccdsb: { system: "catholic", full: "Peterborough Victoria Northumberland and Clarington CDSB (Clarington)", name: x("PVNCCDSB (católico, Clarington)", "PVNCCDSB (Catholic, Clarington)", "PVNCCDSB (catholique, Clarington)"), site: "https://www.pvnccdsb.on.ca/" },
  hdsb: { system: "public", full: "Halton District School Board", name: x("HDSB (público)", "HDSB (public)", "HDSB (public)"), site: "https://www.hdsb.ca/schools/" },
  hcdsb: { system: "catholic", full: "Halton Catholic District School Board", name: x("HCDSB (católico)", "HCDSB (Catholic)", "HCDSB (catholique)"), site: "https://www.hcdsb.org/schools/" },
  viamonde: { system: "french", full: "Conseil scolaire Viamonde", name: x("CS Viamonde (público, francés)", "CS Viamonde (public, French)", "CS Viamonde (public, français)"), site: "https://csviamonde.ca/" },
  monavenir: { system: "french", full: "Conseil scolaire catholique MonAvenir", name: x("CSC MonAvenir (católico, francés)", "CSC MonAvenir (Catholic, French)", "CSC MonAvenir (catholique, français)"), site: "https://www.cscmonavenir.ca/" },
};
export const BOARD_ORDER = ["tdsb", "tcdsb", "peel", "dpcdsb", "yrdsb", "ycdsb", "ddsb", "dcdsb", "kprdsb", "pvnccdsb", "hdsb", "hcdsb", "viamonde", "monavenir"];

export const systemOf = (board) => BOARD_META[board]?.system || "public";
export const boardClass = (board) => SYSTEM_CLASS[systemOf(board)];
export const colorOf = (board) => SYSTEM_COLOR[systemOf(board)];

// Faith-based boards (including the French-language Catholic board), for the questionnaire.
const CATHOLIC = new Set(["dpcdsb", "tcdsb", "ycdsb", "dcdsb", "hcdsb", "pvnccdsb", "monavenir"]);
export const isCatholic = (board) => CATHOLIC.has(board);
