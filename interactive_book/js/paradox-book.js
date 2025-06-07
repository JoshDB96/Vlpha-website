/**
 * Paradox Book Interactive Features
 * Integrates with VLPHA styling and animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize VLPHA features
  initPsychedelicShimmer();
  initFadeInAnimations();
  
  // Initialize book-specific features
  initChapterNavigation();
  initReflectionPrompts();
  initHighlightSystem();
  initZoomableSigils();
  
  // Set up chapter transitions
  setupChapterTransitions();
});

/**
 * Initialize fade-in animations from VLPHA
 */
function initFadeInAnimations() {
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
}

/**
 * Initialize chapter navigation
 */
function initChapterNavigation() {
  const chapterSelect = document.getElementById('chapterSelect');
  const prevButton = document.getElementById('prevChapter');
  const nextButton = document.getElementById('nextChapter');
  const chapters = document.querySelectorAll('.chapter');
  
  if (!chapterSelect || !prevButton || !nextButton || chapters.length === 0) return;
  
  // Set up chapter select dropdown
  chapterSelect.addEventListener('change', function() {
    showChapter(this.value);
    saveCurrentChapter(this.value);
  });
  
  // Set up navigation buttons
  prevButton.addEventListener('click', function() {
    const currentIndex = getCurrentChapterIndex();
    if (currentIndex > 0) {
      const prevChapterId = chapters[currentIndex - 1].id;
      showChapter(prevChapterId);
      chapterSelect.value = prevChapterId;
      saveCurrentChapter(prevChapterId);
    }
  });
  
  nextButton.addEventListener('click', function() {
    const currentIndex = getCurrentChapterIndex();
    if (currentIndex < chapters.length - 1) {
      const nextChapterId = chapters[currentIndex + 1].id;
      showChapter(nextChapterId);
      chapterSelect.value = nextChapterId;
      saveCurrentChapter(nextChapterId);
    }
  });
  
  // Load last viewed chapter or default to first
  const savedChapter = localStorage.getItem('paradoxBookCurrentChapter');
  if (savedChapter && document.getElementById(savedChapter)) {
    showChapter(savedChapter);
    chapterSelect.value = savedChapter;
  } else {
    showChapter(chapters[0].id);
    chapterSelect.value = chapters[0].id;
  }
  
  // Update progress bar
  updateProgressBar();
}

/**
 * Show specified chapter and hide others
 */
function showChapter(chapterId) {
  const chapters = document.querySelectorAll('.chapter');
  
  chapters.forEach(chapter => {
    if (chapter.id === chapterId) {
      chapter.classList.add('active');
      // Scroll to top when changing chapters
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      chapter.classList.remove('active');
    }
  });
  
  // Update progress bar
  updateProgressBar();
}

/**
 * Get current chapter index
 */
function getCurrentChapterIndex() {
  const chapters = document.querySelectorAll('.chapter');
  let currentIndex = 0;
  
  chapters.forEach((chapter, index) => {
    if (chapter.classList.contains('active')) {
      currentIndex = index;
    }
  });
  
  return currentIndex;
}

/**
 * Save current chapter to localStorage
 */
function saveCurrentChapter(chapterId) {
  localStorage.setItem('paradoxBookCurrentChapter', chapterId);
}

/**
 * Update progress bar
 */
function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;
  
  const currentIndex = getCurrentChapterIndex();
  const totalChapters = document.querySelectorAll('.chapter').length;
  const progress = ((currentIndex + 1) / totalChapters) * 100;
  
  progressBar.style.width = `${progress}%`;
}

/**
 * Initialize reflection prompts with journal overlay
 */
function initReflectionPrompts() {
  const reflectionPrompts = document.querySelectorAll('.reflection-prompt');
  
  reflectionPrompts.forEach(prompt => {
    prompt.addEventListener('click', function() {
      const promptId = this.getAttribute('data-reflection-id');
      const promptTitle = this.querySelector('h3').textContent;
      const promptContent = this.querySelector('p').textContent;
      
      // Check if user prefers voice playback
      const preferVoice = localStorage.getItem('paradoxBookVoicePreference') === 'true';
      
      if (preferVoice) {
        openVoicePlayback(promptId, promptTitle, promptContent);
      } else {
        openJournalOverlay(promptId, promptTitle, promptContent);
      }
    });
  });
  
  // Set up journal overlay close button
  const journalCloseBtn = document.querySelector('.journal-close');
  if (journalCloseBtn) {
    journalCloseBtn.addEventListener('click', closeJournalOverlay);
  }
  
  // Set up journal save button
  const journalSaveBtn = document.querySelector('.journal-save');
  if (journalSaveBtn) {
    journalSaveBtn.addEventListener('click', saveJournalEntry);
  }
  
  // Set up voice controls
  initVoiceControls();
}

/**
 * Open journal overlay for reflection
 */
function openJournalOverlay(promptId, promptTitle, promptContent) {
  const overlay = document.getElementById('journalOverlay');
  const title = document.getElementById('journalTitle');
  const content = document.getElementById('journalContent');
  const textarea = document.getElementById('journalTextarea');
  
  if (!overlay || !title || !content || !textarea) return;
  
  // Set content
  title.textContent = promptTitle;
  content.textContent = promptContent;
  
  // Load saved journal entry if exists
  const savedEntry = localStorage.getItem(`paradoxBookJournal_${promptId}`);
  textarea.value = savedEntry || '';
  
  // Set active prompt ID for saving
  textarea.setAttribute('data-prompt-id', promptId);
  
  // Show overlay
  overlay.classList.add('active');
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Focus textarea
  setTimeout(() => {
    textarea.focus();
  }, 500);
}

/**
 * Close journal overlay
 */
function closeJournalOverlay() {
  const overlay = document.getElementById('journalOverlay');
  if (!overlay) return;
  
  overlay.classList.remove('active');
  
  // Re-enable body scrolling
  document.body.style.overflow = '';
}

/**
 * Save journal entry
 */
function saveJournalEntry() {
  const textarea = document.getElementById('journalTextarea');
  if (!textarea) return;
  
  const promptId = textarea.getAttribute('data-prompt-id');
  const journalText = textarea.value;
  
  // Save to localStorage
  localStorage.setItem(`paradoxBookJournal_${promptId}`, journalText);
  
  // Show save confirmation
  const saveBtn = document.querySelector('.journal-save');
  if (saveBtn) {
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.disabled = true;
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }, 2000);
  }
}

/**
 * Initialize voice controls
 */
function initVoiceControls() {
  const voiceToggle = document.getElementById('voiceToggle');
  if (voiceToggle) {
    // Set initial state
    const preferVoice = localStorage.getItem('paradoxBookVoicePreference') === 'true';
    voiceToggle.checked = preferVoice;
    
    // Add change listener
    voiceToggle.addEventListener('change', function() {
      localStorage.setItem('paradoxBookVoicePreference', this.checked);
    });
  }
  
  // Set up voice playback controls
  const playBtn = document.getElementById('voicePlayBtn');
  const pauseBtn = document.getElementById('voicePauseBtn');
  const stopBtn = document.getElementById('voiceStopBtn');
  
  if (playBtn && pauseBtn && stopBtn) {
    playBtn.addEventListener('click', resumeVoicePlayback);
    pauseBtn.addEventListener('click', pauseVoicePlayback);
    stopBtn.addEventListener('click', stopVoicePlayback);
  }
  
  // Set up voice overlay close button
  const voiceCloseBtn = document.querySelector('.voice-close');
  if (voiceCloseBtn) {
    voiceCloseBtn.addEventListener('click', closeVoiceOverlay);
  }
}

/**
 * Open voice playback overlay
 */
function openVoicePlayback(promptId, promptTitle, promptContent) {
  const overlay = document.getElementById('voiceOverlay');
  const title = document.getElementById('voiceTitle');
  const content = document.getElementById('voiceContent');
  
  if (!overlay || !title || !content) return;
  
  // Set content
  title.textContent = promptTitle;
  content.textContent = promptContent;
  
  // Show overlay
  overlay.classList.add('active');
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Start voice playback
  startVoicePlayback(promptContent);
}

/**
 * Start voice playback using Web Speech API
 */
function startVoicePlayback(text) {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  // Create new speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice properties
  utterance.rate = 0.9; // Slightly slower than default
  utterance.pitch = 1;
  
  // Try to use a more natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => voice.name.includes('Google') || voice.name.includes('Natural'));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Set up progress tracking
  const progressBar = document.querySelector('.voice-progress-bar');
  if (progressBar) {
    let elapsedTime = 0;
    const totalTime = text.length / 5; // Rough estimate of speech duration
    
    // Update progress bar every 100ms
    const progressInterval = setInterval(() => {
      if (window.speechSynthesis.paused || window.speechSynthesis.speaking === false) {
        clearInterval(progressInterval);
        return;
      }
      
      elapsedTime += 0.1;
      const progress = Math.min((elapsedTime / totalTime) * 100, 100);
      progressBar.style.width = `${progress}%`;
    }, 100);
    
    // Clean up when speech ends
    utterance.onend = function() {
      clearInterval(progressInterval);
      progressBar.style.width = '100%';
    };
  }
  
  // Start speaking
  window.speechSynthesis.speak(utterance);
}

/**
 * Resume voice playback
 */
function resumeVoicePlayback() {
  window.speechSynthesis.resume();
}

/**
 * Pause voice playback
 */
function pauseVoicePlayback() {
  window.speechSynthesis.pause();
}

/**
 * Stop voice playback
 */
function stopVoicePlayback() {
  window.speechSynthesis.cancel();
  closeVoiceOverlay();
}

/**
 * Close voice overlay
 */
function closeVoiceOverlay() {
  const overlay = document.getElementById('voiceOverlay');
  if (!overlay) return;
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel();
  
  overlay.classList.remove('active');
  
  // Re-enable body scrolling
  document.body.style.overflow = '';
}

/**
 * Initialize highlight system
 */
function initHighlightSystem() {
  // Toggle highlight controls
  const highlightToggle = document.getElementById('highlightToggle');
  const highlightControls = document.querySelector('.highlight-controls');
  
  if (highlightToggle && highlightControls) {
    highlightToggle.addEventListener('click', function() {
      highlightControls.classList.toggle('active');
    });
  }
  
  // Set up highlight buttons
  const highlightButtons = document.querySelectorAll('.highlight-btn');
  highlightButtons.forEach(button => {
    button.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      applyHighlight(color);
    });
  });
  
  // Set up note system
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('note-indicator')) {
      toggleNotePopup(e.target);
    }
  });
  
  // Close note popups when clicking elsewhere
  document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('note-indicator') && !e.target.closest('.note-popup')) {
      closeAllNotePopups();
    }
  });
}

/**
 * Apply highlight to selected text
 */
function applyHighlight(color) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  
  // Don't highlight if selection is empty or spans multiple blocks
  if (range.collapsed) return;
  
  // Create highlight span
  const highlightSpan = document.createElement('span');
  highlightSpan.className = `highlight highlight-${color}`;
  
  // Apply highlight
  range.surroundContents(highlightSpan);
  
  // Add note button
  const noteBtn = document.createElement('span');
  noteBtn.className = 'note-indicator';
  noteBtn.textContent = '+';
  noteBtn.setAttribute('data-note-id', `note_${Date.now()}`);
  highlightSpan.appendChild(noteBtn);
  
  // Clear selection
  selection.removeAllRanges();
  
  // Save highlights to localStorage
  saveHighlights();
}

/**
 * Save highlights to localStorage
 */
function saveHighlights() {
  const chapters = document.querySelectorAll('.chapter');
  const highlightsData = {};
  
  chapters.forEach(chapter => {
    const chapterId = chapter.id;
    const highlights = chapter.querySelectorAll('.highlight');
    
    if (highlights.length > 0) {
      highlightsData[chapterId] = Array.from(highlights).map(highlight => {
        return {
          text: highlight.textContent,
          color: highlight.classList.contains('highlight-yellow') ? 'yellow' : 
                 highlight.classList.contains('highlight-purple') ? 'purple' : 'blue',
          noteId: highlight.querySelector('.note-indicator')?.getAttribute('data-note-id') || null
        };
      });
    }
  });
  
  localStorage.setItem('paradoxBookHighlights', JSON.stringify(highlightsData));
}

/**
 * Toggle note popup
 */
function toggleNotePopup(noteIndicator) {
  // Close all other popups first
  closeAllNotePopups();
  
  const noteId = noteIndicator.getAttribute('data-note-id');
  let popup = document.querySelector(`.note-popup[data-note-id="${noteId}"]`);
  
  if (!popup) {
    // Create new popup if it doesn't exist
    popup = document.createElement('div');
    popup.className = 'note-popup';
    popup.setAttribute('data-note-id', noteId);
    
    // Load saved note content
    const savedNote = localStorage.getItem(`paradoxBookNote_${noteId}`);
    
    // Create popup content
    popup.innerHTML = `
      <div class="note-content">${savedNote || 'Add a note...'}</div>
      <button class="note-edit">Edit</button>
    `;
    
    // Position popup
    const rect = noteIndicator.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    popup.style.left = `${rect.left + window.scrollX - 125 + (rect.width / 2)}px`;
    
    // Add to document
    document.body.appendChild(popup);
    
    // Set up edit button
    const editBtn = popup.querySelector('.note-edit');
    editBtn.addEventListener('click', function() {
      editNote(noteId, popup.querySelector('.note-content').textContent);
    });
  }
  
  // Show popup
  setTimeout(() => {
    popup.classList.add('active');
  }, 10);
}

/**
 * Close all note popups
 */
function closeAllNotePopups() {
  const popups = document.querySelectorAll('.note-popup.active');
  popups.forEach(popup => {
    popup.classList.remove('active');
    
    // Remove popup after animation
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 300);
  });
}

/**
 * Edit note
 */
function editNote(noteId, currentContent) {
  // Create prompt for editing
  const newContent = prompt('Edit your note:', currentContent === 'Add a note...' ? '' : currentContent);
  
  if (newContent !== null) {
    // Save to localStorage
    localStorage.setItem(`paradoxBookNote_${noteId}`, newContent);
    
    // Update popup content
    const popup = document.querySelector(`.note-popup[data-note-id="${noteId}"]`);
    if (popup) {
      popup.querySelector('.note-content').textContent = newContent || 'Add a note...';
    }
  }
}

/**
 * Initialize zoomable sigils
 */
function initZoomableSigils() {
  const sigils = document.querySelectorAll('.transition-sigil, .zoomable-sigil');
  
  sigils.forEach(sigil => {
    sigil.addEventListener('click', function() {
      const imgSrc = this.getAttribute('src') || this.getAttribute('data-full-image');
      const caption = this.getAttribute('alt') || this.getAttribute('data-caption') || '';
      
      openSigilOverlay(imgSrc, caption);
    });
  });
  
  // Set up sigil overlay close button
  const sigilCloseBtn = document.querySelector('.sigil-close');
  if (sigilCloseBtn) {
    sigilCloseBtn.addEventListener('click', closeSigilOverlay);
  }
}

/**
 * Open sigil overlay
 */
function openSigilOverlay(imgSrc, caption) {
  const overlay = document.getElementById('sigilOverlay');
  const image = document.getElementById('sigilImage');
  const captionEl = document.getElementById('sigilCaption');
  
  if (!overlay || !image || !captionEl) return;
  
  // Set image source and caption
  image.src = imgSrc;
  captionEl.textContent = caption;
  
  // Show overlay
  overlay.classList.add('active');
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
}

/**
 * Close sigil overlay
 */
function closeSigilOverlay() {
  const overlay = document.getElementById('sigilOverlay');
  if (!overlay) return;
  
  overlay.classList.remove('active');
  
  // Re-enable body scrolling
  document.body.style.overflow = '';
}

/**
 * Set up chapter transitions
 */
function setupChapterTransitions() {
  // Add event listeners for chapter navigation
  document.querySelectorAll('.toc-item').forEach(item => {
    item.addEventListener('click', function() {
      const chapterId = this.getAttribute('data-chapter');
      if (chapterId) {
        showChapter(chapterId);
        
        // Update chapter select dropdown
        const chapterSelect = document.getElementById('chapterSelect');
        if (chapterSelect) {
          chapterSelect.value = chapterId;
        }
        
        // Save current chapter
        saveCurrentChapter(chapterId);
      }
    });
  });
}

/**
 * Import psychedelic shimmer effect from VLPHA
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
