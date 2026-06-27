document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') AOS.init();
    updateCartCount();
    renderCart();
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        let btn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
        let id = btn.dataset.id;
        let name = btn.dataset.name;
        let price = parseFloat(btn.dataset.price);

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let existing = cart.find(item => item.id == id);
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            cart.push({ id: id, name: name, price: price, qty: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('✅ تمت إضافة "' + name + '" إلى السلة!');
    }
});

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    let badge = document.getElementById('cart-count');
    if (badge) badge.innerText = total;
}

function showNotification(msg) {
    let old = document.querySelector('.toast-notification');
    if (old) old.remove();
    let div = document.createElement('div');
    div.className = 'toast-notification';
    div.style.cssText = 'position:fixed; bottom:20px; left:20px; background:#28a745; color:white; padding:15px 25px; border-radius:10px; font-size:18px; box-shadow:0 5px 15px rgba(0,0,0,0.3); z-index:9999; direction:rtl; font-family:Cairo, sans-serif;';
    div.innerText = msg;
    document.body.appendChild(div);
    setTimeout(() => { div.style.opacity = '0'; div.style.transition = '0.5s'; setTimeout(() => div.remove(), 500); }, 3000);
}

function renderCart() {
    let container = document.getElementById('cart-items');
    let totalContainer = document.getElementById('cart-total');
    if (!container) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><h4>🛒 السلة فارغة</h4><a href="products.php" class="btn btn-warning">تسوق الآن</a></div>';
        if (totalContainer) totalContainer.innerText = '';
        return;
    }

    let html = '<div class="col-md-8">';
    let total = 0;
    cart.forEach((item, index) => {
        let itemTotal = item.price * (item.qty || 1);
        total += itemTotal;
        html += `
            <div class="card mb-3 p-3 shadow-sm">
                <div class="row align-items-center">
                    <div class="col-4"><h5>${item.name}</h5></div>
                    <div class="col-3">$${item.price.toFixed(2)}</div>
                    <div class="col-2">
                        <input type="number" min="1" value="${item.qty || 1}" class="form-control form-control-sm qty-input" data-index="${index}" style="width:70px;">
                    </div>
                    <div class="col-2">$${itemTotal.toFixed(2)}</div>
                    <div class="col-1"><button class="btn btn-danger btn-sm remove-item" data-index="${index}"><i class="fas fa-times"></i></button></div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
    if (totalContainer) totalContainer.innerText = 'المجموع الكلي: $' + total.toFixed(2);

    document.querySelectorAll('.qty-input').forEach(input => {
        input.onchange = function() {
            let idx = this.dataset.index;
            let cart = JSON.parse(localStorage.getItem('cart'));
            cart[idx].qty = parseInt(this.value) || 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
        };
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = function() {
            let idx = this.dataset.index;
            let cart = JSON.parse(localStorage.getItem('cart'));
            cart.splice(idx, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
            showNotification('🗑️ تم حذف المنتج من السلة');
        };
    });

    document.getElementById('clear-cart')?.addEventListener('click', function() {
        localStorage.removeItem('cart');
        renderCart();
        updateCartCount();
        showNotification('🗑️ تم تفريغ السلة');
    });

    document.getElementById('checkout-btn')?.addEventListener('click', function() {
        if (cart.length === 0) return showNotification('⚠️ السلة فارغة!');
        alert('🛍️ شكراً لتسوقك! سيتم توجيهك لصفحة الدفع (يمكنك إضافة صفحة دفع حقيقية لاحقاً).');
    });
}

setTimeout(() => {
    if (window.location.pathname.includes('index.php') || window.location.pathname.endsWith('/')) {
        showNotification('👋 أهلاً بك في بوتيك أبو مجتبى! استمتع بالتسوق.');
    }
}, 1000);