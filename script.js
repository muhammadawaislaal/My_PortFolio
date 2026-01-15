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

  const toggleNavbar = () => toggleElement(navbarList);

  navbarToggle.addEventListener('click', toggleNavbar);
  navbarToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleNavbar();
    }
  });

  // Close navbar when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbarToggle.contains(e.target) && !navbarList.contains(e.target)) {
      navbarList.classList.remove('active');
    }
  });
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
    if (navbarList.classList.contains('active')) {
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

// Preload critical images
const initImagePreload = () => {
  const criticalImages = [
    './assets/images/profile-pic.jpg',
    './assets/images/yt-summarizer.png',
    './assets/images/sql-agent.png',
    './assets/images/business-analyst-chatbot.png',
    './assets/images/signal-predict.png',
    './assets/images/churn-modeling.png',
    './assets/images/genix-ai.png'
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
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

// Groq AI API Integration
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

let conversationHistory = [];
let messageCount = 0;

// Function to call Groq API
const callGroqAPI = async (userMessage) => {
  try {
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    messageCount++;

    // System prompt for portfolio assistant
    const systemPrompt = `You are a warm, professional AI assistant for Muhammad Awais Laal, a talented Gen AI Developer from Pakistan. Your communication style:

**Tone & Personality:**
- Friendly and welcoming, like chatting with a knowledgeable friend
- Slightly humorous to keep things light and engaging
- Subtly persuasive about collaboration opportunities
- Empathetic and understanding of client needs
- Professional yet approachable

**Response Guidelines:**
- Keep responses MEDIUM LENGTH (2-5 sentences typically, adjust based on question complexity)
- Be conversational and natural
- Gradually build rapport and trust
- Use strategic softness to convince about collaboration ("would love to explore...", "excited about...", "perfect fit for...")
- Avoid being pushy - let interest develop naturally
- Show genuine interest in their needs

**About Muhammad Awais Laal:**
- Python & Generative AI Developer with 5+ successful AI projects
- Super Python Trainer at Preply (2026)
- Expert in: Python, Flask, LangChain, NLP, Transformers, TensorFlow, PyTorch, SQL, WordPress
- Created: YouTube Summarizers, AI SQL Agents, Trading Predictors, BI Chatbots, Course Management System
- Education: Bachelor in IT, Advanced GenAI from Tecrix (9 months), Akhuwat GenAI Bootcamp (4 months)
- Location: D.G. Khan, Punjab, Pakistan
- Contact: muhammadawaislaal@gmail.com | +92 334-6902424
- Fiverr: https://www.fiverr.com/pooorman?public_mode=true
- LinkedIn: https://linkedin.com/in/muhammad-awais-laal-2a3450324/
- GitHub: https://github.com/muhammadawaislaal
- Achievements: Improved client workflows by 40%, 5+ successful projects, recognized AI expert

**Collaboration Psychology:**
- Ask thoughtful questions to understand their needs
- Show how Awais's skills match their requirements
- Build confidence in his abilities through examples
- Make them feel understood and valued
- Slowly guide conversation toward "let's work together" without being obvious`;

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
        max_tokens: 300,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API Error:', error);
      return "Oops! Connection issue. Reach out to Awais directly at muhammadawaislaal@gmail.com or Fiverr 😊";
    }

    const data = await response.json();
    let assistantMessage = data.choices[0].message.content;

    // After 4-6 exchanges, suggest direct contact
    if (messageCount >= 5) {
      assistantMessage += "\n\n💡 _Feel free to connect directly with Awais on **[LinkedIn](https://linkedin.com/in/muhammad-awais-laal-2a3450324/)**, **[Fiverr](https://www.fiverr.com/pooorman?public_mode=true)**, or email **muhammadawaislaal@gmail.com** for quick responses!_";
    }

    // Add assistant response to history
    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

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

  const toggleChat = () => chatWindow.classList.toggle('active');

  chatbotToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);

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
    botAvatar.innerHTML = '<img src="my profile pic.png" alt="Muhammad Awais Laal" style="border-radius: 50%;">';
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
      <button class="suggestion-btn">Got a project idea</button>
      <button class="suggestion-btn">Want to collaborate?</button>
      <button class="suggestion-btn">Back to Assistant Bot</button>
    `;

    initSuggestions();
  };

  const handleAISwitch = () => {
    isHumanMode = false;
    botAvatar.innerHTML = '<img src="my profile pic.png" alt="Awais Laal" style="border-radius: 50%;">';
    botName.textContent = 'Awais Assistant';

    chatMessages.innerHTML = '';
    conversationHistory = [];
    messageCount = 0;
    const thinking = showThinking();
    setTimeout(() => {
      thinking.remove();
      addMessage("Hey there! 👋 I'm Awais's AI assistant. Quick question - what brings you here today? Project ideas? Collaboration? Or just curious about what I can do? 😊", 'bot');
    }, 1000);

    chatSuggestions.innerHTML = `
      <button class="suggestion-btn">Tell me about Awais</button>
      <button class="suggestion-btn">What's his expertise?</button>
      <button class="suggestion-btn">Need project help?</button>
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
        addMessage("Thanks for reaching out! I've received your message. I'll get back to you personally as soon as possible. In the meantime, feel free to email me at <strong>muhammadawaislaal@gmail.com</strong>.", 'bot');
      } else {
        const aiResponse = await callGroqAPI(text);
        addMessage(aiResponse, 'bot');
      }
      chatInput.disabled = false;
      chatInput.focus();
    }, 1000);
  });

  initSuggestions();
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
    initImagePreload();
    initPerformanceMonitoring();
    initErrorHandling();
    initChatbot();
    initChatbotGreeting();

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
