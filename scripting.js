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

//Cancel Tool Links

const toolLinks = document.querySelectorAll('.tool-div-link');

toolLinks.forEach(toolLink => {
  toolLink.addEventListener('click', (e) => {
    e.preventDefault();
  })
})

//Toggle the prices//
const toggle = document.getElementById('billing-toggle');

const prices = {
  basic: { monthly: '$14.99/m', yearly: '$11.93/m' },
  pro:   { monthly: '$29.99/m', yearly: '$24.93/m' }
};

toggle.addEventListener('change', () => {
  const isYearly = toggle.checked;
  const billing = isYearly ? 'Billed Yearly' : 'Billed Monthly';
  const plan = isYearly ? 'yearly' : 'monthly';

  // Update basic card
  document.getElementById('basic-price').textContent = prices.basic[plan];
  document.getElementById('basic-billing').textContent = billing;

  // Update pro card
  document.getElementById('pro-price').textContent = prices.pro[plan];
  document.getElementById('pro-billing').textContent = billing;
});

//Changing card color on click//
const plans = document.querySelectorAll('.plan');

plans.forEach(plan => {
  plan.addEventListener('click', () => {
    plans.forEach(p => {
      p.classList.remove('active');
      p.classList.remove('plan-red'); // reset middle card too
      const link = p.querySelector('a');
      link.style.backgroundColor = '';
      link.style.color = '';
    });
    plan.classList.add('active');
    const activeLink = plan.querySelector('a');
    activeLink.style.backgroundColor = '#fff';
    activeLink.style.color = 'red';
  });
});

//FAQs//
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(i => i.classList.remove('open'));

    // Open clicked one only if it wasn't already open
    if (!isOpen) item.classList.add('open');
  });83
});

