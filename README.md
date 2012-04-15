jQuery.sampling()
=================

jQuery.sampling() is a [jQuery](http://jquery.com/) plugin for HTML Sampling / Template Animation.

According to Iain Dooley from [http://www.workingsoftware.com.au](http://www.workingsoftware.com.au)

> Template animation: the practice of using static HTML files as a resource from within your application to be manipulated via the DOM to generate dynamic output.

You can read more about this technique in [Your templating engine sucks and everything you have ever written is spaghetti code (yes, you)](http://www.workingsoftware.com.au/page/Your_templating_engine_sucks_and_everything_you_have_ever_written_is_spaghetti_code_yes_you) but the idea is quite simple: use the *pure HTML* documents from your designer as the source for generating *dynamic content*.

In my opinion, the name is somewhat unfortunate and I prefer calling it *HTML sampling* since we use parts of the pure HTML documents as *samples for the dynamic content*.

The original concept assumes you will use HTML Sampling / Template animation in the backend but I find useful to have some library in the frontend as well.

This plugin enhances the coordination among designers and programmers. Look at this awesome interaction!

## Designer
He decorates part of the HTML with `_s` (or something else) class:

```html
<h1>Star Wars Spaceship Table</h1c>
<table id="spaceship_table">
    <thead>
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Type</th>
            <th>Affiliation</th>
        </tr>
    </thead>
    <tbody>
        <!-- Use these samples if you need to distinguish between even and odd rows -->
        <tr class="_s odd" title="Odd row">
            <td class="id">sample_id1</td>
            <td class="name">sample_name1</td>
            <td class="type">sample_type1</td>
            <td class="affiliation">sample_affiliation1</td>
        </tr>
        <tr class="_s even" title="Even row" style="background-color:grey;">
            <td class="id">sample_id2</td>
            <td class="name">sample_name2</td>
            <td class="type">sample_type2</td>
            <td class="affiliation">sample_affiliation2</td>
        </tr>
        <!-- Use this to highlight some special row -->
        <tr class="_s odd highlight" title="Special" style="background-color:pink; font-weight:bold;">
            <td class="id">sample_id3</td>
            <td class="name">sample_name3</td>
            <td class="type">sample_type3</td>
            <td class="affiliation">sample_affiliation3</td>
        </tr>
        <!-- Use these if no distinction is required -->
        <tr class="_s standard" title="Standard">
            <td class="id">sample_id4</td>
            <td class="name">sample_name4</td>
            <td class="type">sample_type4</td>
            <td class="affiliation">sample_affiliation4</td>
        </tr>
        <tr class="_s standard" title="Standard">
            <td class="id">sample_id5</td>
            <td class="name">sample_name5</td>
            <td class="type">sample_type5</td>
            <td class="affiliation">sample_affiliation5</td>
        </tr>
    </tbody>
</table>
```

## Programmer

1.- Gather samples:

```javascript
var $samples = $(document).sampling('gather');
```

2.- Select one example:

```javascript
var $row_sample = $samples.sampling('.standard');
```

3.- Customize and instanciate it:

```javascript
var $rows = $row_sample.sampling('new', [
    {
        '.id':1,
        '.name':'Tie Fighter',
        '.type':'Starfighter',
        '.affiliation':'Galactic Empire'
    },
    {
        '.id':2,
        '.name':'X-Wing Fighter',
        '.type':'Starfighter',
        '.affiliation':'Rebel Alliance'
    },
    {
        '.id':3,
        '.name':'Imperial Star Destroyer',
        '.type':'Imperial cruiser',
        '.affiliation':'Galactic Empire'
    }
]);
```

4.- Append to the table:

```javascript
$('#spaceship_table').append($rows);
```

Features
--------
 * Improve designer / programmer developing cycle:
  * Frees the designer to know any template language
  * Lets the programmer use designer's templates as sample libraries
 * Lets nested samples
 * Several ways to customize samples

API
---

// $.sampling(options)

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
$.sampling({
    sampleClass:'_example'
});

// $.sampling('option', key[, value])

/*
 * Get an option.
 */
var class = $.sampling('option', 'sampleClass');

/*
 * Set an option.
 */
$.sampling('option', 'sampleClass', '_s');

// $.sampling('option', options)

/*
 * Set several options at the same time.
 */
$.sampling('option', {
    sampleClass: '_s',
    defaultFlags: {
        ensureText:false,
        clearSamples:true
    }
});

// $.sampling('gather')

/*
 * Detaches all sample elements marked by the sample class (by default
 * '_s') and return a collection of them.
 */
var samples = $(document).sampling('gather');

// $.sampling('select', selector)

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
var rowSample = $(document).sampling('select', '.row_example');

// $.sampling('new'[, customizing_items_array[, flags[, ...]]])

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
 */
var row = rowSample.sampling('new');

/*
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
 */
var twoRows = rowSample.sampling('new', [
    {
        ".id":1,
        ".name":"Tie Fighter",
        ".type":"Starfighter",
        ".affiliation":"Galactic Empire"
    },
    {
        ".id":2,
        ".name":"X-Wing Fighter",
        ".type":"Starfighter",
        ".affiliation":"Rebel Alliance"
    },
]);

/*
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
function generateItems(index, limit) {
    if (index < limit) {
        return {
            '.id':index
        }
    }
    return null;
}

// Note you need to specify flags if you want to pass arguments to the geneation function
var severalRows = rowSample.sampling('new', generateItems, {}, 10)


Examples
--------

The [examples](https://github.com/lodr/jquery.sampling/blob/master/examples) directory contains some examples:

* [simple.html](https://github.com/lodr/jquery.sampling/blob/master/examples/simple.html) shows the interaction described above.
* [json.html](https://github.com/lodr/jquery.sampling/blob/master/examples/json.html) gets data from a json source.
* [oddEven.html](https://github.com/lodr/jquery.sampling/blob/master/examples/oddEven.html) uses several samples.
* [generator.html](https://github.com/lodr/jquery.sampling/blob/master/examples/simple.html) uses a generation funciton instead of an array.

Changelog
---------

### 1.0.0-rc.1

First release candidate.

### 1.0.0-alpha.3

API changed to be more homogeneus:

'''javascript
// former $row_sample = $samples.sampling(selector) changes to:
$row_sample = $samples.sampling('select', selector);
'''

### 1.0.0-alpha.1

Initial commit

Misc
----

Licensed under a MIT license, see the [LICENSE file](https://github.com/lodr/jquery.tr/blob/master/LICENSE).

