import Phaser from "phaser";

class ParallaxManager {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.backgrounds = [];
  }

  preload() {
    this.scene.load.setBaseURL("/assets");

    // Charger les images de fond pour la parallaxe
    for (let i = 1; i <= 10; i++) {
      this.scene.load.image(`Layer_${i}`, `background/Layer_${i}.png`);
    }
  }

  create() {
    // Créer les couches de fond pour la parallaxe
    for (let i = 1; i <= 10; i++) {
      const bg = this.scene.add.tileSprite(
        0,
        0,
        this.scene.scale.width,
        this.scene.scale.height,
        `Layer_${i}`
      );
      bg.setOrigin(0, 0);
      bg.setScrollFactor((i - 1) * 0.1);

      // Répéter l'image de fond horizontalement
      const scaleX = this.scene.scale.width / bg.width;
      bg.setTileScale(scaleX, 1);

      this.backgrounds.push(bg);
    }
  }

  update() {
    // Mettre à jour les arrière-plans pour l'effet de parallaxe
    this.backgrounds.forEach((bg, index) => {
      const speed = 0.1 * (index + 1) * 0.5;
      bg.tilePositionX += speed;
    });
  }
}

export default ParallaxManager;
