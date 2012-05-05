/*
MIT license <http://www.opensource.org/licenses/MIT>

Copyright (c) 2012 Salvador de la Puente (lodr)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function($) {
    var settings;
    var cache = {};

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

    function getFixedIndexSelector(fixedIndex) {
        return function(index, length) {
            if (fixedIndex >= 0) {
                return fixedIndex;
            } else {
                return length + fixedIndex;
            }
        }
    }

    function rotationSelectMode(index, length) {
            return index % length;
    }

    // Default sample iteration functions
    var defaultSelectors = {
        'single':function() {
            return 0;
        },
        'identity':function(index, length) {
            if (index < length) {
                return index
            } else {
                return null;
            }
        },
        'clamp':function(index, length) {
            if (index < length) {
                return index;
            } else {
                return length - 1;
            }
        },
        'altern': rotationSelectMode,
        'rotation': rotationSelectMode,
        'bounce':function(index, length) {
            var tl = 2*length - 2;
            var j = index % tl;
            if (j < length) {
                return j;
            } else {
                return tl - j;
            }
        },
        'none' : function() { return null; }
    };

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
         */
        init: function(options) {
            settings = $.extend({
                sampleClass: '_s',
                includeClass: '_inc',
                defaultFlags: {
                    ensureText:false,
                    clearSamples:true,
                    sampleSelectMode:0
                }
            }, options || {});

            return this;
        },

        /*
         * Selects the proper sample inside sample collection.
         */
        select: function(selector, noCache) {
            if (!noCache && typeof cache[selector] == 'undefined') {
                cache[selector] = $(selector, this);
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
         * Resolve the client side includes
         */
        include: function(limit) {
            var count = 0;
            var level = 0;
            var $anchors = $('a.'+settings.includeClass, this);
            while($anchors.length && (!limit || (limit && level < limit))) {
                count += $anchors.length;
                for (var i=0; i<$anchors.length; i++) {
                    var $anchor = $($anchors[i]);
                    $.ajax({
                        url:$anchor.attr('href'),
                        async:false,
                        dataType:'html',
                        success: function(html) {
                            $anchor.replaceWith(html);
                        },
                        error: function() {
                            count--;
                        }
                    });
                }
                $anchors = $('a.'+settings.includeClass, this);
                level++;
            }
            return count;
        },

        /*
         * Clone and customizes a sample retreived by using .sampling('select').
         */
        'new': function(mapGenerator, flags) {
            // No parameters, return a clone of the sample
            if (!arguments.length) { return this.clone(); }

            // Extend flags
            flags = $.extend({}, settings.defaultFlags, flags || {});

            // Normalize arguments: the first argument should be a generator of
            // map objects
            if (typeof mapGenerator != 'function') {
                var mapArray = mapGenerator;
                if (!$.isArray(mapArray)) {
                    mapArray = [mapArray];
                }
                mapGenerator = getArrayIterator(mapArray);
            }

            // Select the sample selector
            var sampleSelector;
            if (typeof flags.sampleSelectMode == 'string') {
                sampleSelector = defaultSelectors[flags.sampleSelectMode];
                if (typeof sampleSelector == 'undefined') {
                    throw "Sample mode '"+flags.sampleSelectMode+"' does not exist.";
                }

            } else if (typeof flags.sampleSelectMode == 'number') {
                sampleSelector = getFixedIndexSelector(flags.sampleSelectMode);

            } else if (typeof flags.sampleSelectMode == 'function') {
                sampleSelector = flags.sampleSelectMode;

            } else {
                throw "sampleSelectMode flag must be a function or a string.";
            }

            var result = [];

            var index = 0;
            var selected = sampleSelector.call(this, index, this.length);
            if (selected != null) {

                var $n = $(this[selected]).clone();
                var args = Array.prototype.slice.call(arguments, 2);
                args.splice(0, 0, index);

                while (null !== (m = mapGenerator.apply($n, args))) {

                    // Function: call and use the result as the actual map
                    if (typeof m == 'function') {
                        args.splice(0, 0, index); // Add the current index to the callback
                        m = m.apply($n, args);
                    }

                    if (typeof m != 'object') {
                        throw 'Returned values of the map generator or objects inside the array should be customizing items.';
                    }

                    $.each(m, function(selector, content) {
                        _fill($(selector, $n), content, flags)
                    });

                    // Remove sample class and all sample sub elements if required
                    $n.removeClass(settings.sampleClass);
                    if (flags.clearSamples) {
                        $('.'+settings.sampleClass, $n).remove();
                    }

                    Array.prototype.push.apply(result, $n);

                    // Next step
                    index++;
                    selected = sampleSelector(index, this.length);
                    if (selected == null) { break; }

                    $n = $(this[selected]).clone();
                    args[0] = index;
                }
            }
            return $(result);
        },

        /*
         * Get or set an option.
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
