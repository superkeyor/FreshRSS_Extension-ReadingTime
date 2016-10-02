var reading_time = {

    init: function() {
        flux_list = $("div[id^='flux']");

        for(var i = 0; i < flux_list.length; i++) {
            //console.log($("div[id^='flux']")[i], "Length (words): ", flux_words_count($("div[id^='flux']")[i]))

            flux = $("div[id^='flux']")[i]

            words_count = flux_words_count($("div[id^='flux']")[i]) // count the words
            reading_time = calc_read_time(words_count, 300)

            // add the reading time just before the title
            $("#" + flux.id + " ul.horizontal-list li.item.title")[0].textContent = '[' + reading_time + 'min] ' + $("#" + flux.id + " ul.horizontal-list li.item.title")[0].textContent
        }
    },

    flux_words_count : function(flux) {

        htmlContent = flux.innerHTML, // get htmlContent

        textContent = flux.textContent; // get textContent

        // split the text to count the words correctly (source: http://www.mediacollege.com/internet/javascript/text/count-words.html)
        textContent = textContent.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
        textContent = textContent.replace(/[ ]{2,}/gi," ");//2 or more space to 1
        textContent = textContent.replace(/\n /,"\n"); // exclude newline with a start spacing

        return textContent.split(' ').length; // returns the number of words
    },

    calc_read_time : function(wd_count, speed) {
        reading_time = Math.round(wd_count/speed)
        if (reading_time === 0) {reading_time = '<1'}
        //console.log('Reading time: ', reading_time)
        return reading_time
    },
};


window.onload = reading_time.init;