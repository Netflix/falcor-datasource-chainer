var AssignableDisposable = require('./AssignableDisposable');
var EMPTY_DISPOSABLE = {dispose: function empty() {}};
var mergeJSONGraphEnvelopes = require('./cache/mergeJSONGraphEnvelopes');
var pathUtils = require('falcor-path-utils');
var optimizePathSets = pathUtils.optimizePathSets;
var collapse = pathUtils.collapse;
var MAX_REFERENCES_TO_FOLLOW = 10;

/**
 * Performs the requesting of the data from each dataSource until exhausted
 * or completed.
 * @private
 */
// TODO: Clean up this function as its very large.
module.exports = function getRequestCycle(sources, sourceIndex,
                                          remainingPathsArg, seed,
                                          observer, disposable) {

    var currentSource = sources[sourceIndex];
    var remainingPaths = remainingPathsArg;
    disposable = disposable || new AssignableDisposable();

    // If the source index is greater than 1 then we need to attempt to
    // optimize / reduce missing paths with our already formulated seed.
    if (sourceIndex > 1 && remainingPaths && remainingPaths.length) {
        remainingPaths = optimizePathSets(seed.jsonGraph, remainingPaths,
                                          MAX_REFERENCES_TO_FOLLOW);
        if (remainingPaths.length) {
            remainingPaths = collapse(remainingPaths);
        }
    }

    // Sources have been exhausted, time to finish
    if (!currentSource || !remainingPaths || remainingPaths.length === 0) {
        seed.unhandledPaths = remainingPaths;
        observer.onNext(seed);
        observer.onCompleted();
        disposable.currentDisposable = EMPTY_DISPOSABLE;
        return disposable;
    }

    // Request from the current source.
    var jsonGraphFromSource;
    disposable.currentDisposable = currentSource.
        get(remainingPaths).
        subscribe(function onNext(jsonGraphEnvelop) {
            jsonGraphFromSource = jsonGraphEnvelop;
        }, function onError(dataSourceError) {
            // Exit condition.
            if (disposable.disposed) {
                return;
            }

            // TODO: If there has been an error what do we do?
            // Are all paths considered 'unhandledPaths?'  Its not really
            // the case.
            observer.onError(dataSourceError);
        }, function onCompleted() {
            // Exit condition.
            if (disposable.disposed) {
                return;
            }

            // We need to merge the results into our seed, if the source
            // is the second or later source.
            if (sourceIndex === 0) {
                seed = {
                    jsonGraph: jsonGraphFromSource.jsonGraph
                };
            }

            else {
                mergeJSONGraphEnvelopes(seed, jsonGraphFromSource);
            }

            // are there unhandledPaths?
            var unhandledPaths = jsonGraphFromSource.unhandledPaths;
            if (unhandledPaths && unhandledPaths.length) {

                // Async Request Recursion.
                getRequestCycle(sources, sourceIndex + 1, unhandledPaths, seed,
                                observer, disposable);
            }

            // We have finished here.
            else {
                observer.onNext(seed);
                observer.onCompleted();
            }
        });


    return disposable;
};
