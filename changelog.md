Private.JS change log
=====================

1.0.3 -> 1.0.4
--------------

- **2012-10-29** Support for initializing multiple private values upon construction time, or using the **Private.enable** method.
    - **At construction:** `new Private({hello:'world'});`,
    - **or when using a subclass:** `Private.call(this, {hello: 'world'});`,
    - **or using enable:** `Private.enable({}, {hello: 'world'});`