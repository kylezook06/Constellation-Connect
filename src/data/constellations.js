// Global, data-driven constellation packs (no modules).
// GameScene will read from window.CONSTELLATION_PACKS.

(function () {
  const ra = (h, m, s = 0) => (h + m / 60 + s / 3600) * 15;
  const dec = (sign, d, m = 0, s = 0) => sign * (d + m / 60 + s / 3600);
  const buildHipStars = (hips, outlineHips) => {
    const unique = Array.from(new Set(hips));
    const count = unique.length || 1;
    const step = (Math.PI * 2) / count;
    return unique.map((hip, index) => ({
      id: hip,
      hip,
      name: `HIP ${hip}`,
      ra: (index / count) * 360,
      dec: Math.sin(step * index) * 30,
      role: outlineHips.has(hip) ? "outline" : "context"
    }));
  };
  const ORION_STANDARD = [
    [27989, 26727],
    [25336, 25930],
    [26727, 26311],
    [26311, 25930],
    [26727, 27366],
    [25930, 24436],
    [27989, 25336]
  ];
  const ORION_HARD = [
    ...ORION_STANDARD,
    [26207, 27989],
    [26207, 25336],
    [22449, 22509],
    [22449, 22730],
    [22449, 25336],
    [27989, 28716],
    [28716, 29426]
  ];
  const ORION_OUTLINE = new Set(ORION_STANDARD.flat());
  const ORION_HIPS = ORION_HARD.flat();

  const TAURUS_STANDARD = [
    [21421, 20889],
    [20889, 20455],
    [20455, 20205],
    [20205, 21421],
    [20889, 25428],
    [21421, 26451]
  ];
  const TAURUS_HARD = [
    ...TAURUS_STANDARD,
    [21421, 18724],
    [18724, 16083],
    [16083, 15900],
    [18724, 16852],
    [20455, 17702]
  ];
  const TAURUS_OUTLINE = new Set(TAURUS_STANDARD.flat());
  const TAURUS_HIPS = TAURUS_HARD.flat();

  const GEMINI_STANDARD = [
    [36850, 34693],
    [34693, 32246],
    [32246, 30883],
    [30883, 31681],
    [28734, 29655],
    [29655, 30883],
    [34693, 35550],
    [35550, 34088],
    [34088, 31681]
  ];
  const GEMINI_HARD = [
    ...GEMINI_STANDARD,
    [35550, 36962],
    [36962, 37740],
    [37740, 37826],
    [34088, 36046],
    [32362, 29655]
  ];
  const GEMINI_OUTLINE = new Set(GEMINI_STANDARD.flat());
  const GEMINI_HIPS = GEMINI_HARD.flat();

  const CANIS_MAJOR_STANDARD = [
    [32349, 30324],
    [32349, 34444],
    [34444, 33579],
    [34444, 35904]
  ];
  const CANIS_MAJOR_HARD = [
    ...CANIS_MAJOR_STANDARD,
    [32349, 33977],
    [33977, 34444],
    [33579, 33856],
    [33579, 30122]
  ];
  const CANIS_MAJOR_OUTLINE = new Set(CANIS_MAJOR_STANDARD.flat());
  const CANIS_MAJOR_HIPS = CANIS_MAJOR_HARD.flat();

  const PACKS = {
  winter: [
    {
      id: "orion",
      name: "Orion",
      season: "winter",
      stars: buildHipStars(ORION_HIPS, ORION_OUTLINE),
      connectionsStandard: ORION_STANDARD,
      connectionsHard: ORION_HARD,
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
      stars: buildHipStars(TAURUS_HIPS, TAURUS_OUTLINE),
      connectionsStandard: TAURUS_STANDARD,
      connectionsHard: TAURUS_HARD,
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
      stars: buildHipStars(GEMINI_HIPS, GEMINI_OUTLINE),
      connectionsStandard: GEMINI_STANDARD,
      connectionsHard: GEMINI_HARD,
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
      stars: buildHipStars(CANIS_MAJOR_HIPS, CANIS_MAJOR_OUTLINE),
      connectionsStandard: CANIS_MAJOR_STANDARD,
      connectionsHard: CANIS_MAJOR_HARD,
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
