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
          { id: "a", x: 280, y: 150 },
          { id: "b", x: 420, y: 190 },
          { id: "c", x: 320, y: 260 },
          { id: "d", x: 370, y: 280 },
          { id: "e", x: 420, y: 305 },
          { id: "f", x: 300, y: 420 },
          { id: "g", x: 450, y: 430 }
        ],
        connections: [
          ["a", "c"],
          ["c", "d"],
          ["d", "e"],
          ["e", "b"],
          ["a", "f"],
          ["b", "g"],
          ["f", "g"],
          ["c", "f"]
        ],
        info: {
          meaning: "A distinctive hunter figure; look for the three-star belt in a straight line.",
          myth: "In Greek myth, Orion was a great hunter placed among the stars. Many cultures also recognize this bold pattern.",
          funFact: "Orion straddles the celestial equator, so it’s visible from much of the world at different times of year."
        }
      },
      {
        id: "taurus",
        name: "Taurus",
        season: "winter",
        stars: [
          { id: "a", x: 520, y: 220 },
          { id: "b", x: 610, y: 160 },
          { id: "c", x: 670, y: 120 },
          { id: "d", x: 590, y: 255 },
          { id: "e", x: 640, y: 210 }
        ],
        connections: [
          ["a", "d"],
          ["d", "e"],
          ["e", "b"],
          ["b", "c"],
          ["a", "e"]
        ],
        info: {
          meaning: "A classic bull outline; look for bright Aldebaran and the 'horns' reaching upward.",
          myth: "Taurus is often linked to the bull in Greek myth (including stories associated with Zeus), but bull imagery appears in many ancient sky traditions.",
          funFact: "The Pleiades star cluster appears near Taurus in the sky and is a famous target for stargazers."
        }
      }
    ],
    summer: [
      {
        id: "lyra",
        name: "Lyra",
        season: "summer",
        stars: [
          { id: "a", x: 270, y: 220 },
          { id: "b", x: 330, y: 300 },
          { id: "c", x: 300, y: 340 },
          { id: "d", x: 240, y: 310 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "b"]
        ],
        info: {
          meaning: "A small lyre/harp shape anchored by bright Vega.",
          myth: "Associated with the lyre of Orpheus in Greek tradition; the instrument motif appears in many retellings.",
          funFact: "Vega is one of the brightest stars in the night sky and part of the Summer Triangle (with Deneb and Altair)."
        }
      },
      {
        id: "scorpius",
        name: "Scorpius",
        season: "summer",
        stars: [
          { id: "a", x: 560, y: 160 },
          { id: "b", x: 600, y: 210 },
          { id: "c", x: 640, y: 270 },
          { id: "d", x: 590, y: 360 },
          { id: "e", x: 650, y: 430 },
          { id: "f", x: 700, y: 455 }
        ],
        connections: [
          ["a", "b"],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"],
          ["e", "f"]
        ],
        info: {
          meaning: "A long, curved 'hook' shape; the bright heart star is often highlighted in depictions.",
          myth: "In Greek myth, Scorpius is the scorpion sent against Orion; the two are often said to occupy opposite seasons in the sky.",
          funFact: "The red supergiant Antares marks the scorpion’s 'heart' and is famous for its reddish hue."
        }
      }
    ]
  };

  window.CONSTELLATION_PACKS = PACKS;
})();
