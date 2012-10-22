/**
 * Created with JetBrains WebStorm.
 * User: daankets
 * Date: 22/10/12
 * Time: 11:18
 * To change this template use File | Settings | File Templates.
 */

var Private = require('../lib/inheritance').Private;

var TestClass = function (value) {
    "use strict";

    Private.call(this);
    this.setValue(value);
};
TestClass.prototype = Object.create(Private.prototype);

TestClass.prototype.addPrivateMethod('capitalize', function (privates, someString) {
    "use strict";

    return someString.toUpperCase();
});

TestClass.prototype.setValue = Private.access(function (privates, value) {
    "use strict";

    return (privates.value = value);
});

TestClass.prototype.toString = Private.access(function (privates) {
    "use strict";

    return privates.capitalize(privates.value);
});

var testWithPrivates = function (test) {
    "use strict";

    var testObject = new TestClass('hello');
    test.equal(testObject.toString(), 'HELLO');
    test.equal(JSON.stringify(testObject), '{}');
    test.done();


};

module.exports = {
    testWithPrivates : testWithPrivates
};