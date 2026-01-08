// Global, data-driven constellation packs (no modules).
// GameScene will read from window.CONSTELLATION_PACKS.

(function () {
  const PACKS = {
    winter: [
      {
        id: "orion",
        name: "Orion",
        season: "winter",
        stars: [
          { id: "a", x: 250, y: 150 },
          { id: "b", x: 420, y: 170 },
          { id: "c", x: 310, y: 245 },
          { id: "d", x: 345, y: 265 },
          { id: "e", x: 380, y: 285 },
          { id: "f", x: 280, y: 420 },
          { id: "g", x: 460, y: 440 }
        ],
        connections: [
          ["a", "b"],
          ["a", "c"],
          ["c", "d"],
          ["d", "e"],
          ["b", "e"],
          ["c", "f"],
          ["e", "g"],
          ["f", "g"]
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
          { id: "a", x: 560, y: 250 },
          { id: "b", x: 505, y: 205 },
          { id: "c", x: 610, y: 205 },
          { id: "d", x: 660, y: 150 },
          { id: "e", x: 720, y: 110 },
          { id: "f", x: 650, y: 310 }
        ],
        connections: [
          ["b", "a"],
          ["a", "c"],
          ["a", "f"],
          ["c", "d"],
          ["d", "e"]
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
          { id: "a", x: 260, y: 140 },
          { id: "b", x: 350, y: 155 },
          { id: "c", x: 250, y: 230 },
          { id: "d", x: 340, y: 245 },
          { id: "e", x: 240, y: 330 },
          { id: "f", x: 330, y: 345 },
          { id: "g", x: 225, y: 430 },
          { id: "h", x: 315, y: 445 }
        ],
        connections: [
          ["a", "c"],
          ["c", "e"],
          ["e", "g"],
          ["b", "d"],
          ["d", "f"],
          ["f", "h"],
          ["c", "d"]
        ],
        info: {
          meaning: "Two 'twin' columns; look for bright Castor and Pollux close together.",
          myth: "The twins Castor and Pollux (Dioscuri) appear in many Greek and Roman stories.",
          funFact: "Pollux is actually the brighter star, even though Castor gets top billing in the name pairing."
        }
      },
      {
        id: "canis_major",
        name: "Canis Major",
        season: "winter",
        stars: [
          { id: "a", x: 520, y: 320 },
          { id: "b", x: 590, y: 275 },
          { id: "c", x: 650, y: 330 },
          { id: "d", x: 610, y: 400 },
          { id: "e", x: 540, y: 410 }
        ],
        connections: [
          ["b", "a"],
          ["a", "c"],
          ["c", "d"],
          ["d", "e"],
          ["e", "a"]
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
          { id: "a", x: 260, y: 170 },
          { id: "b", x: 320, y: 210 },
          { id: "c", x: 380, y: 165 },
          { id: "d", x: 440, y: 220 },
          { id: "e", x: 510, y: 175 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"]
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
          { id: "a", x: 560, y: 130 },
          { id: "b", x: 610, y: 190 },
          { id: "c", x: 650, y: 160 },
          { id: "d", x: 700, y: 230 },
          { id: "e", x: 750, y: 195 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"]
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
          { id: "a", x: 300, y: 170 },
          { id: "b", x: 380, y: 140 },
          { id: "c", x: 450, y: 200 },
          { id: "d", x: 400, y: 285 },
          { id: "e", x: 305, y: 255 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"],
          ["e", "a"]
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
          { id: "a", x: 610, y: 250 },
          { id: "b", x: 700, y: 300 }
        ],
        connections: [
          ["a", "b"]
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
          { id: "a", x: 330, y: 320 },
          { id: "b", x: 420, y: 330 },
          { id: "c", x: 450, y: 410 },
          { id: "d", x: 360, y: 430 },
          { id: "e", x: 300, y: 385 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"],
          ["e", "a"]
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
          { id: "a", x: 520, y: 140 },
          { id: "b", x: 600, y: 160 },
          { id: "c", x: 620, y: 240 },
          { id: "d", x: 540, y: 255 },
          { id: "e", x: 455, y: 230 },
          { id: "f", x: 395, y: 190 },
          { id: "g", x: 345, y: 150 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "a"],
          ["d", "e"],
          ["e", "f"],
          ["f", "g"]
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
          { id: "a", x: 260, y: 210 },
          { id: "b", x: 320, y: 275 },
          { id: "c", x: 295, y: 330 },
          { id: "d", x: 235, y: 295 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "b"]
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
          { id: "a", x: 520, y: 120 },
          { id: "b", x: 520, y: 240 },
          { id: "c", x: 520, y: 410 },
          { id: "d", x: 440, y: 270 },
          { id: "e", x: 600, y: 270 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["d", "b"],
          ["b", "e"]
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
          { id: "a", x: 700, y: 320 },
          { id: "b", x: 650, y: 290 },
          { id: "c", x: 750, y: 285 },
          { id: "d", x: 720, y: 385 }
        ],
        connections: [
          ["b", "a"],
          ["a", "c"],
          ["a", "d"]
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
          { id: "a", x: 560, y: 150 },
          { id: "b", x: 610, y: 200 },
          { id: "c", x: 650, y: 260 },
          { id: "d", x: 610, y: 340 },
          { id: "e", x: 670, y: 410 },
          { id: "f", x: 720, y: 445 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"],
          ["e", "f"]
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
          { id: "a", x: 610, y: 340 },
          { id: "b", x: 560, y: 380 },
          { id: "c", x: 660, y: 395 },
          { id: "d", x: 620, y: 455 },
          { id: "e", x: 710, y: 420 },
          { id: "f", x: 500, y: 420 }
        ],
        connections: [
          ["a", "b"],
          ["a", "c"],
          ["b", "d"],
          ["c", "d"],
          ["c", "e"],
          ["b", "f"]
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
          { id: "a", x: 300, y: 170 },
          { id: "b", x: 390, y: 180 },
          { id: "c", x: 415, y: 270 },
          { id: "d", x: 325, y: 285 },
          { id: "e", x: 250, y: 235 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "a"],
          ["a", "e"],
          ["d", "e"]
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
          { id: "a", x: 520, y: 210 },
          { id: "b", x: 560, y: 185 },
          { id: "c", x: 605, y: 175 },
          { id: "d", x: 650, y: 190 },
          { id: "e", x: 685, y: 220 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"]
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
          { id: "a", x: 680, y: 220 },
          { id: "b", x: 720, y: 250 },
          { id: "c", x: 690, y: 285 },
          { id: "d", x: 650, y: 250 },
          { id: "e", x: 615, y: 305 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "a"],
          ["c", "e"]
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
          { id: "a", x: 420, y: 160 },
          { id: "b", x: 470, y: 210 },
          { id: "c", x: 520, y: 255 },
          { id: "d", x: 475, y: 320 },
          { id: "e", x: 410, y: 290 },
          { id: "f", x: 560, y: 310 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"],
          ["e", "b"],
          ["c", "f"]
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
          { id: "a", x: 260, y: 130 },
          { id: "b", x: 330, y: 160 },
          { id: "c", x: 390, y: 210 },
          { id: "d", x: 360, y: 275 },
          { id: "e", x: 300, y: 330 },
          { id: "f", x: 230, y: 370 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"],
          ["e", "f"]
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
