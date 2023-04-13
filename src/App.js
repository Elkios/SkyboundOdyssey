import React, {useEffect} from "react";
import Game from "./components/Game";
import Phaser from "phaser";
import MenuScene from "./scenes/Menu";
import GameScene from "./scenes/Game";
import LeaderboardScene from "./scenes/Leaderboard";
import TravelDistanceLeaderboardScene from "./scenes/TravelDistanceLeaderboard";
import CoinsLeaderBoardScene from "./scenes/CoinsLeaderboard";

const config = {
  type: Phaser.AUTO, // Utilise WebGL si disponible, sinon utilise Canvas
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [MenuScene, GameScene, LeaderboardScene, CoinsLeaderBoardScene, TravelDistanceLeaderboardScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 20 },
      debug: false,
    },
  },
};

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function App() {

  useEffect(() => {
    // init a uuid for the user and store it in local storage
    if (!localStorage.getItem("uuid")) {
      const uuid = generateUUID();
      localStorage.setItem("uuid", uuid);
    }
  }, []);

  return (
      <div className="App">
        <Game config={config} />
      </div>
  );
}

export default App;
