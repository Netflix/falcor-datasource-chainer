var AssignableDisposable = require('./AssignableDisposable');
var EMPTY_DISPOSABLE = {dispose: function empty() {}};
var mergeJSONGraphEnvelopes = require('./cache/mergeJSONGraphEnvelopes');

/**
 * Performs the requesting of the data from each dataSource until exhausted
 * or completed.
 * @private
 */
// TODO: Clean up this function as its very large.
module.exports = function getRequestCycle(sources, sourceIndex, remainingPaths,
                                          seed, observer, disposable) {

    var currentSource = sources[sourceIndex];
    disposable = disposable || new AssignableDisposable();

    // Sources have been exhausted, time to finish
    if (!currentSource || !remainingPaths || remainingPaths.length === 0) {
        seed.unhandledPaths = remainingPaths;
        observer.onNext(seed);
        observer.onCompleted();
        disposable.currentDisposable = EMPTY_DISPOSABLE;
        return disposable;
    }

    // we have a current source so we need to attempt to fulfill the
    // remaining paths.

    // If the source index is greater than 1 then we need to attempt to
    // optimize / reduce missing paths with our already formulated seed.
    if (sourceIndex > 1) {
        // TODO: optimize / reduce
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
            if (jsonGraphFromSource.unhandledPaths &&
                jsonGraphFromSource.unhandledPaths.length) {

                // Async Request Recursion.
                getRequestCycle(sources, sourceIndex + 1, remainingPaths, seed,
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
