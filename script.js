document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Bulma Mobile Burger Menu Toggle
  // ==========================================================================
  const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
  if (navbarBurgers.length > 0) {
    navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        const targetId = el.dataset.target;
        const targetElement = document.getElementById(targetId);
        
        // Toggle the "is-active" class on both the burger and the menu
        el.classList.toggle('is-active');
        targetElement.classList.toggle('is-active');
      });
    });
  }

  // ==========================================================================
  // 2. Dark Mode Toggle
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const toggleIcon = themeToggleBtn.querySelector('.toggle-icon');
  const htmlElement = document.documentElement;

  // Retrieve stored theme or fall back to system preferences
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      toggleIcon.classList.remove('fa-moon');
      toggleIcon.classList.add('fa-sun');
    } else {
      toggleIcon.classList.remove('fa-sun');
      toggleIcon.classList.add('fa-moon');
    }
  }

  // ==========================================================================
  // 3. Quantity Selector & Cart Management
  // ==========================================================================
  const cartBadge = document.getElementById('cart-badge');
  const bookCards = document.querySelectorAll('.book-card');
  
  // Track quantities in memory
  const cart = {};

  bookCards.forEach(card => {
    const bookId = card.getAttribute('data-id');
    const minusBtn = card.querySelector('.minus-btn');
    const plusBtn = card.querySelector('.plus-btn');
    
    // Initialize cart state for this book if not present
    cart[bookId] = 0;

    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (cart[bookId] > 0) {
        cart[bookId]--;
        updateQuantityDisplay(card, bookId);
      }
    });

    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cart[bookId]++;
      updateQuantityDisplay(card, bookId);
    });
  });

  function updateQuantityDisplay(card, bookId) {
    const qty = cart[bookId];
    const qtyValue = card.querySelector('.quantity-value');
    const minusBtn = card.querySelector('.minus-btn');
    
    qtyValue.textContent = qty;
    
    if (qty > 0) {
      minusBtn.removeAttribute('disabled');
      card.classList.add('in-cart');
    } else {
      minusBtn.setAttribute('disabled', 'true');
      card.classList.remove('in-cart');
    }

    updateCartBadge();
  }

  function updateCartBadge() {
    let totalItems = 0;
    for (const id in cart) {
      totalItems += cart[id];
    }

    if (totalItems > 0) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = 'inline-flex';
    } else {
      cartBadge.style.display = 'none';
    }
  }
});
