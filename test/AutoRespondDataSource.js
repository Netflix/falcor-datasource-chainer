var Subscribable = require('./../src/Subscribable');
var AutoRespondDataSource = function AutoRespondDataSource(data, options) {
    this._options = options || {};
    this._data = data;
};

AutoRespondDataSource.prototype.get = function get(paths) {
    var options = this._options;
    var data = this._data;
    return new Subscribable(function getSubscribe(observer) {
        if (options.onGet) {
            options.onGet(paths);
        }

        if (options.wait) {
            setTimeout(respond, options.wait);
        } else {
            respond();
        }

        function respond() {
            if (options.onError) {
                if (options.onNext) {
                    observer.onNext(data);
                }
                observer.onError(options.error);
            }

            else {
                onNext();
            }
        }

        function onNext() {
            observer.onNext(data);
            observer.onCompleted();
        }
    });
};

module.exports = AutoRespondDataSource;
