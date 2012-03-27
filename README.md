jquery.sampling
===============

jquery.sampling is a [jQuery](http://jquery.com/) plugin for HTML Sampling / Template Animation.

According to Iain Dooley from [http://www.workingsoftware.com.au](http://www.workingsoftware.com.au)

> Template animation: the practice of using static HTML files as a resource from within your application to be manipulated via the DOM to generate dynamic output.

You can read more about this technique in [Your templating engine sucks and everything you have ever written is spaghetti code (yes, you)](http://www.workingsoftware.com.au/page/Your_templating_engine_sucks_and_everything_you_have_ever_written_is_spaghetti_code_yes_you) but the idea is quite simple: use the *pure HTML* documents from your designer as the source for generating *dynamic content*.

In my opinion, the name is somewhat unfortunate and I prefer calling it *HTML sampling* since we use parts of the pure HTML documents as *samples for the dynamic content*.

The original concept assumes you will use HTML Sampling / Template animation in the backend but I find useful to have some library in the frontend as well.

This plugin enhances the coordination among designers and programmers. Look at this awesome interaction!

## Designer
He decorates part of the HTML with `_s` (or something else) classes:

```html
<table id="spaceship_table" border="1">
    <summary>Star Wars Spaceship Table</summary>
    <tbody>
    <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Type</th>
        <th>Affiliation</th>
    </tr>
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

3.- Customize it:

```javascript
var $row = $row_sample.sampling('new', [
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
$('#spaceship_table').append($row);
```

Features
--------

API
-----

Examples
--------

The [examples](https://github.com/lodr/jquery.sampling/blob/master/examples) directory contains some examples:

* [simple.html](https://github.com/lodr/jquery.sampling/blob/master/examples/simple.html) shows debug mode

Changelog
---------

### 1.0

Initial commit

Misc
----

Licensed under a MIT license, see the [LICENSE file](https://github.com/lodr/jquery.tr/blob/master/LICENSE).
