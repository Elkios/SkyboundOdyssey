import React from "react";
import Game from "./components/Game";
import Phaser from "phaser";
import ParallaxManager from "./ParallaxManager";

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
    default: "arcade",
    arcade: {
      gravity: { y: 20 },
    },
  },
};

function preload() {
  this.parallaxManager = new ParallaxManager(this, "darkForest", 10);
  this.parallaxManager.preload();
  this.load.audio("main", "musique/main.mp3");
}

function create() {
  this.parallaxManager.create();

  this.music = this.sound.add("main", { loop: true });
  this.music.setVolume(0.15);
  this.music.play();
  this.music.setMute(false);

  var particles = this.add.particles("red");

  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
  });

  var logo = this.physics.add.image(400, 100, "logo");

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);
}

function update() {
  this.parallaxManager.update();
}

function App() {
  return (
    <div className="App">
      <Game config={config} />
    </div>
  );
}

export default App;
