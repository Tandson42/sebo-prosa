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
  const cartSubtotalFooter = document.getElementById('cart-subtotal-footer');
  const cartSubtotalValue = document.getElementById('cart-subtotal-value');
  const bookCards = document.querySelectorAll('.book-card');
  
  // Track quantities and prices in memory
  const cart = {};
  const prices = {};

  bookCards.forEach(card => {
    const bookId = card.getAttribute('data-id');
    const priceText = card.getAttribute('data-price');
    const priceNum = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
    const minusBtn = card.querySelector('.minus-btn');
    const plusBtn = card.querySelector('.plus-btn');
    
    // Initialize cart state for this book if not present
    cart[bookId] = 0;
    prices[bookId] = priceNum || 0;

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
    let subtotal = 0;
    for (const id in cart) {
      totalItems += cart[id];
      subtotal += cart[id] * prices[id];
    }

    if (totalItems > 0) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = 'inline-flex';
      
      if (cartSubtotalFooter) {
        cartSubtotalFooter.style.display = 'block';
        setTimeout(() => cartSubtotalFooter.classList.add('is-active'), 10);
        cartSubtotalValue.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
      }
    } else {
      cartBadge.style.display = 'none';
      
      if (cartSubtotalFooter) {
        cartSubtotalFooter.classList.remove('is-active');
        setTimeout(() => {
          if (!cartSubtotalFooter.classList.contains('is-active')) {
            cartSubtotalFooter.style.display = 'none';
          }
        }, 400);
      }
    }
  }

  // ==========================================================================
  // 4. LGPD Cookie Banner
  // ==========================================================================
  const cookieBanner = document.getElementById('cookie-banner');
  const btnAcceptCookies = document.getElementById('accept-cookies');

  if (cookieBanner && btnAcceptCookies) {
    const hasAccepted = localStorage.getItem('cookies-accepted');
    if (!hasAccepted) {
      cookieBanner.style.display = 'block';
      setTimeout(() => cookieBanner.classList.add('is-active'), 100);
    }

    btnAcceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'true');
      cookieBanner.classList.remove('is-active');
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 400); // Wait for transition
    });
  }

});
