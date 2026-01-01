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
        let exitTimer = null;

        function setSliderHeight(slide) {
            if (!slide) {
                return;
            }
            slider.style.height = `${slide.offsetHeight}px`;
        }

        function showSlide(index) {
            if (index === currentSlide) {
                setSliderHeight(slides[index]);
                return;
            }

            const previousSlide = slides[currentSlide];
            const nextSlide = slides[index];

            if (previousSlide) {
                previousSlide.classList.remove('active');
                previousSlide.classList.add('is-exiting');
            }

            if (exitTimer) {
                clearTimeout(exitTimer);
            }

            exitTimer = setTimeout(() => {
                slides.forEach((slide) => {
                    slide.classList.remove('is-exiting');
                });
            }, 350);

            nextSlide.classList.add('active');
            nextSlide.classList.remove('is-exiting');
            currentSlide = index;

            setSliderHeight(nextSlide);
        }

        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        function prevSlide() {
            const prevIndex = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
            showSlide(prevIndex);
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

        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        setSliderHeight(slides[currentSlide]);
        resetAutoAdvance();

        window.addEventListener('resize', () => {
            setSliderHeight(slides[currentSlide]);
        });
    });
}
console.log("%cMade with 💜 by Onika & Snoop Booped by Athena aka Thea Thea the Basset Queen", "color: hotpink; font-weight: bold; font-size: 14px;");
// Initial load
mw.hook('wikipage.content').add(initFlipbookSlider);
