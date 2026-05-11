// Returns dashboard mock data for UrbanEdgePro seller

export const sellerProfile = {
  name: "UrbanEdgePro",
  category: "Obuwie męskie",
  contractCommission: 15,
  effectiveCommission: 9.2,
};

export const returnsCosts = {
  totalMonthly: 11580,
  logistics: 6900,
  lostCommission: 4680,
  returnRate: 25.5,
  categoryTopQuartile: 12,
  potentialSavings: 6131,
};

export const trendData = [
  { month: "Lut", rr: 22.1, cost: 9240 },
  { month: "Mar", rr: 23.8, cost: 10120 },
  { month: "Kwi", rr: 25.5, cost: 11580 },
];

export const topCostProducts = [
  {
    id: "p1",
    name: "Cloud Runner Sneakers",
    rrPercent: 34.2,
    returnsPerMonth: 41,
    costPerMonth: 4120,
    unitReturnCost: 584,
    returnReasons: ["Nieodpowiedni rozmiar", "Zdjęcie niezgodne z produktem", "Materiał inny niż oczekiwano"],
    recommendations: [
      "Dodaj tabelę rozmiarów z miarkami w cm",
      "Zmień zdjęcie główne – pokaż but z boku i z góry",
      "Uzupełnij opis o skład materiału i podeszwy",
    ],
  },
  {
    id: "p2",
    name: "Trail Pacer Hiking Boots",
    rrPercent: 29.8,
    returnsPerMonth: 28,
    costPerMonth: 3010,
    unitReturnCost: 413,
    returnReasons: ["Zbyt wąskie w palcach", "Inny odcień koloru niż na zdjęciu"],
    recommendations: [
      "Dodaj informację o szerokości obuwia (wąskie/standardowe/szerokie)",
      "Zaktualizuj zdjęcia – uwzględnij wszystkie dostępne kolory",
      "Ogranicz dostępność rozmiaru 42 – najwyższy RR",
    ],
  },
  {
    id: "p3",
    name: "Dash Sport Sneakers",
    rrPercent: 27.1,
    returnsPerMonth: 22,
    costPerMonth: 2480,
    unitReturnCost: 332,
    returnReasons: ["Mała ilość informacji o produkcie", "Zbyt luźne"],
    recommendations: [
      "Rozbuduj opis o szczegóły dotyczące kroju (slim/regular/loose)",
      "Dodaj zdjęcie produktu na stopie modela",
      "Zmień główne zdjęcie na tle białym",
    ],
  },
  {
    id: "p4",
    name: "Edge Runner Pro",
    rrPercent: 22.4,
    returnsPerMonth: 14,
    costPerMonth: 1190,
    unitReturnCost: 241,
    returnReasons: ["Oczekiwania jakościowe", "Rozmiar"],
    recommendations: [
      "Zaktualizuj opis jakości materiałów",
      "Dodaj tabelę rozmiarów",
      "Rozważ obniżenie ceny lub zmianę pozycjonowania",
    ],
  },
  {
    id: "p5",
    name: "Street Runner X",
    rrPercent: 19.7,
    returnsPerMonth: 6,
    costPerMonth: 780,
    unitReturnCost: 18,
    returnReasons: ["Rozmiar"],
    recommendations: [
      "Dodaj podpowiedź 'zamów rozmiar większy' jeśli krój jest wąski",
      "Dodaj recenzje ze wzmianką o rozmiarze",
      "Monitoruj sezonowe wzrosty zwrotów",
    ],
  },
];
