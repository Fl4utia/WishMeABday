// src/components/Slider.tsx
"use client";   
import React, { useEffect } from 'react';
import $ from 'jquery'; // Importa jQuery
(window as any).jQuery = $; 

const Slider: React.FC = () => {

  useEffect(() => {
    (function($: JQueryStatic) {

      interface SliceSliderSettings {
        delta: number;
        currentSlideIndex: number;
        scrollThreshold: number;
        slides: JQuery<HTMLElement>;
        numSlides: number;
        navPrev: JQuery<HTMLElement>;
        navNext: JQuery<HTMLElement>;
      }

      const SliceSlider = {
        settings: {
          delta: 0,
          currentSlideIndex: 0,
          scrollThreshold: 40,
          slides: $('.slide'),
          numSlides: $('.slide').length,
          navPrev: $('.js-prev'),
          navNext: $('.js-next')
        } as SliceSliderSettings,

        init: function() {
          this.bindEvents();
        },

        bindEvents: function() {
          const s = this.settings;

          s.slides.on('DOMMouseScroll mousewheel', this.handleScroll.bind(this));
          s.navPrev.on('click', this.prevSlide.bind(this));
          s.navNext.on('click', this.nextSlide.bind(this));

          $(document).on('keyup', (e: JQuery.Event) => {
            if (e.which === 37 || e.which === 38) {
              this.prevSlide();
            }
            if (e.which === 39 || e.which === 40) {
              this.nextSlide();
            }
          });
        },

        handleScroll: function(e: JQuery.TriggeredEvent) {
          const s = this.settings;

          // Use deltaY instead of wheelDelta
          const deltaY = (e.originalEvent as WheelEvent).deltaY;

          if (deltaY < 0) { // Scrolling up
            s.delta--;
            if (Math.abs(s.delta) >= s.scrollThreshold) {
              this.prevSlide();
            }
          } else { // Scrolling down
            s.delta++;
            if (s.delta >= s.scrollThreshold) {
              this.nextSlide();
            }
          }

          return false;
        },

        showSlide: function() {
          const s = this.settings;
          s.delta = 0;

          if ($('body').hasClass('is-sliding')) {
            return;
          }

          s.slides.each((i, slide) => {
            $(slide).toggleClass('is-active', i === s.currentSlideIndex);
            $(slide).toggleClass('is-prev', i === s.currentSlideIndex - 1);
            $(slide).toggleClass('is-next', i === s.currentSlideIndex + 1);

            $('body').addClass('is-sliding');

            setTimeout(() => {
              $('body').removeClass('is-sliding');
            }, 1000);
          });
        },

        prevSlide: function() {
          const s = this.settings;
          if (s.currentSlideIndex <= 0) {
            s.currentSlideIndex = s.numSlides;
          }
          s.currentSlideIndex--;
          this.showSlide();
        },

        nextSlide: function() {
          const s = this.settings;
          s.currentSlideIndex++;
          if (s.currentSlideIndex >= s.numSlides) {
            s.currentSlideIndex = 0;
          }
          this.showSlide();
        }
      };

      SliceSlider.init();

    })(jQuery);

  }, []);

  return (
    <div>
      <div className="slide is-active">Slide 1</div>
      <div className="slide">Slide 2</div>
      <div className="slide">Slide 3</div>
      <button className="js-prev">Previous</button>
      <button className="js-next">Next</button>
    </div>
  );
};

export default Slider;
