/* global Phaser */

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    // runtime state
    this.constellation = null;
    this.starSprites = null;
    this.starMap = null;

    this.selectedStarId = null;

    this.requiredEdges = null; // Set(edgeKey)
    this.correctEdges = null; // Set(edgeKey)
    this.wrongEdges = null; // Set(edgeKey)

    this.linesGfx = null;
    this.hintGfx = null;

    this.roundOver = false;
  }

  // ---------- Data ----------
  _getConstellationData() {
    // NOTE: This is a simplified educational MVP dataset:
    // - star positions are "screen-space approximations" for gameplay
    // - edges are common "stick figure" connections
    // You can swap these to real RA/Dec-derived positions later.
    const winter = [
      {
        id: "orion",
        season: "winter",
        name: "Orion",
        stars: [
          { id: "betelgeuse", x: 210, y: 170 },
          { id: "bellatrix", x: 320, y: 175 },
          { id: "alnitak", x: 270, y: 250 },
          { id: "alnilam", x: 305, y: 270 },
          { id: "mintaka", x: 340, y: 250 },
          { id: "saiph", x: 280, y: 360 },
          { id: "rigel", x: 380, y: 370 }
        ],
        connections: [
          ["betelgeuse", "bellatrix"],
          ["betelgeuse", "alnitak"],
          ["bellatrix", "mintaka"],
          ["alnitak", "alnilam"],
          ["alnilam", "mintaka"],
          ["alnitak", "saiph"],
          ["mintaka", "rigel"],
          ["saiph", "rigel"]
        ],
        info: {
          myth:
            "In Greek tradition, Orion is a giant hunter. Many cultures have their own Orion stories—often as a warrior, hunter, or heroic figure.",
          meaning:
            "Orion is one of the easiest constellations to recognize thanks to the three aligned 'Belt' stars.",
          funFact:
            "Orion straddles the celestial equator, so it’s visible from much of the world at different times of year."
        }
      },
      {
        id: "taurus",
        season: "winter",
        name: "Taurus",
        stars: [
          { id: "aldebaran", x: 560, y: 250 },
          { id: "elnath", x: 700, y: 180 },
          { id: "zeta", x: 640, y: 260 },
          { id: "beta", x: 710, y: 240 },
          { id: "gamma", x: 650, y: 330 }
        ],
        connections: [
          ["aldebaran", "zeta"],
          ["zeta", "elnath"],
          ["elnath", "beta"],
          ["beta", "gamma"],
          ["gamma", "aldebaran"]
        ],
        info: {
          myth:
            "Taurus is often linked to the bull in Greek myth (including stories associated with Zeus), but bull imagery appears in many ancient sky traditions.",
          meaning:
            "A classic bull outline: look for bright Aldebaran and the 'horns' reaching upward.",
          funFact:
            "The Pleiades star cluster appears near Taurus in the sky and is a famous target for stargazers."
        }
      }
    ];

    const summer = [
      {
        id: "scorpius",
        season: "summer",
        name: "Scorpius",
        stars: [
          { id: "antarest", x: 650, y: 240 },
          { id: "dschubba", x: 610, y: 180 },
          { id: "sargas", x: 760, y: 420 },
          { id: "shaula", x: 820, y: 460 },
          { id: "lesath", x: 800, y: 440 },
          { id: "jabbah", x: 570, y: 150 },
          { id: "girtab", x: 720, y: 340 }
        ],
        connections: [
          ["jabbah", "dschubba"],
          ["dschubba", "antarest"],
          ["antarest", "girtab"],
          ["girtab", "sargas"],
          ["sargas", "lesath"],
          ["lesath", "shaula"]
        ],
        info: {
          myth:
            "In Greek myth, Scorpius is the scorpion associated with Orion’s story. Many cultures connect it with a scorpion or a hooked creature.",
          meaning:
            "A bright, curved 'J' shape—Antares marks the scorpion’s heart.",
          funFact:
            "Antares is a reddish supergiant star—often called a 'rival of Mars' because of its color."
        }
      },
      {
        id: "lyra",
        season: "summer",
        name: "Lyra",
        stars: [
          { id: "vega", x: 260, y: 150 },
          { id: "sheliak", x: 330, y: 240 },
          { id: "sulafat", x: 230, y: 260 },
          { id: "delta", x: 290, y: 280 }
        ],
        connections: [
          ["vega", "sheliak"],
          ["sheliak", "delta"],
          ["delta", "sulafat"],
          ["sulafat", "vega"]
        ],
        info: {
          myth:
            "Lyra is the lyre (a stringed instrument), often tied to stories of music and poetry in ancient traditions.",
          meaning:
            "A compact shape anchored by very bright Vega.",
          funFact:
            "Vega is one of the brightest stars in the night sky and part of the 'Summer Triangle' (with Deneb and Altair)."
        }
      }
    ];

    return { winter, summer };
  }

  // ---------- Helpers ----------
  _edgeKey(a, b) {
    // normalize undirected edge key
    return a < b ? `${a}|${b}` : `${b}|${a}`;
  }

  _pickRandomConstellation(season) {
    const packs = this._getConstellationData();
    const list = season === "summer" ? packs.summer : packs.winter;
    return Phaser.Utils.Array.GetRandom(list);
  }

  _getPackList(season) {
    const packs = this._getConstellationData();
    return season === "summer" ? packs.summer : packs.winter;
  }

  _pickRandomConstellationFromList(list, avoidId) {
    if (!list || list.length === 0) return null;
    if (list.length === 1) return list[0];

    let pick = Phaser.Utils.Array.GetRandom(list);
    let safety = 10;
    while (pick && pick.id === avoidId && safety-- > 0) {
      pick = Phaser.Utils.Array.GetRandom(list);
    }
    return pick;
  }

  _emitRoundData() {
    this.game.events.emit("roundData", {
      name: this.constellation.name,
      season: this.constellation.season,
      info: this.constellation.info
    });
  }

  // ---------- Phaser lifecycle ----------
  create() {
    this.roundOver = false;

    const W = this.scale.width;
    const H = this.scale.height;

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, 0x0b1020, 1);

    // Pick constellation based on selected season
    const season = this.registry.get("season") || "winter";
    const list = this._getPackList(season);
    const first = this._pickRandomConstellationFromList(list, null);

    // Graphics layers
    this.hintGfx = this.add.graphics();
    this.linesGfx = this.add.graphics();

    // Start first round
    this._startNewRound(first);

    // Instructions overlay (light)
    this.add.text(16, H - 24, "Click stars to connect them. Complete all required connections (any order).", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#9aa7ff"
    });

    // Listen for UI commands
    this.game.events.on("uiReset", this._resetRound, this);
    this.game.events.on("uiToggleHint", this._drawHintOverlay, this);
    this.game.events.on("uiNext", this._nextRound, this);
    this.game.events.on("uiNextConstellation", this._nextConstellation, this);

  }

  update() {
    // GameScene itself doesn’t drive timer; UIScene does in timed mode.
  }

  // ---------- Gameplay ----------
  _onStarClicked(starId) {
    // First click selects
    if (!this.selectedStarId) {
      this.selectedStarId = starId;
      this._setSelectedVisual(starId, true);
      return;
    }

    // Clicking same star just re-selects
    if (this.selectedStarId === starId) return;

    const a = this.selectedStarId;
    const b = starId;
    const key = this._edgeKey(a, b);

    // Already drawn edge? ignore but update selection to new star (feels smooth)
    if (this.correctEdges.has(key) || this.wrongEdges.has(key)) {
      this._setSelectedVisual(this.selectedStarId, false);
      this.selectedStarId = starId;
      this._setSelectedVisual(this.selectedStarId, true);
      return;
    }

    // Determine correctness
    const isRequired = this.requiredEdges.has(key);

    if (isRequired) {
      this.correctEdges.add(key);
      this._addScore(+100);
      this._drawEdge(a, b, true);
    } else {
      this.wrongEdges.add(key);
      this._addMistake(1);
      this._addScore(-25);
      this._drawEdge(a, b, false);
    }

    // move selection to new star
    this._setSelectedVisual(this.selectedStarId, false);
    this.selectedStarId = starId;
    this._setSelectedVisual(this.selectedStarId, true);

    // completion?
    if (this.correctEdges.size >= this.requiredEdges.size) {
      this._completeRound();
    }
  }

  _setSelectedVisual(starId, selected) {
    const s = this.starMap.get(starId);
    if (!s) return;
    s.sprite.setStrokeStyle(2, selected ? 0xffd166 : 0x7c8cff, 0.95);
    s.sprite.setScale(selected ? 1.35 : 1);
  }

  _drawEdge(aId, bId, isCorrect) {
    const a = this.starMap.get(aId);
    const b = this.starMap.get(bId);
    if (!a || !b) return;

    // Thicker line for correct, thinner for wrong
    const lineWidth = isCorrect ? 4 : 2;

    // Colors:
    // - correct: soft green
    // - wrong: soft red
    const color = isCorrect ? 0x43ffb0 : 0xff5c7a;
    const alpha = isCorrect ? 0.9 : 0.7;

    this.linesGfx.lineStyle(lineWidth, color, alpha);
    this.linesGfx.beginPath();
    this.linesGfx.moveTo(a.x, a.y);
    this.linesGfx.lineTo(b.x, b.y);
    this.linesGfx.strokePath();

    // small endcaps
    this.linesGfx.fillStyle(color, alpha);
    this.linesGfx.fillCircle(a.x, a.y, 2);
    this.linesGfx.fillCircle(b.x, b.y, 2);
  }

  _drawHintOverlay(show) {
    // show can be boolean or undefined; treat truthy as show
    const visible = !!show;

    this.hintGfx.clear();

    if (!visible) return;

    // Faint blueprint of required connections
    this.hintGfx.lineStyle(2, 0xffffff, 0.18);
    for (const [aId, bId] of this.constellation.connections) {
      const a = this.starMap ? this.starMap.get(aId) : null;
      const b = this.starMap ? this.starMap.get(bId) : null;

      // If stars not created yet (early call), fall back to constellation stars
      let ax, ay, bx, by;
      if (a && b) {
        ax = a.x;
        ay = a.y;
        bx = b.x;
        by = b.y;
      } else {
        const sa = this.constellation.stars.find((s) => s.id === aId);
        const sb = this.constellation.stars.find((s) => s.id === bId);
        if (!sa || !sb) continue;
        ax = sa.x;
        ay = sa.y;
        bx = sb.x;
        by = sb.y;
      }

      this.hintGfx.beginPath();
      this.hintGfx.moveTo(ax, ay);
      this.hintGfx.lineTo(bx, by);
      this.hintGfx.strokePath();
    }
  }

  _addScore(delta) {
    const prev = this.registry.get("score") || 0;
    const next = Math.max(0, prev + delta);
    this.registry.set("score", next);

    const mistakes = this.registry.get("mistakes") || 0;
    this.game.events.emit("scoreChanged", {
      score: next,
      mistakes,
      done: this.correctEdges.size,
      total: this.requiredEdges.size
    });
  }

  _addMistake(delta) {
    const prev = this.registry.get("mistakes") || 0;
    const next = Math.max(0, prev + delta);
    this.registry.set("mistakes", next);
  }

  _completeRound() {
    if (this.roundOver) return;
    this.roundOver = true;

    // Clear selection highlight
    if (this.selectedStarId) this._setSelectedVisual(this.selectedStarId, false);
    this.selectedStarId = null;

    this.game.events.emit("roundComplete", {
      name: this.constellation.name,
      score: this.registry.get("score") || 0,
      mistakes: this.registry.get("mistakes") || 0
    });
  }

  _resetRound() {
    if (this.selectedStarId) this._setSelectedVisual(this.selectedStarId, false);
    this.selectedStarId = null;

    this.roundOver = false;

    this.correctEdges.clear();
    this.wrongEdges.clear();

    this.linesGfx.clear();

    this.registry.set("score", 0);
    this.registry.set("mistakes", 0);

    this.game.events.emit("scoreChanged", {
      score: 0,
      mistakes: 0,
      done: 0,
      total: this.requiredEdges.size
    });

    // keep hint state as-is; UIScene will re-toggle if needed
  }

  _startNewRound(newConstellation) {
    if (!newConstellation) return;

    if (this.starSprites) {
      this.starSprites.forEach((s) => s.destroy());
    }
    this.starSprites = [];
    this.starMap = new Map();

    if (this.linesGfx) this.linesGfx.clear();
    if (this.hintGfx) this.hintGfx.clear();

    this.roundOver = false;
    this.selectedStarId = null;

    this.constellation = newConstellation;

    this.requiredEdges = new Set();
    this.correctEdges = new Set();
    this.wrongEdges = new Set();

    for (const [a, b] of this.constellation.connections) {
      this.requiredEdges.add(this._edgeKey(a, b));
    }

    const starsGfx = this.add.graphics();

    for (const s of this.constellation.stars) {
      starsGfx.fillStyle(0xffffff, 0.08);
      starsGfx.fillCircle(s.x, s.y, 14);

      const dot = this.add.circle(s.x, s.y, 5, 0xffffff, 1)
        .setStrokeStyle(2, 0x7c8cff, 0.9)
        .setInteractive({ useHandCursor: true });

      dot.starId = s.id;

      dot.on("pointerover", () => {
        if (this.roundOver) return;
        dot.setScale(1.25);
      });

      dot.on("pointerout", () => {
        dot.setScale(1);
      });

      dot.on("pointerdown", () => {
        if (this.roundOver) return;
        this._onStarClicked(dot.starId);
      });

      this.starSprites.push(dot);
      this.starMap.set(s.id, { x: s.x, y: s.y, sprite: dot });
    }

    this.registry.set("score", 0);
    this.registry.set("mistakes", 0);

    this._emitRoundData();
    this.game.events.emit("scoreChanged", {
      score: 0,
      mistakes: 0,
      done: 0,
      total: this.requiredEdges.size
    });

    this._drawHintOverlay(false);
  }

  _nextConstellation() {
    const season = this.registry.get("season") || "winter";
    const list = this._getPackList(season);
    const next = this._pickRandomConstellationFromList(
      list,
      this.constellation ? this.constellation.id : null
    );
    if (!next) return;

    if (this.selectedStarId) this._setSelectedVisual(this.selectedStarId, false);
    this.selectedStarId = null;

    this._startNewRound(next);
  }

  _nextRound() {
    // Go back to Boot menu for now (simple loop). You can switch to "next random in same pack" later.
    this.game.events.off("uiReset", this._resetRound, this);
    this.game.events.off("uiToggleHint", this._drawHintOverlay, this);
    this.game.events.off("uiNext", this._nextRound, this);
    this.game.events.off("uiNextConstellation", this._nextConstellation, this);

    this.scene.stop("UIScene");
    this.scene.start("BootScene");
  }

  shutdown() {
    // safety: remove listeners if Phaser calls shutdown
    this.game.events.off("uiReset", this._resetRound, this);
    this.game.events.off("uiToggleHint", this._drawHintOverlay, this);
    this.game.events.off("uiNext", this._nextRound, this);
    this.game.events.off("uiNextConstellation", this._nextConstellation, this);
  }
}
