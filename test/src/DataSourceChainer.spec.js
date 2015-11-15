var DataSourceChainer = require('./../../src/DataSourceChainer');
var sinon = require('sinon');
var toObservable = require('./../toObservable');
var noOp = function noOp() {};
var expect = require('chai').expect;
var AutoRespondDataSource = require('./../AutoRespondDataSource');

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
                    unhandledPaths: [
                        ['paths']
                    ]
                });
            }).
            subscribe(noOp, done, done);

    });

    it('should be ok with happy case DataSource where the first DataSource fills all data (sync).', function(done) {
        var innerSource = new AutoRespondDataSource({
            jsonGraph: {
                hello: {
                    world: 'foo bar'
                }
            }
        });
        var source = new DataSourceChainer([innerSource]);
        var onNext = sinon.spy();
        toObservable(source.
            get([['hello', 'world']])).
            doAction(onNext, noOp, function() {
                expect(onNext.calledOnce).to.be.ok;
                expect(onNext.getCall(0).args[0]).to.deep.equals({
                    jsonGraph: {
                        hello: {
                            world: 'foo bar'
                        }
                    }
                });
            }).
            subscribe(noOp, done, done);
    });

    it('should be ok with happy case DataSource where the first DataSource fills all data (async).', function(done) {
        var innerSource = new AutoRespondDataSource({
            jsonGraph: {
                hello: {
                    world: 'foo bar'
                }
            }
        }, {wait: 100});
        var source = new DataSourceChainer([innerSource]);
        var onNext = sinon.spy();
        toObservable(source.
            get([['hello', 'world']])).
            doAction(onNext, noOp, function() {
                expect(onNext.calledOnce).to.be.ok;
                expect(onNext.getCall(0).args[0]).to.deep.equals({
                    jsonGraph: {
                        hello: {
                            world: 'foo bar'
                        }
                    }
                });
            }).
            subscribe(noOp, done, done);
    });

    it('should merge in two requests into a single jsonGraphResponse.', function(done) {
        var partial1 = new AutoRespondDataSource({
            jsonGraph: {
                hello: {
                    world: 'foo'
                }
            },
            unhandledPaths: [['hello', 'foo']]
        }, {wait: 100});
        var partial2 = new AutoRespondDataSource({
            jsonGraph: {
                hello: {
                    foo: 'bar'
                }
            }
        }, {wait: 100});

        var source = new DataSourceChainer([partial1, partial2]);
        var onNext = sinon.spy();
        toObservable(source.
            get([['hello', ['world', 'foo']]])).
            doAction(onNext, noOp, function() {
                expect(onNext.calledOnce).to.be.ok;
                expect(onNext.getCall(0).args[0]).to.deep.equals({
                    jsonGraph: {
                        hello: {
                            world: 'foo',
                            foo: 'bar'
                        }
                    }
                });
            }).
            subscribe(noOp, done, done);
    });
});
