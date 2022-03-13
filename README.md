# stellar-auth
Stellar authentication framework

## Configuration
```javascript
const CONDITIONS = {
    operator: "and",
    assets: [
        {
            code: "XLM",
            minAmount: 1
        },
        {
            code: "NFT1",
            issuer: "GC3SEQHDRFTUORPEQ5EDCKKULKBOVFZ37TYIJYU7IWKJVSN7DCDQTEIO",
            minAmount: 0.0000001
        },

        {
            operator: "or",
            assets: [

                {
                    code: "NFT2",
                    issuer: "GC3SEQHDRFTUORPEQ5EDCKKULKBOVFZ37TYIJYU7IWKJVSN7DCDQTEIO",
                    minAmount: 0.0000001
                },
                {
                    code: "NFT3",
                    issuer: "GC3SEQHDRFTUORPEQ5EDCKKULKBOVFZ37TYIJYU7IWKJVSN7DCDQTEIO",
                    minAmount: 0.0000001
                },
                {
                    code: "NFT4",
                    issuer: "GC3SEQHDRFTUORPEQ5EDCKKULKBOVFZ37TYIJYU7IWKJVSN7DCDQTEIO",
                    minAmount: 0.0000001
                },
                {
                    code: "NFT5",
                    issuer: "GC3SEQHDRFTUORPEQ5EDCKKULKBOVFZ37TYIJYU7IWKJVSN7DCDQTEIO",
                    minAmount: 0.0000001
                },
            ]
        }
    ]
}
```

This conditions are met if the account owns:
1 XLM and 1 stroop NFT1 and (1 stroop NFT2 or 1 stroop NFT3 1 stroop NFT4 1 stroop NFT5)

## Usage

```javascript

const StellarSdk = require("stellar-sdk")
const stellarAuthorize = require('./module/stellar-authorize.js')

const SERVER = new StellarSdk.Server("https://horizon-testnet.stellar.org")
var account = await SERVER.loadAccount(pk);

stellarAuthorize(account, CONDITIONS); // return true if the CONDITIONS apply, false otherwise
```
