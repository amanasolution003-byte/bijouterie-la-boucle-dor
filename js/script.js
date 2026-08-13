// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Header scroll effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.background = 'rgba(10,10,10,0.98)';
    header.style.borderBottom = '1px solid rgba(212,175,55,0.3)';
  } else {
    header.style.background = 'rgba(10,10,10,0.95)';
    header.style.borderBottom = '1px solid rgba(212,175,55,0.2)';
  }
});