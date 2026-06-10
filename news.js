const newsLink1 = document.getElementById('insight1');
const newsLink2 = document.getElementById('insight2');
const newsLink3 = document.getElementById('insight3');

newsLink1.addEventListener('click', () => {
  window.location.href = './news/startup.html';
});

newsLink2.addEventListener('click', () => {
  window.location.href = './news/landing.html';
});

newsLink3.addEventListener('click', () => {
  window.location.href = './news/future.html';
});