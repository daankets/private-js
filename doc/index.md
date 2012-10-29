Private.JS documentation
------------------------

The Private function/class
--------------------------

The '**Private**' function exposed by the library acts both as a constructor and a classic function.

The **constructor** style is used for creating a new object **instance** with private members, or as a **base class** for
defining new classes with private member support.

You do NOT necessarily need to extend though, you may just 'enable' a prototype or object with private support as well.

- **Instance:** `var objectWithPrivates = new Private();`
- **Extension:**

        var MyClass = function(){
            Private.call(this);
        };
        MyClass.prototype = Object.create(Private.prototype);
        var myObject = new MyClass();

- **Enable:**

        var MyClass = function(){
            Private.enable(this);
        };
        Private.enable(MyClass.prototype);

The **function** style is used for retrieving the private members object for an instance (or prototype). This function is
used internally for injection as well:

Note that if you use **Private.enable**, you _SHOULD_ apply this method to the prototype and you **MUST** apply this
method to the object (preferably within or the object constructor).

- **Function:** `var privates = Private(this); // Store a reference to the privates into 'privates'`

How does it work?
-----------------

The **Private(**object**)** function actually retrieves a hidden member of the object or prototype, that was defined by
the prototype of the Private class. This object is not visible in most debuggers and IDE's due to the use of an
_(underscore) in the name, and due to the fact that is declared using the **\['squareBracket']** notation.

The variable used is called **_privates**. So, in fact, all prototypes and instances using _Private_ have a hidden
member _privates.

In order to be able to use this in a clean way, the API hides the actual implementation from the developer, and uses the
Private(...) function to access the _privates object.

Extending
---------

The **preferred** way of using this library is by extending a class:

    var MyClass = function(){
        Private.call(this); // Call the super constructor.
    };
    MyClass.prototype = Object.create(Private.prototype); // Extend the prototype of Private

The advantage is that upon construction, the _privates object of your instance is automatically provisioned with a
property '_this': `this._privates._this = this;`

This property is used by the injection mechanism for private methods in order to be able to swap the 'this' argument
from the reference to _privates to the reference of the owning instance.

You may also pass initialisation values to the super constructor. The attributes of the passed object will be copied to the privates of the new instance:

    var MyClass = function(){
        Private.call(this,{name:'Some name', value: 4}); // Call the super constructor, and pass initial privates.
    };
    MyClass.prototype = Object.create(Private.prototype); // Extend the prototype of Private

This way, you do **not** have to call `Private(this).name = 'Some name'` and `Private(this).value = 4;` manually.

Enabling
--------

Sometimes, it may be more convenient if you just 'enable' a class:

    var MyClass = function(){
        Private.enable(this);
    };
    Private.enable(MyClass.prototype);

Or just a single instance:

    var myObject = {};
    Private.enable(myObject);
    // --> (Private(myObject) === myObject._privates) && (Private(myObject)._self === myObject)

This may prove to be convenient for enabling singletons that are otherwise defined.

Public methods
--------------

In order to make it easy to declare public methods, that do not have to use '**Private(**this**)**' all over, the Private class
exposes a static function '**hasAccess(**function**)**' that will wrap a function with the necessary code for injecting the
_privates member upon invocation as the first parameter:

    // Declare MyClass, which extends Private.
    var MyClass = function(somePrivateValue){
        Private.call(this);
        Private(this).somePrivateProperty = somePrivateValue;
    };
    MyClass.prototype = Object.create(Private.prototype);

    MyClass.prototype.getSomeProperty = Private.hasAccess(function(privates){
        return privates.someProperty;
    };

    var myInstance = new MyClass(2);
    console.log(myInstance.getSomeProperty());

As you can see in the example above, there is no need to pass on the _privates when invoking the public function.
Neither does the function have to use **Private(this).someProperty**. This is because the 'privates' parameter is injected
upon invocation by the function returned by **Private.hasAccess(...)**.

Private methods
---------------

In order to make it possible to create private methods, the Private class has a '**privateMethod(name, function)**'
function on its prototype. This method is inherited by the prototype of each sub class (and by each instance).
You can use this function in order to create private methods.

If we extend the example from above:

    // Declare MyClass, which extends Private.
        var MyClass = function(somePrivateValue){
            Private.call(this);
            Private(this).setSomeProperty(somePrivateValue);
        };
        MyClass.prototype = Object.create(Private.prototype);

        MyClass.prototype.getSomeProperty = Private.hasAccess(function(privates){
            return privates.someProperty;
        };

        MyClass.prototype.privateMethod('setSomeProperty',function(privates, value){
            privates.someProperty = value;
        });

        var myInstance = new MyClass(2);
        console.log(myInstance.getSomeProperty());