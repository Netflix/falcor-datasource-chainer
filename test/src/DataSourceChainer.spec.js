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
                    paths: [],
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
            },
            paths: [['hello', 'world']]
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
                    },
                    paths: [['hello', 'world']]
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
            },
            paths: [['hello', 'world']]
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
                    },
                    paths: [['hello', 'world']]
                });
            }).
            subscribe(noOp, done, done);
    });
});
