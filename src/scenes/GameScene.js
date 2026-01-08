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
    this.starsGfx = null;
    this.drawnSegments = null;

    this.roundOver = false;
  }

  // ---------- Data ----------
  _getConstellationData() {
    const packs = window.CONSTELLATION_PACKS;
    if (!packs || !packs.winter || !packs.summer) {
      console.warn("CONSTELLATION_PACKS not loaded (did you include src/data/constellations.js before GameScene.js?)");
      return { winter: [], summer: [] };
    }
    return packs;
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

  _getSeenMap() {
    return this.registry.get("seenConstellations") || {};
  }

  _isSeen(id) {
    const seen = this._getSeenMap();
    return !!seen[id];
  }

  _markSeen(id) {
    const seen = this._getSeenMap();
    if (!seen[id]) {
      seen[id] = true;
      this.registry.set("seenConstellations", seen);
    }
  }

  _emitRoundData() {
    const hardMode = !!this.registry.get("hardMode");
    const revealed = !hardMode || this._isSeen(this.constellation.id);
    const payload = {
      id: this.constellation.id,
      name: this.constellation.name,
      season: this.constellation.season,
      info: this.constellation.info,
      revealed
    };

    this.registry.set("currentRound", payload);

    this.game.events.emit("roundData", payload);
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
    this.add.text(16, H - 24, "Trace the traditional constellation outline by connecting the correct star pairs (any order).", {
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
  _segmentsIntersect(a, b, c, d) {
    const orient = (p, q, r) => {
      const v = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
      if (Math.abs(v) < 1e-9) return 0;
      return v > 0 ? 1 : 2;
    };

    const onSeg = (p, q, r) => (
      q.x <= Math.max(p.x, r.x) + 1e-9 &&
      q.x >= Math.min(p.x, r.x) - 1e-9 &&
      q.y <= Math.max(p.y, r.y) + 1e-9 &&
      q.y >= Math.min(p.y, r.y) - 1e-9
    );

    const o1 = orient(a, b, c);
    const o2 = orient(a, b, d);
    const o3 = orient(c, d, a);
    const o4 = orient(c, d, b);

    if (o1 !== o2 && o3 !== o4) return true;

    if (o1 === 0 && onSeg(a, c, b)) return true;
    if (o2 === 0 && onSeg(a, d, b)) return true;
    if (o3 === 0 && onSeg(c, a, d)) return true;
    if (o4 === 0 && onSeg(c, b, d)) return true;

    return false;
  }

  _wouldCrossExisting(aId, bId) {
    const A = this.starMap.get(aId);
    const B = this.starMap.get(bId);
    if (!A || !B) return false;

    const a = { x: A.x, y: A.y };
    const b = { x: B.x, y: B.y };

    for (const s of this.drawnSegments) {
      if (s.aId === aId || s.bId === aId || s.aId === bId || s.bId === bId) continue;

      const c = { x: s.ax, y: s.ay };
      const d = { x: s.bx, y: s.by };

      if (this._segmentsIntersect(a, b, c, d)) return true;
    }

    return false;
  }

  _flashAttemptLine(aId, bId, color = 0xff5c7a) {
    const A = this.starMap.get(aId);
    const B = this.starMap.get(bId);
    if (!A || !B) return;

    const g = this.add.graphics();
    g.lineStyle(4, color, 1);
    g.beginPath();
    g.moveTo(A.x, A.y);
    g.lineTo(B.x, B.y);
    g.strokePath();

    this.tweens.add({
      targets: g,
      alpha: 0,
      duration: 250,
      onComplete: () => g.destroy()
    });
  }

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

    // Crossing-lines penalty
    if (this._wouldCrossExisting(a, b)) {
      this._addMistake(1);
      this._addScore(-50);
      this._flashAttemptLine(a, b);

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

    const A = this.starMap.get(a);
    const B = this.starMap.get(b);
    if (A && B) {
      this.drawnSegments.push({ aId: a, bId: b, ax: A.x, ay: A.y, bx: B.x, by: B.y });
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

    this._markSeen(this.constellation.id);

    this.game.events.emit("roundComplete", {
      id: this.constellation.id,
      name: this.constellation.name,
      info: this.constellation.info,
      revealed: true,
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
    this.drawnSegments = [];

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
    this.drawnSegments = [];

    this.roundOver = false;
    this.selectedStarId = null;

    this.constellation = newConstellation;

    this.requiredEdges = new Set();
    this.correctEdges = new Set();
    this.wrongEdges = new Set();

    for (const [a, b] of this.constellation.connections) {
      this.requiredEdges.add(this._edgeKey(a, b));
    }

    if (this.starsGfx) {
      this.starsGfx.destroy();
    }
    this.starsGfx = this.add.graphics();
    const starsGfx = this.starsGfx;

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
