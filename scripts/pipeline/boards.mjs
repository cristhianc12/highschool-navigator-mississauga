// Board and region definitions shared by the roster build, the scrapers and (mirrored) by js/geo.js.
export const BOARD_BY_NAME = {
  "Peel DSB": "peel",
  "Dufferin-Peel CDSB": "dpcdsb",
  "Toronto DSB": "tdsb",
  "Toronto CDSB": "tcdsb",
  "York Region DSB": "yrdsb",
  "York CDSB": "ycdsb",
  "Halton DSB": "hdsb",
  "Halton CDSB": "hcdsb",
  "Durham DSB": "ddsb",
  "Durham CDSB": "dcdsb",
  "CS Viamonde": "viamonde",
  "CS catholique MonAvenir": "monavenir",
  "Kawartha Pine Ridge DSB": "kprdsb",
  "Peterborough Victoria Northumberland and Clarington CDSB": "pvnccdsb",
  "Peterborough Victoria Northum Clarington CDSB": "pvnccdsb",
};

// Standard GTA definition: Toronto + the regions of Peel, York, Durham and Halton.
export const REGION_BY_CITY = {
  Toronto: "toronto",
  Mississauga: "peel", Brampton: "peel", Caledon: "peel",
  Markham: "york", Vaughan: "york", "Richmond Hill": "york", Aurora: "york", Newmarket: "york", King: "york",
  "Whitchurch-Stouffville": "york", "East Gwillimbury": "york", Georgina: "york",
  Pickering: "durham", Ajax: "durham", Whitby: "durham", Oshawa: "durham", Clarington: "durham", Scugog: "durham", Uxbridge: "durham", Brock: "durham",
  Oakville: "halton", Burlington: "halton", Milton: "halton", "Halton Hills": "halton",
};
