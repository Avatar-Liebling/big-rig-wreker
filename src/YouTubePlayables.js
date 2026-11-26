/**
 * YouTube Playables Integration
 * Handles communication with YouTube's Playable iframe API
 * https://developers.google.com/youtube/playables
 */

export default class YouTubePlayables {
  constructor(game) {
    this.game = game;
    this.isPlayable = false;
    this.apiReady = false;
    this.callbacks = new Map();
    this._init();
  }

  _init() {
    // Check if we're inside a YouTube Playable iframe
    try {
      if (window.self !== window.top) {
        this.isPlayable = true;
        window.addEventListener('message', this._onMessage.bind(this));
        // Signal readiness to parent
        window.parent.postMessage({ type: 'playableReady' }, '*');
      }
    } catch (e) {
      console.warn('Playables: cross-origin check failed', e);
    }

    // Listen for YouTube's Playables API
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'playablesApiReady') {
        this.apiReady = true;
        this._dispatch('apiReady');
      }
    });
  }

  _onMessage(e) {
    if (!e.data || typeof e.data !== 'object') return;
    const { type, payload } = e.data;
    this._dispatch(type, payload);
  }

  _dispatch(type, payload) {
    if (this.callbacks.has(type)) {
      this.callbacks.get(type).forEach(cb => cb(payload));
    }
  }

  on(type, callback) {
    if (!this.callbacks.has(type)) this.callbacks.set(type, []);
    this.callbacks.get(type).push(callback);
  }

  off(type, callback) {
    if (!this.callbacks.has(type)) return;
    const arr = this.callbacks.get(type);
    const idx = arr.indexOf(callback);
    if (idx >= 0) arr.splice(idx, 1);
  }

  // ─── Core Playables API ───

  /** Notify YouTube that gameplay has started */
  startGameplay() {
    this._send('gameplayStart');
  }

  /** Notify YouTube that gameplay has ended */
  endGameplay(score = 0, metadata = {}) {
    this._send('gameplayEnd', { score, ...metadata });
  }

  /** Update current score during gameplay */
  updateScore(score) {
    this._send('scoreUpdate', { score });
  }

  /** Report a custom event */
  reportEvent(eventName, data = {}) {
    this._send('customEvent', { eventName, data });
  }

  /** Request YouTube to show the playable fullscreen (if supported) */
  requestFullscreen() {
    this._send('requestFullscreen');
  }

  /** Check if running in Playables environment */
  getIsPlayable() {
    return this.isPlayable;
  }

  /** Get API ready state */
  getApiReady() {
    return this.apiReady;
  }

  _send(type, payload = {}) {
    try {
      window.parent.postMessage({ type, payload }, '*');
    } catch (e) {
      console.warn('Playables: send failed', e);
    }
  }

  // ─── Monetization / Purchases ───

  /** Request a purchase flow for in-playable items */
  requestPurchase(productId) {
    this._send('requestPurchase', { productId });
  }

  /** Listen for purchase results */
  onPurchaseResult(callback) {
    this.on('purchaseResult', callback);
  }

  // ─── Ad Integration ───

  /** Request an ad break (YouTube controls ad timing) */
  requestAdBreak() {
    this._send('requestAdBreak');
  }

  /** Listen for ad events */
  onAdEvent(callback) {
    this.on('adEvent', callback);
  }

  // ─── Session Data ───

  /** Save session data to YouTube's storage */
  saveSessionData(data) {
    this._send('saveSessionData', data);
  }

  /** Load session data from YouTube's storage */
  loadSessionData(callback) {
    this.on('sessionDataLoaded', callback);
    this._send('loadSessionData');
  }
}

/**
 * Analytics wrapper for YouTube Playables
 * Sends events to YouTube + optional Google Analytics / custom endpoint
 */
export class PlayableAnalytics {
  constructor(playables, options = {}) {
    this.playables = playables;
    this.gaId = options.gaId || null;
    this.customEndpoint = options.customEndpoint || null;
    this.sessionId = this._generateSessionId();
    this.eventQueue = [];
    this._initGA();
  }

  _generateSessionId() {
    return 'sid_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  _initGA() {
    if (!this.gaId) return;
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', this.gaId, {
      send_page_view: false,
      custom_map: { session_id: 'session_id' }
    });
    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);
  }

  _sendGA(eventName, params = {}) {
    if (!this.gaId || !window.gtag) return;
    window.gtag('event', eventName, {
      session_id: this.sessionId,
      ...params
    });
  }

  _sendCustom(eventName, data) {
    if (!this.customEndpoint) return;
    fetch(this.customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, sessionId: this.sessionId, timestamp: Date.now(), ...data }),
      keepalive: true
    }).catch(() => { /* ignore */ });
  }

  _sendPlayables(eventName, data) {
    this.playables.reportEvent(eventName, data);
  }

  track(eventName, data = {}) {
    this._sendGA(eventName, data);
    this._sendCustom(eventName, data);
    this._sendPlayables(eventName, data);
  }

  // Convenience methods
  trackGameStart(mode = 'normal') {
    this.track('game_start', { mode });
    this.playables.startGameplay();
  }

  trackGameEnd(score, metadata = {}) {
    this.track('game_end', { score, ...metadata });
    this.playables.endGameplay(score, metadata);
  }

  trackScore(score) {
    this.track('score_update', { score });
    this.playables.updateScore(score);
  }

  trackWreck(type, points, combo) {
    this.track('car_wrecked', { type, points, combo });
  }

  trackPowerup(type) {
    this.track('powerup_collected', { type });
  }

  trackLevelUp(level) {
    this.track('level_up', { level });
  }

  trackAdEvent(event, data = {}) {
    this.track('ad_event', { event, ...data });
  }

  trackPurchase(productId, success) {
    this.track('purchase_attempt', { productId, success });
  }

  trackError(error, context = {}) {
    this.track('error', { message: error.message || String(error), ...context });
  }

  trackSessionTime(seconds) {
    this.track('session_time', { seconds });
  }
}