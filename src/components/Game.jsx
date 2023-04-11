import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';

const Game = ({ config }) => {
    const gameRef = useRef(null);

    useEffect(() => {
        const game = new Phaser.Game(config);
        gameRef.current = game;

        function resize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            game.scale.resize(width, height);
        }

        window.addEventListener('resize', resize);

        return () => {
            game.destroy(true);
        };
    }, [config]);

    return <div id="phaser-game" ref={gameRef}></div>;
};

export default Game;
