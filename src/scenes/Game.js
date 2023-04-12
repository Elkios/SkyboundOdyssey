import Phaser from 'phaser';
import ParallaxManager from "../managers/ParallaxManager";

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    FRAME_RATE_SPRITE_ANIMATION = 15;
    character;
    cursors;
    parallaxManager = new ParallaxManager(this, 'darkForest', 10);

    preload() {
        // Load character spritesheet
        // 1803×1561
        this.load.spritesheet("character_idle", "assets/player/player_standing_idle_weapon.png", {
            frameWidth: 1803 / 5,
            frameHeight: 1561 / 3
        });
        this.load.spritesheet("character_flying", "assets/player/player_flying_weapon.png", {
            frameWidth: 881,
            frameHeight: 639
        });
        this.load.spritesheet("character_running", "assets/player/player_running_weapon.png", {
            frameWidth: 881,
            frameHeight: 639
        });

        // Obstacles
        this.load.image("obstacle", "assets/obstacle/obstacle.png");

        // Ghost
        for (let i = 1; i <= 30; i++) {
            this.load.image(`ghost_frame_${i}`, `assets/obstacles/ghost/animation/skeleton-animation_${i}.png`);
        }

        // Gold Coins
        this.load.image("goldCoin", "assets/coins/gold/coin.png");
        for (let i = 1; i <= 10; i++) {
            this.load.image(`gold_coin_frame_${i}`, `assets/coins/gold/animation/Gold_${i}.png`);
        }

        this.parallaxManager.preload();
        this.load.audio("main", "assets/musics/main.mp3");

        // Audio piece
        this.load.audio("coin_pickup", "assets/coins/gold/sound/coin_pickup.mp3");
    }

    create() {
        // Music
        this.music = this.sound.add("main", { loop: true });
        this.music.setVolume(0.15);
        this.music.play();
        this.music.setMute(false);
        // Parallax background
        this.parallaxManager.create();
        // Create animations
        // Idle animation
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("character_idle", {start: 0, end: 14}),
            frameRate: this.FRAME_RATE_SPRITE_ANIMATION,
            repeat: -1,
        });
        // Flying animation
        this.anims.create({
            key: "flying",
            frames: this.anims.generateFrameNumbers("character_flying", {start: 0, end: 14}),
            frameRate: this.FRAME_RATE_SPRITE_ANIMATION,
            repeat: -1,
        });
        // Running animation
        this.anims.create({
            key: "running",
            frames: this.anims.generateFrameNumbers("character_running", {start: 0, end: 14}),
            frameRate: this.FRAME_RATE_SPRITE_ANIMATION * 2,
            repeat: -1,
        });

        // Create character
        this.character = this.physics.add.sprite(
            100,
            window.innerHeight - 100,
            "character_idle"
        );
        this.character.setCollideWorldBounds(true);
        this.character.setScale(0.3);

        // Contrôles
        this.cursors = this.input.keyboard.createCursorKeys();

        this.add.existing(this.character);

        // Score/Coins
        this.score = 0;
        this.scoreText = this.add.text(10, 10, "Score: 0", {
            fontSize: "24px",
            color: "#ffffff",
        });
        this.gameOver = false;

        // Obstacles
        this.obstacles = this.physics.add.group();
        this.coins = this.physics.add.group();

        // Aniamtion ghost
        this.anims.create({
            key: "ghost_animation",
            frames: Array.from({length: 30}, (_, i) => ({
                key: `ghost_frame_${i + 1}`,
                frame: 0,
            })),
            frameRate: 10,
            repeat: -1,
        });

        // Animation piece
        this.anims.create({
            key: "coin_rotate",
            frames: Array.from({ length: 10}, (_, i) => ({
                key: `gold_coin_frame_${i + 1}`,
                frame: 0,
            })),
            frameRate: 10,
            repeat: -1,
        });

        // Audio piece
        this.coinPickupSound = this.sound.add("coin_pickup");

        this.time.addEvent({
            delay: 4000, // Toutes les 2 secondes
            callback: this.spawnPattern,
            callbackScope: this,
            loop: true,
        });
    }

    update(time, delta) {
        this.parallaxManager.update();
        // Gérer les mises à jour du jeu à chaque image (entrées utilisateur, collisions, etc.) ici
        // Contrôles du personnage
        if (this.cursors.space.isDown) {
            this.character.setVelocityY(-300);
            this.character.anims.play("flying", true);
            this.character.setVelocityX(
                this.character.x < window.innerWidth / 2 ? 300 : 0
            )
        } else if (this.cursors.space.isUp) {
            if (this.character.body.onFloor()) {
                this.character.setVelocityY(0);
                this.character.anims.play("running", true);
                this.character.setVelocityX(
                    this.character.x < window.innerWidth / 2 ? 300 : 0
                )
            } else {
                this.character.setVelocityY(300);
                this.character.anims.play("idle", true);
                this.character.setVelocityX(
                    this.character.x < window.innerWidth / 2 ? 300 : 0
                );
            }
        }

        // Collision obstacle
        this.physics.overlap(this.character, this.obstacles, () => {
            if (!this.gameOver) {
                console.log("Collision avec un obstacle");
                this.gameOver = true;
                this.music.stop();
                // Implémentez ici la logique de fin de partie
            }
        }, null, this);

        // Collision score/pieces
        this.physics.overlap(this.character, this.coins, (character, coin) => {
            if (!this.gameOver) {
                console.log("Collision avec une pièce");
                coin.destroy();
                this.score += 10; // Ajoutez les points pour chaque pièce collectée
                this.scoreText.setText("Score: " + this.score);
                this.coinPickupSound.play(); // Jouez le son de collecte de pièce
            }
        }, null, this);
    }

    spawnPattern() {
        const patterns = [
            // pattern 1
            [
                { type: "ghost", x: 200, y: 100 },
                { type: "coin", x: 250, y: 150 },
            ],
            // pattern 2
            [
                { type: "ghost", x: 300, y: 200 },
                { type: "coin", x: 350, y: 250 },
            ],
            // Ajoutez d'autres patterns ici
        ];

        const pattern = Phaser.Utils.Array.GetRandom(patterns);
        pattern.forEach((item) => {
            if (item.type === "obstacle") {
                const obstacle = this.obstacles.create(this.scale.width + item.x, item.y, "obstacle");
                obstacle.setVelocityX(-200);
                obstacle.body.allowGravity = false;
                obstacle.setScale(0.25);
            } else if (item.type === "ghost") {
                const ghost = this.obstacles.create(this.scale.width + item.x, item.y, "ghost_frame_1");
                ghost.setVelocityX(-200);
                ghost.body.allowGravity = false;
                ghost.anims.play("ghost_animation");
                ghost.setScale(0.25);
            } else if (item.type === "coin") {
                const coin = this.coins.create(this.scale.width + item.x, item.y, "goldCoin");
                coin.setVelocityX(-200);
                coin.body.allowGravity = false;
                coin.anims.play("coin_rotate");
                coin.setScale(0.1);
            }
        });
    }
}

export default GameScene;
