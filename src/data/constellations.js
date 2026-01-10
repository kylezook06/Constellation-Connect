// Global, data-driven constellation packs (no modules).
// GameScene will read from window.CONSTELLATION_PACKS.

(function () {
  const ra = (h, m, s = 0) => (h + m / 60 + s / 3600) * 15;
  const dec = (sign, d, m = 0, s = 0) => sign * (d + m / 60 + s / 3600);

  const PACKS = {
  winter: [
    {
      id: "orion",
      name: "Orion",
      season: "winter",
      stars: [
        { id: "alpha", name: "Betelgeuse", ra: ra(5, 55, 10), dec: dec(1, 7, 24, 25), mag: 0.42, role: "outline" },
        { id: "beta", name: "Rigel", ra: ra(5, 14, 32), dec: dec(-1, 8, 12, 6), mag: 0.13, role: "outline" },
        { id: "gamma", name: "Bellatrix", ra: ra(5, 25, 7), dec: dec(1, 6, 20, 59), mag: 1.64, role: "outline" },
        { id: "delta", name: "Mintaka", ra: ra(5, 32, 0), dec: dec(-1, 0, 17, 56), mag: 2.25, role: "outline" },
        { id: "epsilon", name: "Alnilam", ra: ra(5, 36, 12), dec: dec(-1, 1, 12, 7), mag: 1.69, role: "outline" },
        { id: "zeta", name: "Alnitak", ra: ra(5, 40, 45), dec: dec(-1, 1, 56, 34), mag: 1.74, role: "outline" },
        { id: "eta", name: "Saiph", ra: ra(5, 47, 45), dec: dec(-1, 9, 40, 11), mag: 2.07, role: "outline" },
        { id: "kappa", name: "Kappa", ra: ra(5, 47, 45), dec: dec(-1, 9, 40, 11), mag: 2.07, role: "context" },
        { id: "iota", name: "Hatysa", ra: ra(5, 35, 26), dec: dec(-1, 5, 54, 35), mag: 2.75, role: "context" },
        { id: "pi1", name: "Pi1", ra: ra(4, 49, 50), dec: dec(1, 6, 57, 40), mag: 4.65, role: "context" },
        { id: "pi2", name: "Pi2", ra: ra(4, 50, 50), dec: dec(1, 6, 57, 40), mag: 4.64, role: "context" },
        { id: "pi3", name: "Pi3", ra: ra(4, 58, 32), dec: dec(1, 6, 57, 40), mag: 3.19, role: "context" },
        { id: "pi4", name: "Pi4", ra: ra(5, 6, 52), dec: dec(1, 6, 57, 40), mag: 3.68, role: "context" },
        { id: "pi5", name: "Pi5", ra: ra(5, 12, 26), dec: dec(1, 6, 57, 40), mag: 3.71, role: "context" },
        { id: "pi6", name: "Pi6", ra: ra(5, 17, 56), dec: dec(1, 6, 57, 40), mag: 4.47, role: "context" },
        { id: "lambda", name: "Meissa", ra: ra(5, 35, 8), dec: dec(1, 9, 56, 3), mag: 3.39, role: "context" },
        { id: "mu", name: "Mu", ra: ra(5, 32, 8), dec: dec(1, 9, 56, 3), mag: 4.12, role: "context" },
        { id: "nu", name: "Nu", ra: ra(5, 55, 11), dec: dec(1, 7, 24, 25), mag: 4.42, role: "context" }
      ],
      connectionsStandard: [
        ["alpha", "gamma"],
        ["gamma", "delta"],
        ["delta", "epsilon"],
        ["epsilon", "zeta"],
        ["zeta", "beta"],
        ["beta", "eta"],
        ["eta", "alpha"],
        ["delta", "beta"],
        ["gamma", "epsilon"]
      ],
      connectionsHard: [
        ["alpha", "gamma"],
        ["gamma", "delta"],
        ["delta", "epsilon"],
        ["epsilon", "zeta"],
        ["zeta", "beta"],
        ["beta", "eta"],
        ["eta", "alpha"],
        ["delta", "beta"],
        ["gamma", "epsilon"],
        ["lambda", "delta"],
        ["lambda", "gamma"],
        ["lambda", "pi3"],
        ["pi3", "pi4"],
        ["pi4", "pi5"],
        ["pi5", "pi6"],
        ["pi6", "beta"],
        ["pi3", "pi2"],
        ["pi2", "pi1"],
        ["pi1", "alpha"],
        ["alpha", "mu"],
        ["mu", "delta"],
        ["mu", "epsilon"],
        ["nu", "alpha"]
      ],
      info: {
        meaning: "A distinctive hunter figure; the three-star belt is the easiest anchor.",
        myth: "In Greek myth, Orion was a great hunter placed among the stars; many cultures have their own Orion-like figure.",
        funFact: "Orion straddles the celestial equator, so it’s visible from much of the world at different times of year."
      }
    },
    {
      id: "taurus",
      name: "Taurus",
      season: "winter",
      stars: [
        { id: "alpha", name: "Aldebaran", ra: ra(4, 35, 55), dec: dec(1, 16, 30, 33), mag: 0.85, role: "outline" },
        { id: "beta", name: "Elnath", ra: ra(5, 26, 17), dec: dec(1, 28, 36, 27), mag: 1.65, role: "outline" },
        { id: "gamma", name: "Hyadum I", ra: ra(4, 19, 47), dec: dec(1, 15, 37, 39), mag: 3.65, role: "outline" },
        { id: "delta", name: "Hyadum II", ra: ra(4, 22, 56), dec: dec(1, 17, 32, 33), mag: 3.76, role: "outline" },
        { id: "epsilon", name: "Ain", ra: ra(4, 28, 37), dec: dec(1, 19, 10, 49), mag: 3.53, role: "outline" },
        { id: "lambda", name: "Lambda", ra: ra(4, 0, 41), dec: dec(1, 12, 29, 25), mag: 3.41, role: "outline" },
        { id: "mu", name: "Mu", ra: ra(4, 15, 32), dec: dec(1, 8, 53, 32), mag: 4.29, role: "outline" },
        { id: "nu", name: "Nu", ra: ra(4, 3, 9), dec: dec(1, 5, 59, 43), mag: 3.91, role: "context" },
        { id: "xi", name: "Xi", ra: ra(3, 45, 12), dec: dec(1, 9, 43, 8), mag: 3.74, role: "context" },
        { id: "omicron", name: "Omicron", ra: ra(3, 24, 19), dec: dec(1, 9, 1, 44), mag: 3.6, role: "context" },
        { id: "zeta", name: "Zeta", ra: ra(5, 37, 38), dec: dec(1, 21, 8, 33), mag: 2.97, role: "outline" },
        { id: "eta", name: "Eta", ra: ra(3, 47, 29), dec: dec(1, 24, 6, 18), mag: 2.87, role: "context" },
        { id: "theta1", name: "Theta1", ra: ra(4, 28, 34), dec: dec(1, 15, 57, 43), mag: 3.84, role: "outline" },
        { id: "theta2", name: "Theta2", ra: ra(4, 29, 43), dec: dec(1, 15, 52, 15), mag: 3.4, role: "outline" },
        { id: "iota", name: "Iota", ra: ra(5, 3, 5), dec: dec(1, 21, 35, 24), mag: 4.62, role: "outline" }
      ],
      connectionsStandard: [
        ["lambda", "xi"],
        ["xi", "omicron"],
        ["omicron", "eta"],
        ["eta", "gamma"],
        ["gamma", "delta"],
        ["delta", "epsilon"],
        ["epsilon", "theta1"],
        ["theta1", "theta2"],
        ["theta2", "alpha"],
        ["alpha", "iota"],
        ["iota", "zeta"],
        ["zeta", "beta"],
        ["beta", "alpha"],
        ["alpha", "gamma"],
        ["delta", "theta2"],
        ["theta1", "alpha"],
        ["alpha", "mu"],
        ["mu", "lambda"]
      ],
      connectionsHard: [
        ["lambda", "xi"],
        ["xi", "omicron"],
        ["omicron", "eta"],
        ["eta", "gamma"],
        ["gamma", "delta"],
        ["delta", "epsilon"],
        ["epsilon", "theta1"],
        ["theta1", "theta2"],
        ["theta2", "alpha"],
        ["alpha", "iota"],
        ["iota", "zeta"],
        ["zeta", "beta"],
        ["beta", "alpha"],
        ["alpha", "gamma"],
        ["delta", "theta2"],
        ["theta1", "alpha"],
        ["alpha", "mu"],
        ["mu", "lambda"],
        ["lambda", "nu"],
        ["nu", "xi"],
        ["omicron", "theta2"],
        ["theta2", "epsilon"]
      ],
      info: {
        meaning: "A bull’s face (the Hyades 'V') with horns reaching up; Aldebaran is the bright eye.",
        myth: "Often linked to Zeus and the bull in Greek myth, though bull imagery appears across many ancient sky traditions.",
        funFact: "The Pleiades cluster sits nearby—often mistaken as part of Taurus by beginners."
      }
    },
    {
      id: "gemini",
      name: "Gemini",
      season: "winter",
      stars: [
        { id: "alpha", name: "Castor", ra: ra(7, 34, 36), dec: dec(1, 31, 53, 18), mag: 1.58, role: "outline" },
        { id: "beta", name: "Pollux", ra: ra(7, 45, 19), dec: dec(1, 28, 1, 34), mag: 1.14, role: "outline" },
        { id: "gamma", name: "Alhena", ra: ra(6, 37, 42), dec: dec(1, 16, 23, 57), mag: 1.93, role: "outline" },
        { id: "delta", name: "Wasat", ra: ra(7, 20, 7), dec: dec(1, 21, 58, 56), mag: 3.53, role: "outline" },
        { id: "eps", name: "Mebsuta", ra: ra(6, 43, 55), dec: dec(1, 25, 7, 52), mag: 3.06, role: "outline" },
        { id: "zeta", name: "Mekbuda", ra: ra(7, 4, 6), dec: dec(1, 20, 34, 13), mag: 3.79, role: "outline" },
        { id: "eta", name: "Propus", ra: ra(6, 14, 52), dec: dec(1, 22, 30, 24), mag: 3.31, role: "outline" },
        { id: "mu", name: "Tejat", ra: ra(6, 22, 57), dec: dec(1, 22, 30, 49), mag: 2.87, role: "outline" },
        { id: "theta", name: "Theta", ra: ra(6, 52, 47), dec: dec(1, 33, 57, 40), mag: 3.6, role: "context" },
        { id: "iota", name: "Iota", ra: ra(7, 25, 43), dec: dec(1, 27, 47, 53), mag: 3.78, role: "context" },
        { id: "kappa", name: "Kappa", ra: ra(7, 44, 26), dec: dec(1, 24, 23, 53), mag: 3.57, role: "context" },
        { id: "lambda", name: "Lambda", ra: ra(7, 18, 5), dec: dec(1, 16, 32, 25), mag: 3.58, role: "context" },
        { id: "nu", name: "Nu", ra: ra(6, 28, 57), dec: dec(1, 20, 12, 43), mag: 4.15, role: "context" },
        { id: "xi", name: "Xi", ra: ra(6, 45, 17), dec: dec(1, 12, 53, 44), mag: 3.35, role: "context" },
        { id: "rho", name: "Rho", ra: ra(7, 29, 6), dec: dec(1, 31, 47, 4), mag: 4.16, role: "outline" },
        { id: "tau", name: "Tau", ra: ra(7, 11, 8), dec: dec(1, 30, 14, 43), mag: 4.42, role: "outline" },
        { id: "ups", name: "Upsilon", ra: ra(7, 35, 55), dec: dec(1, 26, 53, 44), mag: 4.06, role: "outline" }
      ],
      connectionsStandard: [
        ["alpha", "tau"],
        ["tau", "eps"],
        ["eps", "mu"],
        ["mu", "eta"],
        ["beta", "ups"],
        ["ups", "delta"],
        ["delta", "zeta"],
        ["zeta", "gamma"],
        ["delta", "mu"]
      ],
      connectionsHard: [
        ["alpha", "rho"],
        ["alpha", "tau"],
        ["rho", "tau"],
        ["tau", "theta"],
        ["beta", "ups"],
        ["ups", "iota"],
        ["ups", "kappa"],
        ["ups", "delta"],
        ["iota", "tau"],
        ["tau", "eps"],
        ["eps", "mu"],
        ["mu", "eta"],
        ["mu", "nu"],
        ["eps", "nu"],
        ["delta", "zeta"],
        ["zeta", "gamma"],
        ["gamma", "xi"],
        ["xi", "lambda"],
        ["delta", "lambda"],
        ["delta", "mu"]
      ],
      info: {
        meaning: "The Twins — Castor and Pollux.",
        myth: "In Greek myth, the twins were brothers, one mortal and one divine.",
        funFact: "Gemini is associated with duality and is prominent in winter skies."
      }
    },
    {
      id: "canis_major",
      name: "Canis Major",
      season: "winter",
      stars: [
        { id: "alpha", name: "Sirius", ra: ra(6, 45, 8), dec: dec(-1, 16, 42, 58), mag: -1.46, role: "outline" },
        { id: "beta", name: "Mirzam", ra: ra(6, 22, 42), dec: dec(-1, 17, 57, 21), mag: 1.98, role: "outline" },
        { id: "gamma", name: "Muliphein", ra: ra(7, 3, 46), dec: dec(-1, 15, 37, 59), mag: 4.12, role: "outline" },
        { id: "delta", name: "Wezen", ra: ra(7, 8, 23), dec: dec(-1, 26, 23, 36), mag: 1.83, role: "outline" },
        { id: "epsilon", name: "Adhara", ra: ra(6, 58, 38), dec: dec(-1, 28, 58, 19), mag: 1.5, role: "outline" },
        { id: "eta", name: "Aludra", ra: ra(7, 24, 5), dec: dec(-1, 29, 18, 12), mag: 2.45, role: "outline" },
        { id: "kappa", name: "Kappa", ra: ra(6, 49, 51), dec: dec(-1, 32, 30, 30), mag: 3.96, role: "context" },
        { id: "iota", name: "Iota", ra: ra(6, 56, 8), dec: dec(-1, 17, 3, 15), mag: 4.36, role: "context" },
        { id: "theta", name: "Theta", ra: ra(7, 2, 17), dec: dec(-1, 12, 30, 46), mag: 4.07, role: "context" },
        { id: "zeta", name: "Furud", ra: ra(6, 20, 19), dec: dec(-1, 30, 3, 40), mag: 3.02, role: "context" },
        { id: "omicron", name: "Omicron", ra: ra(6, 54, 7), dec: dec(-1, 24, 11, 12), mag: 3.79, role: "context" },
        { id: "sigma", name: "Sigma", ra: ra(7, 1, 43), dec: dec(-1, 27, 56, 6), mag: 3.47, role: "context" }
      ],
      connectionsStandard: [
        ["beta", "alpha"],
        ["alpha", "epsilon"],
        ["epsilon", "delta"],
        ["delta", "eta"],
        ["delta", "gamma"],
        ["gamma", "alpha"]
      ],
      connectionsHard: [
        ["beta", "alpha"],
        ["alpha", "epsilon"],
        ["epsilon", "delta"],
        ["delta", "eta"],
        ["delta", "gamma"],
        ["gamma", "alpha"],
        ["alpha", "iota"],
        ["iota", "epsilon"],
        ["epsilon", "omicron"],
        ["omicron", "delta"],
        ["delta", "sigma"],
        ["sigma", "eta"],
        ["epsilon", "kappa"],
        ["kappa", "zeta"],
        ["zeta", "beta"],
        ["beta", "theta"],
        ["theta", "gamma"]
      ],
      info: {
        meaning: "Anchored by Sirius (the brightest star in the night sky).",
        myth: "The 'Greater Dog' often accompanies Orion in sky lore.",
        funFact: "Sirius is so bright it can appear to twinkle with intense colors near the horizon."
      }
    },
    {
      id: "cassiopeia",
      name: "Cassiopeia",
      season: "winter",
      stars: [
        {
          id: "a",
          ra: 97.5,
          dec: 33.33
        },
        {
          id: "b",
          ra: 120,
          dec: 20
        },
        {
          id: "c",
          ra: 142.5,
          dec: 35
        },
        {
          id: "d",
          ra: 165,
          dec: 16.67
        },
        {
          id: "e",
          ra: 191.25,
          dec: 31.67
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "e"
        ]
      ],
      info: {
        meaning: "A bold 'W' (or 'M') shape—one of the easiest constellations to spot in the north.",
        myth: "Cassiopeia is a queen in Greek myth, famously vain and placed among the stars.",
        funFact: "Cassiopeia sits near Polaris; it can help you find north when the Big Dipper is low."
      }
    },
    {
      id: "perseus",
      name: "Perseus",
      season: "winter",
      stars: [
        {
          id: "a",
          ra: 210,
          dec: 46.67
        },
        {
          id: "b",
          ra: 228.75,
          dec: 26.67
        },
        {
          id: "c",
          ra: 243.75,
          dec: 36.67
        },
        {
          id: "d",
          ra: 262.5,
          dec: 13.33
        },
        {
          id: "e",
          ra: 281.25,
          dec: 25
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "e"
        ]
      ],
      info: {
        meaning: "A bright, kinked chain near Cassiopeia; it often looks like a bent 'Y' or zig-zag.",
        myth: "Perseus is the hero who defeated Medusa and rescued Andromeda (in one famous telling).",
        funFact: "The Perseus region hosts the famous Double Cluster (a binocular favorite)."
      }
    },
    {
      id: "auriga",
      name: "Auriga",
      season: "winter",
      stars: [
        {
          id: "a",
          ra: 112.5,
          dec: 33.33
        },
        {
          id: "b",
          ra: 142.5,
          dec: 43.33
        },
        {
          id: "c",
          ra: 168.75,
          dec: 23.33
        },
        {
          id: "d",
          ra: 150,
          dec: -5
        },
        {
          id: "e",
          ra: 114.38,
          dec: 5
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "e"
        ],
        [
          "e",
          "a"
        ]
      ],
      info: {
        meaning: "A chunky pentagon; Capella is the bright anchor star in the 'charioteer' shape.",
        myth: "Auriga is often linked to a charioteer figure; traditions vary by source.",
        funFact: "Capella is one of the brightest stars in the northern sky."
      }
    },
    {
      id: "canis_minor",
      name: "Canis Minor",
      season: "winter",
      stars: [
        {
          id: "a",
          ra: 228.75,
          dec: 6.67
        },
        {
          id: "b",
          ra: 262.5,
          dec: -10
        }
      ],
      connections: [
        [
          "a",
          "b"
        ]
      ],
      info: {
        meaning: "A small, simple constellation—often just a short line anchored by bright Procyon.",
        myth: "The 'Lesser Dog' is often paired in sky lore with Canis Major.",
        funFact: "Procyon forms the Winter Triangle with Sirius and Betelgeuse in many sky guides."
      }
    },
    {
      id: "lepus",
      name: "Lepus",
      season: "winter",
      stars: [
        {
          id: "a",
          ra: 123.75,
          dec: -16.67
        },
        {
          id: "b",
          ra: 157.5,
          dec: -20
        },
        {
          id: "c",
          ra: 168.75,
          dec: -46.67
        },
        {
          id: "d",
          ra: 135,
          dec: -53.33
        },
        {
          id: "e",
          ra: 112.5,
          dec: -38.33
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "e"
        ],
        [
          "e",
          "a"
        ]
      ],
      info: {
        meaning: "A compact quadrilateral-ish outline below Orion—often shown as a little 'boxy' rabbit.",
        myth: "Lepus is the hare; in some lore it’s chased by Orion.",
        funFact: "It sits just south of Orion, making it a good 'next step' constellation for learners."
      }
    },
    {
      id: "ursa_major_dipper",
      name: "Ursa Major (Big Dipper)",
      season: "winter",
      stars: [
        {
          id: "a",
          ra: 195,
          dec: 43.33
        },
        {
          id: "b",
          ra: 225,
          dec: 36.67
        },
        {
          id: "c",
          ra: 232.5,
          dec: 10
        },
        {
          id: "d",
          ra: 202.5,
          dec: 5
        },
        {
          id: "e",
          ra: 170.63,
          dec: 13.33
        },
        {
          id: "f",
          ra: 148.13,
          dec: 26.67
        },
        {
          id: "g",
          ra: 129.38,
          dec: 40
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "a"
        ],
        [
          "d",
          "e"
        ],
        [
          "e",
          "f"
        ],
        [
          "f",
          "g"
        ]
      ],
      info: {
        meaning: "The Big Dipper asterism is a ladle shape; the two 'pointer stars' help locate Polaris.",
        myth: "Ursa Major is the Great Bear in Greek tradition, but bear stories appear in many cultures.",
        funFact: "The bowl’s edge stars are used as pointers to Polaris (the North Star)."
      }
    }
  ],
  summer: [
    {
      id: "lyra",
      name: "Lyra",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 97.5,
          dec: 20
        },
        {
          id: "b",
          ra: 120,
          dec: -1.67
        },
        {
          id: "c",
          ra: 110.63,
          dec: -20
        },
        {
          id: "d",
          ra: 88.13,
          dec: -8.33
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "b"
        ]
      ],
      info: {
        meaning: "A small lyre/harp shape anchored by bright Vega.",
        myth: "Associated with the lyre of Orpheus in Greek tradition.",
        funFact: "Vega is one of the brightest stars and part of the Summer Triangle (with Deneb and Altair)."
      }
    },
    {
      id: "cygnus",
      name: "Cygnus",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 195,
          dec: 50
        },
        {
          id: "b",
          ra: 195,
          dec: 10
        },
        {
          id: "c",
          ra: 195,
          dec: -46.67
        },
        {
          id: "d",
          ra: 165,
          dec: 0
        },
        {
          id: "e",
          ra: 225,
          dec: 0
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "d",
          "b"
        ],
        [
          "b",
          "e"
        ]
      ],
      info: {
        meaning: "Often recognized as the 'Northern Cross' in the Milky Way.",
        myth: "Cygnus is linked to several swan myths (multiple Greek stories reuse the swan motif).",
        funFact: "Albireo (at the foot) is a famous double star in small telescopes."
      }
    },
    {
      id: "aquila",
      name: "Aquila",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 262.5,
          dec: -16.67
        },
        {
          id: "b",
          ra: 243.75,
          dec: -6.67
        },
        {
          id: "c",
          ra: 281.25,
          dec: -5
        },
        {
          id: "d",
          ra: 270,
          dec: -38.33
        }
      ],
      connections: [
        [
          "b",
          "a"
        ],
        [
          "a",
          "c"
        ],
        [
          "a",
          "d"
        ]
      ],
      info: {
        meaning: "Aquila is anchored by Altair; a small 'winged' stick shape around it.",
        myth: "Often associated with the eagle of Zeus (varies by retelling).",
        funFact: "Altair is the third star of the Summer Triangle, alongside Vega and Deneb."
      }
    },
    {
      id: "scorpius",
      name: "Scorpius",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 210,
          dec: 40
        },
        {
          id: "b",
          ra: 228.75,
          dec: 23.33
        },
        {
          id: "c",
          ra: 243.75,
          dec: 3.33
        },
        {
          id: "d",
          ra: 228.75,
          dec: -23.33
        },
        {
          id: "e",
          ra: 251.25,
          dec: -46.67
        },
        {
          id: "f",
          ra: 270,
          dec: -58.33
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "e"
        ],
        [
          "e",
          "f"
        ]
      ],
      info: {
        meaning: "A long, curved 'hook' shape; often drawn as a scorpion tail.",
        myth: "In Greek myth, Scorpius is sent against Orion; the two are often placed in opposite parts of the sky.",
        funFact: "Antares (near the middle) is a red supergiant often called the scorpion’s 'heart'."
      }
    },
    {
      id: "sagittarius_teapot",
      name: "Sagittarius (Teapot)",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 228.75,
          dec: -23.33
        },
        {
          id: "b",
          ra: 210,
          dec: -36.67
        },
        {
          id: "c",
          ra: 247.5,
          dec: -41.67
        },
        {
          id: "d",
          ra: 232.5,
          dec: -61.67
        },
        {
          id: "e",
          ra: 266.25,
          dec: -50
        },
        {
          id: "f",
          ra: 187.5,
          dec: -50
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "a",
          "c"
        ],
        [
          "b",
          "d"
        ],
        [
          "c",
          "d"
        ],
        [
          "c",
          "e"
        ],
        [
          "b",
          "f"
        ]
      ],
      info: {
        meaning: "A famous 'teapot' outline—great for learning the Milky Way direction in summer.",
        myth: "Sagittarius is often depicted as an archer; the teapot is a modern recognition aid.",
        funFact: "The spout points toward the dense Milky Way near the Galactic Center."
      }
    },
    {
      id: "hercules_keystone",
      name: "Hercules (Keystone)",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 112.5,
          dec: 33.33
        },
        {
          id: "b",
          ra: 146.25,
          dec: 30
        },
        {
          id: "c",
          ra: 155.63,
          dec: 0
        },
        {
          id: "d",
          ra: 121.88,
          dec: -5
        },
        {
          id: "e",
          ra: 93.75,
          dec: 11.67
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "a"
        ],
        [
          "a",
          "e"
        ],
        [
          "d",
          "e"
        ]
      ],
      info: {
        meaning: "The Keystone is a lopsided quadrilateral—the easiest anchor for finding Hercules.",
        myth: "Linked to Heracles/Hercules and his labors; exact sky mapping varies by tradition.",
        funFact: "M13 (the Great Hercules Cluster) sits near the Keystone—an iconic telescope target."
      }
    },
    {
      id: "corona_borealis",
      name: "Corona Borealis",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 195,
          dec: 20
        },
        {
          id: "b",
          ra: 210,
          dec: 28.33
        },
        {
          id: "c",
          ra: 226.88,
          dec: 31.67
        },
        {
          id: "d",
          ra: 243.75,
          dec: 26.67
        },
        {
          id: "e",
          ra: 256.88,
          dec: 16.67
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "e"
        ]
      ],
      info: {
        meaning: "A delicate arc like a small crown; easy to recognize once you spot the curve.",
        myth: "Often called the 'Northern Crown' in Western tradition.",
        funFact: "The star Gemma (Alphecca) is the brightest in the arc and marks the crown’s jewel."
      }
    },
    {
      id: "delphinus",
      name: "Delphinus",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 255,
          dec: 16.67
        },
        {
          id: "b",
          ra: 270,
          dec: 6.67
        },
        {
          id: "c",
          ra: 258.75,
          dec: -5
        },
        {
          id: "d",
          ra: 243.75,
          dec: 6.67
        },
        {
          id: "e",
          ra: 230.63,
          dec: -11.67
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "a"
        ],
        [
          "c",
          "e"
        ]
      ],
      info: {
        meaning: "A small diamond with a tail—often described as a little 'kite' shape.",
        myth: "Delphinus is tied to dolphin myths and maritime stories in several traditions.",
        funFact: "It’s compact and faint, but the diamond shape makes it a fun pattern-hunt."
      }
    },
    {
      id: "ophiuchus",
      name: "Ophiuchus",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 157.5,
          dec: 36.67
        },
        {
          id: "b",
          ra: 176.25,
          dec: 20
        },
        {
          id: "c",
          ra: 195,
          dec: 5
        },
        {
          id: "d",
          ra: 178.13,
          dec: -16.67
        },
        {
          id: "e",
          ra: 153.75,
          dec: -6.67
        },
        {
          id: "f",
          ra: 210,
          dec: -13.33
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "e"
        ],
        [
          "e",
          "b"
        ],
        [
          "c",
          "f"
        ]
      ],
      info: {
        meaning: "A broad, human-like outline; many guides show it as a large arc with a central spine.",
        myth: "Often identified with Asclepius, a healer figure, associated with the serpent (nearby Serpens).",
        funFact: "Ophiuchus lies along the ecliptic; it’s sometimes called a '13th zodiac' constellation region."
      }
    },
    {
      id: "draco",
      name: "Draco",
      season: "summer",
      stars: [
        {
          id: "a",
          ra: 97.5,
          dec: 46.67
        },
        {
          id: "b",
          ra: 123.75,
          dec: 36.67
        },
        {
          id: "c",
          ra: 146.25,
          dec: 20
        },
        {
          id: "d",
          ra: 135,
          dec: -1.67
        },
        {
          id: "e",
          ra: 112.5,
          dec: -20
        },
        {
          id: "f",
          ra: 86.25,
          dec: -33.33
        }
      ],
      connections: [
        [
          "a",
          "b"
        ],
        [
          "b",
          "c"
        ],
        [
          "c",
          "d"
        ],
        [
          "d",
          "e"
        ],
        [
          "e",
          "f"
        ]
      ],
      info: {
        meaning: "A long, winding dragon-like chain near the north; often drawn as a sinuous curve.",
        myth: "Draco is a dragon in Greek tradition; 'dragon' sky figures appear widely across cultures.",
        funFact: "Thuban in Draco was the North Star around 2700 BCE due to Earth’s precession."
      }
    }
  ]
};

  window.CONSTELLATION_PACKS = PACKS;
})();
