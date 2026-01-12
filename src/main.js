(function () {
  const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: 960,
    height: 540,
    backgroundColor: "#0b1020",
    antialias: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, GameScene, UIScene]
  };

  const startGame = () => {
    new Phaser.Game(config);
  };

  if (window.CONSTELLATION_PACKS) {
    startGame();
    return;
  }

  const script = document.createElement("script");
  script.src = "src/data/constellations.js";
  script.onload = startGame;
  script.onerror = () => {
    console.error("Failed to load constellation packs at src/data/constellations.js");
    startGame();
  };
  document.head.appendChild(script);
})();
