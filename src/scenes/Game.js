import Phaser from 'phaser';
import PatternManager from '../managers/PatternManager';
import ParallaxManager from "../managers/ParallaxManager";

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    FRAME_RATE_SPRITE_ANIMATION = 15;
    character;
    cursors;
    parallaxManager = new ParallaxManager(this, 'darkForest', 10);
    patternManager = new PatternManager(this);

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

        this.parallaxManager.preload();
        this.load.audio("main", "assets/musics/main.mp3");

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
    }

    update(time, delta) {
        this.parallaxManager.update();
        this.patternManager.update();

        // Gérer les mises à jour du jeu à chaque image (entrées utilisateur, collisions, etc.) ici
        // Contrôles du personnage
        if (this.cursors.space.isDown) {
            this.character.setVelocityY(-300);
            this.character.anims.play("flying", true);
            this.character.setVelocityX(
                this.character.x < window.innerWidth / 2 ? 300 : 0
            );

            if (!this.jetpackSound.isPlaying) {
                this.jetpackSound.play({ loop: true });
            }

            this.footstepsSound.stop();
        } else if (this.cursors.space.isUp) {
            if (this.character.body.onFloor()) {
                this.character.setVelocityY(0);
                this.character.anims.play("running", true);
                this.character.setVelocityX(
                    this.character.x < window.innerWidth / 2 ? 300 : 0
                );

                if (!this.footstepsSound.isPlaying) {
                    this.footstepsSound.play({ loop: true });
                }

                this.jetpackSound.stop();
            } else {
                this.character.setVelocityY(300);
                this.character.anims.play("idle", true);
                this.character.setVelocityX(
                    this.character.x < window.innerWidth / 2 ? 300 : 0
                );

                this.jetpackSound.stop();
            }
        }
    }
}

export default GameScene;
