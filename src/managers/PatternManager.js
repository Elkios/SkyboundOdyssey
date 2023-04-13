import Phaser from "phaser";
import GameScene from "../scenes/Game";

class PatternManager {
    constructor(scene, onGameOver) {
        this.scene = scene;
        this.onGameOver = onGameOver
        this.patterns = [
            [
                { type: "lightningTrap", x: 0, y: 100 },
                { type: "coin", x: -100, y: 300 },
                { type: "coin", x: 0, y: 300 },
                { type: "coin", x: 100, y: 300 },
                { type: "lightningTrap", x: 0, y: window.innerHeight / 2 },
                { type: "coin", x: -100, y: window.innerHeight - 300 },
                { type: "coin", x: 0, y: window.innerHeight - 300 },
                { type: "coin", x: 100, y: window.innerHeight - 300 },
                { type: "lightningTrap", x: 0, y: window.innerHeight - 100 },
            ],
            [
                { type: "ghost", x: 0, y: 100 },
                { type: "ghost", x: 0, y: 275 },
                { type: "coin", x: 0, y: window.innerHeight / 2 },
                { type: "ghost", x: 0, y: window.innerHeight - 275 },
                { type: "ghost", x: 0, y: window.innerHeight - 100 },
            ],
            [
                { type: "spike1", x: 0, y: window.innerHeight - 30 },
                { type: "coin", x: 0, y: window.innerHeight - 200 },
                { type: "spike1", x: 150, y: window.innerHeight - 30 },
                { type: "coin", x: 150, y: window.innerHeight - 200 },
                { type: "coin", x: 300, y: window.innerHeight - 100 },
                { type: "spike1", x: 500, y: window.innerHeight - 30 },
                { type: "coin", x: 500, y: window.innerHeight - 200 },
                { type: "spike1", x: 650, y: window.innerHeight - 30 },
                { type: "coin", x: 650, y: window.innerHeight - 200 },
            ],
            [
                { type: "woodFenceSingle", x: -100, y: window.innerHeight - 200, rotation: -45 },
                { type: "woodFenceSingle", x: 0, y: window.innerHeight - 100, rotation: 135 },
                { type: "woodFenceSingle", x: -100, y: 200, rotation: -135 },
                { type: "woodFenceSingle", x: 0, y: 100, rotation: 45 },

                { type: "coin", x: 200 , y: (window.innerHeight / 2) - 150 },
                { type: "coin", x: 400 , y: (window.innerHeight / 2) - 150 },
                { type: "coin", x: 600 , y: (window.innerHeight / 2) - 150 },
                { type: "lightningTrap", x: 200, y: window.innerHeight / 2, rotation: 90 },
                { type: "lightningTrap", x: 400, y: window.innerHeight / 2, rotation: 90 },
                { type: "lightningTrap", x: 600, y: window.innerHeight / 2, rotation: 90 },
                { type: "coin", x: 200 , y: (window.innerHeight / 2) + 150 },
                { type: "coin", x: 400 , y: (window.innerHeight / 2) + 150 },
                { type: "coin", x: 600 , y: (window.innerHeight / 2) + 150 },


                { type: "woodFenceSingle", x: 800, y: 200, rotation: 135 },
                { type: "woodFenceSingle", x: 700, y: 100, rotation: -45 },
                { type: "woodFenceSingle", x: 800, y: window.innerHeight - 200, rotation: 45 },
                { type: "woodFenceSingle", x: 700, y: window.innerHeight - 100, rotation: -135 },
            ],
            [
                { type: "woodFenceMultiple", x: 0, y: 75, rotation: 180 },
                { type: "coin", x: 0, y: 250 },
                { type: "woodFenceMultiple", x: 0, y: window.innerHeight - 75 },
                { type: "coin", x: 0, y: window.innerHeight - 250 },

                { type: "woodFenceSingle", x: 400 - 72, y: window.innerHeight / 2, rotation: -90 },
                { type: "woodFenceSingle", x: 400 + 72, y: window.innerHeight / 2, rotation: 90 },
                { type: "coin", x: 400, y: 150 },
                { type: "coin", x: 400, y: window.innerHeight - 150 },
                { type: "woodFenceSingle", x: 400, y: (window.innerHeight / 2) - 72 },
                { type: "woodFenceSingle", x: 400, y: (window.innerHeight / 2) + 72, rotation: 180 },

                { type: "woodFenceMultiple", x: 800, y: 75, rotation: 180 },
                { type: "coin", x: 800, y: 250 },
                { type: "woodFenceMultiple", x: 800, y: window.innerHeight - 75 },
                { type: "coin", x: 800, y: window.innerHeight - 250 },
            ],
        ];
    }

    preload() {
        // Obstacles
        this.scene.load.image("spike1", "assets/obstacles/spike/spike_1.png");
        this.scene.load.image("woodFenceSingle", "assets/obstacles/woodFence/single.png");
        this.scene.load.image("woodFenceMultiple", "assets/obstacles/woodFence/multiple.png");

        // Ghost
        for (let i = 1; i <= 30; i++) {
            this.scene.load.image(`ghost_frame_${i}`, `assets/obstacles/ghost/animation/skeleton-animation_${i}.png`);
        }

        // Lightning Trap
        this.scene.load.spritesheet("lightning_trap", "assets/obstacles/lightningTrap/lightningTrap.png", {
            frameWidth: 96,
            frameHeight: 89,
        });

        // Gold Coins
        this.scene.load.image("goldCoin", "assets/coins/gold/coin.png");
        for (let i = 1; i <= 10; i++) {
            this.scene.load.image(`gold_coin_frame_${i}`, `assets/coins/gold/animation/Gold_${i}.png`);
        }

        // Audio piece
        this.scene.load.audio("coin_pickup", "assets/coins/gold/sound/coin_pickup.mp3");
    }

    create() {
        // Score & Coins
        this.score = 0;
        this.scoreText = this.scene.add.text(10, 10, "Score: 0", {
            fontSize: "24px",
            color: "#ffffff",
        });
        this.gameOver = false;

        // Obstacles
        this.obstacles = this.scene.physics.add.group();
        this.coins = this.scene.physics.add.group();

        // Animation ghost
        this.scene.anims.create({
            key: "ghost_animation",
            frames: Array.from({length: 30}, (_, i) => ({
                key: `ghost_frame_${i + 1}`,
                frame: 0,
            })),
            frameRate: 10,
            repeat: -1,
        });

        // Animation lightning trap
        this.scene.anims.create({
            key: "lightning_trap_animation",
            frames: this.scene.anims.generateFrameNumbers("lightning_trap", {start: 0, end: 21}),
            frameRate: 10,
            repeat: -1,
        });

        // Animation piece
        this.scene.anims.create({
            key: "coin_rotate",
            frames: Array.from({ length: 10}, (_, i) => ({
                key: `gold_coin_frame_${i + 1}`,
                frame: 0,
            })),
            frameRate: 10,
            repeat: -1,
        });

        // Audio piece
        this.coinPickupSound = this.scene.sound.add("coin_pickup");

        this.spawnPatternEvent = this.scene.time.addEvent({
            delay: 6000,
            callback: this.spawnPattern,
            callbackScope: this,
            loop: true,
        });
    }

    update() {
        // Collision obstacle
        this.scene.physics.overlap(this.scene.character, this.obstacles, this.onGameOver);

        // Collision score/pieces
        this.scene.physics.overlap(this.scene.character, this.coins, (character, coin) => {
            if (!this.gameOver) {
                coin.destroy();
                this.score += 10; // Ajoutez les points pour chaque pièce collectée
                this.scoreText.setText("Score: " + this.score);
                this.coinPickupSound.play(); // Jouez le son de collecte de pièce
            }
        }, null, this);
    }

    spawnPattern() {
        const pattern = Phaser.Utils.Array.GetRandom(this.patterns);
        pattern.forEach((item) => {
            this.createGameObject(item);
        });
    }

    createGameObject(item) {
        let gameObject;

        switch (item.type) {
            case "spike1":
                gameObject = this.obstacles.create(this.scene.scale.width + item.x, item.y, "spike1");
                gameObject.setScale(0.2);
                break;
            case "woodFenceSingle":
                gameObject = this.obstacles.create(this.scene.scale.width + item.x, item.y, "woodFenceSingle");
                gameObject.setScale(0.4);
                break;
            case "woodFenceMultiple":
                gameObject = this.obstacles.create(this.scene.scale.width + item.x, item.y, "woodFenceMultiple");
                gameObject.setScale(0.4);
                break;
            case "ghost":
                gameObject = this.obstacles.create(this.scene.scale.width + item.x, item.y, "ghost_frame_1");
                gameObject.anims.play("ghost_animation");
                gameObject.setScale(0.25);
                break;
            case "lightningTrap":
                gameObject = this.obstacles.create(this.scene.scale.width + item.x, item.y, "lightning_trap");
                gameObject.anims.play("lightning_trap_animation");
                gameObject.setScale(1.5);
                break;
            case "coin":
                gameObject = this.coins.create(this.scene.scale.width + item.x, item.y, "goldCoin");
                gameObject.anims.play("coin_rotate");
                gameObject.setScale(0.1);
                break;
        }

        if (gameObject) {
            gameObject.setVelocityX(-200);
            gameObject.body.allowGravity = false;

            if (item.rotation) {
                gameObject.angle = item.rotation;
            }
        }

        return gameObject;
    }

    stop() {
        // Set Velocity 0 to all obstacles
        this.obstacles.getChildren().forEach((obstacle) => {
            obstacle.setVelocityX(0);
        });

        // Set Velocity 0 to all coins
        this.coins.getChildren().forEach((coin) => {
            coin.setVelocityX(0);
        });
        // Remove the spawnPatternEvent
        if (this.spawnPatternEvent) {
            this.spawnPatternEvent.remove();
        }
    }

    getCoins() {
        return this.score;
    }

}

export default PatternManager;
