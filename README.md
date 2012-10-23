Private.JS
==========

Introduction
------------

**What is private.js?**

Private.js is a [JavaScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm) library that allows you to work with 'private' variables and methods withing JavaScript
classes. The library is compatible with browsers and server-side javascript (for example [node.js](http://nodejs.org)).

The library respects the following best-practices/conventions:

- Adheres to **'use strict'**.
- Uses **prototypes** - does NOT re-create methods per instance.
- Is fully **documented** with **JSDoc** and a **MarkDown** reference.
- Follows the **_underscore** notation convention for private variables in JavaScript
- Exposes a **DSL** for convenience.
- Respects '**this**' contract even within private scope.
- Fully **unit-tested** (using nodeunit).

Documentation
-------------

You can find the documentation [here](./doc/index.md).

Example
-------
As nothing can tell you more than an example, here is one:

    var Private = require('private').Private;

    // If using Node.JS only:
    // var util = require('util'); // Node.JS only

    var MyClass = function(){

        Private.call(this); // Extend the Private class (and call the super constructor).

        // Initialize a private variable. This corresponds to this._privates
        Private(this).setValue('Some private value');

    };
    MyClass.prototype = Object.create(Private.prototype); // Extend the prototype

    // Or using Node.JS style:
    // util.inherits(MyClass, Private);

    // Public getValue method with access to private variables (style 1):

    MyClass.prototype.getValue = Private.hasAccess(function(privates){
        return privates.myValue;
    });

    // Invocation of the getValue method is transparent (as the privates are injected):
    MyClass.prototype.toString = function(){

        // Invoke the getValue method - without parameters!
        return this.getValue();
    };

    // Or, the alternative - without parameter injection (style 2):
    MyClass.prototype.getValue2 = function(){

        // Or access the private value directly, through Private(...).
        return Private(this).myValue;
    };

    // Declare the Private method setValue:
    MyClass.prototype.privateMethod('setValue',function(privates, value){
        privates.myValue = value;
    });

    // Private method toJSON:
    MyClass.prototype.privateMethod('toJSON', function(privates){

        // Note that 'this' within this context is the instance of MyClass, NOT the privates.
        return JSON.stringify(this); // JSON stringification will NOT include the privates.
    });



Copyright
---------

Copyright (C) 2012 by [Daan Kets](mailto:daankets@blackbit.be), [Blackbit Consulting](http://www.blackbit.be)

License
-------
![Creative Commons Attribution-ShareAlike 3.0 Unported License](http://i.creativecommons.org/l/by-sa/3.0/88x31.png)

This library by [Daan Kets - Blackbit Consulting](http://www.blackbit.be) is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/).
You may use this library even within a commercial product as long as you attribute to the original source.
You may created derived work as long as you give back your modifications to the orignal source.

