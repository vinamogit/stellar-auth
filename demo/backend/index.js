const StellarSdk = require("stellar-sdk")
const express = require('express')
const StellarAuthorize = require('../../module/stellar-authorize.js')


const app = express()
const port = 8123

const FILTER = {

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
};

var authorize = async (pk, network) => {

    try {

        const HORIZON = network == "PUBLIC" ? "https://horizon.stellar.org" : "https://horizon-testnet.stellar.org";

        const SERVER = new StellarSdk.Server(HORIZON);
        var account = await SERVER.loadAccount(pk);
        // console.log(account)

        return StellarAuthorize(account, FILTER);
    } catch (err) {
        console.error(err);

        return false;
    }
}

app.get('/authorize', async (req, res) => {
    var pk = req.query.pk;
    var auth = false;
    try {


        auth = await authorize(pk, "TEST");

    } catch (err) {

        console.error(err)

    } finally {

        res.send('{ "authorized": ' + auth + ', "account": "' + pk + '"}')
    }
})

app.get('/bootstrap', async (req, res) => {
    var code = req.query.code;
    var pk = req.query.pk;
    var success = false;
    try {

        if (["NFT1", "NFT2", "NFT3", "NFT4", "NFT5"].includes(code)) {

            var asset = new StellarSdk.Asset(code, "GC3SEQHDRFTUORPEQ5EDCKKULKBOVFZ37TYIJYU7IWKJVSN7DCDQTEIO");

            const HORIZON = "https://horizon-testnet.stellar.org";

            const keys = StellarSdk.Keypair.fromSecret(process.env.SECRET);

            const SERVER = new StellarSdk.Server(HORIZON);
            var account = await SERVER.loadAccount(keys.publicKey());
            console.log(account)
            var transaction = new StellarSdk
                .TransactionBuilder(account,
                    {
                        memo: StellarSdk.Memo.none(),
                        fee: 10000,
                        networkPassphrase: StellarSdk.Networks.TESTNET
                    })

                .addOperation(
                    StellarSdk.Operation.payment(
                        {
                            amount: "0.0000001",
                            asset: asset,
                            destination: pk
                        }
                    )
                )
                .setTimeout(StellarSdk.TimeoutInfinite)
                .build();

            console.log(transaction)

            transaction.sign(keys);


            var result = await SERVER.submitTransaction(transaction);
            if (result && result.successful) {
                success = true;
            }

        }


    } catch (err) {

        console.error(err)

    } finally {

        res.send('{ "success": ' + success + '}')
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

