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
        <tr class="_s even" title="Even row">
            <td class="id">sample_id2</td>
            <td class="name">sample_name2</td>
            <td class="type">sample_type2</td>
            <td class="affiliation">sample_affiliation2</td>
        </tr>
        <!-- Use this to highlight some special row -->
        <tr class="_s odd highlight" title="Special">
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
var $row_sample = $samples.sampling('select', '.standard');
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

Documentation
-------------

* [Latest documentation](https://delapuente.github.io/jquery.sampling/)

Features
--------
* Improve designer / programmer developing cycle:
 * Frees the designer to know any template language
 * Lets the programmer use designer's templates as sample libraries
* Lets nested samples
* Several ways to customize samples

Examples
--------

The [examples](https://github.com/lodr/jquery.sampling/blob/master/examples) directory contains some examples:

* [simple.html](https://github.com/lodr/jquery.sampling/blob/master/examples/simple.html) shows the interaction described above.
* [json.html](https://github.com/lodr/jquery.sampling/blob/master/examples/json.html) gets data from a json source.
* [oddEven.html](https://github.com/lodr/jquery.sampling/blob/master/examples/oddEven.html) uses several sample select modes to generate even, odd rows.
* [sampleModes.html](https://github.com/lodr/jquery.sampling/blob/master/examples/oddEven.html) shows predefined sample select modes in action.
* [generator.html](https://github.com/lodr/jquery.sampling/blob/master/examples/simple.html) uses a generation function instead of an array.
* [include.html](https://github.com/lodr/jquery.sampling/blob/master/examples/include.html) shows client side includes in action.
* [limited.html](https://github.com/lodr/jquery.sampling/blob/master/examples/include.html) shows client side includes with limitation.

Changelog
---------

### 1.0.0

* Support for **client side includes** and templating capabilities (see *include.html* and *limited.html* samples).
* New **sample select modes** eases instantiation (see the *new oddEven.html* sample)
* Improved documentation
* More examples!


### 1.0.0-rc.2

* Documentation added

### 1.0.0-rc.1

* First release candidate.

### 1.0.0-alpha.3

* API changed to be more homogeneus:

```javascript
// former $row_sample = $samples.sampling(selector) changes to:
$row_sample = $samples.sampling('select', selector);
```

### 1.0.0-alpha.1

* Initial commit

Misc
----

Licensed under a MIT license, see the [LICENSE file](https://github.com/lodr/jquery.tr/blob/master/LICENSE).

