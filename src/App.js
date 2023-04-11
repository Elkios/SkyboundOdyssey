import React from 'react';
import Game from './components/Game';
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO, // Utilise WebGL si disponible, sinon utilise Canvas
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    preload: preload, // Fonction pour charger les ressources du jeu
    create: create, // Fonction pour créer les objets de jeu et initialiser les événements
    update: update, // Fonction pour gérer les mises à jour du jeu à chaque image
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 20 }
    }
  },
};

function preload ()
{
  this.load.setBaseURL('/assets');

  // Charger les images de fond pour la parallaxe
  for (let i = 1; i <= 10; i++) {
    this.load.image(`Layer_${i}`, `background/Layer_${i}.png`);
  }

  this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
  // Créer les couches de fond pour la parallaxe
  this.backgrounds = [];
  for (let i = 1; i <= 10; i++) {
    const bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `Layer_${i}`);
    bg.setOrigin(0, 0);
    bg.setScrollFactor((i - 1) * 0.1);

    // Répéter l'image de fond horizontalement
    const scaleX = this.scale.width / bg.width;
    bg.setTileScale(scaleX, 1);

    this.backgrounds.push(bg);
  }

  var particles = this.add.particles('red');

  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD'
  });

  var logo = this.physics.add.image(400, 100, 'logo');

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);
}


function update() {
  // Mettre à jour les arrière-plans pour l'effet de parallaxe
  this.backgrounds.forEach((bg, index) => {
    const speed = 0.1 * (index + 1) * 0.5;
    bg.tilePositionX += speed;
  });
}


function App() {
  return (
      <div className="App">
        <Game config={config} />
      </div>
  );
}

export default App;
