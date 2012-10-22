/**
 * Created with JetBrains WebStorm.
 * User: daankets
 * Date: 22/10/12
 * Time: 10:15
 * To change this template use File | Settings | File Templates.
 */

var PRIVATES_VAR_NAME = '_privates';
/**
 * This class constructs an instance of the WithPrivates class.
 * A class of this type is intended for clean inheritance with private variables. The variables will be added
 * on the prototype of the class, and the class will expose some methods that allow working with the privates.
 *
 * @constructor
 */
var WithPrivates = function () {
    "use strict";

    this[PRIVATES_VAR_NAME].self = this; // Expose to methods defined via prototype.
};
WithPrivates.prototype[PRIVATES_VAR_NAME] = {};

/**
 * Method used for adding a method to the prototype or instance, that will inject the 'privates' as the first argument
 * to the method.
 * @param name The name of the method to add.
 * @param method The method implementation.
 */
WithPrivates.addPublicMethod = function (prototype, name, method) {

    prototype[name] = function () {
        return method.apply(this, [this[PRIVATES_VAR_NAME]].concat(Array.prototype.slice.call(arguments)));
    };

};

/**
 * Method used for adding a new PRIVATE method to the prototype or instance, that will inject the 'privates' as the
 * first argument, and swap the 'this' instance with the 'self' variable set on the privates.
 *
 * @param name The name of the method to add.
 * @param method The method implementation.
 */
WithPrivates.addPrivateMethod = function (prototype, name, method) {
    // "use strict";

    // Swap the this and privates arguments!
    prototype[PRIVATES_VAR_NAME][name] = function () {
        return method.apply(this.self, [this].concat(Array.prototype.slice.call(arguments)));
    };
};

module.exports.WithPrivates = WithPrivates;