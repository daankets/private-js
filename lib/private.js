/**
 * Private-JS - Copyright (C) 2012 by Daan Kets - Blackbit Consulting.
 * Licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License.
 */

/**
 * This class constructs an instance of the Private class. The Private class provides a simple, clear-specs
 * implementation of 'privates' for JavaScript. The prototype of the class will be extended with a '_privates' member,
 * that will contain the private variables. The name of this member is customizable using a constant, but it's not
 * advised to change it.
 *
 * The Private class exposes a static method 'access' that will wrap a function with the necessary code to inject the
 * first parameter 'privates' upon each invocation.
 *
 * @param {Object} object Optional object parameter for non-constructor invocation. Not to be used with constructor
 * style.
 * @param {Object} [initialValues] An optional object of which the attributes will be copied to the privates upon construction.
 *
 */
var Private = function (object, initialValues) {
    "use strict";

    // If this is a classic function invocation, and NOT a constructor call.
    if (this === undefined) {
        return object[Private.PRIVATES_VAR_NAME];
    } else {
        initialValues = object; // Object can not be specified on construction!

        // In other cases, this is an extension - initialize (update) the self reference.
        Private.enable(this, initialValues); // Update the self reference to 'this'.
    }
};

Private.PRIVATES_VAR_NAME = '_privates';
Private.THIS_PRIVATE_VAR_NAME = '_this';

/**
 * Checks if this prototype or object has privates support.
 * @param object The object to test.
 * @return {Boolean} true if supported, false if not.
 */
Private.hasPrivates = function (object) {
    "use strict";

    return (object && object[Private.PRIVATES_VAR_NAME]);
};

/**
 * Method used for wrapping a function with the necessary code for injecting the privates upon invocation. The function
 * will return the original function wrapped with invocation code. This code will make sure the privates are injected
 * as the first parameter, and that the 'this' reference is correctly passed.
 *
 * @param method The actual method implementation, accepting the first parameter 'privates'.
 * @return {Function}
 */
Private.hasAccess = function (method) {
    "use strict";

    return function () {
        return method.apply(this, [Private(this)].concat(Array.prototype.slice.call(arguments)));
    };
};

/**
 * Method used for adding a new PRIVATE method to the prototype of the privates, that will inject the 'privates' as the
 * first argument, and will make sure the method is called with respect to 'this' of the current class.
 * In fact, the created method becomes a member of the 'privates' of the prototype (or instance).
 *
 * The function can later be invoked by a function with access to the privates.
 *
 * @param name The name of the method to add.
 * @param method The actual method implementation, accepting the first parameter 'privates'.
 */
Private.privateMethod = function (name, method) {
    "use strict";

    if (Private(this)[Private.THIS_PRIVATE_VAR_NAME] !== this){
        // This is still the original object, associated with the Private prototype. We need to create a new instance.
        Private.enable(this);
    }

    // Swap the this and privates arguments!
    Private(this)[name] = function () {
        return method.apply(this[Private.THIS_PRIVATE_VAR_NAME], [this].concat(Array.prototype.slice.call(arguments)));
    };
};

/**
 * Enable a prototype or instance with privates support. This can be used on BOTH a prototype or single instance.
 * You may also later enable an object with privates support without extending from Private.
 * @param {Object} object The object or prototype to enable.
 * @param {Object} [initialValues] The initial values to copy to the privates; all attributes owned by the passed object
 * are copied.
 */
Private.enable = function (object, initialValues) {
    "use strict";

    if (object) {
        if (!Private(object)) {
            // Create a new object for the base prototype.
            object[Private.PRIVATES_VAR_NAME] = {};
        } else if (Private(object)[Private.THIS_PRIVATE_VAR_NAME] !== object){ // This is still the inherited object!
            // Use the inherited privates as the prototype for the new privates.
            // This prevents sharing of a single privates instance between prototypes and objects.
            object[Private.PRIVATES_VAR_NAME] = Object.create(Private(object));
        }
        if (!object.privateMethod) {
            object.privateMethod = Private.privateMethod;
        }
    }

    if (initialValues !== undefined) { // Copy the initial values to this object.
        for (var attributeName in initialValues) {
            if (initialValues.hasOwnProperty(attributeName) && attributeName) {
                Private(object)[attributeName] = initialValues[attributeName];
            }
        }
    }

    Private(object)[Private.THIS_PRIVATE_VAR_NAME] = object;
};

// Enable the Private prototype for Private support.
Private.enable(Private.prototype);

// If running on Node.JS
try {
    if (module !== undefined) { // If 'module' is defined
        // Export the Private class.
        module.exports = {
            Private : Private
        };
    }
} catch (error) {
    // Ignore - we are running on a browser, this will only occur once, and on some browsers.
}