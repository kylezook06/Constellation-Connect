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

  new Phaser.Game(config);
})();
