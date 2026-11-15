/**
 * متجر غُـرْزَة | Ghorza Craft Studio
 * المحرك البرمجي العام للتطبيق (Core Application Logic)
 */

(function () {
  'use strict';

  // ==========================================
  // 1. إدارة حالة السلة والمفضلة (State Management)
  // ==========================================
  const CART_STORAGE_KEY = 'ghorza_cart_items';
  const WISHLIST_STORAGE_KEY = 'ghorza_wishlist_items';
  const ORDERS_STORAGE_KEY = 'orders';
  const FREE_SHIPPING_THRESHOLD = 1500;

  let state = {
    cart: loadFromStorage(CART_STORAGE_KEY, []).filter(item => !String(item.productId || '').startsWith('lea-')),
    wishlist: loadFromStorage(WISHLIST_STORAGE_KEY, []),
    selectedCraft: 'all',
    selectedAgeGroup: 'all',
    searchQuery: '',
    sortBy: 'popular',
    coupon: null // { code: 'GHORZA10', discountPercent: 10 }
  };

  function loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('Error reading from localStorage', e);
      return fallback;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  }

  // ==========================================
  // 2. دوال السلة (Shopping Cart Functions)
  // ==========================================
  function addToCart(productId, quantity = 1, customNote = '') {
    const product = (window.PRODUCTS || []).find(p => p.id === productId);
    if (!product) return;

    // التحقق مما إذا كان العنصر موجوداً بنفس التخصيص
    const existingIndex = state.cart.findIndex(
      item => item.productId === productId && (item.customNote || '') === (customNote || '')
    );

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        craftTypeName: product.craftTypeName,
        quantity: quantity,
        customNote: customNote
      });
    }

    saveToStorage(CART_STORAGE_KEY, state.cart);
    updateCartUI();

    // تشغيل الحركة الارتدادية لأيقونة وعداد السلة
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.classList.remove('animate-cart-bump');
      void badge.offsetWidth;
      badge.classList.add('animate-cart-bump');
    });

    showToast(`تمت إضافة «${product.name}» إلى سلة المشتريات`, 'success');
  }

  function removeFromCart(cartItemId) {
    state.cart = state.cart.filter(item => item.id !== cartItemId);
    saveToStorage(CART_STORAGE_KEY, state.cart);
    updateCartUI();
    showToast('تم حذف العنصر من السلة', 'info');
  }

  function updateQuantity(cartItemId, delta) {
    const item = state.cart.find(i => i.id === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    saveToStorage(CART_STORAGE_KEY, state.cart);
    updateCartUI();
  }

  function clearCart() {
    state.cart = [];
    saveToStorage(CART_STORAGE_KEY, state.cart);
    updateCartUI();
  }

  function getCartTotals(shippingCost = 0) {
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0;
    const finalShipping = isFreeShipping ? 0 : (subtotal > 0 ? shippingCost : 0);

    let discount = 0;
    if (state.coupon && subtotal > 0) {
      discount = Math.round((subtotal * state.coupon.discountPercent) / 100);
    }

    const total = Math.max(0, subtotal - discount + finalShipping);

    return {
      subtotal,
      discount,
      shipping: finalShipping,
      isFreeShipping,
      total,
      itemCount: state.cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  // ==========================================
  // 3. تحديث واجهة السلة (Cart UI & Drawer)
  // ==========================================
  function updateCartUI() {
    const totals = getCartTotals();

    // تحديث عدادات السلة في الهيدر
    document.querySelectorAll('.cart-count-badge').forEach(el => {
      el.textContent = totals.itemCount;
      el.style.display = totals.itemCount > 0 ? 'inline-flex' : 'none';
    });

    // تحديث محتويات الدرج الجانبي
    const cartContainer = document.getElementById('cart-drawer-items');
    const emptyState = document.getElementById('cart-drawer-empty');
    const footerState = document.getElementById('cart-drawer-footer');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const shippingProgressText = document.getElementById('shipping-progress-text');
    const shippingProgressBar = document.getElementById('shipping-progress-bar');

    if (cartContainer) {
      if (state.cart.length === 0) {
        cartContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        if (footerState) footerState.style.display = 'none';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        if (footerState) footerState.style.display = 'block';

        cartContainer.innerHTML = state.cart.map(item => `
          <div class="flex gap-3 p-3 bg-white rounded-xl border border-[#e8e4dc] mb-3 items-center">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover shrink-0 bg-[#f5f3ef]">
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-sm text-[#1b1c1a] truncate">${item.name}</h4>
              <span class="text-xs text-[#98440b] font-medium block">${item.craftTypeName}</span>
              ${item.customNote ? `<span class="text-[11px] text-gray-500 block truncate">تخصيص: ${item.customNote}</span>` : ''}
              <div class="flex items-center justify-between mt-2">
                <span class="font-bold text-sm text-[#1b1c1a]">${(item.price * item.quantity).toLocaleString('ar-EG')} ج.م</span>
                <div class="flex items-center gap-1 bg-[#f5f3ef] rounded-lg px-1.5 py-0.5">
                  <button class="w-6 h-6 flex items-center justify-center text-sm font-bold hover:text-[#98440b]" onclick="GhorzaApp.updateQuantity('${item.id}', -1)">-</button>
                  <span class="w-6 text-center text-xs font-bold">${item.quantity}</span>
                  <button class="w-6 h-6 flex items-center justify-center text-sm font-bold hover:text-[#98440b]" onclick="GhorzaApp.updateQuantity('${item.id}', 1)">+</button>
                </div>
              </div>
            </div>
            <button onclick="GhorzaApp.removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-600 p-1" title="حذف">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        `).join('');

        if (subtotalEl) {
          subtotalEl.textContent = `${totals.subtotal.toLocaleString('ar-EG')} ج.م`;
        }
      }
    }

    // شريط تقدم الشحن المجاني
    if (shippingProgressText && shippingProgressBar) {
      if (totals.subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingProgressText.innerHTML = `<span class="text-emerald-700 font-bold">🎉 مبروك! طلبك مؤهل للشحن المجاني لجميع المحافظات</span>`;
        shippingProgressBar.style.width = '100%';
        shippingProgressBar.classList.add('bg-emerald-600');
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - totals.subtotal;
        const percent = Math.min(100, Math.round((totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        shippingProgressText.innerHTML = `أضف بـ <strong>${remaining.toLocaleString('ar-EG')} ج.م</strong> للحصول على <strong>شحن مجاني</strong>`;
        shippingProgressBar.style.width = `${percent}%`;
        shippingProgressBar.classList.remove('bg-emerald-600');
      }
    }
  }

  function openCartDrawer() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      overlay.classList.add('active');
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      overlay.classList.remove('active');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ==========================================
  // 4. المفضلة (Wishlist)
  // ==========================================
  function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast('تمت الإزالة من المفضلة', 'info');
    } else {
      state.wishlist.push(productId);
      showToast('تمت الإضافة إلى قائمة المفضلة ❤️', 'success');
    }
    saveToStorage(WISHLIST_STORAGE_KEY, state.wishlist);
    updateWishlistUI();
  }

  function updateWishlistUI() {
    document.querySelectorAll('.wishlist-count-badge').forEach(el => {
      el.textContent = state.wishlist.length;
      el.style.display = state.wishlist.length > 0 ? 'inline-flex' : 'none';
    });

    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      const pid = btn.getAttribute('data-wishlist-btn');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) {
        if (state.wishlist.includes(pid)) {
          icon.style.fontVariationSettings = "'FILL' 1";
          icon.classList.add('text-red-500');
        } else {
          icon.style.fontVariationSettings = "'FILL' 0";
          icon.classList.remove('text-red-500');
        }
      }
    });
  }

  // ==========================================
  // 5. التصفية والعرض (Filtering & Rendering)
  // ==========================================
  function filterProducts() {
    let list = window.PRODUCTS || [];

    // فلترة نوع الحرفة
    if (state.selectedCraft && state.selectedCraft !== 'all') {
      list = list.filter(p => p.craftType === state.selectedCraft);
    }

    // فلترة الفئة العمرية
    if (state.selectedAgeGroup && state.selectedAgeGroup !== 'all') {
      list = list.filter(p => p.ageGroup === state.selectedAgeGroup);
    }

    // البحث النصي
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.craftTypeName.toLowerCase().includes(q)
      );
    }

    // الترتيب
    if (state.sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'newest') {
      list.reverse();
    }

    return list;
  }

  function renderProductCard(product) {
    const isWishlisted = state.wishlist.includes(product.id);
    const ageIcon = product.ageGroup === 'kids' ? 'child_care' : product.ageGroup === 'teens' ? 'school' : 'person';

    return `
      <article class="product-card group" data-product-id="${product.id}">
        <div class="product-image-wrap">
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy" />
          ${product.badge ? `
            <div class="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#98440b] shadow-sm flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#98440b]"></span>
              <span>${product.badge}</span>
            </div>
          ` : ''}
          <button 
            data-wishlist-btn="${product.id}" 
            onclick="GhorzaApp.toggleWishlist('${product.id}')"
            aria-label="إضافة للمفضلة" 
            class="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-red-600 flex items-center justify-center shadow-sm transition-transform active:scale-95"
          >
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' ${isWishlisted ? 1 : 0};">${isWishlisted ? 'favorite' : 'favorite'}</span>
          </button>
          <div class="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-[#ffdbca]">${ageIcon}</span>
            <span>${product.ageGroupName}</span>
          </div>
        </div>

        <div class="p-4 flex flex-col flex-1 text-right">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span class="text-[#98440b] font-semibold">${product.craftTypeName}</span>
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px] text-amber-500" style="font-variation-settings: 'FILL' 1;">star</span>
              <strong class="text-gray-800">${product.rating}</strong> (${product.reviewsCount})
            </span>
          </div>

          <h3 class="font-bold text-base text-[#1b1c1a] group-hover:text-[#98440b] transition-colors leading-snug mb-2 line-clamp-2">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>

          <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">${product.description}</p>

          <div class="mt-auto pt-3 border-t border-[#f0ede6] flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-[11px] text-gray-400">السعر</span>
              <div class="flex items-baseline gap-1">
                <span class="font-bold text-lg text-[#98440b] font-display">${product.price.toLocaleString('ar-EG')}</span>
                <span class="text-xs text-gray-500">ج.م</span>
                ${product.comparePrice ? `<span class="text-xs text-gray-400 line-through mr-1">${product.comparePrice.toLocaleString('ar-EG')}</span>` : ''}
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <button 
                onclick="GhorzaApp.openQuickView('${product.id}')"
                class="p-2 rounded-lg bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#1b1c1a] text-xs font-semibold flex items-center justify-center transition-colors"
                title="معاينة سريعة"
              >
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </button>
              <button 
                onclick="GhorzaApp.addToCart('${product.id}', 1)"
                class="px-3.5 py-2 rounded-lg bg-[#1b1c1a] hover:bg-[#98440b] text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-sm active:scale-95"
              >
                <span class="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                <span>أضف</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderProductsGrid(containerId = 'products-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = filterProducts();
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-gray-500 flex flex-col items-center justify-center">
          <span class="material-symbols-outlined text-5xl text-gray-400 mb-3">search_off</span>
          <h4 class="text-lg font-bold text-gray-700">لم نجد أي قطع تطابق بحثك</h4>
          <p class="text-sm mt-1">جرب اختيار فئة هاند ميد أخرى أو إزالة الفلاتر</p>
          <button onclick="GhorzaApp.resetFilters()" class="btn-primary mt-4 text-xs">إعادة ضبط الفلاتر</button>
        </div>
      `;
    } else {
      container.innerHTML = filtered.map(renderProductCard).join('');
    }

    // تحديث عداد المنتجات
    const countEl = document.getElementById('products-count');
    if (countEl) {
      countEl.textContent = `${filtered.length} قطعة`;
    }
  }

  // ==========================================
  // 6. المعاينة السريعة (Quick View Modal)
  // ==========================================
  function openQuickView(productId) {
    const product = (window.PRODUCTS || []).find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickview-modal');
    const content = document.getElementById('quickview-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <button onclick="GhorzaApp.closeQuickView()" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
          <span class="badge-craft badge-craft-primary">${product.craftTypeName} • ${product.ageGroupName}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="aspect-[4/3] rounded-xl overflow-hidden bg-[#f5f3ef]">
            <img src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-cover">
          </div>
          <div class="flex flex-col text-right">
            <h2 class="font-bold text-xl text-[#1b1c1a] mb-2 leading-snug">${product.name}</h2>
            <div class="flex items-baseline gap-2 mb-4">
              <span class="font-bold text-2xl text-[#98440b] font-display">${product.price.toLocaleString('ar-EG')} ج.م</span>
              ${product.comparePrice ? `<span class="text-sm text-gray-400 line-through">${product.comparePrice.toLocaleString('ar-EG')} ج.م</span>` : ''}
            </div>
            <p class="text-sm text-gray-600 mb-4 leading-relaxed">${product.description}</p>
            
            <div class="bg-[#f5f3ef] p-3 rounded-lg text-xs space-y-1 mb-4 text-gray-700">
              <p><strong>الخامات:</strong> ${product.details.materials}</p>
              <p><strong>الأبعاد:</strong> ${product.details.dimensions}</p>
            </div>

            ${product.customizable ? `
              <div class="mb-4">
                <label class="block text-xs font-bold text-[#1b1c1a] mb-1">${product.customFieldLabel || 'تخصيص مجاني بالاسم أو العبارة'}</label>
                <input type="text" id="quickview-custom-note" placeholder="اكتب المطلوب هنا..." class="w-full px-3 py-2 text-xs rounded-lg border border-[#e8e4dc] focus:outline-none focus:border-[#98440b]" />
              </div>
            ` : ''}

            <div class="flex items-center gap-3">
              <button 
                onclick="GhorzaApp.addFromQuickView('${product.id}')"
                class="flex-1 btn-primary text-sm py-2.5"
              >
                <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>أضف للسلة الآن</span>
              </button>
              <a href="product.html?id=${product.id}" class="btn-outline text-xs py-2.5 px-3">
                <span>التفاصيل الكاملة</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function addFromQuickView(productId) {
    const noteInput = document.getElementById('quickview-custom-note');
    const customNote = noteInput ? noteInput.value.trim() : '';
    addToCart(productId, 1, customNote);
    closeQuickView();
  }

  // ==========================================
  // 7. إشعارات Toast التفاعلية
  // ==========================================
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[20px] text-[#ffdbca]">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // 8. إتمام الطلبات (Checkout & Order Submission)
  // ==========================================
  function placeOrder(formData) {
    if (state.cart.length === 0) {
      showToast('سلة المشتريات فارغة!', 'error');
      return null;
    }

    const totals = getCartTotals(formData.shippingCost || 50);
    const orderNumber = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const order = {
      id: 'ord_' + Date.now(),
      orderNumber: orderNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      customer: {
        name: formData.name,
        email: formData.email || '',
        phone: formData.phone,
        governorate: formData.governorate,
        district: formData.district,
        address: formData.address,
        notes: formData.notes || ''
      },
      payment: {
        method: formData.paymentMethod, // 'cod', 'instapay', 'wallets', 'cards'
        status: formData.paymentMethod === 'cod' ? 'unpaid' : 'pending_verification'
      },
      items: state.cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customNote: item.customNote || ''
      })),
      totals: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total
      }
    };

    // حفظ في localStorage في مصفوفة orders
    const allOrders = loadFromStorage(ORDERS_STORAGE_KEY, []);
    allOrders.unshift(order);
    saveToStorage(ORDERS_STORAGE_KEY, allOrders);

    // إفراغ السلة
    clearCart();

    return order;
  }

  // ==========================================
  // 9. حركات التحميل والظهور (Animations & Preloader)
  // ==========================================
  function initPreloader() {
    const preloader = document.getElementById('atelier-preloader');
    if (!preloader) return;

    const percentageEl = document.getElementById('preloader-percentage');
    const fillEl = document.getElementById('preloader-fill');
    const stageEl = document.getElementById('preloader-stage');

    const stages = [
      "تجهيز الخامات الطبيعية...",
      "ضبط مقاسات الطارات والخيوط...",
      "تجهيز تفاصيل المنتجات اليدوية...",
      "صقل ونقش الأسماء...",
      "مرحباً بك في غُـرْزَة ✨"
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 6;
      if (progress > 100) progress = 100;

      if (percentageEl) percentageEl.textContent = progress;
      if (fillEl) fillEl.style.width = progress + '%';

      const stageIdx = Math.min(Math.floor((progress / 100) * stages.length), stages.length - 1);
      if (stageEl && stages[stageIdx]) {
        stageEl.textContent = stages[stageIdx];
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('fade-out');
          setTimeout(() => {
            if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
          }, 650);
        }, 250);
      }
    }, 55);
  }

  function initScrollAnimations() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0,
        rootMargin: '100px 0px 50px 0px'
      });

      elements.forEach(el => observer.observe(el));
    } else {
      elements.forEach(el => el.classList.add('is-revealed'));
    }
  }

  // ==========================================
  // 10. التهيئة العامة عند تحميل الصفحة
  // ==========================================
  function init() {
    initPreloader();
    initScrollAnimations();
    updateCartUI();
    updateWishlistUI();

    // ربط مبدلات نوع الهاند ميد (Craft Tabs)
    document.querySelectorAll('[data-craft-filter]').forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        const craft = tab.getAttribute('data-craft-filter');
        state.selectedCraft = craft;

        document.querySelectorAll('[data-craft-filter]').forEach(t => t.classList.remove('active', 'bg-[#98440b]', 'text-white'));
        tab.classList.add('active', 'bg-[#98440b]', 'text-white');

        renderProductsGrid();
        initScrollAnimations();
      });
    });

    // ربط فلاتر الفئات العمرية (Age Group Filter)
    document.querySelectorAll('[data-age-filter]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const age = btn.getAttribute('data-age-filter');
        state.selectedAgeGroup = age;

        document.querySelectorAll('[data-age-filter]').forEach(b => b.classList.remove('active', 'bg-[#98440b]', 'text-white'));
        btn.classList.add('active', 'bg-[#98440b]', 'text-white');

        renderProductsGrid();
        initScrollAnimations();
      });
    });

    // ربط البحث
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        state.searchQuery = e.target.value;
        renderProductsGrid();
        initScrollAnimations();
      });
    }

    // ربط الترتيب
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', e => {
        state.sortBy = e.target.value;
        renderProductsGrid();
        initScrollAnimations();
      });
    }

    // العرض الأولي للمنتجات إن وُجد الحاوي
    renderProductsGrid();
  }

  // تصدير الواجهة البرمجية للنافذة العالمية
  window.GhorzaApp = {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotals,
    openCartDrawer,
    closeCartDrawer,
    toggleWishlist,
    openQuickView,
    closeQuickView,
    addFromQuickView,
    showToast,
    placeOrder,
    renderProductsGrid,
    resetFilters: () => {
      state.selectedCraft = 'all';
      state.selectedAgeGroup = 'all';
      state.searchQuery = '';
      state.sortBy = 'popular';
      init();
    },
    state
  };

  document.addEventListener('DOMContentLoaded', init);
})();
