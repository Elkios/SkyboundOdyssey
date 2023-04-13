import Phaser from 'phaser';
import PatternManager from '../managers/PatternManager';
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

    patternManager = new PatternManager(this, () => {
        this.gameOver()
    });

    reset() {
        this.distance = 0;
        this.parallaxManager.reset();
        this.isDead = false;
        this.isGameOver = false;
        this.obstacles.clear(true, true);
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

        // Audio footstep & jetpack
        this.load.audio("footsteps", "assets/player/sound/footsteps.mp3");
        this.load.audio("jetpack", "assets/player/sound/jetpack.mp3");

        // Load pattern Manager
        this.patternManager.preload();
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
        this.character.setScale(0.2);

        // Contrôles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Audio footstep & jetpack
        this.footstepsSound = this.sound.add("footsteps");
        this.jetpackSound = this.sound.add("jetpack");
        this.jetpackSound.setVolume(0.2);

        // Pattern Manager
        this.patternManager.create();

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
        this.physics.add.collider(this.character, this.obstacles, this.gameOver, null, this);

    }

    gameOver() {
        if (this.isDead) return
        this.isDead = true;

        // Stop the music and animations
        if (this.music) { this.music.stop(); }
        this.footstepsSound.stop();
        this.jetpackSound.stop()
        this.character.anims.stop();
        this.sound.stopAll();
        this.character.setVelocityX(0)

        this.patternManager.stop()

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
            fill: '#000',
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

        // Add a button to save the score
        const saveScoreButtonImage = this.add.image(this.scale.width / 2, this.scale.height / 2 + 300, "blueAtlas", "blue_button02.png");
        saveScoreButtonImage.setOrigin(0.5, 0.5);

        const saveScoreButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 300, "Enregistrer le score", {
            fontSize: '32px',
            fill: '#FFF',
            align: 'center',
        }).setOrigin(0.5, 0.5);

        saveScoreButton.setInteractive();
        saveScoreButton.on("pointerdown", async () => {
            const playerName = prompt("Entrez votre nom:");
            if (playerName && playerName.trim() !== '') {
                // Replace 'dbInstance' with an instance of the dbCRUD class
                this.goToMenu()
                await this.dbCRUD.setRank(playerName.trim(), Math.floor(this.distance), this.patternManager.getCoins());
            }
        }, this);

        // Resize the button to fit the text
        saveScoreButtonImage.displayWidth = saveScoreButton.width + 20;
        saveScoreButtonImage.displayHeight = saveScoreButton.height + 20;

        // On hover change the button image
        saveScoreButton.on("pointerover", () => {
            saveScoreButtonImage.setFrame("blue_button03.png");
        });
        saveScoreButton.on("pointerout", () => {
            saveScoreButtonImage.setFrame("blue_button02.png");
        });


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

        // Calculate the distance
        this.distance += layerSpeed * 66.67 * delta / 1000;
        this.distanceText.setText(`Distance: ${Math.round(this.distance)} m`);

        this.patternManager.update();

        // If the character is dead and touches the ground, play the idle_die animation and show the Game Over screen
        // Controls for the character
        // Gérer les mises à jour du jeu à chaque image (entrées utilisateur, collisions, etc.) ici
        // Contrôles du personnage
        if (this.cursors.space.isDown) {
            this.character.setVelocityY(-300);
            this.character.anims.play("flying", true);
            this.character.setVelocityX(
                this.character.x < window.innerWidth / 2 ? 300 : 0
            );
            if (!this.jetpackSound.isPlaying) {
                this.jetpackSound.play({loop: true});
            }
            this.footstepsSound.stop();
        }
        else {
            if (isOnFloor) {
                console.log("on floor");
                this.character.anims.play("running", true);
                this.character.setVelocityX(
                    this.character.x < window.innerWidth / 2 ? 300 : 0
                );
                this.character.setVelocityY(0);
                if (!this.footstepsSound.isPlaying) {
                    this.footstepsSound.play({loop: true});
                }

                this.jetpackSound.stop();
            } else {
                this.character.anims.play("idle", true);
                this.character.setVelocityX(
                    this.character.x < window.innerWidth / 2 ? 300 : 0
                );
                // Apply gravity when the character is not on the floor and the spacebar is not pressed
                this.character.setVelocityY(300);
                this.jetpackSound.stop();
            }
        }
    }
}

export default GameScene;
