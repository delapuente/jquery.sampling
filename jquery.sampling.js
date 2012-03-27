(function($) {
    var settings;

    function _fill($collection, content, flags) {
        if (flags.ensureText) {
            $collection.text(content);
        } else {
            $collection.html(content);
        }
    }

    var methods = {
        init: function(options) {
            settings = $.extend({
                sampleClass: '_s',
                defaultFlags: {
                    ensureText:false,
                    clearSamples:true
                }
            }, options || {});
        },

        select: function(selector) {
            return $($(selector, this)[0]);
        },

        gather: function() {
            var $c = $('<div>');
            this.each(function() {
                $('.'+settings.sampleClass, this).each(function() {
                    $c.append(this);
                });
            });
            return $c;
        },

        'new': function(maps, flags) {
            flags = $.extend({}, settings.defaultFlags, flags || {});

            // Normalize arguments
            if (!$.isArray(maps)) {
                maps = [maps];
            }

            var result = [];
            for (var i=0; m = maps[i]; i++) {
                var collection, n = this.clone();

                // Function: call and use the result as the actual map
                if (typeof m == 'function') {
                    m = m.apply(n, Array.prototype.slice.call(arguments, 2));
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
            }
            return $(result);
        },

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
        } else if (typeof method === 'string') {
            return methods.select.apply(this, arguments);
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.sampling' );
        }
    };

    methods.init();
})(jQuery);
