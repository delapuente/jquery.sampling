(function($) {
    var settings;
    var cache = {};

    function _fill($collection, content, flags) {
        if (flags.ensureText) {
            $collection.text(content);
        } else {
            $collection.html(content);
        }
    }

    var methods = {

        /*
         * Establishes initial options such as the sample class or 'new' flags.
         *
         * Accepts an object which defaults to:
         *  {
         *      sampleClass: '_s',
         *      defaultFlags: {
         *          ensureText:false,
         *          clearSamples:true
         *      }
         *  }
         *
         */
        init: function(options) {
            settings = $.extend({
                sampleClass: '_s',
                defaultFlags: {
                    ensureText:false,
                    clearSamples:true
                }
            }, options || {});

            return this;
        },

        /*
         * Selects the proper sample inside sample collection. Use it after 
         * calling .sampling('gather'). The method is cached by the selector.
         * In order to avoid caching, pass false as second parameter.
         *
         * Accepts a jQuery selector and an optional parameter noCache to avoid
         * the cache mechanism.
         *
         * Returns a jQuery object with the sample. Avoid to modify this object
         * because it's the sample itself. Use jQuery.clone() or use
         * .sampling('new') to build a new copy.
         */
        select: function(selector, noCache) {
            if (!noCache && typeof cache[selector] == 'undefined') {
                cache[selector] = $($(selector, this)[0]);
            }
            return cache[selector];
        },

        /*
         * Detaches all sample elements marked by the sample class (by default
         * '_s') and return a collection of them.
         */
        gather: function() {
            var $c = $('<div>');
            this.each(function() {
                $('.'+settings.sampleClass, this).each(function() {
                    $c.append(this);
                });
            });
            return $c;
        },

        /*
         * Clone and customizes a sample retreived by using .sampling('select').
         *
         * The method takes from two to undefined number of optional parameters.
         * The first one is called map_generator and second one are flags.
         * From here, the method accepts an undefined number of parameters to 
         * pass to possible callbacks.
         *
         * You can call .sampling('new') in several ways. In the simplest form,
         * you can pass no parameters. Then, a copy of the element will be
         * returned. This is the same as calling jQuery.clone() on the sample.
         *
         * Another form is to call it with an array of customizing items. Then,
         * as much copies as items in the array will be created, each using the
         * n-th customizing item to customize the sample according to the
         * following rules:
         *
         *   - If the item is a function, it will be called passing all arguments
         *     after the second one received by .sampling('new'). The function
         *     always receives the number of the element being generated as first
         *     argument and the word 'this', inside the function, refers to that
         *     element.
         *
         *     The result of the function will be treated as it had been the 
         *     original item, so the following rules still apply.
         *
         *   - If the item is an object, it must be a map object. A map object
         *     is an object where keys are valid jQuery selector strings that
         *     will be searched inside the sample. Values will be the content
         *     for those elements.
         *
         *   - Else case, the item will be the content of the element being
         *     generated.
         *
         * If you want to pass an array of just one customizing item you can pass
         * just the item intead of the array.
         *
         * Furthermore, in place of passing an array of customizing items you
         * can generate them dynamically by passing a generating function. The
         * customizing objects should be created by the geneation function and
         * the rules described before apply on them. Generation ends when the
         * generation function returns null.
         *
         * The generation function is passed with the number of the element
         * being created and all the parameters after flags received by
         * .sampling('new').
         *
         * Finally, flags parameter is an object with the following options:
         *   - ensureText, a boolean, false by default indicating if content
         *     should be htmlencoded before inserted. It is equivalent to do
         *     jQuery.text() on the content.
         *
         *   - clearSamples, a boolean, true by default indicating if subelemnts,
         *     marked as samples, of the current sample should be stripped 
         *
         */
        'new': function(mapGenerator, flags) {
            // No parameters, return a clone of the sample
            if (!arguments.length) { return this.clone(); }

            // Extend flags
            flags = $.extend({}, settings.defaultFlags, flags || {});

            // Default map generator that returns each item of an array
            function getArrayIterator(array) {
                var l = array.length;
                return function(index) {
                    if (index == l) {
                        return null;
                    }
                    return array[index];
                };
            }

            // Normalize arguments: the first argument should be a generator of
            // map objects
            if (typeof mapGenerator != 'function') {
                var mapArray = mapGenerator;
                if (!$.isArray(mapArray)) {
                    mapArray = [mapArray];
                }
                mapGenerator = getArrayIterator(mapArray);
            }

            var result = [];
            var index = 0, n = this.clone();
            var args = Array.prototype.slice.call(arguments, 2);
            args.splice(0, 0, index);

            while (null !== (m = mapGenerator.apply(n, args))) {

                // Function: call and use the result as the actual map
                if (typeof m == 'function') {
                    args.splice(0, 0, i); // Add the current index to the callback
                    m = m.apply(n, args);
                }

                // The map is an object: subelemnts and their contents
                if (typeof m == 'object') {
                    $.each(m, function(selector, content) {
                        _fill($(selector, n), content, flags)
                    });

                // The map is another thing: the content for the current instance
                } else {
                    _fill(n, m, flags);
                }

                // Remove sample class and all sample sub elements if required
                n.removeClass(settings.sampleClass);
                if (flags.clearSamples) {
                    $('.'+settings.sampleClass, n).remove();
                }

                result.push(n[0]);

                // Next step
                index++;
                n = this.clone();
                args[0] = index;
            }
            return $(result);
        },

        /*
         * Get or set an option. If just one parameter is provided, it returns 
         * the current value for that option. If value is indicated then, the
         * option is set to that value.
         */
        option: function(opts, value) {
            // Get form
            if (typeof value == 'undefined' && typeof opts != 'object') {
                return settings[opts];
            }

            // Normalize opts: it should be a map
            if (typeof opts != 'object'){
                var d = {};
                d[opts] = value;
                opts = d;
            }

            // Set form
            settings = $.extend(settings, opts);
        }
    };

    $.fn.sampling = function(method) {
        if (method in methods) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.sampling' );
        }
    };

    methods.init();
})(jQuery);
