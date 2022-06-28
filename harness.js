import * as fcl from "@onflow/fcl";

const {
  default: { ec: EC },
} = await import("elliptic");

import { SHA3 } from "sha3";
const ec = new EC("p256");

import "./config.js";

const hashMsgHex = (msgHex) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msgHex, "hex"));
  return sha.digest();
};

function sign(privateKey, msgHex) {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMsgHex(msgHex));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
}

const keyId = 0;
let addr = "0xf8d6e0586b0a20c7";
let privKey =
  "37182571a64a9e6b84967c8cc1dbe5be5f354994bbda23496ff4ed61d0ac84f8";

const authz = (args) => {
  return Promise.resolve({
    ...args,
    addr,
    signingFunction: (signable) => {
      return {
        signature: sign(privKey, signable.message),
        addr,
        keyId: 0,
      };
    },
    keyId,
  });
};

/*fcl
  .mutate({
    cadence: `
  transaction {
    prepare(acct: AuthAccount) {}
  }
  `,
    proposer: authz,
    payer: auth2,
    authorizations: [authz],
    limit: 50,
  })
  .then(console.log);*/

var response = await fcl.send([
  fcl.transaction(`
  transaction {
    prepare(acct: AuthAccount) {}
  }
  `),
  fcl.proposer(authz),
  fcl.payer(authz),
  fcl.authorizations([authz]),
  fcl.limit(9999),
]);
console.log(await fcl.tx(response).onceSealed());

//fcl.block().then(console.log);
/*const stuff = [];
let n = 0;
while (n < 100) {
  const ix = await resolve(
    await build([
      transaction`
  import Events from ${addr}
  transaction {
      prepare(authorizer: AuthAccount) {
        Events.events()
        var a = 0
        while a < 100 {
          Events.events()
            a = a + 1
        }
      }
  }
  `,
      limit(9999),
      proposer(authz(n)),
      authorizations([authz(n)]),
      payer(authz(n)),
    ])
  );

  const { transactionId } = await send(ix);
  console.log("txid", transactionId);
  fcl.tx(transactionId).subscribe(async (status) => {
    console.log(status);
    if (status.status === 4) {
      stuff.push(status.blockId);
      console.log(stuff);
      fcl
        .send([fcl.getTransactionStatus(transactionId)])
        .then((d) => fcl.decode(d))
        .then((d) => console.log("tx stat:", d));
    }
  });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

  n += 1;
}*/

/*const txx = fcl.tx(
  "ca3099d5ad0def8945b0e11dceed7da0214665cbc4f45b9efaa98e3af353dca6"
);

txx.subscribe((data, error) => {
  console.log(error);
});

txx.subscribe(() => {});*/

/*const transactionId = await fcl
  .send([
    fcl.transaction`
    import FungibleToken from 0x9a0766d93b6608b7
    import FlowToken from 0x7e60df042a9c0868
    
    transaction(amount: UFix64, to: Address) {
    
        let sentVault: @FungibleToken.Vault
    
        prepare(signer: AuthAccount) {
    
            let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow reference to the owner''s Vault!")
    
            self.sentVault <- vaultRef.withdraw(amount: amount)
        }
    
        execute {
    
            let receiverRef =  getAccount(to)
                .getCapability(/public/flowTokenReceiver)
                .borrow<&{FungibleToken.Receiver}>()
          ?? panic("Could not borrow receiver reference to the recipient''s Vault")
    
            receiverRef.deposit(from: <-self.sentVault)
        }
    }`,
    fcl.args([
      fcl.arg("1.0", fcl.t.UFix64),
      fcl.arg("0x912d5440f7e3769e", fcl.t.Address),
    ]),
    fcl.proposer(authz),
    fcl.payer(auth2),
    fcl.authorizations([authz, auth2]),
    fcl.limit(100),
  ])
  .then(fcl.decode)
  .then((txId) => {
    console.log(txId);
    fcl
      .tx(txId)
      .onceSealed()
      .then((val) => {
        console.log(val);
      })
      .catch((err) => {
        console.log("e", err);
      });
  });

//fcl.block().then(console.log);

/*
const resp = await fcl.query({
  cadence: `
  pub fun main(test: String): String {
    return test
  }
  `,
  limit: 9999,
  args: (arg, t) => [arg("HEY", t.String)],
});

console.log(resp);*/
