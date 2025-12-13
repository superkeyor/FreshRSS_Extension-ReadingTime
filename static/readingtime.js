(function reading_time() {
    'use strict';

    const reading_time = {
        flux_list: null,
        flux: null,
        textContent: null,
        words_count: null,
        read_time: null,
        reading_time: null,

        // Define a threshold for "long" reading time (in minutes)
        LONG_READING_TIME_THRESHOLD: 5, // Adjust this value as needed

        init: function () {
            const flux_list = document.querySelectorAll('[id^="flux_"]');

            for (let i = 0; i < flux_list.length; i++) {
                if ('readingTime' in flux_list[i].dataset) {
                    continue;
                }

                reading_time.flux = flux_list[i];

                // Count words or characters (for Chinese) or mixed text
                reading_time.words_count = reading_time.flux_words_count(flux_list[i]); // count the words or characters
                // change this number (in words/characters) to your preferred reading speed:
                reading_time.reading_time = reading_time.calc_read_time(reading_time.words_count, 300);

                flux_list[i].dataset.readingTime = reading_time.reading_time;

                const li = document.createElement('li');
                li.setAttribute('class', 'item date');
                li.style.width = '40px';
                li.style.overflow = 'hidden';
                li.style.textAlign = 'right';
                li.style.display = 'table-cell';

                // Set the text content
                li.textContent = reading_time.reading_time + '\u2009m';

                // Highlight long reading times
                if (reading_time.reading_time !== '<1' && reading_time.reading_time > reading_time.LONG_READING_TIME_THRESHOLD) {
                    li.style.color = 'red'; // Change text color to red
                    li.style.fontWeight = 'bold'; // Make text bold
                    // li.textContent += ' ⏳'; // Add an icon or indicator
                }

                const ul = document.querySelector('#' + reading_time.flux.id + ' ul.horizontal-list');
                ul.insertBefore(li, ul.children[ul.children.length - 1]);
                if (reading_time.reading_time !== '<1' && reading_time.reading_time > reading_time.LONG_READING_TIME_THRESHOLD) {
                    // ul.children[3].children[0].style.color='red';  // change title color
                    ul.children[3].children[0].text=ul.children[3].children[0].text+'⏳'
                }
            }
        },

        flux_words_count: function flux_words_count(flux) {
            // Get textContent from the article itself (not the header, not the bottom line):
            reading_time.textContent = flux.querySelector('.flux_content .content').textContent;

            // Remove extra spaces and newlines (optional, for non-Chinese text)
            reading_time.textContent = reading_time.textContent.replace(/(^\s*)|(\s*$)/gi, ''); // exclude start and end white-space
            reading_time.textContent = reading_time.textContent.replace(/[ ]{2,}/gi, ' '); // 2 or more spaces to 1
            reading_time.textContent = reading_time.textContent.replace(/\n /, '\n'); // exclude newline with a start spacing

            // Count mixed Chinese characters and English words
            let wordCount = 0;
            const text = reading_time.textContent;

            // Split the text into an array of tokens (Chinese characters and English words)
            const tokens = text.split(/(\s+)/).filter(token => token.trim().length > 0);

            for (const token of tokens) {
                if (/[\u4e00-\u9fa5]/.test(token)) {
                    // If the token contains Chinese characters, count each character as a word
                    wordCount += token.length;
                } else {
                    // If the token is English (or other non-Chinese text), count it as one word
                    wordCount += 1;
                }
            }

            return wordCount;
        },

        calc_read_time: function calc_read_time(wd_count, speed) {
            reading_time.read_time = Math.round(wd_count / speed);

            if (reading_time.read_time === 0) {
                reading_time.read_time = '<1';
            }

            return reading_time.read_time;
        },
    };

    function add_load_more_listener() {
        reading_time.init();
        document.body.addEventListener('freshrss:load-more', function (e) {
            reading_time.init();
        });
    }

    if (document.readyState && document.readyState !== 'loading') {
        add_load_more_listener();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', add_load_more_listener, false);
    }
}());
