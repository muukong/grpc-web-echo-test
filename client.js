
const {EchoRequest, EchoRequestStream, EchoReply} = require('./echo_pb.js');
const {EchoServiceClient} = require('./echo_grpc_web_pb.js');

var client = new EchoServiceClient('http://' + window.location.hostname + ':8080', null, null);

// Send unary message
window.sendMessage1 = function() {

  var request = new EchoRequest();
  request.setPayload('Le Test 1337');

  client.echo(request, {}, (err, response) => {
    if (err) {
      console.log(`Unexpected error for sayHello: code = ${err.code}` + `, message = "${err.message}"`);
    } else {
      console.log(response.getRequest());
    }
  });

}

// Send message with stream response
window.sendMessage1Streaming = function() {

  var streamRequest = new EchoRequestStream();
  streamRequest.setPayload('Le Test 1337');
  streamRequest.setCount(5);

  var stream = client.echoStream(streamRequest, {});

  stream.on('data', (response) => {
    console.log(response.getRequest);
  });

  stream.on('error', (err) => {
    console.log(`Unexpected stream error: code = ${err.code}` + `, message = "${err.message}"`);
  });

}
