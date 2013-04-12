backbone-delegating-router
==========================

Router with ability to specify a delegate object

Forked from a gist here: [stephenhandley](https://gist.github.com/stephenhandley/2251058)

```javascript
function Delegate(routes) {
  this.router = new DelegatingRouter({
    delegate: this,
    routes: routes
  });
}

Delegate.prototype.barf = function(something) { console.log(["barf", something]); };
Delegate.prototype.barfed = function(one, two) { console.log(["barfed", one, two]) };
Delegate.prototype.index = function() { console.log("index"); };

new Delegate({
  "barf/:something": "barf",
  "barfed/:one/:two": "barfed",
  "": "index"
});
```