import Phaser from 'phaser';
import dbCRUD from "../managers/dbCRUD"

class TravelDistanceLeaderboardScene extends Phaser.Scene {
    constructor() {
        super({key: "TravelDistanceLeaderboardScene"});
    }

    preload() {
        // Load menu assets
        this.load.image("playButton", "assets/ui/play_button.png");
        // Load blueSheet assets
        this.load.atlasXML("blueAtlas", "assets/ui/blueSheet.png", "assets/ui/blueSheet.xml");
    }

    dataSort(data, type) {
        const mapCoins = new Map();
        for (const key in data) {
            if (type == "coins") {
                mapCoins.set(data[key].username, data[key].coins);
            }
            else if (type == "travelDistance") {
                mapCoins.set(data[key].username, data[key].travelDistance);
            }
        }
        let mapAsc = new Map([...mapCoins.entries()].sort((a,b) => a[1] < b[1]));
        return mapAsc;
    }

    create() {
        // Add a simple "Play" button
        const backMenuButton = this.add.image(this.scale.width / 8, this.scale.height / 6, "blueAtlas", "blue_button00.png");
        backMenuButton.setInteractive();
        // Add a hover effect
        backMenuButton.on("pointerover", () => {
            backMenuButton.setFrame("blue_button01.png");
        });

        backMenuButton.on("pointerout", () => {
            backMenuButton.setFrame("blue_button00.png");
        });

        // Add text to center of button (playButton) and center it
        const backMenuButtonText = this.add.text(0, 0, "Back Menu", {
            fontSize: "28px",
            color: "#ffffff",
        });
        Phaser.Display.Align.In.Center(backMenuButtonText, backMenuButton);

        const travelDistanceButton = this.add.image(this.scale.width / 2.2, this.scale.height / 4.5, "blueAtlas", "blue_button00.png");
        travelDistanceButton.setInteractive();
        // Add a hover effect
        travelDistanceButton.on("pointerover", () => {
            travelDistanceButton.setFrame("blue_button01.png");
        });

        travelDistanceButton.on("pointerout", () => {
            travelDistanceButton.setFrame("blue_button00.png");
        });

        // Add text to center of button (playButton) and center it
        const travelDistanceButtonText = this.add.text(0, 0, "Distance", {
            fontSize: "28px",
            color: "#ffffff",
        });
        Phaser.Display.Align.In.Center(travelDistanceButtonText, travelDistanceButton);

        const coinsButton = this.add.image(this.scale.width / 1.8, this.scale.height / 4.5, "blueAtlas", "blue_button00.png");
        coinsButton.setInteractive();
        // Add a hover effect
        coinsButton.on("pointerover", () => {
            coinsButton.setFrame("blue_button01.png");
        });

        coinsButton.on("pointerout", () => {
            coinsButton.setFrame("blue_button00.png");
        });

        // Add text to center of button (playButton) and center it
        const coinsButtonText = this.add.text(0, 0, "Coins", {
            fontSize: "28px",
            color: "#ffffff",
        });
        Phaser.Display.Align.In.Center(coinsButtonText, coinsButton);

        // Switch to the game scene when the button is clicked
        backMenuButton.on("pointerdown", () => {
            this.scene.start("MenuScene");
        });

        coinsButton.on("pointerdown", () => {
            this.scene.start("CoinsLeaderBoardScene");
        });

        travelDistanceButton.on("pointerdown", () => {
            this.scene.start("TravelDistanceLeaderboardScene");
        });

        // Add a title text
        const titleText = this.add.text(this.scale.width / 2, this.scale.height / 6, "Leaderboard", {
            fontSize: "32px",
            color: "#ffffff",
        });
        titleText.setOrigin(0.5);

        const dbCrud = new dbCRUD();
        let leaderboardData = dbCrud.getLeaderBoard();
        if (leaderboardData !== undefined) {
            let i = 1;
            const leaderBoardMap = this.dataSort(leaderboardData, "travelDistance");
            leaderBoardMap.forEach( (value, key, map) => {
                if (i>10) return;
                const leaderboardText = this.add.text(this.scale.width / 2, (this.scale.height / 3.6) + (i-1)*50, i + ' - ' + key + ' distance = ' + value, {
                    fontSize: "32px",
                    color: "#ffffff",
                });
                leaderboardText.setOrigin(0.5);
                i++;
            });
        }
    }
}

export default TravelDistanceLeaderboardScene;
