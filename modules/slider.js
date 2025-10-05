function initFlipbookSlider($content) {
    $content.find('.mediawiki-flipbook-slider').each(function() {
        const slider = this;
        const slides = slider.querySelectorAll('.flipbook-slide');
        const prevButton = slider.querySelector('.flipbook-prev');
        const nextButton = slider.querySelector('.flipbook-next');

        if (!slides.length || !prevButton || !nextButton) {
            console.error('Slider setup failed: missing slides or buttons.');
            return;
        }

        let currentSlide = 0;
        let autoAdvanceTimer = null;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
        }

        function resetAutoAdvance() {
            clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = setInterval(nextSlide, 5000);
        }

        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoAdvance();
        });

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoAdvance();
        });

        showSlide(currentSlide);
        resetAutoAdvance();
    });
}
console.log("%cMade with 💜 by Onika & Snoop Booped by Athena the Basset Queen", "color: hotpink; font-weight: bold; font-size: 14px;");
// Initial load
mw.hook('wikipage.content').add(initFlipbookSlider);
