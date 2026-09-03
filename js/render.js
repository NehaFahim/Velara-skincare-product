(function(){
  'use strict';
  var PRODUCTS = window.VELARA.PRODUCTS;
  var cartApi = window.velaraCart;

  function money(n){ return cartApi.money(n); }

  function starString(n){
    var full = Math.round(n);
    var s = '';
    for(var i=0;i<5;i++){ s += (i < full) ? '\u2605' : '\u2606'; }
    return s;
  }

  /* ============================================
     Product card markup (shared by bestsellers + shop grid)
     ============================================ */
  function productCard(p){
    var size = p.sizes[p.sizes.length > 1 ? 0 : 0];
    var priceHtml = size.was
      ? '<span class="was">'+money(size.was)+'</span>'+money(size.price)
      : money(size.price);

    var el = document.createElement('div');
    el.className = 'product-card';
    el.innerHTML =
      '<a href="product.html?id='+p.id+'" class="product-media">' +
        '<img src="'+p.img+'" alt="'+p.name+'" loading="lazy">' +
      '</a>' +
      '<button type="button" class="product-quickadd" data-id="'+p.id+'" data-size="'+size.label+'">Add to bag \u2014 '+money(size.price)+'</button>' +
      '<a href="product.html?id='+p.id+'" class="product-link-body">' +
        '<div class="product-cat">'+p.catLabel+'</div>' +
        '<div class="product-name">'+p.name+'</div>' +
        '<div class="product-desc">'+p.shortDesc+'</div>' +
        '<div class="product-price">'+priceHtml+'</div>' +
      '</a>';

    var qa = el.querySelector('.product-quickadd');
    qa.addEventListener('click', function(e){
      e.preventDefault();
      cartApi.add(p.id, size.label, 1);
      qa.textContent = 'Added to bag \u2713';
      qa.classList.add('added');
      cartApi.toast(p.name + ' added to your bag');
      setTimeout(function(){
        qa.textContent = 'Add to bag \u2014 ' + money(size.price);
        qa.classList.remove('added');
      }, 1800);
    });

    return el;
  }

  /* ============================================
     Home: bestsellers
     ============================================ */
  var bestsellerGrid = document.getElementById('bestsellerGrid');
  function renderBestsellers(){
    if(!bestsellerGrid) return;
    bestsellerGrid.innerHTML = '';
    var picks = PRODUCTS.filter(function(p){ return p.cat !== 'kits'; }).slice(0,4);
    picks.forEach(function(p){ bestsellerGrid.appendChild(productCard(p)); });
  }

  /* ============================================
     Shop page: full grid + filters + sort
     ============================================ */
  var shopGrid = document.getElementById('shopGrid');
  var filterBar = document.getElementById('filterBar');
  var sortSelect = document.getElementById('sortSelect');
  var activeFilter = 'all';

  function renderShopGrid(){
    if(!shopGrid) return;
    var list = PRODUCTS.slice();
    if(activeFilter !== 'all'){
      list = list.filter(function(p){ return p.cat === activeFilter; });
    }
    if(sortSelect){
      var mode = sortSelect.value;
      if(mode === 'price-asc') list.sort(function(a,b){ return a.sizes[0].price - b.sizes[0].price; });
      if(mode === 'price-desc') list.sort(function(a,b){ return b.sizes[0].price - a.sizes[0].price; });
      if(mode === 'name') list.sort(function(a,b){ return a.name.localeCompare(b.name); });
    }
    shopGrid.innerHTML = '';
    if(list.length === 0){
      shopGrid.innerHTML = '<p class="empty-note">No products in this category yet.</p>';
      return;
    }
    list.forEach(function(p){ shopGrid.appendChild(productCard(p)); });
  }

  if(filterBar){
    filterBar.querySelectorAll('.filter-pill').forEach(function(pill){
      pill.addEventListener('click', function(){
        filterBar.querySelectorAll('.filter-pill').forEach(function(b){ b.classList.remove('active'); });
        pill.classList.add('active');
        activeFilter = pill.dataset.cat;
        renderShopGrid();
      });
    });
  }
  if(sortSelect){ sortSelect.addEventListener('change', renderShopGrid); }

  // Allow deep-linking to a category, e.g. products.html?cat=treat
  (function applyCatFromQuery(){
    if(!shopGrid) return;
    var params = new URLSearchParams(location.search);
    var cat = params.get('cat');
    if(cat && filterBar){
      var target = filterBar.querySelector('[data-cat="'+cat+'"]');
      if(target){
        filterBar.querySelectorAll('.filter-pill').forEach(function(b){ b.classList.remove('active'); });
        target.classList.add('active');
        activeFilter = cat;
      }
    }
  })();

  /* ============================================
     Product detail page
     ============================================ */
  var detailRoot = document.getElementById('productDetail');
  var currentProduct = null;
  var currentSize = null;
  var currentQty = 1;

  function renderProductDetail(){
    if(!detailRoot) return;
    var params = new URLSearchParams(location.search);
    var id = params.get('id') || 'renewal-serum';
    currentProduct = window.VELARA.PRODUCTS.find(function(p){ return p.id === id; }) || window.VELARA.PRODUCTS[0];
    currentSize = currentProduct.sizes[0];
    currentQty = 1;

    document.title = currentProduct.name + ' — VELARA';

    var breadcrumbCat = document.getElementById('bcCategory');
    var breadcrumbName = document.getElementById('bcName');
    if(breadcrumbCat){ breadcrumbCat.textContent = currentProduct.catLabel; breadcrumbCat.href = 'products.html?cat=' + currentProduct.cat; }
    if(breadcrumbName){ breadcrumbName.textContent = currentProduct.name; }

    document.getElementById('pdImage').src = currentProduct.img;
    document.getElementById('pdImage').alt = currentProduct.name;
    document.getElementById('pdCat').textContent = currentProduct.catLabel;
    document.getElementById('pdName').textContent = currentProduct.name;
    document.getElementById('pdTagline').textContent = currentProduct.tagline;

    renderSizeOptions();
    renderQty();
    updatePrice();

    // Ingredients tab
    var ingList = document.getElementById('pdIngredients');
    ingList.innerHTML = '';
    currentProduct.ingredients.forEach(function(ing){
      var li = document.createElement('li');
      li.textContent = ing;
      ingList.appendChild(li);
    });

    // How to use tab
    document.getElementById('pdHowToUse').textContent = currentProduct.howToUse;

    // Reviews tab
    var revWrap = document.getElementById('pdReviews');
    revWrap.innerHTML = '';
    var avg = currentProduct.reviews.reduce(function(s,r){ return s+r.rating; },0) / currentProduct.reviews.length;
    document.getElementById('pdRatingSummary').innerHTML =
      '<span class="stars">'+starString(avg)+'</span> <strong>'+avg.toFixed(1)+'</strong> \u00b7 '+currentProduct.reviews.length+' reviews';
    currentProduct.reviews.forEach(function(r){
      var block = document.createElement('div');
      block.className = 'review-block';
      block.innerHTML =
        '<div class="review-top"><span class="stars">'+starString(r.rating)+'</span><strong>'+r.name+'</strong></div>' +
        '<p>'+r.text+'</p>';
      revWrap.appendChild(block);
    });

    // Related products
    var relatedWrap = document.getElementById('pdRelated');
    if(relatedWrap){
      relatedWrap.innerHTML = '';
      var related = window.VELARA.PRODUCTS.filter(function(p){ return p.id !== currentProduct.id; }).slice(0,3);
      related.forEach(function(p){ relatedWrap.appendChild(productCard(p)); });
    }
  }

  function renderSizeOptions(){
    var wrap = document.getElementById('pdSizes');
    wrap.innerHTML = '';
    currentProduct.sizes.forEach(function(size){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'size-pill' + (size.label === currentSize.label ? ' active' : '');
      btn.textContent = size.label;
      btn.addEventListener('click', function(){
        currentSize = size;
        wrap.querySelectorAll('.size-pill').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        updatePrice();
      });
      wrap.appendChild(btn);
    });
  }

  function renderQty(){
    document.getElementById('pdQty').textContent = currentQty;
  }
  var qtyDec = document.getElementById('pdQtyDec');
  var qtyInc = document.getElementById('pdQtyInc');
  if(qtyDec) qtyDec.addEventListener('click', function(){ if(currentQty>1){ currentQty--; renderQty(); } });
  if(qtyInc) qtyInc.addEventListener('click', function(){ currentQty++; renderQty(); });

  function updatePrice(){
    var priceEl = document.getElementById('pdPrice');
    if(!priceEl) return;
    var html = currentSize.was ? '<span class="was">'+money(currentSize.was)+'</span>'+money(currentSize.price) : money(currentSize.price);
    priceEl.innerHTML = html;
  }

  var pdAddBtn = document.getElementById('pdAddToBag');
  if(pdAddBtn){
    pdAddBtn.addEventListener('click', function(){
      cartApi.add(currentProduct.id, currentSize.label, currentQty);
      cartApi.toast(currentProduct.name + ' added to your bag');
      pdAddBtn.textContent = 'Added \u2713';
      setTimeout(function(){ pdAddBtn.textContent = 'Add to bag'; }, 1600);
    });
  }

  /* ============================================
     Routine builder (services page mini-quiz)
     ============================================ */
  var routineRoot = document.getElementById('routineBuilder');
  if(routineRoot){
    var concernMap = {
      dryness: ['barrier-oil','milk-cleanser'],
      brightening: ['vitamin-c-drops','daily-spf'],
      aging: ['renewal-serum','barrier-oil'],
      sensitivity: ['milk-cleanser','barrier-oil']
    };
    var concernLabels = {
      dryness:'dryness and tightness',
      brightening:'dullness and uneven tone',
      aging:'fine lines and firmness',
      sensitivity:'redness and sensitivity'
    };
    routineRoot.querySelectorAll('.concern-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        routineRoot.querySelectorAll('.concern-btn').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var concern = btn.dataset.concern;
        var ids = concernMap[concern] || [];
        var result = document.getElementById('routineResult');
        result.hidden = false;
        result.querySelector('.routine-lead').textContent =
          'For ' + concernLabels[concern] + ', we\u2019d start here:';
        var grid = result.querySelector('.routine-products');
        grid.innerHTML = '';
        ids.forEach(function(id){
          var p = PRODUCTS.find(function(x){ return x.id === id; });
          if(p) grid.appendChild(productCard(p));
        });
        result.scrollIntoView({behavior:'smooth', block:'nearest'});
      });
    });
  }

  /* ============================================
     Blog category filter
     ============================================ */
  var blogFilterBar = document.getElementById('blogFilterBar');
  if(blogFilterBar){
    blogFilterBar.querySelectorAll('.filter-pill').forEach(function(pill){
      pill.addEventListener('click', function(){
        blogFilterBar.querySelectorAll('.filter-pill').forEach(function(b){ b.classList.remove('active'); });
        pill.classList.add('active');
        var cat = pill.dataset.cat;
        document.querySelectorAll('.blog-card').forEach(function(card){
          card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }

  /* ============================================
     Init + expose rerender hook
     ============================================ */
  window.velaraRerenderProducts = function(){
    renderBestsellers();
    renderShopGrid();
  };

  renderBestsellers();
  renderShopGrid();
  renderProductDetail();

})();
