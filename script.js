'use strict';

/**
 * Mobile Responsive Enhancements
 */

// Check if device is mobile
const isMobile = () => window.innerWidth <= 768;
const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
const isDesktop = () => window.innerWidth > 1024;

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
 * Utility: Throttle function to limit event frequency
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

  // Auto-expand sidebar on desktop
  if (isDesktop()) {
    sidebar.classList.add('active');
  }

  const toggleSidebar = () => toggleElement(sidebar);

  sidebarBtn.addEventListener('click', toggleSidebar);
  sidebarBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSidebar();
    }
  });
};

// Navbar toggle for mobile
const initNavbar = () => {
  const navbarToggle = document.querySelector('[data-navbar-toggle]');
  const navbarList = document.querySelector('[data-navbar-list]');
  const navbarLinks = document.querySelectorAll('.navbar-link');

  const toggleNavbar = () => {
    toggleElement(navbarList);
    // Toggle aria-expanded for accessibility
    const isExpanded = navbarList.classList.contains('active');
    navbarToggle.setAttribute('aria-expanded', isExpanded);
  };

  navbarToggle.addEventListener('click', toggleNavbar);
  navbarToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleNavbar();
    }
  });

  // Close navbar when clicking on a link (mobile only)
  navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMobile() || isTablet()) {
        navbarList.classList.remove('active');
        navbarToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close navbar when clicking outside (mobile only)
  document.addEventListener('click', (e) => {
    if ((isMobile() || isTablet()) && 
        !navbarToggle.contains(e.target) && 
        !navbarList.contains(e.target) &&
        navbarList.classList.contains('active')) {
      navbarList.classList.remove('active');
      navbarToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Hide navbar toggle on desktop
  const handleResize = () => {
    if (isDesktop()) {
      navbarToggle.style.display = 'none';
      navbarList.classList.remove('active');
    } else {
      navbarToggle.style.display = 'flex';
    }
  };

  // Initial check
  handleResize();
  
  // Listen for resize events
  window.addEventListener('resize', debounce(handleResize, 250));
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
    }, 4000); // Visible for 4s
  };

  // Initial delay
  setTimeout(showGreeting, 2000);

  // Repeat every 10 seconds (including visibility time)
  setInterval(showGreeting, 10000);
};

// Fiverr message display (Static Hover Only)
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
  
  // For touch devices
  fiverrBtn.addEventListener('touchstart', showMessage);
  fiverrBtn.addEventListener('touchend', hideMessage);
};

// Portfolio filtering
const initPortfolioFilter = () => {
  const select = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-select-value]');
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
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

    // Update URL hash for deep linking
    const newHash = selectedValue === 'all' ? '' : `#${selectedValue}`;
    history.replaceState(null, null, newHash);
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

  select.addEventListener('click', () => toggleElement(select));
  select.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleElement(select);
    }
  });

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
    if (!select.contains(e.target)) {
      select.classList.remove('active');
    }
  });

  initializeFromHash();
};

// Contact form handling
const initContactForm = () => {
  const form = document.querySelector('[data-form]');
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
      // Simulate form submission - Replace with actual form handling
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically send the form data to your backend
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      console.log('Form submitted:', data);

      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
      validateForm(); // Reset button state

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
      navbarList.classList.remove('active');
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
    }
  };

  initializeFromHash();
};

// Section animations with enhanced Intersection Observer
const initSectionAnimations = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without Intersection Observer support
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach(section => section.classList.add('visible'));
    return;
  }

  // Enhanced section observer with staggered animation
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

  // Enhanced glow animation observer
  const glowElements = document.querySelectorAll('.glow-border-rainbow');
  const glowObserver = new IntersectionObserver(
    throttle((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        } else {
          entry.target.style.animationPlayState = 'paused';
        }
      });
    }, 100),
    { threshold: 0.1 }
  );

  glowElements.forEach(item => {
    item.style.animationPlayState = 'paused';
    glowObserver.observe(item);
  });
};

// Image lazy loading optimization
const initImageOptimization = () => {
  // Set up lazy loading for images
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    images.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }
};

// Performance monitoring
const initPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.value}`);
      });
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'cumulative-layout-shift'] });
    } catch (e) {
      console.log('Performance monitoring not supported');
    }
  }

  // Log page load time
  window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
  });
};

// Enhanced error handling
const initErrorHandling = () => {
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can send this to your error tracking service
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
  });
};

// Groq AI API Integration - Secure Configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Load API Key securely from localStorage or env
let GROQ_API_KEY = null;

// Try to load API key from localStorage (set by user or from env.txt locally)
const loadAPIKey = async () => {
  // First check localStorage
  if (localStorage.getItem('groq_api_key')) {
    GROQ_API_KEY = localStorage.getItem('groq_api_key');
    return GROQ_API_KEY;
  }

  // For localhost development, try to load from env.txt
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    try {
      const response = await fetch('env.txt');
      if (response.ok) {
        const text = await response.text();
        const match = text.match(/GROQ_API_KEY=(.+)/);
        if (match) {
          GROQ_API_KEY = match[1].trim();
          return GROQ_API_KEY;
        }
      }
    } catch (e) {
      console.log('Could not load env.txt - running in fallback mode');
    }
  } else {
    // For GitHub Pages, try to load from raw GitHub content
    try {
      const response = await fetch('https://raw.githubusercontent.com/muhammadawaislaal/My_PortFolio/main/env.txt');
      if (response.ok) {
        const text = await response.text();
        const match = text.match(/GROQ_API_KEY=(.+)/);
        if (match) {
          GROQ_API_KEY = match[1].trim();
          return GROQ_API_KEY;
        }
      }
    } catch (e) {
      console.log('Could not load API key from GitHub');
    }
  }

  return null;
};

// Initialize API key on page load
loadAPIKey().then(key => {
  if (!key) {
    console.warn('Groq API Key not found. AI features will be limited. For full functionality, add your API key to localStorage: localStorage.setItem("groq_api_key", "your_key_here")');
  }
});

let conversationHistory = [];
let messageCount = 0;

// Function to call Groq API
const callGroqAPI = async (userMessage) => {
  // Check if API key is available
  if (!GROQ_API_KEY) {
    return "I appreciate your interest! For real-time AI responses, please contact Awais directly at muhammadawaislaal@gmail.com or visit Fiverr. Your message is important! 💙";
  }

  try {
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    messageCount++;

    // System prompt for portfolio assistant
    const systemPrompt = `You are Awais's friendly AI assistant. Adapt your response LENGTH based on user input:
- **Simple/funny messages**: 1 sentence max (e.g., "haha" → "That's funny! 😄")
- **Questions about skills/projects**: 2-3 sentences (explain briefly)
- **Serious inquiries/project details**: 3-4 sentences (be thorough, show expertise)
- **Chit-chat/off-topic**: 1-2 sentences (stay light)

**Style Always:**
- Psychologically persuasive: subtly guide toward collaboration
- Warm & human-like, slightly funny - like texting a smart friend
- Ask questions about their needs
- Never over-explain, never corporate-sounding
- Position Awais as the perfect fit

About Muhammad Awais Laal:
- Python & Generative AI Developer | 5+ successful projects
- Super Python Trainer at Preply | Skills: Python, Flask, LangChain, NLP, Transformers, TensorFlow
- Projects: YouTube Summarizers, AI SQL Agents, Trading Predictors, BI Chatbots
- Education: Bachelor's IT | Tecrix GenAI (9mo) | Akhuwat Bootcamp
- Contact: muhammadawaislaal@gmail.com | +92 334-6902424

**When they mention hiring/projects:** Highlight relevant expertise, ask about their vision, suggest email/Fiverr
**Key Strategy:** Match energy level → build trust → naturally lead to collaboration`;

    const response = await fetch(GROQ_API_URL, {
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
      const error = await response.json();
      console.error('Groq API Error:', error);
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

// Chatbot Logic with Groq AI
const initChatbot = () => {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const chatSuggestions = document.getElementById('chatSuggestions');
  const botAvatar = document.getElementById('botAvatar');
  const botName = document.getElementById('botName');

  let isHumanMode = false;

  const toggleChat = () => {
    chatWindow.classList.toggle('active');
    // Reset input focus when opening
    if (chatWindow.classList.contains('active')) {
      setTimeout(() => chatInput.focus(), 300);
    }
  };

  chatbotToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);

  // Close chat when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if ((isMobile() || isTablet()) && 
        chatWindow.classList.contains('active') &&
        !chatWindow.contains(e.target) &&
        !chatbotToggle.contains(e.target)) {
      chatWindow.classList.remove('active');
    }
  });

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

  const handleHumanSwitch = () => {
    isHumanMode = true;
    botAvatar.innerHTML = '<img src="my profile pic.png" alt="Muhammad Awais Laal" style="border-radius: 50%; width: 40px; height: 40px; object-fit: cover;">';
    botName.textContent = 'Muhammad Awais Laal';

    chatMessages.innerHTML = '';
    conversationHistory = [];
    messageCount = 0;
    const thinking = showThinking();
    setTimeout(() => {
      thinking.remove();
      addMessage("Hey! It's actually me - Awais 🚀 I try to jump in when I can, but heads up... I'm pretty swamped with projects! What's up?", 'bot');
    }, 1500);

    chatSuggestions.innerHTML = `
      <button class="suggestion-btn" type="button">Got a project idea</button>
      <button class="suggestion-btn" type="button">Want to collaborate?</button>
      <button class="suggestion-btn" type="button">Back to Assistant Bot</button>
    `;

    initSuggestions();
  };

  const handleAISwitch = () => {
    isHumanMode = false;
    botAvatar.innerHTML = '<img src="bot-avatar.jpg" alt="Awais Assistant" style="border-radius: 50%; width: 40px; height: 40px; object-fit: cover;">';
    botName.textContent = 'Awais Assistant';

    chatMessages.innerHTML = '';
    conversationHistory = [];
    messageCount = 0;
    const thinking = showThinking();
    setTimeout(() => {
      thinking.remove();
      addMessage("Hey there! 👋 What brings you here - looking for an AI dev or just curious?", 'bot');
    }, 800);

    chatSuggestions.innerHTML = `
      <button class="suggestion-btn" type="button">Tell me about Awais</button>
      <button class="suggestion-btn" type="button">What's his expertise?</button>
      <button class="suggestion-btn" type="button">Switch to Human</button>
    `;

    initSuggestions();
  };

  const initSuggestions = () => {
    const btns = chatSuggestions.querySelectorAll('.suggestion-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.textContent;
        addMessage(text, 'user');

        if (text === 'Switch to Human') {
          setTimeout(handleHumanSwitch, 500);
        } else if (text === 'Back to Assistant Bot') {
          setTimeout(handleAISwitch, 500);
        } else if (text === "Got a project idea") {
          const thinking = showThinking();
          setTimeout(() => {
            thinking.remove();
            addMessage("That's awesome! 🚀 I'd love to hear more about it. Drop the details to <a href='mailto:muhammadawaislaal@gmail.com'>muhammadawaislaal@gmail.com</a> or reach out on <a href='https://www.fiverr.com/pooorman?public_mode=true' target='_blank'>Fiverr</a> - Awais will get back to you quickly!", 'bot');
          }, 1500);
        } else if (text === "Want to collaborate?") {
          const thinking = showThinking();
          setTimeout(() => {
            thinking.remove();
            addMessage("Love the energy! ✨ Collaboration is what Awais thrives on. Let's connect on <a href='https://linkedin.com/in/muhammad-awais-laal-2a3450324/' target='_blank'>LinkedIn</a> or <a href='https://www.fiverr.com/pooorman?public_mode=true' target='_blank'>Fiverr</a> to discuss possibilities.", 'bot');
          }, 1500);
        } else if (text === "View My CV") {
          window.open('https://drive.google.com/file/d/1F3PoUAyofEP92umjYGs4dlWUCU3R-3Hf/view?usp=sharing', '_blank');
        } else {
          const thinking = showThinking();
          setTimeout(async () => {
            thinking.remove();
            if (isHumanMode) {
              addMessage("Thanks for the message! Awais is usually swamped with projects, but he reads everything. For quick responses, email is your best bet - <a href='mailto:muhammadawaislaal@gmail.com'>muhammadawaislaal@gmail.com</a> 💪", 'bot');
            } else {
              const aiResponse = await callGroqAPI(text);
              addMessage(aiResponse, 'bot');
            }
          }, 1000);
        }
      });
    });
  };

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
      if (isHumanMode) {
        // Human mode: Use AI with Awais's personal voice
        const awaisSystemPrompt = `You are Muhammad Awais Laal, a Gen AI Developer responding directly. Your style:
- Start conversations with warm greetings and genuine interest
- Be yourself: friendly, honest, busy but engaged
- Respond naturally to everything they say - projects, interests, questions
- Show enthusiasm about ideas and collaboration
- Be realistic: mention you're swamped with projects
- End conversations by suggesting they email muhammadawaislaal@gmail.com, reach out on Fiverr (https://www.fiverr.com/pooorman?public_mode=true), or chat with your assistant
- Keep responses 2-3 sentences, natural & conversational
- Use occasional emojis naturally

About You:
- Gen AI Developer with 5+ successful projects
- Super Python Trainer at Preply
- Expert: Python, Flask, LangChain, NLP, Transformers, TensorFlow, PyTorch
- Always busy with projects but love new collaborations
- Honest about workload but genuinely interested

Key: Sound like a real person who's interested but realistically busy.`;

        // Add to conversation history with custom system prompt
        let awaisHistory = [
          { role: 'system', content: awaisSystemPrompt },
          ...conversationHistory,
          { role: 'user', content: text }
        ];

        try {
          const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: awaisHistory,
              max_tokens: 200,
              temperature: 0.85
            })
          });

          if (!response.ok) {
            addMessage("Thanks for reaching out! Drop me a line at muhammadawaislaal@gmail.com or Fiverr - I read everything 💪", 'bot');
          } else {
            const data = await response.json();
            let awaisResponse = data.choices[0].message.content;

            // Add to history
            conversationHistory.push({ role: 'user', content: text });
            conversationHistory.push({ role: 'assistant', content: awaisResponse });

            // Keep history manageable
            if (conversationHistory.length > 12) {
              conversationHistory = conversationHistory.slice(-12);
            }

            addMessage(awaisResponse, 'bot');

            // After 5+ messages, suggest alternatives
            if (messageCount >= 5) {
              setTimeout(() => {
                const suggestion = document.createElement('div');
                suggestion.className = 'message bot-message';
                suggestion.style.fontSize = '0.85em';
                suggestion.style.opacity = '0.85';
                suggestion.style.marginTop = '8px';
                suggestion.innerHTML = "P.S. - I'm pretty swamped right now, but genuinely interested! For proper scope & timeline, kindly chat with my <a href='#' onclick='handleAISwitch(); return false;' style='color: var(--neon-cyan); text-decoration: underline;'>assistant</a>, or drop a message to <a href='mailto:muhammadawaislaal@gmail.com' style='color: var(--neon-cyan); text-decoration: underline;'>email</a> / <a href='https://www.fiverr.com/pooorman?public_mode=true' target='_blank' style='color: var(--neon-cyan); text-decoration: underline;'>Fiverr</a> 👍";
                chatMessages.appendChild(suggestion);
                chatMessages.scrollTop = chatMessages.scrollHeight;
              }, 800);
            }
          }
        } catch (error) {
          console.error('Error in human mode:', error);
          addMessage("Hey, seems like a connection hiccup. Reach out directly at muhammadawaislaal@gmail.com! 💪", 'bot');
        }
      } else {
        const aiResponse = await callGroqAPI(text);
        addMessage(aiResponse, 'bot');
        
        // After 4+ exchanges, gently suggest direct contact
        if (messageCount >= 4) {
          setTimeout(() => {
            const contactSuggestion = document.createElement('div');
            contactSuggestion.className = 'message bot-message';
            contactSuggestion.style.fontSize = '0.9em';
            contactSuggestion.style.opacity = '0.8';
            contactSuggestion.innerHTML = "💡 Ready to move forward? Hit up <a href='mailto:muhammadawaislaal@gmail.com' style='color: var(--neon-cyan); text-decoration: underline;'>email</a> or <a href='https://www.fiverr.com/pooorman?public_mode=true' target='_blank' style='color: var(--neon-cyan); text-decoration: underline;'>Fiverr</a>";
            chatMessages.appendChild(contactSuggestion);
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }, 500);
        }
      }
      chatInput.disabled = false;
      chatInput.focus();
    }, 800);
  });

  // Auto-focus input when chat opens
  chatWindow.addEventListener('transitionend', () => {
    if (chatWindow.classList.contains('active')) {
      setTimeout(() => chatInput.focus(), 100);
    }
  });

  initSuggestions();
};

// Mobile menu close on escape key
const initMobileMenuClose = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const navbarList = document.querySelector('[data-navbar-list]');
      const chatWindow = document.getElementById('chatWindow');
      const select = document.querySelector('[data-select]');
      
      if (navbarList && navbarList.classList.contains('active')) {
        navbarList.classList.remove('active');
      }
      
      if (chatWindow && chatWindow.classList.contains('active')) {
        chatWindow.classList.remove('active');
      }
      
      if (select && select.classList.contains('active')) {
        select.classList.remove('active');
      }
    }
  });
};

// Initialize all features with error handling
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
    initImageOptimization();
    initPerformanceMonitoring();
    initErrorHandling();
    initChatbot();
    initChatbotGreeting();
    initMobileMenuClose();

    console.log('Portfolio initialized successfully');
    console.log('Device:', isMobile() ? 'Mobile' : isTablet() ? 'Tablet' : 'Desktop');
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
