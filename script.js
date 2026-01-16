'use strict';

/**
 * Utility: Toggle element's active class
 * @param {HTMLElement} elem - Element to toggle
 */
const toggleElement = (elem) => elem.classList.toggle('active');

/**
 * Utility: Debounce function to limit event frequency
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Utility: Throttle function for scroll/resize events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum interval in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error)
 */
const showNotification = (message, type = 'success') => {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} active`;

  setTimeout(() => {
    notification.classList.remove('active');
  }, 4000);
};

/**
 * Show loading spinner
 */
const showLoading = () => {
  document.getElementById('loadingSpinner').classList.add('active');
};

/**
 * Hide loading spinner
 */
const hideLoading = () => {
  document.getElementById('loadingSpinner').classList.remove('active');
};

// Sidebar toggle
const initSidebar = () => {
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');

  const toggleSidebar = () => toggleElement(sidebar);

  sidebarBtn.addEventListener('click', toggleSidebar);
  sidebarBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSidebar();
    }
  });

  // Close sidebar when clicking outside on mobile
  if (window.innerWidth <= 767) {
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') && 
          !sidebar.contains(e.target) && 
          !sidebarBtn.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  }
};

// Navbar toggle for mobile
const initNavbar = () => {
  const navbarToggle = document.querySelector('[data-navbar-toggle]');
  const navbarList = document.querySelector('[data-navbar-list]');

  const toggleNavbar = () => toggleElement(navbarList);

  if (navbarToggle) {
    navbarToggle.addEventListener('click', toggleNavbar);
    navbarToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleNavbar();
      }
    });

    // Close navbar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 767 && 
          navbarList.classList.contains('active') && 
          !navbarToggle.contains(e.target) && 
          !navbarList.contains(e.target)) {
        navbarList.classList.remove('active');
      }
    });

    // Close navbar when clicking a link
    navbarList.addEventListener('click', (e) => {
      if (window.innerWidth <= 767 && e.target.closest('.navbar-link')) {
        navbarList.classList.remove('active');
      }
    });
  }
};

// Theme toggle
const initThemeToggle = () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const icon = themeToggle.querySelector('ion-icon');

  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme') || 'light-theme';
  body.classList.add(savedTheme);
  icon.setAttribute('name', savedTheme === 'light-theme' ? 'moon-outline' : 'sunny-outline');

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    body.classList.toggle('dark-theme');

    const isLightTheme = body.classList.contains('light-theme');
    icon.setAttribute('name', isLightTheme ? 'moon-outline' : 'sunny-outline');

    // Save theme preference
    localStorage.setItem('theme', isLightTheme ? 'light-theme' : 'dark-theme');
  });
};

// Periodic Chatbot Greeting
const initChatbotGreeting = () => {
  const greetingBubble = document.getElementById('chatbotGreetingBubble');
  if (!greetingBubble) return;

  const showGreeting = () => {
    greetingBubble.classList.add('active');
    setTimeout(() => {
      greetingBubble.classList.remove('active');
    }, 4000);
  };

  // Initial delay
  setTimeout(showGreeting, 2000);

  // Repeat every 10 seconds
  setInterval(showGreeting, 10000);
};

// Fiverr message display
const initFiverrMessages = () => {
  const messageElement = document.getElementById('fiverr-message');
  const fiverrBtn = document.querySelector('.fiverr-btn');

  if (!messageElement || !fiverrBtn) return;

  const showMessage = () => {
    messageElement.classList.add('active');
  };

  const hideMessage = () => {
    messageElement.classList.remove('active');
  };

  fiverrBtn.addEventListener('mouseenter', showMessage);
  fiverrBtn.addEventListener('mouseleave', hideMessage);
  fiverrBtn.addEventListener('focus', showMessage);
  fiverrBtn.addEventListener('blur', hideMessage);

  // Touch events for mobile
  fiverrBtn.addEventListener('touchstart', showMessage);
  fiverrBtn.addEventListener('touchend', hideMessage);
};

// Portfolio filtering
const initPortfolioFilter = () => {
  const select = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-select-value]');
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  
  // Check if elements exist
  if (!select || !selectValue) return;
  
  let lastClickedBtn = filterButtons[0];

  const filterFunc = (selectedValue) => {
    const filterItems = document.querySelectorAll('[data-filter-item]');

    filterItems.forEach(item => {
      const isVisible = selectedValue === 'all' || selectedValue === item.dataset.category;

      // Enhanced animation with fade and scale
      item.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
      item.style.opacity = isVisible ? '1' : '0';
      item.style.transform = isVisible ? 'scale(1)' : 'scale(0.9)';

      setTimeout(() => {
        item.classList.toggle('active', isVisible);
        item.style.opacity = '';
        item.style.transform = '';
        item.style.transition = '';
      }, 400);
    });
  };

  // Initialize from URL hash
  const initializeFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && Array.from(filterButtons).some(btn => btn.textContent.toLowerCase() === hash)) {
      const targetBtn = Array.from(filterButtons).find(btn =>
        btn.textContent.toLowerCase() === hash
      );
      if (targetBtn) {
        const selectedValue = hash;
        selectValue.textContent = targetBtn.textContent;
        filterFunc(selectedValue);
        lastClickedBtn.classList.remove('active');
        targetBtn.classList.add('active');
        lastClickedBtn = targetBtn;
      }
    }
  };

  if (select) {
    select.addEventListener('click', () => toggleElement(select));
    select.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleElement(select);
      }
    });
  }

  selectItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedValue = item.textContent.toLowerCase();
      selectValue.textContent = item.textContent;
      toggleElement(select);
      filterFunc(selectedValue);

      // Update filter buttons state
      const correspondingBtn = Array.from(filterButtons).find(btn =>
        btn.textContent.toLowerCase() === selectedValue
      );
      if (correspondingBtn) {
        lastClickedBtn.classList.remove('active');
        correspondingBtn.classList.add('active');
        lastClickedBtn = correspondingBtn;
      }
    });
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedValue = btn.textContent.toLowerCase();
      selectValue.textContent = btn.textContent;
      filterFunc(selectedValue);
      lastClickedBtn.classList.remove('active');
      btn.classList.add('active');
      lastClickedBtn = btn;
    });
  });

  // Close select when clicking outside
  document.addEventListener('click', (e) => {
    if (select && !select.contains(e.target)) {
      select.classList.remove('active');
    }
  });

  initializeFromHash();
};

// Contact form handling
const initContactForm = () => {
  const form = document.querySelector('[data-form]');
  if (!form) return;

  const formInputs = document.querySelectorAll('[data-form-input]');
  const formBtn = document.querySelector('[data-form-btn]');
  const formBtnText = formBtn.querySelector('span');

  const validateForm = () => {
    let isValid = true;

    formInputs.forEach(input => {
      if (!input.checkValidity()) {
        isValid = false;
      }
    });

    formBtn.disabled = !isValid;
    return isValid;
  };

  const debouncedValidate = debounce(validateForm, 100);

  // Enhanced input validation with visual feedback
  formInputs.forEach(input => {
    input.addEventListener('input', debouncedValidate);

    input.addEventListener('blur', () => {
      if (input.value && !input.checkValidity()) {
        input.style.borderBottomColor = 'var(--error-red)';
        showNotification('Please check your input', 'error');
      } else {
        input.style.borderBottomColor = '';
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Please fill all required fields correctly', 'error');
      return;
    }

    showLoading();
    formBtn.disabled = true;
    formBtnText.textContent = 'Sending...';

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically send the form data to your backend
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      console.log('Form submitted:', data);

      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
      validateForm();

    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('Failed to send message. Please try again or email me directly.', 'error');
    } finally {
      hideLoading();
      formBtnText.textContent = 'Send Message';
      formBtn.disabled = false;
    }
  });

  // Initialize form validation
  validateForm();
};

// Page navigation
const initNavigation = () => {
  const navigationLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');
  const navbarList = document.querySelector('[data-navbar-list]');

  const navigateToPage = (targetPage) => {
    // Update page visibility
    pages.forEach(page => {
      page.classList.toggle('active', page.dataset.page === targetPage);
    });

    // Update navigation links
    navigationLinks.forEach(nav => {
      nav.classList.toggle('active', nav.textContent.toLowerCase() === targetPage);
    });

    // Scroll to top with smooth behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile navbar if open
    if (navbarList && navbarList.classList.contains('active')) {
      toggleElement(navbarList);
    }

    // Update URL for deep linking
    history.pushState(null, null, `#${targetPage}`);
  };

  navigationLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.textContent.toLowerCase();
      navigateToPage(target);
    });

    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && Array.from(navigationLinks).some(link => link.textContent.toLowerCase() === hash)) {
      navigateToPage(hash);
    }
  });

  // Initialize from URL hash
  const initializeFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && Array.from(navigationLinks).some(link => link.textContent.toLowerCase() === hash)) {
      navigateToPage(hash);
    } else {
      // Default to about page
      navigateToPage('about');
    }
  };

  initializeFromHash();
};

// Section animations with Intersection Observer
const initSectionAnimations = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without Intersection Observer support
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach(section => section.classList.add('visible'));
    return;
  }

  const animateSections = document.querySelectorAll('.animate-section');
  const sectionObserver = new IntersectionObserver(
    throttle((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation with delay based on index
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          sectionObserver.unobserve(entry.target);
        }
      });
    }, 100),
    {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px'
    }
  );

  animateSections.forEach(section => sectionObserver.observe(section));
};

// Groq AI API Integration
let GROQ_API_KEY = null;
let conversationHistory = [];
let messageCount = 0;

// Load API Key securely
const loadAPIKey = async () => {
  // Check localStorage
  if (localStorage.getItem('groq_api_key')) {
    GROQ_API_KEY = localStorage.getItem('groq_api_key');
    return GROQ_API_KEY;
  }

  return null;
};

// Initialize API key
loadAPIKey().then(key => {
  if (!key) {
    console.warn('Groq API Key not found. AI features will be limited.');
  }
});

// Function to call Groq API
const callGroqAPI = async (userMessage) => {
  if (!GROQ_API_KEY) {
    return "I appreciate your interest! For real-time AI responses, please contact Awais directly at muhammadawaislaal@gmail.com or visit Fiverr. Your message is important! 💙";
  }

  try {
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    messageCount++;

    const systemPrompt = `You are Awais's friendly AI assistant. About Muhammad Awais Laal:
- Python & Generative AI Developer | 5+ successful projects
- Super Python Trainer at Preply | Skills: Python, Flask, LangChain, NLP, Transformers, TensorFlow
- Projects: YouTube Summarizers, AI SQL Agents, Trading Predictors, BI Chatbots
- Education: Bachelor's IT | Tecrix GenAI (9mo) | Akhuwat Bootcamp
- Contact: muhammadawaislaal@gmail.com | +92 334-6902424`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory
        ],
        max_tokens: 200,
        temperature: 0.85
      })
    });

    if (!response.ok) {
      return "Oops! Connection issue. Reach out to Awais directly at muhammadawaislaal@gmail.com or Fiverr 😊";
    }

    const data = await response.json();
    let assistantMessage = data.choices[0].message.content;

    // Keep conversation history manageable
    if (conversationHistory.length > 12) {
      conversationHistory = conversationHistory.slice(-12);
    }

    return assistantMessage;
  } catch (error) {
    console.error('Groq API Error:', error);
    return "Having trouble connecting 😅 Try emailing Awais at muhammadawaislaal@gmail.com!";
  }
};

// Chatbot Logic
const initChatbot = () => {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const chatSuggestions = document.getElementById('chatSuggestions');

  if (!chatbotToggle || !chatWindow) return;

  let isHumanMode = false;

  const toggleChat = () => chatWindow.classList.toggle('active');

  chatbotToggle.addEventListener('click', toggleChat);
  if (chatClose) chatClose.addEventListener('click', toggleChat);

  // Close chat when clicking outside on mobile
  if (window.innerWidth <= 767) {
    document.addEventListener('click', (e) => {
      if (chatWindow.classList.contains('active') && 
          !chatWindow.contains(e.target) && 
          !chatbotToggle.contains(e.target)) {
        chatWindow.classList.remove('active');
      }
    });
  }

  const addMessage = (text, sender) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerHTML = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
  };

  const showThinking = () => {
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'message bot-message thinking';
    thinkingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return thinkingDiv;
  };

  // Initialize suggestions
  const initSuggestions = () => {
    const btns = chatSuggestions.querySelectorAll('.suggestion-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.textContent;
        addMessage(text, 'user');

        if (text === 'Switch to Human') {
          setTimeout(() => {
            isHumanMode = true;
            addMessage("Hey! It's actually me - Awais 🚀 I try to jump in when I can. What's up?", 'bot');
          }, 500);
        } else {
          const thinking = showThinking();
          setTimeout(async () => {
            thinking.remove();
            const aiResponse = await callGroqAPI(text);
            addMessage(aiResponse, 'bot');
          }, 800);
        }
      });
    });
  };

  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      chatInput.value = '';
      chatInput.disabled = true;

      const thinking = showThinking();
      setTimeout(async () => {
        thinking.remove();
        const aiResponse = await callGroqAPI(text);
        addMessage(aiResponse, 'bot');
        chatInput.disabled = false;
        chatInput.focus();
      }, 800);
    });
  }

  initSuggestions();
};

// Handle window resize for responsive adjustments
const handleResize = () => {
  const navbarList = document.querySelector('[data-navbar-list]');
  const sidebar = document.querySelector('[data-sidebar]');
  
  // Close navbar on desktop if it was open on mobile
  if (window.innerWidth > 767 && navbarList && navbarList.classList.contains('active')) {
    navbarList.classList.remove('active');
  }
  
  // Auto-expand sidebar on desktop
  if (window.innerWidth >= 1100 && sidebar && !sidebar.classList.contains('active')) {
    sidebar.classList.add('active');
  }
  
  // Collapse sidebar on mobile if expanded
  if (window.innerWidth < 1100 && sidebar && sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
  }
};

// Initialize all features
const init = () => {
  try {
    initSidebar();
    initNavbar();
    initThemeToggle();
    initFiverrMessages();
    initPortfolioFilter();
    initContactForm();
    initNavigation();
    initSectionAnimations();
    initChatbot();
    initChatbotGreeting();
    
    // Add resize listener
    window.addEventListener('resize', throttle(handleResize, 250));
    
    // Initial responsive setup
    handleResize();

    console.log('Portfolio initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
    showNotification('Some features may not work properly', 'error');
  }
};

// Enhanced DOM ready with loading states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    toggleElement,
    debounce,
    throttle,
    showNotification
  };
}
