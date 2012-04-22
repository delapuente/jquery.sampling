jQuery.sampling plugin
======================

Setup
-----

You can configure the jQuery.sampling() plugin by calling :js:func:`jQuery.sampling` on the jQuery object (on ``$`` for newbies).

.. js:function:: jQuery.sampling([options])

    Establishes initial options such as the sample class or ``new`` flags. See :ref:`plugin-options` for further information.

    :param object options:
        a configuring object which defaults to::

            {
                sampleClass: '_s',
                defaultFlags: {
                    ensureText:false,
                    clearSamples:true
                }
            }

.. _plugin-options:

jQuery.sampling() options
^^^^^^^^^^^^^^^^^^^^^^^^^

sampleClass (defaults to ``_s``)
    class to mark HTML elements as samples. These elements will be gathered by using :js:func:`gather`.

defaultFlags
    see :ref:`instantiation-flags` for more information about these options.

.. _instantiation-flags:

Instantiation flags
^^^^^^^^^^^^^^^^^^^

ensureText (defaults to ``false``)
    during instantiation, content is set to each element by using ``jQuery.text()`` instead of ``jQuery.html()`` as it's by default.

clearSamples (defaults to ``true``)
    this option removes all nested samples inside the sample being instantiated.

Plugin API
----------

Following `jQuery Namespacing convenions <http://docs.jquery.com/Plugins/Authoring#Namespacing>`_, all these methods must be called by using::

    jQuery.sampling(<method_name>, ...);

I.e, to call :js:func:`option` to set the value of parameter ``sampleClass`` to ``_sample`` you should do::

    jQuery.sampling('option', 'sampleClass', '_sample');

.. js:function:: gather()

    Applies on **jQuery object**. Detaches all sample elements marked by the sample class (by default ``_s``) and returns a collection of them.

    :returns: **sample collection** with all collected samples.

.. js:function:: select(selector[, noCache=false])

    Applies on **sample collection** returned by :js:func:`gather`. Selects the proper sample inside the sample collection. The method is cached by the selector so succesive calls to this method have improved performance.

    :param selector: a valid jQuery selector to look for it inside the sample collection.
    :param boolean noCache: if ``true``, avoid caching by the selector and the query is re-runned. Defaults to ``false``.
    :returns:

        a **jQuery sample object** with the sample. Avoid to modify this object because it's the sample itself. Use ``jQuery.clone()`` or use :js:func:`new` to build a new copy.

.. js:function:: option(optName)

    Get value of the ``optName`` option.

    :param string optName: name of the option to get.
    :returns: value of the option specified by ``optName`` parameter.

.. js:function:: option(optName, value)

    Set the ``optName`` option to ``value``.

    :param string optName: name of the option to set.
    :param value: value to set.

Instantiating samples
^^^^^^^^^^^^^^^^^^^^^

Sample instantiation is the most interesting part of the plugin. Instantiate refers to clone the sample and customize it.

The task can be performed by calling to :js:func:`new` in several ways. The most important concept here is **customizing item**.

.. _customizing-items:

Customizing items
^^^^^^^^^^^^^^^^^

When a sample is instantiated it is customized by a **customizing item**. This is an ordinary object where keys are valid jQuery selector strings and values are mixed contents.

During customization process, each ``key`` of the customizing item is searched inside the sample and its content is set with the ``value``.

In instance, look at this customizing item::

    {
        '.id':1,
        '.name':'Tie Fighter',
        '.type':'Starfighter',
        '.affiliation':'Galactic Empire'
    }

Now look at this HTML snippet::

    <tr class="_s">
        <td class="id">sample_id1</td>
        <td class="name">sample_name1</td>
        <td class="type">sample_type1</td>
        <td class="affiliation">sample_affiliation1</td>
    </tr>

Previous ``tr`` sample, after instantiating with the previous item should look like::

    <tr>
        <td class="id">1</td>
        <td class="name">Tie Fighter</td>
        <td class="type">Starfighter</td>
        <td class="affiliation">Galactic Empire</td>
    </tr>

Following, there is the documentation about the different ways of calling :js:func:`new`:

.. js:function:: new()

    Applies on a **jQuery sample object** returned by :js:func:`select`.

    :returns: a clone of the current sample without the sample class.

.. js:function:: new(map_generator[, flags={}[, ...]])

    Applies on a **jQuery sample object** returned by :js:func:`select`. Successively calls ``map_generator`` using the returned value as the customizing item (see :ref:`customizing-items`) to instantiate the sample. Instantiation process ends when ``null`` is returned.

    :param callback map_generator:

        the callback signature should be as follows::

            map_generator(index[, ...])

        It receives the number of call (first time, 0; second time, 1; third time, 2...) and all other parameters passed to :js:func:`new` method.

        It should return a customizing item to instantiate the sample or ``null`` to end the instantiation process.

        Inside the callback, ``this`` refers to the sample's copy being instantiated.

        .. NOTE::
            Remember passing ``flags`` parameter (you can pass an empty object ``{}`` if you cannot change any flag) if you want to add parameters to the ``map_generator``.

    :param object flags:
        flags to customize the sample's instantiaion. Default flags can be set by using :js:func:`jQuery.sampling` or :js:func:`option`. Flags are explained in :ref:`instantiation-flags`.
    :param mixed ...: parameters for the ``map_generator``.
    :returns: a jQuery object, clone of the current sample, without the sample class.

.. js:function:: new(customizing_array[, flags={}[, ...]])

    Applies on a **jQuery sample object** returned by :js:func:`select`. Generates as much instantiations of the sample object as elements in the array.

    :param array customizing_array:

        The array containing the customizing items to instantiate the sample. Items inside the array can be of one of these types:

        * *object*: the object must be a customizing item (see :ref:`customizing-items`)
        * *function*: the function is call under same conditions of ``map_generator`` in the previous :js:func:`new` method but it **must** return a customizing item.
        * rest of the cases: the item will be the content of the instance.

        .. NOTE::
            Remember passing ``flags`` parameter (you can pass an empty object ``{}`` if you cannot change any flag) if you want to add parameters to the functions inside the array.

    :param object flags:
        flags to customize the sample's instantiaion. Default flags can be set by using :js:func:`jQuery.sampling` or :js:func:`option`. Flags are explained in :ref:`instantiation-flags`.
    :param mixed ...: parameters for the ``map_generator``.
    :returns: a jQuery object, clone of the current sample, without the sample class.

    .. TIP::
        If you want to pass an array of just one item, and this item is not a function, then ignores the array and pass only the item.
