import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';

const Game = ({ config }) => {
    const gameRef = useRef(null);

    useEffect(() => {
        const game = new Phaser.Game(config);
        gameRef.current = game;

        const resizeGame = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            game.scale.resize(width, height);
            game.events.emit('resize', width, height);
        };

        window.addEventListener('resize', resizeGame);

        return () => {
            game.destroy(true);
            window.removeEventListener('resize', resizeGame);
        };
    }, [config]);

    return <div id="phaser-game" ref={gameRef}></div>;
};

export default Game;
