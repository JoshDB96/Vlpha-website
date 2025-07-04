/**
 * VLPHA Music Visualizer Synchronization
 * Syncs the music visualizer video with the website's audio player
 */

class VLPHAVisualizerSync {
    constructor() {
        this.audioPlayer = null;
        this.visualizer = null;
        this.visualizerDuration = 8.043; // Duration of the visualizer loop in seconds
        this.syncTolerance = 0.5; // Tolerance for time sync in seconds
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Find the audio player and visualizer elements
        this.audioPlayer = document.querySelector('audio');
        this.visualizer = document.querySelector('#music-visualizer');
        
        if (!this.audioPlayer) {
            console.warn('VLPHA Visualizer: Audio player not found');
            return;
        }
        
        if (!this.visualizer) {
            console.warn('VLPHA Visualizer: Visualizer element not found');
            return;
        }
        
        this.setupEventListeners();
        this.setupVisualizer();
        this.isInitialized = true;
        
        console.log('VLPHA Visualizer: Initialized successfully');
    }
    
    setupVisualizer() {
        // Ensure visualizer is muted and set to loop
        this.visualizer.muted = true;
        this.visualizer.loop = true;
        this.visualizer.preload = 'auto';
        
        // Handle visualizer loading states
        this.visualizer.addEventListener('loadstart', () => {
            this.visualizer.classList.add('loading');
        });
        
        this.visualizer.addEventListener('canplay', () => {
            this.visualizer.classList.remove('loading');
        });
        
        this.visualizer.addEventListener('error', () => {
            this.visualizer.classList.add('error');
            console.error('VLPHA Visualizer: Failed to load visualizer video');
        });
        
        // Start visualizer if audio is already playing
        if (!this.audioPlayer.paused) {
            this.startVisualizer();
        }
    }
    
    setupEventListeners() {
        // Audio player event listeners
        this.audioPlayer.addEventListener('play', () => this.onAudioPlay());
        this.audioPlayer.addEventListener('pause', () => this.onAudioPause());
        this.audioPlayer.addEventListener('timeupdate', () => this.onAudioTimeUpdate());
        this.audioPlayer.addEventListener('seeked', () => this.onAudioSeeked());
        this.audioPlayer.addEventListener('ended', () => this.onAudioEnded());
        
        // Visualizer event listeners
        this.visualizer.addEventListener('ended', () => this.onVisualizerEnded());
    }
    
    onAudioPlay() {
        this.startVisualizer();
        document.body.classList.add('audio-playing');
    }
    
    onAudioPause() {
        this.pauseVisualizer();
        document.body.classList.remove('audio-playing');
    }
    
    onAudioTimeUpdate() {
        if (this.audioPlayer.paused || this.visualizer.paused) return;
        
        this.syncVisualizerTime();
    }
    
    onAudioSeeked() {
        if (!this.audioPlayer.paused) {
            this.syncVisualizerTime();
        }
    }
    
    onAudioEnded() {
        this.pauseVisualizer();
        document.body.classList.remove('audio-playing');
    }
    
    onVisualizerEnded() {
        // This shouldn't happen since we set loop=true, but handle it just in case
        if (!this.audioPlayer.paused) {
            this.visualizer.currentTime = 0;
            this.visualizer.play();
        }
    }
    
    startVisualizer() {
        if (this.visualizer.classList.contains('error')) return;
        
        this.syncVisualizerTime();
        
        const playPromise = this.visualizer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('VLPHA Visualizer: Autoplay prevented', error);
            });
        }
    }
    
    pauseVisualizer() {
        this.visualizer.pause();
    }
    
    syncVisualizerTime() {
        const audioTime = this.audioPlayer.currentTime;
        const syncedTime = audioTime % this.visualizerDuration;
        
        // Only sync if the difference is significant to avoid constant adjustments
        if (Math.abs(this.visualizer.currentTime - syncedTime) > this.syncTolerance) {
            this.visualizer.currentTime = syncedTime;
        }
    }
    
    // Public methods for external control
    setOpacity(opacity) {
        this.visualizer.style.opacity = opacity;
    }
    
    setBlendMode(mode) {
        this.visualizer.style.mixBlendMode = mode;
    }
    
    destroy() {
        if (this.isInitialized) {
            this.pauseVisualizer();
            document.body.classList.remove('audio-playing');
            // Remove event listeners if needed
        }
    }
}

// Initialize the visualizer sync when the script loads
const vlphaVisualizer = new VLPHAVisualizerSync();

// Make it globally accessible for debugging or external control
window.VLPHAVisualizer = vlphaVisualizer;
