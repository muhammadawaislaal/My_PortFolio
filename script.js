// Mobile responsiveness: Added touch event handling and improved mobile navigation
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
  
  // Close sidebar when clicking outside on mobile
  if (window.innerWidth <= 768) {
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !sidebarBtn.contains(e.target) && sidebar.classList.contains('active')) {
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
    
    // Touch support for mobile
    navbarToggle.addEventListener('touchend', (e) => {
      e.preventDefault();
      toggleNavbar();
    });
  }

  // Close navbar when clicking outside
  document.addEventListener('click', (e) => {
    if (navbarToggle && navbarList && !navbarToggle.contains(e.target) && !navbarList.contains(e.target)) {
      navbarList.classList.remove('active');
    }
  });
  
  // Close navbar when clicking a link on mobile
  if (window.innerWidth <= 768) {
    const navLinks = document.querySelectorAll('[data-nav-link]');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarList.classList.remove('active');
      });
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
loadAPIKey().then(key
