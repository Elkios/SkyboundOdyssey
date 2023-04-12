import React from "react";
import Game from "./components/Game";
import Phaser from "phaser";
import MenuScene from "./scenes/Menu";
import GameScene from "./scenes/Game";

const config = {
  type: Phaser.AUTO, // Utilise WebGL si disponible, sinon utilise Canvas
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [MenuScene, GameScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 20 },
    },
  },
};

function App() {
  return (
      <div className="App">
        <Game config={config} />
      </div>
  );
}

export default App;