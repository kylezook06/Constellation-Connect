/* global Phaser */

class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");

    this.scoreText = null;
    this.progressText = null;
    this.timerText = null;

    this.hintOn = false;
    this.infoOpen = false;

    this.roundName = "";
    this.roundInfo = null;

    this.mode = "relaxed";
    this.timeLeft = 0;
    this.roundEnded = false;

    this.overlay = null;

    this._onRoundData = null;
    this._onScoreChanged = null;
    this._onRoundComplete = null;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.roundEnded = false;

    this.mode = this.registry.get("mode") || "relaxed";
    const timeLimit = this.registry.get("timeLimitSec") || 120;
    this.timeLeft = timeLimit;

    // Top HUD bar
    this.add.rectangle(W / 2, 22, W, 44, 0x10183a, 0.85);

    // Title (constellation name shown upfront)
    const title = this.add.text(16, 10, "Constellation: ...", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#ffffff"
    });

    // Score & progress
    this.scoreText = this.add.text(340, 10, "Score: 0 | Mistakes: 0", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#cbd5ff"
    });

    this.progressText = this.add.text(16, 34, "Connections: 0/0", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#9aa7ff"
    });

    // Timer (timed mode only)
    this.timerText = this.add.text(W - 16, 10, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#ffd166"
    }).setOrigin(1, 0);

    if (this.mode === "timed") {
      this.timerText.setText("Time: 2:00");
    } else {
      this.timerText.setText("Relaxed");
      this.timerText.setColor("#9aa7ff");
    }

    // Buttons
    const makeTinyButton = (x, y, label, onClick) => {
      const txt = this.add.text(x, y, label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#ffffff"
      }).setOrigin(0.5);

      const padX = 12;
      const padY = 7;
      const b = txt.getBounds();

      const rect = this.add.rectangle(x, y, b.width + padX * 2, b.height + padY * 2, 0x263055, 1)
        .setStrokeStyle(1, 0x7c8cff, 0.8);

      txt.setDepth(1);

      const hit = this.add.rectangle(x, y, rect.width, rect.height, 0x000000, 0)
        .setInteractive({ useHandCursor: true });

      hit.on("pointerover", () => rect.setFillStyle(0x34407a, 1));
      hit.on("pointerout", () => rect.setFillStyle(0x263055, 1));
      hit.on("pointerdown", () => onClick());

      return { rect, txt, hit };
    };

    makeTinyButton(W - 330, 34, "Reset", () => {
      if (this.roundEnded) return;
      this.game.events.emit("uiReset");
    });

    const hintBtn = makeTinyButton(W - 250, 34, "Hint: OFF", () => {
      if (this.roundEnded) return;
      this.hintOn = !this.hintOn;
      hintBtn.txt.setText(this.hintOn ? "Hint: ON" : "Hint: OFF");
      this.game.events.emit("uiToggleHint", this.hintOn);
    });

    const infoBtn = makeTinyButton(W - 160, 34, "Info", () => {
      this._toggleInfoPanel();
    });

    makeTinyButton(W - 90, 34, "Next", () => {
      if (this.overlay) {
        this.overlay.destroy(true);
        this.overlay = null;
      }
      this.roundEnded = false;

      if (this.mode === "timed") {
        const timeLimit = this.registry.get("timeLimitSec") || 120;
        this.timeLeft = timeLimit;
        this.timerText.setText("Time: " + this._formatTime(this.timeLeft));
      }

      this.game.events.emit("uiNextConstellation");
    });

    makeTinyButton(W - 30, 34, "Menu", () => {
      this.game.events.emit("uiNext"); // returns to BootScene
    });

    // Info panel (hidden by default)
    this.infoPanel = this.add.container(0, 0);
    const panelW = 360;
    const panelH = 220;
    const panelX = W - panelW - 16;
    const panelY = 60;

    const panelBg = this.add.rectangle(panelX + panelW / 2, panelY + panelH / 2, panelW, panelH, 0x0f1633, 0.92)
      .setStrokeStyle(2, 0x7c8cff, 0.8);

    this.infoTitle = this.add.text(panelX + 12, panelY + 10, "About this constellation", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#ffffff"
    });

    this.infoBody = this.add.text(panelX + 12, panelY + 40, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#cbd5ff",
      wordWrap: { width: panelW - 24 }
    });

    this.infoPanel.add([panelBg, this.infoTitle, this.infoBody]);
    this.infoPanel.setVisible(false);

    // Listen for GameScene events
    this._onRoundData = (data) => {
      this.roundName = data.name;
      this.roundInfo = data.info;
      title.setText(`Constellation: ${this.roundName}`);
      this._refreshInfoText();
    };

    this._onScoreChanged = (data) => {
      this.scoreText.setText(`Score: ${data.score} | Mistakes: ${data.mistakes}`);
      this.progressText.setText(`Connections: ${data.done}/${data.total}`);
    };

    this._onRoundComplete = (data) => {
      this.roundEnded = true;
      this._showCompleteOverlay(data);
    };

    this.game.events.on("roundData", this._onRoundData);
    this.game.events.on("scoreChanged", this._onScoreChanged);
    this.game.events.on("roundComplete", this._onRoundComplete);

    this.events.once("shutdown", this._cleanup, this);
    this.events.once("destroy", this._cleanup, this);

    // Timed mode countdown
    if (this.mode === "timed") {
      this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
          if (this.roundEnded) return;

          this.timeLeft -= 1;
          this.timerText.setText("Time: " + this._formatTime(this.timeLeft));

          if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            this.roundEnded = true;
            this._showTimeUpOverlay();
          }
        }
      });
    }
  }

  _formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  _toggleInfoPanel() {
    this.infoOpen = !this.infoOpen;
    this.infoPanel.setVisible(this.infoOpen);
    this._refreshInfoText();
  }

  _refreshInfoText() {
    if (!this.roundInfo) return;
    const text =
      `Meaning / Recognition:\n${this.roundInfo.meaning}\n\n` +
      `Myth / Origin:\n${this.roundInfo.myth}\n\n` +
      `Trivia:\n${this.roundInfo.funFact}`;
    this.infoBody.setText(text);
  }

  _showCompleteOverlay(data) {
    const W = this.scale.width;
    const H = this.scale.height;

    if (this.overlay) this.overlay.destroy(true);

    this.overlay = this.add.container(0, 0);

    const dim = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55);

    const cardW = 520;
    const cardH = 260;
    const card = this.add.rectangle(W / 2, H / 2, cardW, cardH, 0x10183a, 0.95)
      .setStrokeStyle(3, 0x7c8cff, 0.9);

    const title = this.add.text(W / 2, H / 2 - 105, "Completed!", {
      fontFamily: "Arial, sans-serif",
      fontSize: "32px",
      color: "#ffffff"
    }).setOrigin(0.5);

    const stats = this.add.text(W / 2, H / 2 - 65, `Score: ${data.score}   Mistakes: ${data.mistakes}`,
      {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#cbd5ff"
      }).setOrigin(0.5);

    const info = this.add.text(W / 2, H / 2 + 10, this.roundInfo ? this.roundInfo.funFact : "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#9aa7ff",
      wordWrap: { width: cardW - 50 }
    }).setOrigin(0.5);

    const makeOverlayButton = (x, y, label, onClick) => {
      const txt = this.add.text(x, y, label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#ffffff"
      }).setOrigin(0.5);

      const padX = 16;
      const padY = 10;
      const b = txt.getBounds();

      const rect = this.add.rectangle(x, y, b.width + padX * 2, b.height + padY * 2, 0x263055, 1)
        .setStrokeStyle(2, 0x7c8cff, 0.8);

      txt.setDepth(1);

      const hit = this.add.rectangle(x, y, rect.width, rect.height, 0x000000, 0)
        .setInteractive({ useHandCursor: true });

      hit.on("pointerover", () => rect.setFillStyle(0x34407a, 1));
      hit.on("pointerout", () => rect.setFillStyle(0x263055, 1));
      hit.on("pointerdown", () => onClick());

      return { rect, txt, hit };
    };

    const btnReset = makeOverlayButton(W / 2 - 120, H / 2 + 85, "Try Again", () => {
      this.overlay.destroy(true);
      this.overlay = null;
      this.roundEnded = false;
      this.game.events.emit("uiReset");
    });

    const btnNext = makeOverlayButton(W / 2 + 120, H / 2 + 85, "Next / Menu", () => {
      this.game.events.emit("uiNext");
    });

    this.overlay.add([
      dim,
      card,
      title,
      stats,
      info,
      btnReset.rect,
      btnReset.hit,
      btnReset.txt,
      btnNext.rect,
      btnNext.hit,
      btnNext.txt
    ]);
  }

  _showTimeUpOverlay() {
    const W = this.scale.width;
    const H = this.scale.height;

    if (this.overlay) this.overlay.destroy(true);

    this.overlay = this.add.container(0, 0);

    const dim = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.60);

    const cardW = 520;
    const cardH = 240;
    const card = this.add.rectangle(W / 2, H / 2, cardW, cardH, 0x10183a, 0.95)
      .setStrokeStyle(3, 0xff5c7a, 0.9);

    const title = this.add.text(W / 2, H / 2 - 85, "Time’s Up", {
      fontFamily: "Arial, sans-serif",
      fontSize: "32px",
      color: "#ffffff"
    }).setOrigin(0.5);

    const subtitle = this.add.text(W / 2, H / 2 - 45,
      "Timed mode ended. You can try again or go back to the menu.",
      {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#cbd5ff",
        wordWrap: { width: cardW - 50 }
      }).setOrigin(0.5);

    const info = this.add.text(W / 2, H / 2 + 10, this.roundInfo ? this.roundInfo.funFact : "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#9aa7ff",
      wordWrap: { width: cardW - 50 }
    }).setOrigin(0.5);

    const makeOverlayButton = (x, y, label, onClick) => {
      const txt = this.add.text(x, y, label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#ffffff"
      }).setOrigin(0.5);

      const padX = 16;
      const padY = 10;
      const b = txt.getBounds();

      const rect = this.add.rectangle(x, y, b.width + padX * 2, b.height + padY * 2, 0x263055, 1)
        .setStrokeStyle(2, 0x7c8cff, 0.8);

      txt.setDepth(1);

      const hit = this.add.rectangle(x, y, rect.width, rect.height, 0x000000, 0)
        .setInteractive({ useHandCursor: true });

      hit.on("pointerover", () => rect.setFillStyle(0x34407a, 1));
      hit.on("pointerout", () => rect.setFillStyle(0x263055, 1));
      hit.on("pointerdown", () => onClick());

      return { rect, txt, hit };
    };

    const btnReset = makeOverlayButton(W / 2 - 120, H / 2 + 75, "Try Again", () => {
      this.overlay.destroy(true);
      this.overlay = null;
      this.roundEnded = false;
      // Reset timer too
      const timeLimit = this.registry.get("timeLimitSec") || 120;
      this.timeLeft = timeLimit;
      this.timerText.setText("Time: " + this._formatTime(this.timeLeft));
      this.game.events.emit("uiReset");
    });

    const btnNext = makeOverlayButton(W / 2 + 120, H / 2 + 75, "Next / Menu", () => {
      this.game.events.emit("uiNext");
    });

    this.overlay.add([
      dim,
      card,
      title,
      subtitle,
      info,
      btnReset.rect,
      btnReset.hit,
      btnReset.txt,
      btnNext.rect,
      btnNext.hit,
      btnNext.txt
    ]);
  }

  _cleanup() {
    if (this.game && this.game.events) {
      if (this._onRoundData) this.game.events.off("roundData", this._onRoundData);
      if (this._onScoreChanged) this.game.events.off("scoreChanged", this._onScoreChanged);
      if (this._onRoundComplete) this.game.events.off("roundComplete", this._onRoundComplete);
    }

    if (this.time) {
      this.time.removeAllEvents();
    }

    this._onRoundData = null;
    this._onScoreChanged = null;
    this._onRoundComplete = null;
  }
}
