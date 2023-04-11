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
  this.load.setBaseURL('https://labs.phaser.io');

  this.load.image('sky', 'assets/skies/space3.png');
  this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
  this.add.image(400, 300, 'sky');

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
  // Gérer les mises à jour du jeu à chaque image (entrées utilisateur, collisions, etc.) ici
}


function App() {
  return (
      <div className="App">
        <Game config={config} />
      </div>
  );
}

export default App;
