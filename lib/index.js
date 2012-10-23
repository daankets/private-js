/**
 * Created with JetBrains WebStorm.
 * User: daankets
 * Date: 22/10/12
 * Time: 10:15
 * To change this template use File | Settings | File Templates.
 */

var PRIVATES_VAR_NAME = '_privates';
var THIS_VAR_NAME = '_this';

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
 *
 */
var Private = function (object) {
    "use strict";

    // If this is a classic function invocation, and NOT a constructor call.
    if (object) {
        return object[PRIVATES_VAR_NAME];
    }

    // In other cases, this is an extension - initialize (update) the self reference.
    Private.enable(this); // Update the self reference to 'this'.
};

/**
 * Checks if this prototype or object has privates support.
 * @param object The object to test.
 * @return {Boolean} true if supported, false if not.
 */
Private.hasPrivates = function (object) {
    "use strict";

    return (object && object[PRIVATES_VAR_NAME]);
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
 * In fact, the created method becomes a memeber of the 'privates' of the prototype (or instance).
 *
 * The function can later be invoked by a function with access to the privates.
 *
 * @param name The name of the method to add.
 * @param method The actual method implementation, accepting the first parameter 'privates'.
 */
var privateMethod = function (name, method) {
    "use strict";

    // Swap the this and privates arguments!
    Private(this)[name] = function () {
        return method.apply(this[THIS_VAR_NAME], [this].concat(Array.prototype.slice.call(arguments)));
    };
};

/**
 * Enable a prototype or instance with privates support. This can be used on BOTH a prototype or single instance.
 * You may also later enable an object with privates support without extending from Private.
 * @param object The object or prototype to enable.
 */
Private.enable = function (object) {
    "use strict";

    if (object) {
        if (!object[PRIVATES_VAR_NAME]) {
            object[PRIVATES_VAR_NAME] = {};
        }
        if (!object.privateMethod) {
            object.privateMethod = privateMethod;
        }
    }
    Private(object)[THIS_VAR_NAME] = object;
};

// Enable the Private prototype for Private support.
Private.enable(Private.prototype);

// Export the Private class.
module.exports.Private = Private;