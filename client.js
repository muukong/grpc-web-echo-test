
const {EchoRequest, EchoReply} = require('./echo_pb.js');
const {EchoServiceClient} = require('./echo_grpc_web_pb.js');

var client = new EchoServiceClient('http://' + window.location.hostname + ':8080', null, null);


window.sendMessage1 = function() {

// simple unary call
  var request = new EchoRequest();
  request.setPayload('Hello');

  client.echo(request, {}, (err, response) => {
    if (err) {
      // console.log(`Unexpected error for sayHello: code = ${err.code}` +
      //     `, message = "${err.message}"`);
    } else {
      // console.log(response.getMessage());
    }
  });


}

// server streaming call
/*
var streamRequest = new RepeatHelloRequest();
streamRequest.setName('World');
streamRequest.setCount(5);

var stream = client.sayRepeatHello(streamRequest, {});
stream.on('data', (response) => {
  console.log(response.getMessage());
});
stream.on('error', (err) => {
  console.log(`Unexpected stream error: code = ${err.code}` +
              `, message = "${err.message}"`);
});
 */
