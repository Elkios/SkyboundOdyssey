import Phaser from 'phaser';
import ParallaxManager from "../managers/ParallaxManager";
import dbCRUD from "../managers/dbCRUD"

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    FRAME_RATE_SPRITE_ANIMATION = 15;
    character;
    cursors;
    parallaxManager = new ParallaxManager(this, 'darkForest', 10);
    dbCRUD = new dbCRUD();


    // Distance
    distance = 0;
    distanceText;

    isDead = false;
    isGameOver = false;

    reset() {
        this.distance = 0;
        this.parallaxManager.reset();
        this.isDead = false;
        this.isGameOver = false;
        this.obstacles.clear(true, true);
    }

    spawnObstacle() {
        const minY = 100; // La hauteur minimale de l'obstacle
        const maxY = this.scale.height - 100; // La hauteur maximale de l'obstacle
        const y = Math.floor(Math.random() * (maxY - minY)) + minY; // Position Y aléatoire entre minY et maxY

        const minSize = 50; // La taille minimale de l'obstacle
        const maxSize = 200; // La taille maximale de l'obstacle
        const size = Math.floor(Math.random() * (maxSize - minSize)) + minSize; // Taille aléatoire entre minSize et maxSize

        const obstacle = this.obstacles.create(this.scale.width, y, null);
        obstacle.setDisplaySize(size, size);
        obstacle.body.setAllowGravity(false);
        obstacle.setOrigin(0.5, 0.5);
        obstacle.setVelocityX(-300);
        obstacle.setCollideWorldBounds(false);
    }

    goToMenu = () => {
        this.music.stop();
        this.reset();
        this.scene.start("MenuScene");
    }


    preload() {
        // Load character spritesheet
        // 1803×1561
        this.load.spritesheet("character_idle", "assets/player/player_standing_idle_weapon.png", {
            frameWidth: 1803 / 5,
            frameHeight: 1561 / 3
        });
        this.load.spritesheet("character_flying", "assets/player/player_flying_weapon.png", {
            // 2071×1630
            frameWidth: 2071 / 5,
            frameHeight: 1630 / 3
        });
        this.load.spritesheet("character_running", "assets/player/player_running_weapon.png", {
            frameWidth: 2309 / 5,
            frameHeight: 1564 / 3
        });
        // load flying die
        this.load.spritesheet("character_flying_die", "assets/player/player_flying_weapon_die.png", {
            // 4405×639
            frameWidth: 4405 / 5,
            frameHeight: 639 / 1
        });
        // Load idle die
        this.load.spritesheet("character_idle_die", "assets/player/player_standing_idle_weapon_die.png", {
            // 4405×639
            frameWidth: 4405 / 5,
            frameHeight: 639 / 1
        });

        this.parallaxManager.preload();
        this.load.audio("main", "assets/musics/main.mp3");
        this.load.audio("gameover", "assets/musics/gameover.mp3");
    }

    create() {
        // Music
        this.music = this.sound.add("main", { loop: true });
        this.music.setVolume(0.15);
        this.music.play();
        this.music.setMute(false);
        this.gameOverSound = this.sound.add("gameover", { loop: false });
        this.gameOverSound.setVolume(0.05);
        this.gameOverSound.setMute(false);
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
            frameRate: 0,
            repeat: -1,
        });
        // Flying die animation
        this.anims.create({
            key: "flying_die",
            frames: this.anims.generateFrameNumbers("character_flying_die", {start: 0, end: 4}),
            frameRate: 10,
            repeat: 0,
        });
        // Idle die animation
        this.anims.create({
            key: "idle_die",
            frames: this.anims.generateFrameNumbers("character_idle_die", {start: 0, end: 4}),
            frameRate: 10,
            repeat: 0,
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

        // Distance
        // Display distance in right corner
        const distanceBg = this.add.image(window.innerWidth - 200, 50, "blueAtlas", "blue_button09.png");
        this.add.existing(distanceBg);
        this.distanceText = this.add.text(10, 10, 'Distance: 0 m', { font: '18px Arial', color: '#ffffff' });
        this.distanceText.setScrollFactor(0);

        // Resize the button to fit the text
        distanceBg.displayWidth = this.distanceText.width + 200;
        distanceBg.displayHeight = this.distanceText.height + 20;
        // Center the text in the button
        Phaser.Display.Align.In.Center(
            this.distanceText,
            distanceBg
        );
        // Obstacles
        this.obstacles = this.physics.add.group();
        this.lastObstacleTime = 0;
        this.physics.add.collider(this.character, this.obstacles, this.gameOver, null, this);

    }

    gameOver() {
        if (this.isDead) return
        this.isDead = true;

        // Stop the music and animations
        this.music.stop();
        this.character.anims.stop();

        // Play the flying_die animation if the character is in the air
        const isOnFloor = this.character.body.blocked.down || this.character.body.touching.down;
        if (!isOnFloor) {
            this.character.anims.play("flying_die", true);
        } else {
            this.character.anims.play("idle_die", true);
        }
    }

    showGameOverScreen() {
        this.isGameOver = true;
        // Stop player animation
        this.character.anims.stop();
        // Show a Game Over screen with the distance traveled
        const gameOverText = `Game Over\nDistance parcourue : ${Math.floor(this.distance)} m`;
        this.add.text(this.scale.width / 2, this.scale.height / 2, gameOverText, {
            fontSize: '32px',
            fill: '#FFF',
            align: 'center',
        }).setOrigin(0.5, 0.5);
        // Add button image to the button
        const buttonImage = this.add.image(this.scale.width / 2, this.scale.height / 2 + 100, "blueAtlas", "blue_button02.png");
        buttonImage.setOrigin(0.5, 0.5);
        // Add a revive button
        const reviveButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, "Recommencer", {
            fontSize: '32px',
            fill: '#FFF',
            align: 'center',
        }).setOrigin(0.5, 0.5);
        reviveButton.setInteractive();
        reviveButton.on("pointerdown", () => {
            this.reset();
            this.scene.restart();
        }, this);
        // Resize the button to fit the text
        buttonImage.displayWidth = reviveButton.width + 20;
        buttonImage.displayHeight = reviveButton.height + 20;
        // Center the text in the button
        Phaser.Display.Align.In.Center(
            reviveButton,
            buttonImage
        );
        // On Hover change the button image
        reviveButton.on("pointerover", () => {
            buttonImage.setFrame("blue_button03.png");
        });
        reviveButton.on("pointerout", () => {
            buttonImage.setFrame("blue_button02.png");
        });
        // Add button image to the button
        const menuButtonImage = this.add.image(this.scale.width / 2, this.scale.height / 2 + 200, "blueAtlas", "blue_button02.png");
        menuButtonImage.setOrigin(0.5, 0.5);
        // Add a menu button
        const menuButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 200, "Retourner au menu", {
            fontSize: '32px',
            fill: '#FFF',
            align: 'center',
        }).setOrigin(0.5, 0.5);
        menuButton.setInteractive();
        menuButton.on("pointerdown", this.goToMenu, this);
        // Resize the button to fit the text
        menuButtonImage.displayWidth = menuButton.width + 20;
        menuButtonImage.displayHeight = menuButton.height + 20;
        // On hover change image
        menuButton.on("pointerover", () => {
            menuButtonImage.setFrame("blue_button03.png");
        }, this);
        menuButton.on("pointerout", () => {
            menuButtonImage.setFrame("blue_button02.png");
        }, this);
        // Center the text in the button
        Phaser.Display.Align.In.Center(
            menuButton,
            menuButtonImage
        );

        // Stop music
        this.music.stop();
        // Play the game over sound if it's not already playing
        if (!this.gameOverSound.isPlaying) {
            this.gameOverSound.play();
        }
    }

    update(time, delta) {
        if (this.isGameOver) return
        const isOnFloor = this.character.body.blocked.down || this.character.body.touching.down;

        // If the character is dead
        if (this.isDead) {
            const velocityY = this.character.body.velocity.y;
            if (isOnFloor && velocityY <= 0) {
                this.character.setVelocityY(0);
                this.character.setVelocityX(0);
                this.character.anims.play("idle_die", true)
                    .on("animationcomplete", () => {
                        // Disable collisions
                        this.physics.world.colliders.destroy();
                        // Disable all velocity of obstacles
                        this.obstacles.children.iterate((obstacle) => {
                            obstacle.setVelocityX(0);
                        });
                        // Show the Game Over screen
                        this.showGameOverScreen();
                    }, this);
            } else {
                this.character.anims.play("flying_die", true);
                this.character.setVelocityY(1000);
            }
            return
        }

        const layerSpeed = this.parallaxManager.update(this.distance);

        if (time - this.lastObstacleTime > 2000) { // Générer un nouvel obstacle toutes les 2000 ms (2 secondes)
            this.spawnObstacle();
            this.lastObstacleTime = time;
        }

        // Calculate the distance
        this.distance += layerSpeed * 66.67 * delta / 1000;
        this.distanceText.setText(`Distance: ${Math.round(this.distance)} m`);

        // If the character is dead and touches the ground, play the idle_die animation and show the Game Over screen
        // Controls for the character
       if (this.cursors.space.isDown) {
            console.log("space");
            this.character.setVelocityY(-300);
            this.character.anims.play("flying", true);
            this.character.setVelocityX(
                this.character.x < window.innerWidth / 2 ? 300 : 0
            );
        }
        else {
            // Update character's animations and velocity based on whether they are on the floor or not
            if (isOnFloor) {
                console.log("on floor");
                this.character.anims.play("running", true);
                this.character.setVelocityX(
                    this.character.x < window.innerWidth / 2 ? 300 : 0
                );
                this.character.setVelocityY(0);
            } else {
                console.log("in air");
                this.character.anims.play("idle", true);
                this.character.setVelocityX(
                    this.character.x < window.innerWidth / 2 ? 300 : 0
                );
                // Apply gravity when the character is not on the floor and the spacebar is not pressed
                this.character.setVelocityY(300);
            }
        }

    }

}

export default GameScene;
