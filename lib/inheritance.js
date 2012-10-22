/**
 * Created with JetBrains WebStorm.
 * User: daankets
 * Date: 22/10/12
 * Time: 10:15
 * To change this template use File | Settings | File Templates.
 */

var PRIVATES_VAR_NAME = '_privates';

/**
 * This class constructs an instance of the Private class. The Private class provides a simple, clear-specs
 * implementation of 'privates' for JavaScript. The prototype of the class will be extended with a '_privates' member,
 * that will contain the private variables. The name of this member is customizable using a constant, but it's not
 * advised to change it.
 *
 * The Private class exposes a static method 'access' that will wrap a function with the necessary code to inject the
 * first parameter 'privates' upon each invocation.
 *
 *
 *
 * @constructor
 */
var Private = function () {
    "use strict";

    this[PRIVATES_VAR_NAME].self = this; // Expose to methods defined via prototype.
};
Private.prototype[PRIVATES_VAR_NAME] = {};

/**
 * Method used for wrapping a function with the necessary code for injecting the privates upon invocation.
 * @param method The actual method implementation, accepting the first parameter 'privates'.
 */
Private.access = function (method) {
    "use strict";

    return function () {
        return method.apply(this, [this[PRIVATES_VAR_NAME]].concat(Array.prototype.slice.call(arguments)));
    };
};

/**
 * Method used for adding a new PRIVATE method to the prototype of the privates, that will inject the 'privates' as the
 * first argument, and will make sure the method is called with respect to 'this' of the current class.
 *
 * @param name The name of the method to add.
 * @param method The actual method implementation, accepting the first parameter 'privates'.
 */
Private.prototype.addPrivateMethod = function (name, method) {
    "use strict";

    // Swap the this and privates arguments!
    this[PRIVATES_VAR_NAME][name] = function () {
        return method.apply(this.self, [this].concat(Array.prototype.slice.call(arguments)));
    };
};

module.exports.Private = Private;