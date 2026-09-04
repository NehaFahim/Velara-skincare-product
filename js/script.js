(function(){
  'use strict';

  /* ============================================
     Product data (shared across all pages)
     ============================================ */
  var PRODUCTS = [
    {
      id:'renewal-serum',
      name:'Overnight Renewal Serum',
      cat:'treat',
      catLabel:'Treat',
      tagline:'Bakuchiol and peptides — a gentle retinol alternative that works while you sleep.',
      shortDesc:'Bakuchiol + peptides, a gentle retinol alternative',
      img:'https://images.unsplash.com/photo-1760860992928-221d73c4c0cc?w=800&q=80&auto=format&fit=crop',
      sizes:[ {label:'15ml', price:34}, {label:'30ml', price:58} ],
      ingredients:['Bakuchiol','Peptide complex','Squalane','Vitamin E','Centella asiatica extract'],
      howToUse:'Apply 2–3 drops to clean, dry skin each evening, before moisturizer. Introduce it 2–3 nights a week and build up from there.',
      reviews:[
        {name:'Amina R.', rating:5, text:'My skin looks rested even on five hours of sleep. A little goes a long way.'},
        {name:'Priya S.', rating:5, text:'Switched from a harsher retinol and my skin barrier thanked me.'},
        {name:'Zainab H.', rating:4, text:'Lovely texture, sinks in fast. Wish the bottle was a bit bigger.'}
      ]
    },
    {
      id:'vitamin-c-drops',
      name:'Vitamin C Brightening Drops',
      cat:'treat',
      catLabel:'Treat',
      tagline:'15% stabilized vitamin C, formulated to brighten without the usual sting.',
      shortDesc:'15% vitamin C to brighten and even tone',
      img:'https://images.unsplash.com/photo-1696691719049-ed915b8d6e67?w=800&q=80&auto=format&fit=crop',
      sizes:[ {label:'15ml', price:30}, {label:'30ml', price:52} ],
      ingredients:['Ascorbic acid 15%','Ferulic acid','Vitamin E','Hyaluronic acid'],
      howToUse:'Apply each morning after cleansing and before SPF. Patch test first if you are new to vitamin C.',
      reviews:[
        {name:'Fatima K.', rating:5, text:'Visible brightness within two weeks, and it layers well under makeup.'},
        {name:'Hassan M.', rating:4, text:'Strong stuff — start slow if you have sensitive skin.'}
      ]
    },
    {
      id:'milk-cleanser',
      name:'Gentle Milk Cleanser',
      cat:'cleanse',
      catLabel:'Cleanse',
      tagline:'Oat milk and ceramides that lift away the day without stripping your skin.',
      shortDesc:'Oat milk and ceramides, for a soft, balanced cleanse',
      img:'https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?w=800&q=80&auto=format&fit=crop',
      sizes:[ {label:'150ml', price:28}, {label:'300ml', price:46} ],
      ingredients:['Oat milk','Ceramide NP','Panthenol','Glycerin'],
      howToUse:'Massage onto damp skin morning and night, then rinse with lukewarm water. Follow with toner or serum.',
      reviews:[
        {name:'Sara T.', rating:5, text:'Finally a cleanser that does not leave my face feeling tight.'},
        {name:'Bilal A.', rating:5, text:'Smells clean, feels gentle, works every time.'}
      ]
    },
    {
      id:'barrier-oil',
      name:'Barrier Repair Face Oil',
      cat:'hydrate',
      catLabel:'Hydrate',
      tagline:'Squalane and evening primrose, pressed into skin as the last step of the night.',
      shortDesc:'Squalane and evening primrose for a calmer barrier',
      img:'https://images.unsplash.com/photo-1574670700790-fa314ab37787?w=800&q=80&auto=format&fit=crop',
      sizes:[ {label:'30ml', price:64} ],
      ingredients:['Squalane','Evening primrose oil','Ceramide NP','Vitamin F'],
      howToUse:'Warm 3–4 drops between your palms and press into skin as the final step, sealing in everything underneath.',
      reviews:[
        {name:'Noor E.', rating:5, text:'My go-to on dry Karachi winter nights. Never feels heavy.'},
        {name:'Ayesha Q.', rating:4, text:'A little pricey but the bottle lasts months.'}
      ]
    },
    {
      id:'daily-spf',
      name:'Daily Shield SPF 50',
      cat:'protect',
      catLabel:'Protect',
      tagline:'Weightless broad-spectrum protection with zero white cast, made for daily wear.',
      shortDesc:'Weightless broad-spectrum protection, no white cast',
      img:'https://images.unsplash.com/photo-1598662972299-5408ddb8a3dc?w=800&q=80&auto=format&fit=crop',
      sizes:[ {label:'50ml', price:34} ],
      ingredients:['Zinc oxide','Niacinamide','Green tea extract'],
      howToUse:'Apply generously as the last step every morning. Reapply midday if you are outdoors for long stretches.',
      reviews:[
        {name:'Mahnoor I.', rating:5, text:'No white cast, no greasy feel — I actually reach for this daily now.'},
        {name:'Usman F.', rating:5, text:'Sits well under sunscreen-shy skin like mine.'}
      ]
    },
    {
      id:'ritual-set',
      name:'The Ritual Set',
      cat:'kits',
      catLabel:'Kit',
      tagline:'The full evening ritual — cleanser, serum, and oil — at a kinder price.',
      shortDesc:'Cleanser, serum and oil, bundled for the full ritual',
      img:'https://images.unsplash.com/photo-1760860992928-221d73c4c0cc?w=800&q=80&auto=format&fit=crop',
      sizes:[ {label:'Full set', price:130, was:150} ],
      ingredients:['Gentle Milk Cleanser (150ml)','Overnight Renewal Serum (30ml)','Barrier Repair Face Oil (30ml)'],
      howToUse:'Cleanse, treat, then seal — every evening. Everything you need, nothing you don\u2019t.',
      reviews:[
        {name:'Kiran D.', rating:5, text:'Bought this as a gift for myself. Best decision of the month.'}
      ]
    }
  ];

  var FREE_SHIP_THRESHOLD = 75;
  var SHIP_FEE = 6;

  window.VELARA = { PRODUCTS: PRODUCTS };

  /* ============================================
     Helpers
     ============================================ */
  function money(n){ return '$' + n.toFixed(2).replace(/\.00$/, ''); }
  function findProduct(id){
    for(var i=0;i<PRODUCTS.length;i++){ if(PRODUCTS[i].id===id) return PRODUCTS[i]; }
    return null;
  }
  
  function findSize(product, sizeLabel){
    for(var i=0;i<product.sizes.length;i++){ if(product.sizes[i].label===sizeLabel) return product.sizes[i]; }
    return product.sizes[0];
  }

  var cart = loadCart();

  function saveCart(){ try{ localStorage.setItem('velara_cart', JSON.stringify(cart)); }catch(e){} }
  function loadCart(){
    try{ var raw = localStorage.getItem('velara_cart'); return raw ? JSON.parse(raw) : {}; }
    catch(e){ return {}; }
  }
  function lineKey(id, size){ return id + '::' + size; }

  function addToCart(id, size, qty){
    qty = qty || 1;
    var key = lineKey(id, size);
    cart[key] = (cart[key] || 0) + qty;
    saveCart();
    renderCart();
  }
  function setQty(id, size, qty){
    var key = lineKey(id, size);
    if(qty <= 0){ delete cart[key]; } else { cart[key] = qty; }
    saveCart();
    renderCart();
  }
  function removeLine(id, size){
    delete cart[lineKey(id, size)];
    saveCart();
    renderCart();
  }
  function cartCount(){
    var n = 0;
    for(var k in cart){ n += cart[k]; }
    return n;
  }
  function cartSubtotal(){
    var total = 0;
    for(var k in cart){
      var parts = k.split('::');
      var product = findProduct(parts[0]);
      if(!product) continue;
      var size = findSize(product, parts[1]);
      total += size.price * cart[k];
    }
    return total;
  }

  function toast(msg){
    var el = document.getElementById('toast');
    if(!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){ el.classList.remove('show'); }, 2200);
  }

  /* ============================================
     Cart drawer rendering (present on every page)
     ============================================ */
  function renderCart(){
    var countEl = document.getElementById('cartCount');
    if(countEl) countEl.textContent = cartCount();

    var drawer = document.getElementById('cartDrawer');
    if(!drawer) return;
    var itemsWrap = document.getElementById('cartItems');
    itemsWrap.innerHTML = '';

    var keys = Object.keys(cart);
    if(keys.length === 0){
      drawer.classList.add('is-empty');
      return;
    }
    drawer.classList.remove('is-empty');

    keys.forEach(function(key){
      var parts = key.split('::');
      var product = findProduct(parts[0]);
      if(!product) return;
      var sizeLabel = parts[1];
      var size = findSize(product, sizeLabel);
      var qty = cart[key];

      var line = document.createElement('div');
      line.className = 'cart-line';
      line.innerHTML =
        '<img src="'+product.img+'" alt="'+product.name+'">' +
        '<div class="cart-line-body">' +
          '<div class="cart-line-top">' +
            '<span class="cart-line-name">'+product.name+'</span>' +
            '<span class="cart-line-price">'+money(size.price*qty)+'</span>' +
          '</div>' +
          '<div class="cart-line-size">'+sizeLabel+'</div>' +
          '<div class="cart-line-actions">' +
            '<div class="qty-stepper">' +
              '<button type="button" data-act="dec">\u2212</button>' +
              '<span>'+qty+'</span>' +
              '<button type="button" data-act="inc">+</button>' +
            '</div>' +
            '<button type="button" class="cart-remove">Remove</button>' +
          '</div>' +
        '</div>';

      line.querySelector('[data-act="dec"]').addEventListener('click', function(){ setQty(product.id, sizeLabel, qty-1); });
      line.querySelector('[data-act="inc"]').addEventListener('click', function(){ setQty(product.id, sizeLabel, qty+1); });
      line.querySelector('.cart-remove').addEventListener('click', function(){ removeLine(product.id, sizeLabel); });

      itemsWrap.appendChild(line);
    });

    var subtotal = cartSubtotal();
    var shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIP_FEE);
    var shipNote = document.getElementById('cartShipNote');
    if(shipNote){
      if(subtotal >= FREE_SHIP_THRESHOLD){
        shipNote.textContent = 'You\u2019ve unlocked free shipping.';
      }else{
        shipNote.textContent = 'Add ' + money(FREE_SHIP_THRESHOLD - subtotal) + ' more for free shipping.';
      }
    }
    var subtotalEl = document.getElementById('sumSubtotal');
    var shippingEl = document.getElementById('sumShipping');
    var totalEl = document.getElementById('sumTotal');
    if(subtotalEl) subtotalEl.textContent = money(subtotal);
    if(shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : money(shipping);
    if(totalEl) totalEl.textContent = money(subtotal + shipping);
  }

  /* ============================================
     Cart drawer open/close (shared)
     ============================================ */
  var overlay = document.getElementById('overlay');
  var cartDrawer = document.getElementById('cartDrawer');
  var checkoutOverlay = document.getElementById('checkoutOverlay');

  function openCart(){
    if(!cartDrawer) return;
    cartDrawer.classList.add('open');
    if(overlay) overlay.classList.add('show');
  }
  function closeCart(){
    if(!cartDrawer) return;
    cartDrawer.classList.remove('open');
    if(overlay) overlay.classList.remove('show');
  }
  var cartToggle = document.getElementById('cartToggle');
  if(cartToggle) cartToggle.addEventListener('click', openCart);
  var cartClose = document.getElementById('cartClose');
  if(cartClose) cartClose.addEventListener('click', closeCart);
  if(overlay){
    overlay.addEventListener('click', function(){
      closeCart();
      if(checkoutOverlay) checkoutOverlay.classList.remove('show');
    });
  }
  var cartEmptyBtn = document.getElementById('cartEmptyBtn');
  if(cartEmptyBtn) cartEmptyBtn.addEventListener('click', closeCart);

  /* ============================================
     Mobile nav
     ============================================ */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', function(){
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
      });
    });
  }

  /* ============================================
     Checkout flow (shared)
     ============================================ */
  var orderInfo = {};

  function openCheckout(){
    if(cartCount() === 0){ toast('Your bag is empty — add something first'); return; }
    closeCart();
    if(!checkoutOverlay) return;
    checkoutOverlay.classList.add('show');
    goToStep(1);
  }
  function closeCheckout(){ if(checkoutOverlay) checkoutOverlay.classList.remove('show'); }

  var checkoutBtn = document.getElementById('checkoutBtn');
  if(checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  var checkoutClose = document.getElementById('checkoutClose');
  if(checkoutClose) checkoutClose.addEventListener('click', closeCheckout);

  function goToStep(n){
    [1,2,3].forEach(function(s){
      var el = document.getElementById('step'+s);
      if(el) el.hidden = (s!==n);
    });
    document.querySelectorAll('.step').forEach(function(el){
      el.classList.toggle('active', Number(el.dataset.step) === n);
    });
    if(n === 2){
      var subtotal = cartSubtotal();
      var shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIP_FEE;
      var payTotal = document.getElementById('payTotal');
      if(payTotal) payTotal.textContent = money(subtotal + shipping);
    }
  }

  var deliveryForm = document.getElementById('deliveryForm');
  if(deliveryForm){
    deliveryForm.addEventListener('submit', function(e){
      e.preventDefault();
      orderInfo.name = document.getElementById('oName').value.trim();
      orderInfo.phone = document.getElementById('oPhone').value.trim();
      orderInfo.address = document.getElementById('oAddress').value.trim();
      goToStep(2);
    });
  }

  var cardFields = document.getElementById('cardFields');
  document.querySelectorAll('input[name="payMethod"]').forEach(function(radio){
    radio.addEventListener('change', function(){
      if(cardFields) cardFields.style.display = (this.value === 'card') ? 'block' : 'none';
    });
  });

  var paymentForm = document.getElementById('paymentForm');
  if(paymentForm){
    paymentForm.addEventListener('submit', function(e){
      e.preventDefault();
      var payBtn = document.getElementById('payBtn');
      payBtn.disabled = true;
      payBtn.textContent = 'Processing…';

      setTimeout(function(){
        payBtn.disabled = false;
        payBtn.textContent = 'Place Order';

        var orderId = 'VL-' + Math.floor(10000 + Math.random()*89999);
        var days = 3 + Math.floor(Math.random()*3);
        var confirmId = document.getElementById('confirmId');
        var confirmTime = document.getElementById('confirmTime');
        var confirmName = document.getElementById('confirmName');
        if(confirmId) confirmId.textContent = orderId;
        if(confirmTime) confirmTime.textContent = days + ' business days';
        if(confirmName) confirmName.textContent = orderInfo.name ? (', ' + orderInfo.name) : '';

        cart = {};
        saveCart();
        renderCart();
        if(typeof window.velaraRerenderProducts === 'function') window.velaraRerenderProducts();

        goToStep(3);
      }, 1100);
    });
  }

  var confirmClose = document.getElementById('confirmClose');
  if(confirmClose){
    confirmClose.addEventListener('click', function(){
      closeCheckout();
      if(deliveryForm) deliveryForm.reset();
      if(paymentForm) paymentForm.reset();
    });
  }

  /* ============================================
     Newsletter + contact forms (demo submit)
     ============================================ */
  var newsletterForm = document.getElementById('newsletterForm');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', function(e){
      e.preventDefault();
      var input = newsletterForm.querySelector('input');
      var btn = newsletterForm.querySelector('button');
      var originalText = btn.textContent;
      btn.textContent = 'Added';
      toast('You\u2019re on the list');
      setTimeout(function(){ btn.textContent = originalText; input.value=''; }, 1800);
    });
  }

  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      var status = document.getElementById('contactStatus');
      status.textContent = 'Sending…';
      setTimeout(function(){
        status.textContent = 'Thanks — we\u2019ll reply within one business day.';
        contactForm.reset();
      }, 800);
    });
  }

  /* ============================================
     FAQ accordion (contact page)
     ============================================ */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    if(!q) return;
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i){ i.classList.remove('open'); });
      if(!isOpen) item.classList.add('open');
    });
  });

  /* ============================================
     Product tabs (product detail page)
     ============================================ */
  document.querySelectorAll('.tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function(p){ p.hidden = true; });
      btn.classList.add('active');
      var panel = document.getElementById('tab-'+target);
      if(panel) panel.hidden = false;
    });
  });

  /* ============================================
     Footer year
     ============================================ */
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================
     Expose for page-specific scripts
     ============================================ */
  window.velaraCart = {
    add: addToCart,
    render: renderCart,
    money: money,
    findProduct: findProduct,
    findSize: findSize,
    toast: toast
  };

  renderCart();

})();
