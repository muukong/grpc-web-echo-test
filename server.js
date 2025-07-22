
var PROTO_PATH = __dirname + '/echo.proto';

var assert = require('assert');
var async = require('async');
var _ = require('lodash');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var echo = protoDescriptor.echo;

function doEcho(call, callback) {
    callback(null, { request: call.request });
}

function doEchoStream(call) {
    var senders = [];
    function sender(requestMessage) {

        return (callback) => {

            call.write({
                request: requestMessage.payload
            });
            _.delay(callback, 500); // in ms
        };
    }

    for (var i = 0; i < call.request.count; i++) {
        // senders[i] = sender(call.request.name + i);
        senders[i] = sender(call.request);
    }

    async.series(senders, () => {
        call.end();
    });
}

function getServer() {

    var server = new grpc.Server();

    server.addService(echo.EchoService.service, {
        echo: doEcho,
        echoStream: doEchoStream,
        // doEcho: doEcho,
    });

    return server;
}

if (require.main === module) {
    var server = getServer();
    server.bindAsync(
        '0.0.0.0:9090', grpc.ServerCredentials.createInsecure(), (err, port) => {
            assert.ifError(err);
            server.start();
        });
}

exports.getServer = getServer;
