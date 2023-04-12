import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MenuScene" });
    }

    preload() {
        // Load menu assets
        this.load.image("playButton", "assets/ui/play_button.png");
        // Load blueSheet assets
        this.load.atlasXML("blueAtlas", "assets/ui/blueSheet.png", "assets/ui/blueSheet.xml");
    }

    create() {
        // Add a simple "Play" button
        const playButton = this.add.image(this.scale.width / 2, this.scale.height / 2, "blueAtlas", "blue_button00.png");
        playButton.setInteractive();
        // Add a hover effect
        playButton.on("pointerover", () => {
            playButton.setFrame("blue_button01.png");
        });

        playButton.on("pointerout", () => {
            playButton.setFrame("blue_button00.png");
        });

        // Add text to center of button (playButton) and center it
        const playButtonText = this.add.text(0, 0, "Play", {
            fontSize: "28px",
            color: "#ffffff",
        });
        Phaser.Display.Align.In.Center(playButtonText, playButton);

        // Add a simple "Leaderboard" button
        const rankButton = this.add.image(this.scale.width / 2, this.scale.height / 1.8, "blueAtlas", "blue_button00.png");
        rankButton.setInteractive();
        // Add a hover effect
        rankButton.on("pointerover", () => {
            rankButton.setFrame("blue_button01.png");
        });

        rankButton.on("pointerout", () => {
            rankButton.setFrame("blue_button00.png");
        });

        // Add text to center of button (playButton) and center it
        const rankButtonText = this.add.text(0, 0, "Leaderboard", {
            fontSize: "28px",
            color: "#ffffff",
        });
        Phaser.Display.Align.In.Center(rankButtonText, rankButton);

        // Switch to the game scene when the button is clicked
        playButton.on("pointerdown", () => {
            this.scene.start("GameScene");
        });

        rankButton.on("pointerdown", () => {
            this.scene.start("LeaderboardScene");
        });

        // Add a title text
        const titleText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, "Skybound Odyssey", {
            fontSize: "32px",
            color: "#ffffff",
        });
        titleText.setOrigin(0.5);
    }
}

export default MenuScene;
