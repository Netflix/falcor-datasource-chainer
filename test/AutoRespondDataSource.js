var Subscribable = require('./../src/Subscribable');
var AutoRespondDataSource = function AutoRespondDataSource(data, options) {
    this._options = options || {};
    this._data = data;
};

AutoRespondDataSource.prototype.get = function get() {
    var self = this;
    var options = self._options;
    return new Subscribable(function getSubscribe(observer) {
        if (options.wait) {
            setTimeout(respond, options.wait);
        } else {
            respond();
        }

        function respond() {
            onNext(self._data);
        }

        function onNext(data) {
            observer.onNext(data);
            observer.onCompleted();
        }

        function onError(e) {
            observer.onError(e);
        }
    });
};

module.exports = AutoRespondDataSource;
