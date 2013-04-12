(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['backbone'], function (Backbone) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.amdWebGlobal = factory(Backbone));
        });
    } else {
        // Browser globals
        root.amdWebGlobal = factory(root.Backbone);
    }
}(this, function (Backbone) {
    // Modified from from Backbone.Router v 0.9.2
    function DelegatingRouter (args) {
        if (!args.delegate) { throw("delegate is required arg to DelegateRouter"); }
        if (!args.routes) { throw("routes is required arg to DelegateRouter"); }     
        Backbone.history || (Backbone.history = new Backbone.History);

        _delegate_routes(this, args.delegate, args.routes);

        if (!Backbone.history.start({pushState: true})) {
          window.location.href = "/404.html";
        }
    }

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var named_param = /:\w+/g;
    var splat_param = /\*\w+/g;
    var escape_rx   = /[-[\]{}()+?.,\\^$|#\s]/g;

    function _str_to_rx(route) {
        route = route.replace(escape_rx, '\\$&')
                     .replace(named_param, '([^\/]+)')
                     .replace(splat_param, '(.*?)');
                   
        return new RegExp('^' + route + '$');
    }

    function _delegate_routes(router, delegate, routes_map) {
        var routes = [];
        for (var route in routes_map) {
          routes.unshift([route, routes_map[route]]);
        }
        for (var i = 0, l = routes.length; i < l; i++) {
          var route = routes[i];
          var route_rx = _str_to_rx(route[0]);
          var route_name = route[1];
          _delegate_route(router, delegate, route_rx, route_name);
        }
    }

    function _delegate_route(router, delegate, route_rx, route_name) {
        var callback = delegate[route_name];

        var route_matcher = function(path) {
          var args = route_rx.exec(path).slice(1);
          callback.apply(delegate, args);
          router.trigger.apply(router, ['route:' + route_name].concat(args));
          Backbone.history.trigger('route', this, route_name, args);
        }

        Backbone.history.route(route_rx, route_matcher);
    }

    _.extend(DelegatingRouter.prototype, Backbone.Events, {
        // Simple proxy to `Backbone.history` to save a fragment into the history.
        navigate: function(fragment, options) {
          Backbone.history.navigate(fragment, options);
        }
    });

    return DelegatingRouter;
}));