/**
 * Created with JetBrains WebStorm.
 * User: daankets
 * Date: 22/10/12
 * Time: 11:18
 * To change this template use File | Settings | File Templates.
 */

var WithPrivates = require('../lib/inheritance').WithPrivates;

var TestClass = function (value) {
    "use strict";

    WithPrivates.call(this);
    this.setValue(value);
};
TestClass.prototype = Object.create(WithPrivates.prototype);

WithPrivates.addPrivateMethod(TestClass.prototype, 'capitalize', function (privates, someString) {
    "use strict";

    return someString.toUpperCase();
});

WithPrivates.addPublicMethod(TestClass.prototype, 'setValue', function (privates, value) {
    "use strict";

    return (privates.value = value);
});

WithPrivates.addPublicMethod(TestClass.prototype, 'toString', function (privates) {
    "use strict";

    return privates.capitalize(privates.value);
});

var testWithPrivates = function (test) {
    "use strict";

    var testObject = new TestClass('hello');
    test.equal(testObject.toString(), 'HELLO');
    test.done();

};

module.exports = {
    testWithPrivates : testWithPrivates
};