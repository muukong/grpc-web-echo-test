
const {EchoRequest, EchoRequestStream, EchoReply, SubMessage1, SubMessage2} = require('./echo_pb.js');
const {EchoServiceClient} = require('./echo_grpc_web_pb.js');

var client = new EchoServiceClient('http://' + window.location.hostname + ':8888', null, null);

var subMessage1 = new SubMessage1();
subMessage1.setA('Hello from sub message 1');

var subMessage2 = new SubMessage2();
subMessage2.setA(1337);

var request1 = new EchoRequest();
request1.setA('hello');
request1.setB(subMessage1);
request1.setC(subMessage2);

// Send unary message
window.sendMessage1 = function() {

  // var tmp = client.echo(request1, {});
  //
  // tmp.on('data', (response) => {
  //   console.log(response);
  // });


  const call = client.echo(request1, {}, (err, response) => {
    if (err) {
      console.log(`Unexpected error for sayHello: code = ${err.code}` + `, message = "${err.message}"`);
    } else {
      console.log('Response data:');
      console.log(response);
    }
  });

  call.on('status', (response) => { // Trailing HTTP readers in response
    console.log("Trailing Headers in Response:");
    console.log(response);
  });

  call.on('metadata', (response) => {
    console.log("Trailing Headers in Request:");
    console.log(response);
  });
}

// Send message with stream response
window.sendMessage1Streaming = function() {

  var streamRequest = new EchoRequestStream();
  streamRequest.setPayload(request1);
  streamRequest.setCount(5);

  var stream = client.echoStream(streamRequest, {});

  stream.on('data', (response) => {
    console.log(response);
  });

  stream.on('metadata', (response) => {
    console.log("Trailing Headers in Request:");
    console.log(response);
  });

  stream.on('status', (response) => { // Trailing HTTP readers in response
    console.log("Trailing Headers in Response:");
    console.log(response);
  });

  stream.on('error', (err) => {
    console.log(`Unexpected stream error: code = ${err.code}` + `, message = "${err.message}"`);
  });

}
