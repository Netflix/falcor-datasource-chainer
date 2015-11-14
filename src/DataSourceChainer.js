var getRequestCycle = require('./getRequestCycle');
var Subscribable = require('./Subscribable');
var EMPTY_SOURCES_ARRAY = [];

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
    this._sources = sources || EMPTY_SOURCES_ARRAY;
};

DataSourceChainer.prototype = {
    get: function get(paths) {
        var self = this;
        return new Subscribable(function getSubscribe(observer) {
            var seed = {
                jsonGraph: {},
                paths: []
            };

            // Performs the internal get request loop.
            return getRequestCycle(self._sources, 0,
                                   paths, seed, observer);
        });
    },
    set: function set(jsonGraph) {
    },
    call: function call(callPath, args, suffixes, paths) {
    }
};

module.exports = DataSourceChainer;
