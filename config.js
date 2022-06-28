import * as fcl from "@onflow/fcl";

const USE_LOCAL = true;
const resolver = async () => ({
  appIdentifier: "Awesome App (v0.0)",
  nonce: "3037366134636339643564623330316636626239323161663465346131393662",
});

// prettier-ignore
fcl.config()
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://placekitten.com/g/200/200")
  .put("service.OpenID.scopes", "email")
  .put("fcl.limit", 10)
if (USE_LOCAL) {
  // prettier-ignore
  fcl
    .config()
    .put("flow.network", "local")
    .put("debug.accounts", true)
    .put("logger.level", 2)
    .put("accessNode.api", "http://localhost:8888")
    .put("discovery.wallet", "http://localhost:8701/fcl/authn")
    .put("fcl.accountProof.resolver", resolver)
} else {
  // prettier-ignore
  fcl
    .config()
    .put("debug.accounts", true)
    .put("logger.level", 2)
    .put("fcl.accountProof.resolver", resolver)
    // testnet
    .put("flow.network", "testnet")
    .put("accessNode.api", "https://rest-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  //.put("sdk.transport", transportGRPC)
  // mainnet
  //.put("env", "mainnet")
  //.put("discovery.wallet", "https://fcl-discovery.onflow.org/authn")
  //.put("accessNode.api", "https://rest-mainnet.onflow.org")
  // Discovery API
  //.put("discovery.authn.include", ["0x9d2e44203cb13051"])
  //.put("discovery.authn.endpoint", "https://fcl-discovery.onflow.org/api/testnet/authn")
}
