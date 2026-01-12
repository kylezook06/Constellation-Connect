/* global Phaser */

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    // Defaults
    this.registry.set("season", "winter");
    this.registry.set("mode", "relaxed"); // "relaxed" | "timed"
    this.registry.set("timeLimitSec", 120);
    this.registry.set("hardMode", false);

    const W = this.scale.width;
    const H = this.scale.height;

    // Background stars (simple)
    const bg = this.add.graphics();
    bg.fillStyle(0x0b1020, 1);
    bg.fillRect(0, 0, W, H);

    for (let i = 0; i < 120; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H);
      const r = Phaser.Math.Between(1, 2);
      const a = Phaser.Math.FloatBetween(0.2, 0.9);
      bg.fillStyle(0xffffff, a);
      bg.fillCircle(x, y, r);
    }

    // Title
    this.add.text(W / 2, 70, "Constellation Connect", {
      fontFamily: "Arial, sans-serif",
      fontSize: "40px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.add.text(W / 2, 110, "Trace constellations by connecting stars (any order).", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#cbd5ff"
    }).setOrigin(0.5);

    // UI helper
    const makeButton = (x, y, label, onClick, opts = {}) => {
      const padX = 18;
      const padY = 10;

      const txt = this.add.text(x, y, label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#ffffff"
      }).setOrigin(0.5);

      const bounds = txt.getBounds();
      const fill = opts.fill ?? 0x263055;
      const stroke = opts.stroke ?? 0x7c8cff;

      const bgRect = this.add.rectangle(
        x,
        y,
        bounds.width + padX * 2,
        bounds.height + padY * 2,
        fill,
        1
      ).setStrokeStyle(2, stroke, 0.8);

      // Put text above rect
      txt.setDepth(1);

      const hit = this.add.rectangle(x, y, bgRect.width, bgRect.height, 0x000000, 0);
      hit.setInteractive({ useHandCursor: true });

      const setHover = (hover) => {
        bgRect.setFillStyle(hover ? 0x34407a : 0x263055, 1);
      };

      hit.on("pointerover", () => setHover(true));
      hit.on("pointerout", () => setHover(false));
      hit.on("pointerdown", () => onClick());

      return { bgRect, txt, hit };
    };

    // Season selection
    this.add.text(W / 2, 160, "Season Pack", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff"
    }).setOrigin(0.5);

    const seasonLabel = this.add.text(W / 2, 190, "Selected: WINTER", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#cbd5ff"
    }).setOrigin(0.5);

    makeButton(W / 2 - 120, 230, "Winter", () => {
      this.registry.set("season", "winter");
      seasonLabel.setText("Selected: WINTER");
    });

    makeButton(W / 2 + 120, 230, "Summer", () => {
      this.registry.set("season", "summer");
      seasonLabel.setText("Selected: SUMMER");
    });

    // Mode selection
    this.add.text(W / 2, 280, "Mode", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff"
    }).setOrigin(0.5);

    const modeLabel = this.add.text(W / 2, 310, "Selected: RELAXED", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#cbd5ff"
    }).setOrigin(0.5);

    makeButton(W / 2 - 120, 350, "Relaxed", () => {
      this.registry.set("mode", "relaxed");
      modeLabel.setText("Selected: RELAXED");
    });

    makeButton(W / 2 + 120, 350, "Timed (2:00)", () => {
      this.registry.set("mode", "timed");
      this.registry.set("timeLimitSec", 120);
      modeLabel.setText("Selected: TIMED (2:00)");
    });

    // Difficulty selection
    this.add.text(W / 2, 400, "Difficulty", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff"
    }).setOrigin(0.5);

    const difficultyLabel = this.add.text(W / 2, 430, "Selected: STANDARD", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#cbd5ff"
    }).setOrigin(0.5);

    makeButton(W / 2 - 120, 470, "Standard", () => {
      this.registry.set("hardMode", false);
      difficultyLabel.setText("Selected: STANDARD");
    });

    makeButton(W / 2 + 120, 470, "Hard", () => {
      this.registry.set("hardMode", true);
      difficultyLabel.setText("Selected: HARD");
    });

    // Start
    makeButton(W / 2, 510, "Start", () => {
      // Reset shared state
      this.registry.set("score", 0);
      this.registry.set("mistakes", 0);
      this.registry.set("seenConstellations", {});

      // Start gameplay + HUD
      this.scene.start("GameScene");
      this.scene.start("UIScene");
    }, { fill: 0x1f6f3b, stroke: 0x9cffb5 });

    this.add.text(W / 2, H - 20, "Click stars to connect • Reset anytime • Hint + Info in HUD", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#9aa7ff"
    }).setOrigin(0.5);
  }
}
