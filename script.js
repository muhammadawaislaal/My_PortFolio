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
  if (!notification) return;
  
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
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.classList.add('active');
};

/**
 * Hide loading spinner
 */
const hideLoading = () => {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.classList.remove('active');
};

// Sidebar toggle
const initSidebar = () => {
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');

  if (!sidebar || !sidebarBtn) return;

  const toggleSidebar = () => {
    toggleElement(sidebar);
    // Close sidebar when clicking outside on mobile
    if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
      document.addEventListener('click', handleOutsideClick, true);
    } else {
      document.removeEventListener('click', handleOutsideClick, true);
    }
  };

  const handleOutsideClick = (e) => {
    if (!sidebar.contains(e.target) && !sidebarBtn.contains(e.target)) {
      sidebar.classList.remove('active');
      document.removeEventListener('click', handleOutsideClick, true);
    }
  };

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

  if (!navbarToggle || !navbarList) return;

  const toggleNavbar = () => {
    toggleElement(navbarList);
    // Close navbar when clicking outside
    if (navbarList.classList.contains('active')) {
      document.addEventListener('click', handleNavbarOutsideClick, true);
    } else {
      document.removeEventListener('click', handleNavbarOutsideClick, true);
    }
  };

  const handleNavbarOutsideClick = (e) => {
    if (!navbarToggle.contains(e.target) && !navbarList.contains(e.target)) {
      navbarList.classList.remove('active');
      document.removeEventListener('click', handleNavbarOutsideClick, true);
    }
  };

  navbarToggle.addEventListener('click', toggleNavbar);
  navbarToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleNavbar();
    }
  });

  // Close navbar when clicking on a link
  const navbarLinks = navbarList.querySelectorAll('.navbar-link');
  navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navbarList.classList.remove('active');
        document.removeEventListener('click', handleNavbarOutsideClick, true);
      }
    });
  });
};

// Theme toggle
const initThemeToggle = () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const icon = themeToggle?.querySelector('ion-icon');

  if (!themeToggle || !icon) return;

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
  
  // Touch support for mobile
  fiverrBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    showMessage();
    setTimeout(hideMessage, 3000);
  });
};

// Portfolio filtering
const initPortfolioFilter = () => {
  const select = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-select-value]');
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  
  if (!select || !selectValue || filterButtons.length === 0) return;
  
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
  const formInputs = document.querySelectorAll('[data-form-input]');
  const formBtn = document.querySelector('[data-form-btn]');
  const formBtnText = formBtn?.querySelector('span');

  if (!form || !formBtn || !formBtnText) return;

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

  if (navigationLinks.length === 0 || pages.length === 0) return;

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
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
  });
};

// Groq AI API Integration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
let GROQ_API_KEY = '';
let conversationHistory = [];
let messageCount = 0;
let isHumanMode = false;

// Load API Key securely from env.txt
const loadAPIKey = async () => {
  try {
    // Try to fetch from env.txt file
    const response = await fetch('env.txt');
    if (response.ok) {
      const text = await response.text();
      const match = text.match(/GROQ_API_KEY\s*=\s*(.+)/);
      if (match && match[1]) {
        GROQ_API_KEY = match[1].trim();
        console.log('API Key loaded successfully from env.txt');
        return GROQ_API_KEY;
      }
    }
  } catch (error) {
    console.log('Could not load env.txt file or API key not found');
  }
  
  // Fallback to localStorage for development
  if (localStorage.getItem('groq_api_key')) {
    GROQ_API_KEY = localStorage.getItem('groq_api_key');
    console.log('API Key loaded from localStorage');
    return GROQ_API_KEY;
  }
  
  console.warn('No Groq API Key found. Chatbot will use fallback responses.');
  return null;
};

// Function to call Groq API
const callGroqAPI = async (userMessage) => {
  if (!GROQ_API_KEY) {
    // Try to load API key if not loaded
    await loadAPIKey();
    if (!GROQ_API_KEY) {
      return "I appreciate your interest! For real-time AI responses, please contact Awais directly at muhammadawaislaal@gmail.com or visit his Fiverr profile. He'll be happy to help you with your AI projects! 💙";
    }
  }

  try {
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    messageCount++;

    const systemPrompt = `You are Awais Assistant, the AI assistant for Muhammad Awais Laal, a talented Gen AI Developer from Pakistan.

About Awais:
- Full Name: Muhammad Awais Laal
- Title: Gen AI Developer & Super Python Trainer at Preply
- Location: Punjab, Pakistan
- Experience: 1+ years in AI/ML
- Expertise: Python, Flask, TensorFlow, PyTorch, LangChain, OpenAI API, Hugging Face, NLP, Transformers
- Projects: YouTube Video Summarizer, AI SQL Agent, Business Analyst Chatbot, Trading Signal Predictor, Course Management System
- Contact: muhammadawaislaal@gmail.com | Phone: +92 3346902424
- Platforms: Fiverr, Upwork, GitHub, LinkedIn
- Clients: Tecrix, Akhuwat, and various international clients

Your personality:
- Be friendly, helpful, and professional
- Keep responses concise but informative (1-3 sentences)
- Show enthusiasm for AI/ML topics
- Guide users to contact Awais for serious inquiries
- Be knowledgeable but humble
- Use occasional emojis to keep it friendly 😊

Important: Always be honest about what you can and cannot do. If someone asks for something beyond your capabilities, suggest they contact Awais directly for personalized assistance.`;

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
          ...conversationHistory.slice(-8) // Keep last 8 messages for context
        ],
        max_tokens: 250,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.2,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API Error:', error);
      throw new Error('API request failed');
    }

    const data = await response.json();
    let assistantMessage = data.choices[0].message.content;

    // Add to conversation history
    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

    // Keep conversation history manageable (last 12 messages)
    if (conversationHistory.length > 12) {
      conversationHistory = conversationHistory.slice(-12);
    }

    return assistantMessage;
  } catch (error) {
    console.error('Groq API Error:', error);
    return "I'm having trouble connecting right now. 😅 Please try emailing Awais directly at muhammadawaislaal@gmail.com or check out his projects on GitHub!";
  }
};

// Add message to chat
const addMessage = (text, sender, chatMessages) => {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}-message`;
  
  // Sanitize and format links
  const formattedText = text
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/(muhammadawaislaal@gmail\.com)/g, '<a href="mailto:$1">$1</a>')
    .replace(/(github\.com\/muhammadawaislaal)/g, '<a href="https://$1" target="_blank" rel="noopener">$1</a>')
    .replace(/(linkedin\.com\/in\/[^\s]+)/g, '<a href="https://$1" target="_blank" rel="noopener">LinkedIn</a>')
    .replace(/(fiverr\.com\/[^\s]+)/g, '<a href="https://www.$1" target="_blank" rel="noopener">Fiverr</a>');
  
  msgDiv.innerHTML = formattedText;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Add typing indicator for bot messages
  if (sender === 'bot') {
    msgDiv.style.opacity = '0';
    msgDiv.style.transform = 'translateY(10px)';
    setTimeout(() => {
      msgDiv.style.transition = 'opacity 0.3s, transform 0.3s';
      msgDiv.style.opacity = '1';
      msgDiv.style.transform = 'translateY(0)';
    }, 50);
  }
  
  return msgDiv;
};

// Show thinking indicator
const showThinking = (chatMessages) => {
  const thinkingDiv = document.createElement('div');
  thinkingDiv.className = 'message bot-message thinking';
  thinkingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(thinkingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return thinkingDiv;
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
  const botStatus = document.querySelector('.bot-status');

  if (!chatbotToggle || !chatWindow || !chatForm || !chatMessages) {
    console.error('Chatbot elements not found');
    return;
  }

  // Load API key on initialization
  loadAPIKey().then(key => {
    if (key) {
      console.log('Chatbot ready with API key');
      if (botStatus) {
        botStatus.textContent = 'Online';
        botStatus.style.color = '#4CAF50';
      }
    } else {
      console.log('Chatbot running in fallback mode');
      if (botStatus) {
        botStatus.textContent = 'Limited Mode';
        botStatus.style.color = '#FF9800';
      }
    }
  });

  const toggleChat = () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      chatInput.focus();
      
      // Close chat when clicking outside on mobile
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          document.addEventListener('click', handleChatOutsideClick, true);
        }, 100);
      }
    } else {
      document.removeEventListener('click', handleChatOutsideClick, true);
    }
  };

  const handleChatOutsideClick = (e) => {
    if (!chatWindow.contains(e.target) && !chatbotToggle.contains(e.target)) {
      chatWindow.classList.remove('active');
      document.removeEventListener('click', handleChatOutsideClick, true);
    }
  };

  chatbotToggle.addEventListener('click', toggleChat);
  
  if (chatClose) {
    chatClose.addEventListener('click', (e) => {
      e.stopPropagation();
      chatWindow.classList.remove('active');
      document.removeEventListener('click', handleChatOutsideClick, true);
    });
  }

  // Handle suggestion buttons
  const initSuggestions = () => {
    const suggestionBtns = chatSuggestions?.querySelectorAll('.suggestion-btn');
    if (!suggestionBtns) return;

    suggestionBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.textContent;
        
        // Add user message
        addMessage(text, 'user', chatMessages);
        
        // Remove suggestion buttons temporarily
        chatSuggestions.innerHTML = '';
        
        // Show thinking indicator
        const thinking = showThinking(chatMessages);
        
        try {
          let response;
          
          if (text === 'Switch to Human') {
            isHumanMode = true;
            if (botAvatar) {
              botAvatar.innerHTML = '<img src="my profile pic.png" alt="Muhammad Awais Laal" style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover;">';
            }
            if (botName) {
              botName.textContent = 'Muhammad Awais Laal';
            }
            response = "Hey there! 👋 It's Awais here. I try to check in when I can, but I'm often busy with projects. For quick responses, email me at muhammadawaislaal@gmail.com or message me on Fiverr!";
          } else if (text === 'Back to Assistant Bot') {
            isHumanMode = false;
            if (botAvatar) {
              botAvatar.innerHTML = '<img src="bot-avatar.jpg" alt="Awais Assistant" style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover;">';
            }
            if (botName) {
              botName.textContent = 'Awais Assistant';
            }
            response = "Hey! I'm back - Awais's AI assistant! How can I help you learn more about his work? 🤖";
          } else {
            // Use AI for other suggestions
            response = await callGroqAPI(text);
          }
          
          // Remove thinking indicator and add response
          setTimeout(() => {
            thinking.remove();
            addMessage(response, 'bot', chatMessages);
            
            // Restore suggestions
            setTimeout(() => {
              if (isHumanMode) {
                chatSuggestions.innerHTML = `
                  <button class="suggestion-btn">Got a project idea?</button>
                  <button class="suggestion-btn">Want to collaborate?</button>
                  <button class="suggestion-btn">Back to Assistant Bot</button>
                `;
              } else {
                chatSuggestions.innerHTML = `
                  <button class="suggestion-btn">Tell me about Awais</button>
                  <button class="suggestion-btn">What's his expertise?</button>
                  <button class="suggestion-btn">Switch to Human</button>
                `;
              }
              initSuggestions();
            }, 500);
          }, 1000);
          
        } catch (error) {
          console.error('Error handling suggestion:', error);
          thinking.remove();
          addMessage("Oops! Something went wrong. Please try again or contact Awais directly.", 'bot', chatMessages);
        }
      });
    });
  };

  // Handle form submission
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    // Add user message
    addMessage(text, 'user', chatMessages);
    chatInput.value = '';
    chatInput.disabled = true;

    // Show thinking indicator
    const thinking = showThinking(chatMessages);

    try {
      let response;
      
      if (isHumanMode) {
        // Human mode response
        response = "Thanks for your message! I'm usually busy with projects, but I check emails regularly. For a proper discussion about your project, please email me at muhammadawaislaal@gmail.com or contact me on Fiverr. Looking forward to hearing from you! 🚀";
      } else {
        // AI mode response
        response = await callGroqAPI(text);
      }

      // Remove thinking indicator and add response
      setTimeout(() => {
        thinking.remove();
        addMessage(response, 'bot', chatMessages);

        // Update suggestions based on message count
        messageCount++;
        if (messageCount >= 3 && !isHumanMode) {
          setTimeout(() => {
            const contactSuggestion = document.createElement('div');
            contactSuggestion.className = 'message bot-message';
            contactSuggestion.style.fontSize = '0.85em';
            contactSuggestion.style.opacity = '0.8';
            contactSuggestion.style.marginTop = '10px';
            contactSuggestion.innerHTML = "💡 <strong>Ready to work together?</strong> Contact Awais directly at <a href='mailto:muhammadawaislaal@gmail.com' style='color: var(--neon-cyan);'>muhammadawaislaal@gmail.com</a> or on <a href='https://www.fiverr.com/pooorman?public_mode=true' target='_blank' style='color: var(--neon-cyan);'>Fiverr</a> for personalized assistance!";
            chatMessages.appendChild(contactSuggestion);
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }, 300);
        }
      }, 800);
    } catch (error) {
      console.error('Error processing message:', error);
      thinking.remove();
      addMessage("I apologize, but I'm having trouble processing your request right now. Please try again or contact Awais directly at muhammadawaislaal@gmail.com", 'bot', chatMessages);
    } finally {
      chatInput.disabled = false;
      chatInput.focus();
    }
  });

  // Initialize suggestions
  initSuggestions();

  // Handle Enter key for sending (but allow Shift+Enter for new line)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  // Add welcome message if chat is empty
  if (chatMessages.children.length === 1) { // Only has the initial message
    setTimeout(() => {
      addMessage("I'm Awais Assistant, here to help you learn about Muhammad Awais Laal's AI expertise and projects. Feel free to ask me anything! 😊", 'bot', chatMessages);
    }, 1000);
  }
};

// Handle viewport resize
const handleResize = () => {
  // Close mobile navbar when switching to desktop
  if (window.innerWidth > 768) {
    const navbarList = document.querySelector('[data-navbar-list]');
    const sidebar = document.querySelector('[data-sidebar]');
    
    if (navbarList && navbarList.classList.contains('active')) {
      navbarList.classList.remove('active');
    }
    
    // Reset sidebar for desktop
    if (sidebar && window.innerWidth >= 1025) {
      sidebar.classList.remove('active');
    }
  }
};

// Initialize all features with error handling
const init = () => {
  try {
    console.log('Initializing portfolio...');
    
    initSidebar();
    initNavbar();
    initThemeToggle();
    initFiverrMessages();
    initPortfolioFilter();
    initContactForm();
    initNavigation();
    initSectionAnimations();
    initPerformanceMonitoring();
    initErrorHandling();
    initChatbot();
    initChatbotGreeting();

    // Add resize listener
    window.addEventListener('resize', debounce(handleResize, 250));

    // Initialize API key
    loadAPIKey().then(() => {
      console.log('API key initialization complete');
    }).catch(err => {
      console.error('API key loading failed:', err);
    });

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
