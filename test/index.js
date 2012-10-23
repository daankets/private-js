/**
 * Created with JetBrains WebStorm.
 * User: daankets
 * Date: 22/10/12
 * Time: 11:18
 * To change this template use File | Settings | File Templates.
 */

// Import the Private class/function
var Private = require('../lib/index').Private;
var PRIVATES_VAR_NAME = '_privates';
var THIS_VAR_NAME = '_this';

// Define a TestClass that inherits from Private.
var TestClass = function (value) {
    "use strict";

    Private.call(this);
    this.setValue(value);
};
TestClass.prototype = Object.create(Private.prototype);

TestClass.prototype.privateMethod('capitalize', function (privates, someString) {
    "use strict";

    return someString.toUpperCase();
});

TestClass.prototype.setValue = Private.hasAccess(function (privates, value) {
    "use strict";

    return (privates.value = value);
});

TestClass.prototype.toString = Private.hasAccess(function (privates) {
    "use strict";

    return privates.capitalize(privates.value);
});

var testPrivateFunction = function (test) {
    "use strict";

    var object = {};
    object[PRIVATES_VAR_NAME] = "test";

    test.equals(Private(object), "test");
    test.done();
};

var testPrivateConstructor = function (test) {
    "use strict";

    var testObject = new Private();
    test.ok(Private(testObject)[THIS_VAR_NAME] === testObject);
    test.done();
};

var testPrivateConstructorExtension = function (test) {
    "use strict";

    var testObject = new TestClass('test');
    test.ok(Private(testObject)[THIS_VAR_NAME] === testObject);
    //test.ok(Private(testObject)['value'] === 'test');
    test.done();
};

var testPrivateVariable = function (test) {
    "use strict";

    var testObject = new Private();
    Private(testObject).value = 'test';
    test.ok(Private(testObject)['value'] === 'test');
    test.done();
};

var testPublicMethod = function (test) {
    "use strict";

    var MyClass = function () {
        Private.call(this);
        Private(this).value = 'test';
    };
    MyClass.prototype = Object.create(Private.prototype);
    MyClass.prototype.getValue = Private.hasAccess(function (privates) {
        return privates.value;
    });
    test.equal(new MyClass().getValue(), 'test');
    test.done();

};

var testPrivateMethod = function (test) {
    "use strict";

    var MyClass = function () {
        Private.call(this);
        Private(this).setValue('test');
    };
    MyClass.prototype = Object.create(Private.prototype);
    MyClass.prototype.privateMethod('setValue', function (privates, value) {
        privates.value = value;
    });
    test.equal(Private(new MyClass()).value, 'test');
    test.done();
};

var testEnable = function (test) {
    "use strict";

    var myObject, MyClass = function () {
        Private.enable(this);
    };
    Private.enable(MyClass.prototype);

    test.ok(Private(MyClass.prototype)[THIS_VAR_NAME] === MyClass.prototype);

    myObject = new MyClass();
    test.equal(Private(myObject)[THIS_VAR_NAME], myObject);
    test.done();
};

module.exports = {
    testPrivateFunction : testPrivateFunction,
    testPrivateConstructor : testPrivateConstructor,
    testPrivateConstructorExtension : testPrivateConstructorExtension,
    testPrivateVariable : testPrivateVariable,
    testPublicMethod : testPublicMethod,
    testPrivateMethod : testPrivateMethod,
    testEnable : testEnable
};