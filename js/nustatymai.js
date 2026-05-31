(function() {
    const bgColor = localStorage.getItem('bgColor');
    const headingColor = localStorage.getItem('headingColor');
    const headingSize = localStorage.getItem('headingSize');
    
    if (bgColor) {
        document.body.style.backgroundColor = bgColor;
    }
    
    if (headingColor) {
        document.querySelectorAll('h2, h3, .hero-turinys h2, .hero-turinys p').forEach(el => {
            el.style.color = headingColor;
        });
    }
    
    if (headingSize) {
        document.querySelectorAll('h2').forEach(el => {
            el.style.fontSize = headingSize;
        });
    }
})();