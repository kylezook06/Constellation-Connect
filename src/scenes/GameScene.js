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
  _deg2rad(deg) {
    return (deg * Math.PI) / 180;
  }

  _wrapRadDelta(rad) {
    let value = rad;
    while (value > Math.PI) value -= Math.PI * 2;
    while (value < -Math.PI) value += Math.PI * 2;
    return value;
  }

  _projectRADec(raDeg, decDeg, ra0Deg, dec0Deg) {
    const ra = this._deg2rad(raDeg);
    const dec = this._deg2rad(decDeg);
    const ra0 = this._deg2rad(ra0Deg);
    const dec0 = this._deg2rad(dec0Deg);

    const dRa = this._wrapRadDelta(ra - ra0);
    const x = Math.cos(dec) * Math.sin(dRa);
    const y = Math.sin(dec) * Math.cos(dec0) - Math.cos(dec) * Math.sin(dec0) * Math.cos(dRa);

    return { x, y };
  }

  _layoutFromRADec(stars, box) {
    let ra0 = 0;
    let dec0 = 0;
    for (const s of stars) {
      ra0 += s.ra;
      dec0 += s.dec;
    }
    ra0 /= stars.length;
    dec0 /= stars.length;

    const pts = stars.map((s) => {
      const p = this._projectRADec(s.ra, s.dec, ra0, dec0);
      return { id: s.id, x: p.x, y: p.y };
    });

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const w = Math.max(1e-9, maxX - minX);
    const h = Math.max(1e-9, maxY - minY);

    const pad = 30;
    const targetW = box.w - pad * 2;
    const targetH = box.h - pad * 2;
    const scale = Math.min(targetW / w, targetH / h);
    const flipX = true;

    const out = new Map();
    for (const p of pts) {
      let nx = (p.x - minX) * scale;
      let ny = (p.y - minY) * scale;
      if (flipX) nx = targetW - nx;
      const sx = box.x + pad + nx;
      const sy = box.y + pad + (targetH - ny);
      out.set(p.id, { x: sx, y: sy });
    }

    return out;
  }

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

  _getConnectionsForMode() {
    const hardMode = !!this.registry.get("hardMode");
    if (hardMode && Array.isArray(this.constellation.connectionsHard)) return this.constellation.connectionsHard;
    if (!hardMode && Array.isArray(this.constellation.connectionsStandard)) return this.constellation.connectionsStandard;
    return this.constellation.connections || [];
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

    const hasRaDec = this.constellation.stars.every((s) => typeof s.ra === "number" && typeof s.dec === "number");
    const fallbackLayout = hasRaDec
      ? this._layoutFromRADec(this.constellation.stars, { x: 0, y: 60, w: this.scale.width, h: this.scale.height - 60 })
      : null;

    // Faint blueprint of required connections
    this.hintGfx.lineStyle(2, 0xffffff, 0.18);
    for (const [aId, bId] of this._getConnectionsForMode()) {
      const a = this.starMap ? this.starMap.get(aId) : null;
      const b = this.starMap ? this.starMap.get(bId) : null;

      // If stars not created yet (early call), fall back to constellation stars
      let ax, ay, bx, by;
      if (a && b) {
        ax = a.x;
        ay = a.y;
        bx = b.x;
        by = b.y;
      } else if (fallbackLayout) {
        const fa = fallbackLayout.get(aId);
        const fb = fallbackLayout.get(bId);
        if (!fa || !fb) continue;
        ax = fa.x;
        ay = fa.y;
        bx = fb.x;
        by = fb.y;
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
    // Choose edge set based on hardMode, but keep backwards compatibility.
    const hard = !!this.registry.get("hardMode");
    if (this.constellation.connectionsStandard && this.constellation.connectionsHard) {
      this.constellation.connections = hard
        ? this.constellation.connectionsHard
        : this.constellation.connectionsStandard;
    } else if (!this.constellation.connections) {
      // If somehow missing, fall back to standard/hard if present
      this.constellation.connections = hard
        ? (this.constellation.connectionsHard || [])
        : (this.constellation.connectionsStandard || []);
    }

    this.requiredEdges = new Set();
    this.correctEdges = new Set();
    this.wrongEdges = new Set();

    for (const [a, b] of this._getConnectionsForMode()) {
      this.requiredEdges.add(this._edgeKey(a, b));
    }

    const hasRaDec = this.constellation.stars.every((s) => typeof s.ra === "number" && typeof s.dec === "number");
    const layoutMap = hasRaDec
      ? this._layoutFromRADec(this.constellation.stars, { x: 0, y: 60, w: this.scale.width, h: this.scale.height - 60 })
      : new Map(this.constellation.stars.map((s) => [s.id, { x: s.x, y: s.y }]));

    if (this.starsGfx) {
      this.starsGfx.destroy();
    }
    this.starsGfx = this.add.graphics();
    const starsGfx = this.starsGfx;

    const hardMode = !!this.registry.get("hardMode");
    for (const s of this.constellation.stars) {
      const pos = layoutMap.get(s.id);
      if (!pos) continue;
      const role = s.role || "outline";
      const isOutline = role === "outline";
      const contextAlpha = hardMode ? 0.35 : 0.18;
      const glowAlpha = isOutline ? 0.08 : (hardMode ? 0.05 : 0.03);

      starsGfx.fillStyle(0xffffff, glowAlpha);
      starsGfx.fillCircle(pos.x, pos.y, 14);

      const dot = this.add.circle(pos.x, pos.y, 5, 0xffffff, 1)
        .setStrokeStyle(2, 0x7c8cff, 0.9);
      dot.setAlpha(isOutline ? 1 : contextAlpha);

      dot.starId = s.id;

      const interactive = isOutline || hardMode;
      if (interactive) {
        dot.setInteractive({ useHandCursor: true });

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
      } else {
        dot.disableInteractive();
      }

      this.starSprites.push(dot);
      this.starMap.set(s.id, { x: pos.x, y: pos.y, sprite: dot });
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
