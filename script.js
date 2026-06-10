//Hamburger Menu//
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

//Animate on scroll//
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 }); // 0.2 = trigger when 20% of element is in view

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));


//Toggle the prices//
const toggle = document.getElementById('billing-toggle');

const prices = {
  basic: { monthly: '<span class="transparent planning-span">$14.99</span><span class="transparent">/m</span>', yearly: '<span class="transparent planning-span">$11.93</span><span class="transparent">/m</span>' },
  pro:   { monthly: '<span class="transparent planning-span">$29.99</span><span class="transparent">/m</span>', yearly: '<span class="transparent planning-span">$24.93</span><span class="transparent">/m</span>' }
};

toggle.addEventListener('change', () => {
  const isYearly = toggle.checked;
  const billing = isYearly ? 'Billed Yearly' : 'Billed Monthly';
  const plan = isYearly ? 'yearly' : 'monthly';

  // Update basic card
  document.getElementById('basic-price').innerHTML = prices.basic[plan];
  document.getElementById('basic-billing').innerHTML = billing;

  // Update pro card
  document.getElementById('pro-price').innerHTML = prices.pro[plan];
  document.getElementById('pro-billing').innerHTML = billing;

  
});


//Changing card color on click//
const plans = document.querySelectorAll('.plan');

plans.forEach(plan => {
  plan.addEventListener('click', () => {
    plans.forEach(p => {
      p.classList.remove('active');
      p.classList.remove('plan-red'); // reset middle card too
    });
    plan.classList.add('active');

    let retired;
    retired = `${document.querySelector('.active .planning-name').textContent[0] +((document.querySelector('.active .planning-name').textContent).slice(1).toLowerCase())} Plan — ${document.querySelector('.active .planning-cost').textContent}`;
    console.log(retired);

    document.getElementById('orderSummary').textContent = retired;

    let totalAmount;
    totalAmount = `${document.querySelector('.active .planning-span').textContent}`

    document.getElementById('totalAmount').innerText = totalAmount;
  });
});

function handleSubmit() {
  const inputs = document.querySelectorAll('.checkout input[required]');
  let allValid = true;

  // helper to mark fields red or clear them
  function setError(input, hasError) {
    input.style.borderColor = hasError ? 'red' : '';
    if (hasError) allValid = false;
  }

  for (const input of inputs) {
    const val = input.value.trim();

    // empty check first
    if (!val) {
      setError(input, true);
      continue;
    }

    // type-specific validation
    switch (input.id) {
      case 'email':
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        setError(input, !emailOk);
        break;

      case 'cardNumber':
        const cardOk = val.replace(/\s/g, '').length === 16;
        setError(input, !cardOk);
        break;

      case 'expiry':
        // must be MM / YY and not expired
        const expiryMatch = val.match(/^(\d{2})\s*\/\s*(\d{2})$/);
        if (!expiryMatch) { setError(input, true); break; }
        const month = parseInt(expiryMatch[1]);
        const year  = parseInt('20' + expiryMatch[2]);
        const now   = new Date();
        const expired = year < now.getFullYear() ||
                       (year === now.getFullYear() && month < now.getMonth() + 1);
        setError(input, month < 1 || month > 12 || expired);
        break;

      case 'cvv':
        const cvvOk = /^\d{3,4}$/.test(val);
        setError(input, !cvvOk);
        break;

      case 'firstName':
      case 'lastName':
      case 'cardName':
        // must be letters only, no numbers
        const nameOk = /^[a-zA-Z\s'-]+$/.test(val);
        setError(input, !nameOk);
        break;

      default:
        setError(input, false);
    }
  }

  if (!allValid) return;
  
  const btn = document.querySelector('.cta-btn');
  btn.textContent = 'Processing…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Subscription activated!';
    btn.style.background = '#fff';
    btn.style.color = 'red';
    const backToDash = document.getElementById('backToDash');
    const backToDashArr = document.getElementById('backToDashArr');
    backToDash.style.display = 'block';
    backToDashArr.style.display = 'inline';
  }, 1800);

  
}
