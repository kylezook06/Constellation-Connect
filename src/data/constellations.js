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
      }
    ]
  };

  window.CONSTELLATION_PACKS = PACKS;
})();
