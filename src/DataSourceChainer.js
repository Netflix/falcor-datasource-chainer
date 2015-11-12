var Subscribable = require('./Subscribable');
var AssignableDisposable = require('./AssignableDisposable');
var EMPTY_ARRAY = [];

/**
 * DataSourceChainer takes in a list of dataSources and calls them one at a time
 * until the get/set/call operation has been satisified.  If the list of sources
 * have been exhausted, then the source will either emit the JSONGraphEnvelope
 * with unhandledPaths key or forward on 'function does not exist' error (call
 * only).
 *
 * The order of dataSource calling is list ordering. The interface can be found
 * here: http://netflix.github.io/falcor/doc/DataSource.html
 *
 * @param {Array.<DataSource>} sources - The list of sources to call.
 * @public
 */
var DataSourceChainer = function DataSourceChainer(sources) {
    // It makes the code easy to default to an empty array.
    this._sources = sources || EMPTY_ARRAY;
};

DataSourceChainer.prototype = {
    get: function get(paths) {
        var self = this;
        return new Subscribable(function(observer) {
            var seed = {};

            // Performs the internal get request loop.
            return self._getRequestCycle(self, self._sources, 0,
                                         paths, seed, observer);
        });
    },
    set: function set(jsonGraph) {
    },
    call: function call(callPath, arguments, suffixes, paths) {
    },

    /**
     * Performs the requesting of the data from each dataSource until exhausted
     * or completed.
     * @private
     */
    _getRequestCycle: function _getRequestCycle(sourceChainer, sources,
                                                sourceIndex, remainingPaths,
                                                seed, observer, disposable) {
        var currentSource = sources[sourceIndex];
        disposable = disposable || new AssignableDisposable();

        // Sources have been exhausted, time to finish
        if (!currentSource) {
            seed.unhandledPaths = remainingPaths;
            observer.onNext(seed);
            observer.onCompleted();
            return;
        }

        return disposable;
    }
};
