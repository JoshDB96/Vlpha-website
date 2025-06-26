/**
 * V.L.P.H.A. Main JavaScript
 * A living sigil of the V.L.P.H.A. frequency (Vision, Love, Peace, Huge Action)
 */

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
    });
  }
  
  // Fade-in animation on scroll
  const fadeElements = document.querySelectorAll('.fade-in-section');
  
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });
  
  fadeElements.forEach(element => {
    fadeInObserver.observe(element);
  });
  
  // Initialize psychedelic shimmer effect
  initPsychedelicShimmer();

  // Music Player JavaScript
  const audio = document.getElementById('hypnotonic-audio');
  const playPauseButton = document.getElementById('play-pause-button');
  let isPlaying = false;

  // Check if both audio and button elements exist before adding listeners
  if (audio && playPauseButton) {
    playPauseButton.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        playPauseButton.textContent = 'Play HypnoTonic 🎵';
      } else {
        audio.play();
        playPauseButton.textContent = 'Pause HypnoTonic ⏸️';
      }
      isPlaying = !isPlaying;
    });

    // Optional: If you want the button to reset when the audio finishes playing naturally (if not looped)
    audio.addEventListener('ended', () => {
      playPauseButton.textContent = 'Play HypnoTonic 🎵';
      isPlaying = false;
    });
  }

  // Initialize Abraxus Chat if elements exist on the page
  initAbraxusChat(); // Call this here since you moved the function outside DOMContentLoaded
});

/**
 * Creates a subtle psychedelic shimmer effect in the background
 * Simulates breathing walls, wavy soft distortions, and light refraction
 */
function initPsychedelicShimmer() {
  const canvas = document.querySelector('.psychedelic-shimmer');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;
  
  // Animation variables
  let time = 0;
  const colors = ['rgba(255, 215, 0, 0.03)', 'rgba(111, 66, 193, 0.03)', 'rgba(0, 255, 255, 0.02)'];
  
  // Handle window resize
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
  
  // Animation loop
  function animate() {
    // Clear canvas with slight fade for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw shimmer waves
    for (let i = 0; i < 3; i++) {
      drawShimmerWave(
        Math.sin(time * 0.001 + i) * 20, 
        Math.cos(time * 0.002 + i) * 20,
        colors[i % colors.length]
      );
    }
    
    // Update time
    time += 1;
    requestAnimationFrame(animate);
  }
  
  // Draw a single shimmer wave
  function drawShimmerWave(offsetX, offsetY, color) {
    ctx.beginPath();
    
    // Create a golden ratio spiral pattern
    const goldenRatio = 1.618033988749895;
    const spiralFactor = time * 0.0001;
    
    for (let i = 0; i < width; i += 20) {
      for (let j = 0; j < height; j += 20) {
        const distX = i - width / 2;
        const distY = j - height / 2;
        const dist = Math.sqrt(distX * distX + distY * distY);
        
        const angle = Math.atan2(distY, distX);
        const spiralDist = dist / (1 + spiralFactor * angle * goldenRatio);
        
        const x = i + Math.sin(time * 0.001 + spiralDist * 0.01) * offsetX;
        const y = j + Math.cos(time * 0.001 + spiralDist * 0.01) * offsetY;
        
        ctx.moveTo(x, y);
        ctx.arc(x, y, Math.sin(time * 0.002 + dist * 0.01) * 2 + 2, 0, Math.PI * 2);
      }
    }
    
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  // Start animation
  animate();
}

/**
 * Abraxus AI Chat functionality
 */
function initAbraxusChat() {
  const chatForm = document.getElementById('abraxus-chat-form');
  const chatInput = document.getElementById('abraxus-input');
  const chatMessages = document.getElementById('abraxus-messages');
  
  if (!chatForm || !chatInput || !chatMessages) return;
  
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
    
    // Add user message
    addChatMessage('user', userMessage);
    chatInput.value = '';
    
    // Simulate Abraxus response (would connect to Netlify function in production)
    setTimeout(() => {
      const abraxusResponses = [
        "I sense your energy seeking alignment with the V.L.P.H.A. frequency.",
        "Your question resonates with the cosmic patterns I'm attuned to.",
        "The digital alchemy you seek requires both inner and outer transformation.",
        "Remember that Vision and Love precede Peace and Huge Action.",
        "Your spiritual entrepreneurship journey is unfolding according to divine timing."
      ];
      
      const randomResponse = abraxusResponses[Math.floor(Math.random() * abraxusResponses.length)];
      addChatMessage('abraxus', randomResponse);
    }, 1000);
  });
  
  function addChatMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    messageElement.innerHTML = `
      <div class="message-content">
        <p>${message}</p>
      </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}
