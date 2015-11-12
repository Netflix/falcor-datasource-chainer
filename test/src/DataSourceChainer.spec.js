var DataSourceChainer = require('./../../src/DataSourceChainer');
var sinon = require('sinon');
var toObservable = require('./../toObservable');
var noOp = function noOp() {};
var expect = require('chai').expect;

describe('DataSourceChainer', function() {
    it('should be able to construct an empty chainer and make get requests.', function(done) {
        var source = new DataSourceChainer();
        var onNext = sinon.spy();
        toObservable(source.
            get([['paths']])).
            doAction(onNext, noOp, function() {
                expect(onNext.calledOnce).to.be.ok;
                expect(onNext.getCall(0).args[0]).to.deep.equals({
                    jsonGraph: {},
                    paths: [],
                    unhandledPaths: [
                        ['paths']
                    ]
                });
            }).
            subscribe(noOp, done, done);

    });
});
