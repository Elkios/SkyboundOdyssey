class ParallaxManager {
  constructor(scene, backgroundName, numberOfLayers) {
    this.scene = scene;
    this.backgroundName = backgroundName;
    this.numberOfLayers = numberOfLayers;
    this.backgrounds = [];
  }

  reset() {
    this.backgrounds = [];
  }

  preload() {
    // Charger les images de fond pour la parallaxe
    for (let i = 1; i <= this.numberOfLayers; i++) {
      this.scene.load.image(`Layer_${i}`, `assets/backgrounds/${this.backgroundName}/Layer_${i}.png`);
    }
  }

  create() {
    // Créer les couches de fond pour la parallaxe
    for (let i = 1; i <= 10; i++) {
      const bg = this.scene.add.tileSprite(0, 0, this.scene.scale.width, this.scene.scale.height, `Layer_${i}`);
      bg.setOrigin(0, 0);
      bg.setScrollFactor((i - 1) * 0.1);

      // Répéter l'image de fond horizontalement
      const scaleX = this.scene.scale.width / bg.width;
      bg.setTileScale(scaleX, 1);

      this.backgrounds.push(bg);
    }
  }

  update(distance) {
    // Calculate the speed factor based on the distance
    const speedFactor = 1 + Math.floor(distance / 1000) * 0.1;
    let layerSpeed;

    // Mettre à jour les arrière-plans pour l'effet de parallaxe
    this.backgrounds.forEach((bg, index) => {
      const speed = 0.1 * (index + 1) * 10 * speedFactor;
      bg.tilePositionX += speed

      // Store the speed of the first layer
      if (index === 0) {
        layerSpeed = speed;
      }
    });

    return layerSpeed
  }

}

export default ParallaxManager;
