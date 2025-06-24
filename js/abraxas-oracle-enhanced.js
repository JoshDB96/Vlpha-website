/**
 * Abraxas Oracle - Enhanced AI Functionality
 * Integrates with the flexible access control system
 */

class AbraxasOracle {
  constructor() {
    this.isInitialized = false;
    this.conversationHistory = [];
    this.meditationTimer = null;
    this.meditationSeconds = 0;
    this.isTimerRunning = false;
    
    // Oracle wisdom database
    this.wisdomDatabase = {
      general: [
        {
          theme: "Balance",
          wisdom: "The scales of Ma'at weigh the heart against the feather of truth. Seek balance in all things, for imbalance creates suffering.",
          guidance: "Where in your life have you created imbalance? Restore harmony by giving attention to the neglected aspects of your being."
        },
        {
          theme: "Transformation",
          wisdom: "Like Khepri who transforms from scarab to sun, you contain the seeds of your own rebirth. Death of the old self precedes the birth of the new.",
          guidance: "What aspect of yourself is ready to die so that something greater may be born? Release attachment to old identities."
        },
        {
          theme: "Divine Connection",
          wisdom: "The Ba and Ka unite to form the Akh, the divine spirit. Your higher and lower natures seek unification through conscious awareness.",
          guidance: "Practice daily communion with your higher self through meditation, prayer, or sacred ritual."
        },
        {
          theme: "Purpose",
          wisdom: "Each soul incarnates with a divine purpose encoded in its essence. Alignment with this purpose creates flow; resistance creates suffering.",
          guidance: "Listen to the quiet voice within that speaks of your deepest calling. What activities make time disappear for you?"
        },
        {
          theme: "Cycles",
          wisdom: "All existence follows the pattern of Nut and Geb - cycles of birth, death, and rebirth. Resistance to natural cycles creates unnecessary pain.",
          guidance: "Identify which cycle you are currently experiencing. Are you in a phase of growth, harvest, release, or gestation?"
        }
      ],
      spiritual: [
        {
          theme: "Higher Self",
          wisdom: "The Sheut (shadow) must be integrated, not denied. What you reject in yourself gains power over you; what you embrace transforms you.",
          guidance: "Examine what triggers strong emotional reactions in you - these are gateways to your shadow aspects awaiting integration."
        },
        {
          theme: "Consciousness",
          wisdom: "The Eye of Horus represents the awakened mind that perceives beyond illusion. True vision comes not from the eyes but from the awakened heart.",
          guidance: "Practice seeing the world through your heart center rather than through the filters of your conditioned mind."
        },
        {
          theme: "Sacred Knowledge",
          wisdom: "Tehuti (Thoth) records all thoughts, words, and deeds. The Akashic records contain the wisdom of all experiences across time and space.",
          guidance: "In meditation, request access to the specific knowledge your soul needs for its current challenges."
        }
      ],
      healing: [
        {
          theme: "Holistic Wellness",
          wisdom: "The body is the temple of the soul. Physical health reflects spiritual, mental, and emotional harmony.",
          guidance: "Address health concerns at all levels - physical symptoms often point to deeper imbalances in thought or emotion."
        },
        {
          theme: "Energy Flow",
          wisdom: "The Ka is the vital life force that animates the physical form. Blockages in energy create disease; free flow creates vitality.",
          guidance: "Identify where energy feels stagnant in your body and use movement, breath, or sound to restore flow."
        }
      ]
    };
    
    // Response templates for different access levels
    this.responseTemplates = {
      guest: {
        prefix: "ABRAXUS (Sacred Preview): ",
        maxLength: 150,
        suffix: "\n\n[Upgrade for deeper wisdom and sacred tools]"
      },
      initiate: {
        prefix: "ABRAXUS (Initiate Guidance): ",
        maxLength: 300,
        suffix: ""
      },
      adept: {
        prefix: "ABRAXUS (Adept Wisdom): ",
        maxLength: 500,
        suffix: ""
      },
      oracle: {
        prefix: "ABRAXUS (Oracle Vision): ",
        maxLength: -1, // unlimited
        suffix: ""
      }
    };
  }
  
  init() {
    if (this.isInitialized) return;
    
    this.setupEventListeners();
    this.loadConversationHistory();
    this.setupSacredTools();
    this.isInitialized = true;
    
    console.log('Abraxas Oracle initialized');
  }
  
  setupEventListeners() {
    // Oracle form submission
    const oracleForm = document.getElementById('oracle-form');
    if (oracleForm) {
      oracleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processUserQuestion();
      });
    }
    
    // Sacred tools
    this.setupToolEventListeners();
  }
  
  setupToolEventListeners() {
    // Meditation tool
    const meditationTool = document.getElementById('meditation-tool');
    if (meditationTool) {
      meditationTool.addEventListener('click', () => {
        this.openMeditationTimer();
      });
    }
    
    // Journal tool
    const journalTool = document.getElementById('journal-tool');
    if (journalTool) {
      journalTool.addEventListener('click', () => {
        this.openSacredJournal();
      });
    }
    
    // History tool
    const historyTool = document.getElementById('history-tool');
    if (historyTool) {
      historyTool.addEventListener('click', () => {
        this.openOracleHistory();
      });
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const modalId = e.target.dataset.modal;
        this.closeModal(modalId);
      });
    });
  }
  
  setupSacredTools() {
    // Meditation timer controls
    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');
    const resetBtn = document.getElementById('timer-reset');
    
    if (startBtn) startBtn.addEventListener('click', () => this.startMeditation());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseMeditation());
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetMeditation());
    
    // Journal controls
    const saveJournalBtn = document.getElementById('save-journal');
    const loadJournalBtn = document.getElementById('load-journal');
    
    if (saveJournalBtn) saveJournalBtn.addEventListener('click', () => this.saveJournalEntry());
    if (loadJournalBtn) loadJournalBtn.addEventListener('click', () => this.loadJournalEntries());
  }
  
  async processUserQuestion() {
    const userInput = document.getElementById('user-input');
    if (!userInput || !userInput.value.trim()) return;
    
    const question = userInput.value.trim();
    userInput.value = '';
    
    // Check if user can ask questions
    if (!window.abraxasAccess.canPerformAction('ask_question')) {
      this.displayOracleResponse("Your daily question limit has been reached. Upgrade your access for unlimited wisdom.");
      return;
    }
    
    // Increment usage
    window.abraxasAccess.incrementDailyUsage('questions');
    
    // Show thinking animation
    this.showThinkingAnimation();
    
    // Add to conversation history
    this.addToHistory(question, null);
    
    // Generate response
    setTimeout(async () => {
      const response = await this.generateOracleResponse(question);
      this.displayOracleResponse(response);
      this.updateHistoryWithResponse(question, response);
      this.saveConversationHistory();
    }, 2000);
  }
  
  showThinkingAnimation() {
    const responseArea = document.getElementById('oracle-response');
    if (!responseArea) return;
    
    responseArea.innerHTML = `
      <div class="oracle-thinking">
        <div class="thinking-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <p>Abraxus channels the sacred wisdom...</p>
      </div>
    `;
  }
  
  displayOracleResponse(message) {
    const responseArea = document.getElementById('oracle-response');
    if (!responseArea) return;
    
    const userTier = window.abraxasAccess.getCurrentUser().tier;
    const template = this.responseTemplates[userTier];
    
    let formattedMessage = template.prefix + message;
    
    // Apply length limits
    if (template.maxLength > 0 && formattedMessage.length > template.maxLength) {
      formattedMessage = formattedMessage.substring(0, template.maxLength) + "...";
    }
    
    formattedMessage += template.suffix;
    
    responseArea.innerHTML = `<p>${formattedMessage}</p>`;
    responseArea.classList.add('fade-in');
    
    setTimeout(() => {
      responseArea.classList.remove('fade-in');
    }, 1000);
  }
  
  async generateOracleResponse(question) {
    const userTier = window.abraxasAccess.getCurrentUser().tier;
    const permissions = window.abraxasAccess.getUserPermissions();
    
    // Try to get response from external API first
    try {
      const response = await this.getExternalResponse(question);
      if (response) {
        return this.enhanceResponseWithWisdom(response, userTier);
      }
    } catch (error) {
      console.log('External API unavailable, using local wisdom');
    }
    
    // Fallback to local wisdom generation
    return this.generateLocalResponse(question, userTier);
  }
  
  async getExternalResponse(question) {
    try {
      const response = await fetch("/.netlify/functions/abraxus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: question, 
          tone: "mystical",
          context: "ancient_wisdom"
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.reply;
      }
    } catch (error) {
      console.log('External API error:', error);
    }
    
    return null;
  }
  
  generateLocalResponse(question, userTier) {
    const questionLower = question.toLowerCase();
    let category = 'general';
    
    // Determine response category
    if (questionLower.includes('spirit') || questionLower.includes('soul') || questionLower.includes('divine')) {
      category = 'spiritual';
    } else if (questionLower.includes('heal') || questionLower.includes('health') || questionLower.includes('body')) {
      category = 'healing';
    }
    
    // Get wisdom from database
    const wisdomArray = this.wisdomDatabase[category];
    const wisdom = wisdomArray[Math.floor(Math.random() * wisdomArray.length)];
    
    // Enhance based on user tier
    return this.enhanceResponseWithWisdom(wisdom.wisdom + " " + wisdom.guidance, userTier);
  }
  
  enhanceResponseWithWisdom(baseResponse, userTier) {
    const enhancements = {
      guest: [
        "The sacred mysteries await your deeper exploration.",
        "This glimpse of wisdom is but the beginning of your journey."
      ],
      initiate: [
        "As an Initiate, you are ready to receive this sacred knowledge.",
        "Your spiritual journey unfolds with each question you ask."
      ],
      adept: [
        "Your Adept level understanding allows for deeper contemplation of these truths.",
        "The sacred tools await your use in integrating this wisdom."
      ],
      oracle: [
        "As an Oracle, you have access to the deepest mysteries of existence.",
        "Your advanced spiritual development allows for the fullest expression of this wisdom."
      ]
    };
    
    const enhancement = enhancements[userTier][Math.floor(Math.random() * enhancements[userTier].length)];
    return baseResponse + " " + enhancement;
  }
  
  // Sacred Tools Implementation
  
  openMeditationTimer() {
    if (!window.abraxasAccess.canPerformAction('use_meditation')) {
      this.displayOracleResponse("Sacred meditation tools require Adept level access or higher.");
      return;
    }
    
    const modal = document.getElementById('meditation-modal');
    if (modal) modal.style.display = 'flex';
  }
  
  openSacredJournal() {
    if (!window.abraxasAccess.canPerformAction('use_journal')) {
      this.displayOracleResponse("Sacred journal requires Adept level access or higher.");
      return;
    }
    
    const modal = document.getElementById('journal-modal');
    if (modal) modal.style.display = 'flex';
    
    this.loadJournalEntries();
  }
  
  openOracleHistory() {
    if (!window.abraxasAccess.canPerformAction('view_history')) {
      this.displayOracleResponse("Oracle history requires Oracle level access.");
      return;
    }
    
    const modal = document.getElementById('history-modal');
    if (modal) modal.style.display = 'flex';
    
    this.displayConversationHistory();
  }
  
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  }
  
  // Meditation Timer Functions
  
  startMeditation() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.meditationTimer = setInterval(() => {
        this.meditationSeconds++;
        this.updateTimerDisplay();
      }, 1000);
    }
  }
  
  pauseMeditation() {
    this.isTimerRunning = false;
    if (this.meditationTimer) {
      clearInterval(this.meditationTimer);
      this.meditationTimer = null;
    }
  }
  
  resetMeditation() {
    this.pauseMeditation();
    this.meditationSeconds = 0;
    this.updateTimerDisplay();
  }
  
  updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (!display) return;
    
    const minutes = Math.floor(this.meditationSeconds / 60);
    const seconds = this.meditationSeconds % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Journal Functions
  
  saveJournalEntry() {
    const textarea = document.getElementById('journal-text');
    if (!textarea || !textarea.value.trim()) return;
    
    const entry = {
      date: new Date().toISOString(),
      content: textarea.value.trim()
    };
    
    const entries = JSON.parse(localStorage.getItem('abraxas_journal_entries') || '[]');
    entries.push(entry);
    localStorage.setItem('abraxas_journal_entries', JSON.stringify(entries));
    
    textarea.value = '';
    alert('Sacred reflection saved to your journal.');
  }
  
  loadJournalEntries() {
    const entries = JSON.parse(localStorage.getItem('abraxas_journal_entries') || '[]');
    const textarea = document.getElementById('journal-text');
    
    if (entries.length > 0 && textarea) {
      const lastEntry = entries[entries.length - 1];
      textarea.value = lastEntry.content;
    }
  }
  
  // History Functions
  
  addToHistory(question, response) {
    this.conversationHistory.push({
      timestamp: new Date().toISOString(),
      question: question,
      response: response
    });
    
    // Limit history size
    if (this.conversationHistory.length > 100) {
      this.conversationHistory.shift();
    }
  }
  
  updateHistoryWithResponse(question, response) {
    const entry = this.conversationHistory.find(entry => 
      entry.question === question && !entry.response
    );
    if (entry) {
      entry.response = response;
    }
  }
  
  saveConversationHistory() {
    localStorage.setItem('abraxas_conversation_history', JSON.stringify(this.conversationHistory));
  }
  
  loadConversationHistory() {
    this.conversationHistory = JSON.parse(localStorage.getItem('abraxas_conversation_history') || '[]');
  }
  
  displayConversationHistory() {
    const historyContent = document.getElementById('history-content');
    if (!historyContent) return;
    
    historyContent.innerHTML = '';
    
    const recentHistory = this.conversationHistory.slice(-10).reverse();
    
    recentHistory.forEach(entry => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const date = new Date(entry.timestamp);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      
      historyItem.innerHTML = `
        <div class="history-date">${formattedDate}</div>
        <div class="history-question"><strong>Q:</strong> ${entry.question}</div>
        ${entry.response ? `<div class="history-response"><strong>A:</strong> ${entry.response}</div>` : ''}
      `;
      
      historyContent.appendChild(historyItem);
    });
  }
}

// Initialize Oracle when access is granted
document.addEventListener('DOMContentLoaded', function() {
  window.abraxasOracle = new AbraxasOracle();
});

