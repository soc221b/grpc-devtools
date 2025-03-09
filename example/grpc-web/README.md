# gRPC Web Example

Run the example:

1. Run the gRPC server:

   ```shell
   cd server
   npm ci
   npm run dev
   ```

2. Run the Envoy proxy:

   ```shell
   cd server
   envoy -c envoy.yaml
   ```

3. Run the gRPC client:

   ```shell
   cd client
   npm ci
   npm run dev
   ```

When these are all ready, you can open a browser tab and navigate to:

```
localhost:8080
```
