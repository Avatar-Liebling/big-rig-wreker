import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import YouTubePlayables, { PlayableAnalytics } from './YouTubePlayables.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: 'game',
  backgroundColor: '#111111',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene],
  render: {
    pixelArt: false,
    antialias: true,
  },
};

const game = new Phaser.Game(config);

// Initialize YouTube Playables & Analytics after game is ready
game.events.once('ready', () => {
  // Initialize Playables API
  game.playables = new YouTubePlayables(game);
  
  // Initialize Analytics (GA_ID can be set via environment or left null for YouTube-only)
  const GA_ID = (typeof window !== 'undefined' && window.GA_MEASUREMENT_ID) || null;
  const ANALYTICS_ENDPOINT = (typeof window !== 'undefined' && window.ANALYTICS_ENDPOINT) || null;
  game.analytics = new PlayableAnalytics(game.playables, {
    gaId: GA_ID,
    customEndpoint: ANALYTICS_ENDPOINT
  });
  
  // Expose for debugging
  if (typeof window !== 'undefined') {
    window.__GAME = game;
    window.__PLAYABLES = game.playables;
    window.__ANALYTICS = game.analytics;
  }
  
  console.log('Big Rig Wrecker initialized - Playables:', game.playables.getIsPlayable());
});

// Handle page visibility for pause/resume
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.scene.isActive('GameScene')) {
      const scene = game.scene.getScene('GameScene');
      if (scene.started && !scene.paused) {
        scene.togglePause();
      }
    }
  });
}

export default game;