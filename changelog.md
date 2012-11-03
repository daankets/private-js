Private.JS change log
=====================

1.0.5 -> 1.0.6
--------------
- **2012-11-03 - Bug fix:** prevents the accidental invalid re-use of the privates instance of the Private prototype by subclasses.
1.0.4 -> 1.0.5
--------------

- **2012-11-02 - Bug fix:** prevent sharing of the privates instance between prototypes. Instead, use the inherited prototypes' privates instance as the prototype for the object instance.

1.0.3 -> 1.0.4
--------------

- **2012-10-29 - Feature:** Support for initializing multiple private values upon construction time, or using the **Private.enable** method.
    - **At construction:** `new Private({hello:'world'});`,
    - **or when using a subclass:** `Private.call(this, {hello: 'world'});`,
    - **or using enable:** `Private.enable({}, {hello: 'world'});`