# gRPC-Web Echo Server

This project implements a simple gRPC-Web echo server for generating requests / responses
in gRPC-Web format. The `grpc-web+proto` and `grpc-web+text` formats are supported, with
unitary and streaming responses.

This implementation closely follows the hello world guide example from the official
repository (see https://github.com/grpc/grpc-web/tree/master/net/grpc/gateway/examples/helloworld).

## Project Structure

### Service Definition
The gRPC service is defined using protobuf buffers, which are defined in
`echo.proto`.

### Service Implementation

The server-side gRPC service is defined in `server.js`.

### Proxy Configuration

The configuration for the Envoy proxy is defined in `envoy.xml`. This
proxy translates gRPC-Web requests/responses to gRPC requests / responses (andd vice-versa).

### Client Code

The client-side code is implemented in `client.js`. This NodeJS code is packaged
using webpack and then loaded in the `index.html` file.

## Running the Echo Server

### Generate Protobuf Messages and Client Service Stubs

The following software must be installed:
* `protoc` binary
* `protoc-gen-grpc-web` plugin

You can either generate gRPC or gRPC-Web messages.

#### Generate gRPC-Web messages
```bash
protoc -I=. helloworld.proto   --js_out=import_style=commonjs:.   --grpc-web_out=import_style=commonjs,mode=grpcwebtext:.
```

#### Generate gRPC messages
```bash
protoc -I=. helloworld.proto   --js_out=import_style=commonjs:.   --grpc-web_out=import_style=commonjs,mode=grpcwebproto:.
```

### Comppile Client JavaScript Code

Install dependencies (only needed once):
```bash
npm install
```

Package client code using webpack:
```bash
npx webpack ./client.js
```

### Run the Application

Run the NodeJS gRPC service (on port `9090`):
```bash
node server.js &
```

Run the Envoy proxy (listens on port `8080` and forwards all traffic to port `9090`):
```bash
docker run -d -v "$(pwd)"/envoy.yaml:/etc/envoy/envoy.yaml:ro --network=host envoyproxy/envoy:v1.22.0
```

Run an HTTP server to serve the client code:
```bash
python3 -m http.server 8081 &
```

The application can now be accessed at http://localhost:8081.
