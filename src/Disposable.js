var Disposable = module.exports = function Disposable() {
    this.disposed = false;
};

Disposable.prototype.dispose = function dispose() {
    this.disposed = true;
};
