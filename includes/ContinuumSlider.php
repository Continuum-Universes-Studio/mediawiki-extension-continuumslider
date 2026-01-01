<?php

class ContinuumSlider {
    public static function onParserFirstCallInit(Parser $parser) {
        $parser->setHook('slider', [self::class, 'renderSlider']);
    }

    public static function renderSlider($input, array $args, Parser $parser, PPFrame $frame) {
        // Load JS/CSS via ResourceLoader
        $parser->getOutput()->addModules(['ext.ContinuumSlider']);
        wfDebugLog('ContinuumSlider', 'addModules triggered!');
        // Parse the wikitext inside the <slider> tag
        $parsed = $parser->recursiveTagParse($input, $frame);

        // Extract images & captions
        $slides = self::extractSlides($parsed);

        if (empty($slides)) {
            return '<div class="slider-error">No images found for slider.</div>';
        }

        // Generate a unique ID for this slider instance (in case you have multiple sliders on the same page)
        $sliderId = 'slider-' . mt_rand(1000, 9999);

        // Start building slider HTML
        $html = '<div class="mediawiki-flipbook-slider" id="' . htmlspecialchars($sliderId) . '" data-slide-count="' . count($slides) . '">';

        // Add each slide
        foreach ($slides as $index => $slide) {
            $activeClass = ($index === 0) ? 'active' : '';
            $html .= '<div class="flipbook-slide ' . $activeClass . '" data-slide-index="' . $index . '">';
            $html .= $slide['html'];
            if (!empty($slide['caption'])) {
                $html .= '<div class="slider-caption">' . htmlspecialchars($slide['caption']) . '</div>';
            }
            $html .= '</div>';
        }

        // Add prev/next buttons
        $html .= '<button class="flipbook-prev" aria-label="Previous slide">❮</button>';
        $html .= '<button class="flipbook-next" aria-label="Next slide">❯</button>';

        $html .= '</div>'; // close .mediawiki-flipbook-slider
        $html .= '<div class="slider-credit" style="text-align:center; font-size:0.8em; color:#888; margin-top:5px;">';
        $html .= 'Made with 💜 by Onika & Snoop Booped by Athena aka Thea Thea';
        $html .= '</div>';

        return $html;
    }

    private static function extractSlides($html) {
        $slides = [];

        $doc = new DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML('<?xml encoding="UTF-8">' . $html); // Fix for mb_convert_encoding deprecation
        libxml_clear_errors();

        foreach ($doc->getElementsByTagName('img') as $img) {
            $src = $img->getAttribute('src');
            $alt = $img->getAttribute('alt');
            $caption = $img->getAttribute('data-caption') ?: $img->getAttribute('title');

            $link = null;
            if ($img->parentNode->nodeName === 'a') {
                $link = $img->parentNode->getAttribute('href');
            }

            // Build the <img> (inside <a> if there's a link)
            $imgHTML = '<img src="' . htmlspecialchars($src) . '" alt="' . htmlspecialchars($alt) . '">';
            if ($link) {
                $imgHTML = '<a href="' . htmlspecialchars($link) . '">' . $imgHTML . '</a>';
            }

            $slides[] = [
                'html' => $imgHTML,
                'caption' => $caption
            ];
        }

        return $slides;
    }
}
