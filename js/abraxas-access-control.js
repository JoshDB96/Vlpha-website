/**
 * Abraxas Oracle - Flexible Access Control System
 * Completely modular and configurable access management
 */

class AbraxasAccessControl {
  constructor(config = {}) {
    // Default configuration - easily customizable
    this.config = {
      // Access tiers and their permissions
      tiers: {
        guest: {
          name: 'Guest',
          price: 0,
          duration: 0, // 0 = session only
          features: ['basic_oracle'],
          limits: {
            daily_questions: 3,
            response_length: 'short'
          }
        },
        initiate: {
          name: 'Initiate',
          price: 9.99,
          duration: 7, // days
          features: ['basic_oracle', 'general_wisdom'],
          limits: {
            daily_questions: 10,
            response_length: 'medium'
          }
        },
        adept: {
          name: 'Adept',
          price: 19.99,
          duration: 30, // days
          features: ['basic_oracle', 'general_wisdom', 'meditation_timer', 'sacred_journal'],
          limits: {
            daily_questions: 25,
            response_length: 'long'
          }
        },
        oracle: {
          name: 'Oracle',
          price: 49.99,
          duration: 365, // days (lifetime)
          features: ['basic_oracle', 'general_wisdom', 'meditation_timer', 'sacred_journal', 'oracle_history', 'premium_guidance'],
          limits: {
            daily_questions: -1, // unlimited
            response_length: 'unlimited'
          }
        }
      },
      
      // Authentication methods
      auth: {
        allowGuest: true,
        requireLogin: false, // Set to true to always require login
        credentials: {
          // Add your custom credentials here
          'JoshDB96': 'Yung@993590',
          'admin': 'sacred_key_2025'
        }
      },
      
      // Payment configuration
      payment: {
        provider: 'paypal',
        clientId: 'ActVV9YG3-qWPXSbB2YDU2UIikelad-GMBs51iTTE-tKQJZjnS3U5WCPS345S0sVr5vUG5DY6vpXHtfq',
        currency: 'USD'
      },
      
      // Storage configuration
      storage: {
        prefix: 'abraxas_',
        keys: {
          userTier: 'user_tier',
          accessExpiry: 'access_expiry',
          isLoggedIn: 'is_logged_in',
          username: 'username',
          dailyUsage: 'daily_usage',
          lastAccess: 'last_access'
        }
      },
      
      // UI configuration
      ui: {
        showGuestOption: true,
        showTierSelection: true,
        autoHideOverlay: true,
        animationDuration: 500
      },
      
      // Override this configuration
      ...config
    };
    
    this.currentUser = null;
    this.accessState = 'checking';
    this.callbacks = {};
    
    this.init();
  }
  
  init() {
    this.loadUserState();
    this.setupEventListeners();
    this.checkAccess();
  }
  
  // Load user state from storage
  loadUserState() {
    const prefix = this.config.storage.prefix;
    const keys = this.config.storage.keys;
    
    this.currentUser = {
      tier: localStorage.getItem(prefix + keys.userTier) || 'guest',
      expiry: localStorage.getItem(prefix + keys.accessExpiry),
      isLoggedIn: localStorage.getItem(prefix + keys.isLoggedIn) === 'true',
      username: localStorage.getItem(prefix + keys.username),
      dailyUsage: JSON.parse(localStorage.getItem(prefix + keys.dailyUsage) || '{}'),
      lastAccess: localStorage.getItem(prefix + keys.lastAccess)
    };
  }
  
  // Save user state to storage
  saveUserState() {
    const prefix = this.config.storage.prefix;
    const keys = this.config.storage.keys;
    
    localStorage.setItem(prefix + keys.userTier, this.currentUser.tier);
    localStorage.setItem(prefix + keys.accessExpiry, this.currentUser.expiry || '');
    localStorage.setItem(prefix + keys.isLoggedIn, this.currentUser.isLoggedIn);
    localStorage.setItem(prefix + keys.username, this.currentUser.username || '');
    localStorage.setItem(prefix + keys.dailyUsage, JSON.stringify(this.currentUser.dailyUsage));
    localStorage.setItem(prefix + keys.lastAccess, new Date().toISOString());
  }
  
  // Setup event listeners
  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }
    
    // Guest access
    const guestBtn = document.getElementById('guest-access-btn');
    if (guestBtn) {
      guestBtn.addEventListener('click', () => {
        this.grantGuestAccess();
      });
    }
    
    // Tier selection
    const tierOptions = document.querySelectorAll('.tier-option');
    tierOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.selectTier(option.dataset.tier, parseFloat(option.dataset.price));
      });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
    
    // Upgrade tool
    const upgradeBtn = document.getElementById('upgrade-tool');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        this.showUpgradeOptions();
      });
    }
  }
  
  // Main access checking logic
  checkAccess() {
    this.accessState = 'checking';
    this.updateUI();
    
    // Check if access has expired
    if (this.currentUser.expiry && new Date() > new Date(this.currentUser.expiry)) {
      this.expireAccess();
      return;
    }
    
    // Check daily limits
    this.checkDailyLimits();
    
    // Determine access level
    if (this.hasValidAccess()) {
      this.accessState = 'granted';
      this.grantAccess();
    } else {
      this.accessState = 'denied';
      this.showAccessOverlay();
    }
  }
  
  // Check if user has valid access
  hasValidAccess() {
    const tier = this.config.tiers[this.currentUser.tier];
    if (!tier) return false;
    
    // Guest access is always valid for session
    if (this.currentUser.tier === 'guest') {
      return this.config.auth.allowGuest;
    }
    
    // Check if login is required
    if (this.config.auth.requireLogin && !this.currentUser.isLoggedIn) {
      return false;
    }
    
    // Check expiry
    if (this.currentUser.expiry && new Date() > new Date(this.currentUser.expiry)) {
      return false;
    }
    
    return true;
  }
  
  // Handle login attempt
  handleLogin() {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value.trim();
    
    if (this.validateCredentials(username, password)) {
      this.currentUser.isLoggedIn = true;
      this.currentUser.username = username;
      this.saveUserState();
      this.checkAccess();
      this.showMessage('Login successful. Welcome, Sacred Seeker.', 'success');
    } else {
      this.showMessage('Invalid credentials. Please try again.', 'error');
    }
  }
  
  // Validate login credentials
  validateCredentials(username, password) {
    return this.config.auth.credentials[username] === password;
  }
  
  // Grant guest access
  grantGuestAccess() {
    this.currentUser.tier = 'guest';
    this.currentUser.isLoggedIn = false;
    this.currentUser.expiry = null;
    this.saveUserState();
    this.checkAccess();
  }
  
  // Select payment tier
  selectTier(tierName, price) {
    this.selectedTier = tierName;
    this.selectedPrice = price;
    this.renderPayPalButton();
    this.highlightSelectedTier(tierName);
  }
  
  // Highlight selected tier
  highlightSelectedTier(tierName) {
    document.querySelectorAll('.tier-option').forEach(option => {
      option.classList.remove('selected');
    });
    document.querySelector(`[data-tier="${tierName}"]`).classList.add('selected');
  }
  
  // Render PayPal payment button
  renderPayPalButton() {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    
    // Clear existing buttons
    container.innerHTML = '';
    
    if (!this.selectedTier || !this.selectedPrice) return;
    
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.selectedPrice.toString()
            },
            description: `Abraxas Oracle ${this.config.tiers[this.selectedTier].name} Access`
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          this.handleSuccessfulPayment(this.selectedTier, details);
        });
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        this.showMessage('Payment failed. Please try again.', 'error');
      }
    }).render('#paypal-button-container');
  }
  
  // Handle successful payment
  handleSuccessfulPayment(tierName, paymentDetails) {
    const tier = this.config.tiers[tierName];
    
    this.currentUser.tier = tierName;
    this.currentUser.isLoggedIn = true;
    
    // Set expiry date
    if (tier.duration > 0) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + tier.duration);
      this.currentUser.expiry = expiry.toISOString();
    }
    
    this.saveUserState();
    this.showMessage(`Payment successful! Welcome to ${tier.name} level access.`, 'success');
    
    setTimeout(() => {
      this.checkAccess();
    }, 2000);
  }
  
  // Grant access to the application
  grantAccess() {
    const overlay = document.getElementById('access-overlay');
    const mainApp = document.getElementById('main-app');
    
    if (overlay) overlay.style.display = 'none';
    if (mainApp) mainApp.style.display = 'block';
    
    this.updateUserDisplay();
    this.enableFeatures();
    
    // Trigger access granted callback
    if (this.callbacks.onAccessGranted) {
      this.callbacks.onAccessGranted(this.currentUser);
    }
  }
  
  // Show access overlay
  showAccessOverlay() {
    const overlay = document.getElementById('access-overlay');
    const mainApp = document.getElementById('main-app');
    
    if (overlay) overlay.style.display = 'flex';
    if (mainApp) mainApp.style.display = 'none';
    
    this.updateAccessUI();
  }
  
  // Update access overlay UI
  updateAccessUI() {
    const title = document.getElementById('access-title');
    const loginSection = document.getElementById('login-section');
    const paymentSection = document.getElementById('payment-section');
    const guestSection = document.getElementById('guest-section');
    
    if (this.currentUser.tier !== 'guest' && this.currentUser.expiry && new Date() > new Date(this.currentUser.expiry)) {
      if (title) title.textContent = 'Access Expired - Renew Your Journey';
    } else {
      if (title) title.textContent = 'Enter the Sacred Temple';
    }
    
    // Show/hide sections based on configuration
    if (loginSection) {
      loginSection.style.display = this.config.auth.requireLogin ? 'block' : 'none';
    }
    
    if (paymentSection) {
      paymentSection.style.display = this.config.ui.showTierSelection ? 'block' : 'none';
    }
    
    if (guestSection) {
      guestSection.style.display = this.config.ui.showGuestOption ? 'block' : 'none';
    }
  }
  
  // Update user display in main app
  updateUserDisplay() {
    const tierDisplay = document.getElementById('user-tier-display');
    if (tierDisplay) {
      const tier = this.config.tiers[this.currentUser.tier];
      tierDisplay.textContent = `${tier.name} Access`;
      
      if (this.currentUser.expiry) {
        const expiry = new Date(this.currentUser.expiry);
        const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft > 0) {
          tierDisplay.textContent += ` (${daysLeft} days remaining)`;
        }
      }
    }
  }
  
  // Enable features based on user tier
  enableFeatures() {
    const tier = this.config.tiers[this.currentUser.tier];
    const toolsSection = document.getElementById('oracle-tools');
    
    if (tier.features.length > 1) {
      if (toolsSection) toolsSection.style.display = 'block';
    }
    
    // Enable/disable specific tools
    tier.features.forEach(feature => {
      const element = document.getElementById(feature.replace('_', '-') + '-tool');
      if (element) {
        element.style.display = 'block';
        element.disabled = false;
      }
    });
  }
  
  // Check daily usage limits
  checkDailyLimits() {
    const today = new Date().toDateString();
    const tier = this.config.tiers[this.currentUser.tier];
    
    if (!this.currentUser.dailyUsage[today]) {
      this.currentUser.dailyUsage[today] = { questions: 0 };
    }
    
    const todayUsage = this.currentUser.dailyUsage[today];
    const limit = tier.limits.daily_questions;
    
    if (limit > 0 && todayUsage.questions >= limit) {
      this.showMessage(`Daily question limit reached (${limit}). Upgrade for more access.`, 'warning');
      return false;
    }
    
    return true;
  }
  
  // Increment daily usage
  incrementDailyUsage(type = 'questions') {
    const today = new Date().toDateString();
    
    if (!this.currentUser.dailyUsage[today]) {
      this.currentUser.dailyUsage[today] = { questions: 0 };
    }
    
    this.currentUser.dailyUsage[today][type]++;
    this.saveUserState();
  }
  
  // Check if user can perform action
  canPerformAction(action) {
    const tier = this.config.tiers[this.currentUser.tier];
    
    switch (action) {
      case 'ask_question':
        return this.checkDailyLimits();
      case 'use_meditation':
        return tier.features.includes('meditation_timer');
      case 'use_journal':
        return tier.features.includes('sacred_journal');
      case 'view_history':
        return tier.features.includes('oracle_history');
      default:
        return true;
    }
  }
  
  // Expire access
  expireAccess() {
    this.currentUser.tier = 'guest';
    this.currentUser.expiry = null;
    this.saveUserState();
    this.showMessage('Your access has expired. Please renew to continue.', 'warning');
    this.showAccessOverlay();
  }
  
  // Logout user
  logout() {
    this.currentUser = {
      tier: 'guest',
      expiry: null,
      isLoggedIn: false,
      username: null,
      dailyUsage: {},
      lastAccess: null
    };
    this.saveUserState();
    this.showAccessOverlay();
    this.showMessage('You have been logged out.', 'info');
  }
  
  // Show upgrade options
  showUpgradeOptions() {
    this.showAccessOverlay();
    const title = document.getElementById('access-title');
    if (title) title.textContent = 'Upgrade Your Sacred Journey';
  }
  
  // Update UI based on current state
  updateUI() {
    const statusElement = document.getElementById('access-status');
    if (statusElement) {
      switch (this.accessState) {
        case 'checking':
          statusElement.textContent = 'Checking sacred permissions...';
          break;
        case 'granted':
          statusElement.textContent = 'Access granted. Welcome, seeker.';
          break;
        case 'denied':
          statusElement.textContent = 'Sacred access required.';
          break;
      }
    }
  }
  
  // Show message to user
  showMessage(message, type = 'info') {
    // Create or update message element
    let messageEl = document.getElementById('access-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'access-message';
      messageEl.className = 'access-message';
      document.body.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.className = `access-message ${type}`;
    messageEl.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  }
  
  // Register callbacks
  onAccessGranted(callback) {
    this.callbacks.onAccessGranted = callback;
  }
  
  onAccessDenied(callback) {
    this.callbacks.onAccessDenied = callback;
  }
  
  // Get current user info
  getCurrentUser() {
    return { ...this.currentUser };
  }
  
  // Get user permissions
  getUserPermissions() {
    return this.config.tiers[this.currentUser.tier];
  }
  
  // Manual access override (for admin/testing)
  overrideAccess(tier, duration = null) {
    this.currentUser.tier = tier;
    this.currentUser.isLoggedIn = true;
    
    if (duration) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + duration);
      this.currentUser.expiry = expiry.toISOString();
    }
    
    this.saveUserState();
    this.checkAccess();
  }
  
  // Reset all user data
  resetUserData() {
    const prefix = this.config.storage.prefix;
    Object.values(this.config.storage.keys).forEach(key => {
      localStorage.removeItem(prefix + key);
    });
    this.loadUserState();
    this.checkAccess();
  }
}

// Initialize access control when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Create global access control instance
  window.abraxasAccess = new AbraxasAccessControl({
    // Custom configuration can be passed here
    // Example: override default credentials
    auth: {
      allowGuest: true,
      requireLogin: false,
      credentials: {
        'JoshDB96': 'Yung@993590',
        'admin': 'sacred_key_2025',
        'testuser': 'test123'
      }
    }
  });
  
  // Set up callbacks
  window.abraxasAccess.onAccessGranted((user) => {
    console.log('Access granted to:', user);
    // Initialize oracle functionality
    if (window.abraxasOracle) {
      window.abraxasOracle.init();
    }
  });
});

// Export for external use
window.AbraxasAccessControl = AbraxasAccessControl;

