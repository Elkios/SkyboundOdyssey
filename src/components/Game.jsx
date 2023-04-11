import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';

const Game = ({ config }) => {
    const gameRef = useRef(null);

    useEffect(() => {
        const game = new Phaser.Game(config);
        gameRef.current = game;

        return () => {
            game.destroy(true);
        };
    }, [config]);

    return <div id="phaser-game" ref={gameRef}></div>;
};

export default Game;
