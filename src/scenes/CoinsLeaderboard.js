import Phaser from 'phaser';
import dbCRUD from "../managers/dbCRUD"

class CoinsLeaderBoardScene extends Phaser.Scene {
    constructor() {
        super({key: "CoinsLeaderBoardScene"});
    }

    preload() {
        // Load menu assets
        this.load.image("playButton", "assets/ui/play_button.png");
        // Load blueSheet assets
        this.load.atlasXML("blueAtlas", "assets/ui/blueSheet.png", "assets/ui/blueSheet.xml");
        this.load.image('background', "assets/backgrounds/MenuBG.png");
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
        let mapAsc = new Map([...mapCoins.entries()].sort((a,b) => b[1] - a[1]));
        return mapAsc;
    }

    create() {
        let bg = this.add.image(this.cameras.main.width /2, this.cameras.main.height /2, 'background').setOrigin(.5, .5);
        let scaleX = this.cameras.main.width / bg.width
        let scaleY = this.cameras.main.height / bg.height
        let scale = Math.max(scaleX, scaleY)
        bg.setScale(scale).setScrollFactor(0)

        let rectangle = this.add.rectangle(this.scale.width / 2.4, this.scale.height / 4.5, this.scale.width/3.5, this.scale.height/1.7, "#FFD700", 100);

        rectangle.setOrigin(0.2);
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
            color: "#FFD700",
            fontStyle: "bold",
        });
        titleText.setOrigin(0.5);

        const dbCrud = new dbCRUD();
        let leaderboardData = dbCrud.getLeaderBoard();
        if (leaderboardData !== undefined) {
            let i = 1;
            const leaderBoardMap = this.dataSort(leaderboardData, "coins");
            leaderBoardMap.forEach( (value, key, map) => {
                if (i>10) return;
                const leaderboardText = this.add.text(this.scale.width / 2, (this.scale.height / 3.6) + (i-1)*50, i + ' - ' + key + ' | coins = ' + value, {
                    fontSize: "32px",
                    fontStyle: "bold",
                    color: "#FFD700",
                });
                leaderboardText.setOrigin(0.5);
                i++;
            });
        }
    }
}

export default CoinsLeaderBoardScene;
