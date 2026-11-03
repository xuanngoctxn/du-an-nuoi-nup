(function () {
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return n.toLocaleString('vi-VN') + 'đ'; };

  function current() {
    var r = document.querySelector('input[name=goi]:checked');
    var isCustom = r.value === 'custom';
    var amount = isCustom ? Math.max(1000, parseInt($('customAmount').value, 10) || 0) : parseInt(r.value, 10);
    var pct = isCustom ? Math.min(100, Math.round(amount / 5000)) : parseInt(r.dataset.pct, 10);
    return { amount: amount, label: r.dataset.label, short: r.dataset.short, memo: r.dataset.memo, pct: pct };
  }

  function render() {
    var c = current();
    $('amount').textContent = fmt(c.amount);
    $('amountRaw').textContent = String(c.amount);
    $('memo').textContent = c.memo;
    $('cPack').textContent = c.short;
    $('cAmount').textContent = fmt(c.amount);
  }

  var toastTimer;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { toast('Đã sao chép'); }, function () { toast('Không sao chép được, bạn chép tay giúp mình nhé'); });
    }
    toast('Trình duyệt chưa hỗ trợ sao chép');
  }

  document.querySelectorAll('input[name=goi]').forEach(function (r) { r.addEventListener('change', render); });
  $('customAmount').addEventListener('focus', function () { document.querySelector('input[value=custom]').checked = true; render(); });
  $('customAmount').addEventListener('input', render);
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () { var t = $(b.dataset.copy).textContent; copyText(b.dataset.copy === 'account' ? t.replace(/\s+/g, '') : t); });
  });
  $('shareBtn').addEventListener('click', function () { copyText(location.href); });

  var tb = document.querySelector('.term-body');
  if (tb) { tb.scrollTop = tb.scrollHeight; }

  var BASE = 19;
  var levels = [
    [0, 'Em bé đang đói, cần được cho ăn.'],
    [30, 'Bụng đã bớt réo, vẫn còn thèm.'],
    [60, 'No vừa phải, đủ sức đi làm tới chiều.'],
    [90, 'No căng, tuần này khỏi lo chuyện ăn.']
  ];
  function levelText(p) {
    var t = levels[0][1];
    levels.forEach(function (x) { if (p >= x[0]) t = x[1]; });
    return t;
  }
  function setMeter(p, pctEl, fillEl, capEl) {
    if (pctEl) pctEl.textContent = p + '%';
    if (fillEl) fillEl.style.width = p + '%';
    if (capEl) capEl.textContent = levelText(p);
  }
  function mealOfDay() {
    var hr = new Date().getHours();
    if (hr < 10) return 'bữa sáng';
    if (hr < 14) return 'bữa trưa';
    if (hr < 18) return 'bữa chiều';
    return 'bữa tối';
  }
  function celebrate() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var layer = document.createElement('div');
    layer.className = 'confetti-layer';
    layer.setAttribute('aria-hidden', 'true');
    var colors = ['#044FE9', '#01B9E8', '#03B6CA', '#2BA137', '#FFC81A', '#FF7A7A'];
    for (var i = 0; i < 60; i++) {
      var p = document.createElement('span');
      var star = i % 3 === 0;
      p.className = 'confetti-piece' + (star ? ' is-star' : '');
      p.textContent = star ? '★' : '';
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.color = colors[i % colors.length];
      if (!star) p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.6) + 's';
      p.style.animationDuration = (2.2 + Math.random() * 1.6) + 's';
      p.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
      p.style.setProperty('--spin', (360 + Math.random() * 720) + 'deg');
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 4200);
  }

  function stampCert() {
    var cert = document.querySelector('#quy-trinh .cert');
    if (!cert) return;
    var old = cert.querySelector('.cert-seal');
    if (old) old.parentNode.removeChild(old);
    var seal = document.createElement('div');
    seal.className = 'cert-seal';
    seal.setAttribute('aria-hidden', 'true');
    seal.innerHTML = '<span>ĐÃ GHI TÊN</span><small>Nuôi em</small>';
    cert.appendChild(seal);
    setTimeout(function () { if (seal.parentNode) seal.parentNode.removeChild(seal); }, 4200);
  }

  function heartRain() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var layer = document.createElement('div');
    layer.className = 'confetti-layer';
    layer.setAttribute('aria-hidden', 'true');
    var colors = ['#044FE9', '#2BA137', '#01B9E8', '#78D67F', '#FF7A7A'];
    for (var i = 0; i < 110; i++) {
      var p = document.createElement('span');
      p.className = 'confetti-piece is-star';
      var glyphs = ['♥', '✦', '●'];
      var kind = i % 5 === 0 ? 1 : (i % 5 === 1 ? 2 : 0);
      p.textContent = glyphs[kind];
      if (kind === 1) { colors.unshift('#FFC81A'); }
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.color = kind === 1 ? '#FFC81A' : colors[i % colors.length];
      if (kind === 1) { colors.shift(); }
      p.style.animationDelay = (Math.random() * 1.2) + 's';
      p.style.animationDuration = (3 + Math.random() * 2) + 's';
      p.style.fontSize = (kind === 2 ? 12 : 14) + Math.random() * 12 + 'px';
      p.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
      p.style.setProperty('--spin', (Math.random() * 180 - 90) + 'deg');
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 6000);
  }

  var certBtn = $('certSubmit');
  if (certBtn) {
    certBtn.addEventListener('click', function () {
      var name = ($('sponsorName').value || '').trim();
      var box = $('certThanks');
      if (!name) {
        toast('Nhập tên bạn vào giấy chứng nhận trước nhé');
        $('sponsorName').focus();
        return;
      }
      heartRain();
      box.textContent = 'Cảm ơn ' + name + ' đã trở thành phụ huynh nuôi em! Giấy chứng nhận đã ghi tên bạn.';
      box.hidden = false;
      $('sponsorName').disabled = true;
      certBtn.disabled = true;
    });
  }

  var doneBtn = $('doneBtn');
  if (doneBtn) {
    doneBtn.addEventListener('click', function () {
      celebrate();
      var c = current();
      var newPct = Math.min(100, BASE + c.pct);
      setMeter(newPct, $('meterPct'), $('meterFill'), $('caption'));
      $('caption').classList.toggle('urgent', newPct < 30);
      setMeter(newPct, $('camPct'), $('camFill'), $('camNote'));
      $('camBody').textContent = 'Cảm ơn anh/chị đã nuôi em ' + mealOfDay() + '. Bụng em tăng từ ' + BASE + '% lên ' + newPct + '%.';
      $('cam-on').querySelector('[role=progressbar]').setAttribute('aria-valuenow', String(newPct));
      $('cam-on').hidden = false;
      $('cheer').classList.remove('show');
      void $('cheer').offsetWidth;
      $('cheer').classList.add('show');
      doneBtn.setAttribute('aria-expanded', 'true');
      $('cam-on').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  render();
})();
