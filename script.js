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
};

// Theme toggle
const initThemeToggle = () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const icon = themeToggle.querySelector('ion-icon');

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    body.classList.toggle('dark-theme');
    icon.setAttribute('name', body.classList.contains('light-theme') ? 'moon-outline' : 'sunny-outline');
  });
};

// WhatsApp message display
const initWhatsAppMessages = () => {
  const messages = [
    "Let's connect!",
    "Ready to collaborate?",
    "Reach out today!",
    "Got a project? Let's talk!",
    "Let's build something great!"
  ];
  const messageElement = document.getElementById('whatsapp-message');

  const showRandomMessage = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    messageElement.textContent = randomMessage;
    messageElement.classList.add('active');
    setTimeout(() => {
      messageElement.classList.remove('active');
    }, 3000);
  };

  showRandomMessage();
  setInterval(showRandomMessage, 10000);
};

// Portfolio filtering (minimal, only "All")
const initPortfolioFilter = () => {
  const select = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-selecct-value]');
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  let lastClickedBtn = filterButtons[0];

  const filterFunc = (selectedValue) => {
    const filterItems = document.querySelectorAll('[data-filter-item]');
    filterItems.forEach(item => {
      const isVisible = selectedValue === 'all' || selectedValue === item.dataset.category;
      item.style.transition = 'opacity 0.3s ease';
      item.style.opacity = isVisible ? '1' : '0';
      setTimeout(() => {
        item.classList.toggle('active', isVisible);
        item.style.opacity = '';
        item.style.transition = '';
      }, 300);
    });
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
      const selectedValue = item.innerText.toLowerCase();
      selectValue.innerText = item.innerText;
      toggleElement(select);
      filterFunc(selectedValue);
    });
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedValue = btn.innerText.toLowerCase();
      selectValue.innerText = btn.innerText;
      filterFunc(selectedValue);
      lastClickedBtn.classList.remove('active');
      btn.classList.add('active');
      lastClickedBtn = btn;
    });
  });
};

// Contact form handling
const initContactForm = () => {
  const form = document.querySelector('[data-form]');
  const formInputs = document.querySelectorAll('[data-form-input]');
  const formBtn = document.querySelector('[data-form-btn]');
  const formBtnText = formBtn.querySelector('span');

  const validateForm = () => {
    formBtn.disabled = !form.checkValidity();
  };

  const debouncedValidate = debounce(validateForm, 100);

  formInputs.forEach(input => {
    input.addEventListener('input', debouncedValidate);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formBtn.disabled = true;
    formBtnText.textContent = 'Sending...';

    setTimeout(() => {
      try {
        console.log('Form submitted:', new FormData(form));
        alert('Message sent successfully!');
        form.reset();
        formBtnText.textContent = 'Send Message';
        validateForm();
      } catch (error) {
        console.error('Form submission error:', error);
        alert('Failed to send message. Please try again.');
        formBtnText.textContent = 'Send Message';
        formBtn.disabled = false;
      }
    }, 1000);
  });
};

// Page navigation
const initNavigation = () => {
  const navigationLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');
  const navbarList = document.querySelector('[data-navbar-list]');

  navigationLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.innerHTML.toLowerCase();
      pages.forEach(page => page.classList.toggle('active', page.dataset.page === target));
      navigationLinks.forEach(nav => nav.classList.toggle('active', nav === link));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (navbarList.classList.contains('active')) {
        toggleElement(navbarList); // Close mobile navbar
      }
    });
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });
};

// Section animations
const initSectionAnimations = () => {
  if (!('IntersectionObserver' in window)) {
    const sections = document.querySelectorAll('.animate-section');
    const glowItems = document.querySelectorAll('.glow-border-rainbow');
    sections.forEach(section => section.classList.add('visible'));
    glowItems.forEach(item => (item.style.animationPlayState = 'running'));
    return;
  }

  const animateSections = document.querySelectorAll('.animate-section');
  const sectionObserver = new IntersectionObserver(
    throttle((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, 100),
    { threshold: 0.2 }
  );

  animateSections.forEach(section => sectionObserver.observe(section));

  const glowElements = document.querySelectorAll('.glow-border-rainbow');
  const glowObserver = new IntersectionObserver(
    throttle((entries) => {
      entries.forEach(entry => {
        entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    }, 100),
    { threshold: 0.1 }
  );

  glowElements.forEach(item => {
    item.style.animationPlayState = 'paused';
    glowObserver.observe(item);
  });
};

// Preload testimonial images
const initImagePreload = () => {
  const testimonialImages = [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop'
  ];

  testimonialImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Initialize all features
const init = () => {
  initSidebar();
  initNavbar();
  initThemeToggle();
  initWhatsAppMessages();
  initPortfolioFilter();
  initContactForm();
  initNavigation();
  initSectionAnimations();
  initImagePreload();
};

document.addEventListener('DOMContentLoaded', init);