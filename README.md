
## Generate Protobuf Messages and Client Service Stub

To generate the protobuf messages and client service stub class from your
`.proto` definitions, we need:
 - the `protoc` binary, _and_
 - the `protoc-gen-grpc-web` plugin.

> You can download the `protoc-gen-grpc-web` protoc plugin from our
> [release](https://github.com/grpc/grpc-web/releases) page.
>
> If you don't already have `protoc` installed, you will have to download it
> first from [here](https://github.com/protocolbuffers/protobuf/releases).
>
> Make sure they are both executable and are discoverable from your PATH.
>
> For example, in MacOS, you can do:
>
> ```sh
> $ sudo mv ~/Downloads/protoc-gen-grpc-web-1.4.2-darwin-x86_64 \
>   /usr/local/bin/protoc-gen-grpc-web
> $ sudo chmod +x /usr/local/bin/protoc-gen-grpc-web
> ```


When you have both `protoc` and `protoc-gen-grpc-web` installed, you can now
run this command:

```sh
$ protoc -I=. echo.proto \
  --js_out=import_style=commonjs:. \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:.
```

After the command runs successfully, you should now see two new files generated
in the current directory:

 - `helloworld_pb.js`: this contains the `HelloRequest` and `HelloReply`
   classes
 - `helloworld_grpc_web_pb.js`: this contains the `GreeterClient` class

These are also the 2 files that our `client.js` file imported earlier in the
example.

## Compile the Client JavaScript Code

Next, we need to compile the client side JavaScript code into something that
can be consumed by the browser.

```sh
$ npm install
$ npx webpack client.js
```

Here we use `webpack` and give it an entry point `client.js`. You can also use
`browserify` or other similar tools. This will resolve all the `require()`
statements and produce a `./dist/main.js` file that can be embedded in our
`index.html` file.

## Run the Example!

We are ready to run the Hello World example. The following set of commands will
run the 3 processes all in the background.

 1. Run the NodeJS gRPC Service. This listens at port `:9090`.

 ```sh
 $ node server.js &
 ```

 2. Run the Envoy proxy. The `envoy.yaml` file configures Envoy to listen to
 browser requests at port `:8080`, and forward them to port `:9090` (see
 above).

 ```sh
 $ docker run -d -v "$(pwd)"/envoy.yaml:/etc/envoy/envoy.yaml:ro \
     --network=host envoyproxy/envoy:v1.22.0
 ```

> NOTE: As per [this issue](https://github.com/grpc/grpc-web/issues/436):
> if you are running Docker on Mac/Windows, remove the `--network=host` option:
>
> ```sh
> $ docker run -d -v "$(pwd)"/envoy.yaml:/etc/envoy/envoy.yaml:ro \
>     -p 8080:8080 -p 9901:9901 envoyproxy/envoy:v1.22.0
>  ```

 3. Run the simple Web Server. This hosts the static file `index.html` and
 `dist/main.js` we generated earlier.

 ```sh
 $ python3 -m http.server 8081 &
 ```

When these are all ready, you can open a browser tab and navigate to

```
localhost:8081
```

Open up the developer console and you should see the following printed out:

```
Hello! World
```
