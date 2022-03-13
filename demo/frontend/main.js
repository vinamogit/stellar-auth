import { Freighter } from './freighter.js'
// import { Authorize } from './config.js'

const App = {

    login: async () => {
        var hasFreighter = await Freighter.isConnected();
        if (hasFreighter) {
            var pk = await Freighter.getPublicKey();
            console.log(pk)

            var network = await Freighter.getNetwork();
            var transaction = App.transactionToSign(pk, network);
            try {

                var signedXdr = await Freighter.sign(transaction.toXDR(), network);

                var netpass = network == "PUBLIC" ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET;
                var signedTransaction = await StellarSdk.TransactionBuilder.fromXDR(signedXdr, netpass);
                var verif = await StellarSdk.Utils.verifyTxSignedBy(signedTransaction, pk)

                if (verif) {
                    console.log("Signature confirmed")

                    const HORIZON = network == "PUBLIC" ? "https://horizon.stellar.org" : "https://horizon-testnet.stellar.org";

                    const SERVER = new StellarSdk.Server(HORIZON);


                    var info = document.getElementById('info')

                    // console.log("https://untitled-ti0dtw2ftzkd.runkit.sh/authorize?pk=" + pk)
                    var response = await fetch("https://untitled-ti0dtw2ftzkd.runkit.sh/authorize?pk=" + pk)
                    var data = await response.json();
                    console.log(data)
                    if (data.authorized) {
                        info.innerHTML = data.account + " is authorized";
                    } else {
                        info.innerHTML = data.account + " is not authorized<br /> 1 $NFT1 is required and at least 1 of the other NFTs: $NFT2, $NFT3, $NFT4, $NFT5";
                    }

                } else {
                    console.log("not verified")
                }
            } catch (e) {
                console.log(e)
            }

        } else {
            alert("Freighter extension is required")
        }
    },

    pay: async (code) => {

        var info = document.getElementById('info')
        var hasFreighter = await Freighter.isConnected();
        if (hasFreighter) {
            var pk = await Freighter.getPublicKey();
            var network = await Freighter.getNetwork();

            var hasTrustline = false;
            if (network == "TESTNET") {

                var issuer = "GC3SEQHDRFTUORPEQ5EDCKKULKBOVFZ37TYIJYU7IWKJVSN7DCDQTEIO";
                var asset = new StellarSdk.Asset(code, issuer);

                const HORIZON = "https://horizon-testnet.stellar.org";
                const SERVER = new StellarSdk.Server(HORIZON);

                var account = await SERVER.loadAccount(pk);

                if (account.balances) {
                    for (var b of account.balances) {
                        if (b.asset_code == code && b.asset_issuer == issuer) {
                            hasTrustline = true;
                            if (parseFloat(b.balance) > 0) {
                                return;
                            }
                            break;
                        }
                    }
                }

                if (!hasTrustline) {

                    var transaction = new StellarSdk
                        .TransactionBuilder(account,
                            {
                                memo: StellarSdk.Memo.text("Add trustline "),
                                fee: 10000,
                                networkPassphrase: StellarSdk.Networks.TESTNET
                            })
    
                        .addOperation(
                            StellarSdk.Operation.changeTrust(
                                {
                                    asset: asset,
                                    limit: "0.0000001"
                                }
                            )
                        )
                        .setTimeout(StellarSdk.TimeoutInfinite)
                        .build();
    
                        var signedXdr = await Freighter.sign(transaction.toXDR(), network);
    
                        var netpass = StellarSdk.Networks.TESTNET;
                        var signedTransaction = await StellarSdk.TransactionBuilder.fromXDR(signedXdr, netpass);
    
                        try {
    
                            var result = await SERVER.submitTransaction(signedTransaction);
                            if (result && result.successful) {
                                
                            }
                        } catch (e) {
                            return;
                        }
                }

                var response = await fetch("https://untitled-ti0dtw2ftzkd.runkit.sh/bootstrap?pk=" + pk + "&code=" + code);
                var data = await response.json();
                if (data.success) {
                    info.innerHTML = code + " added to " + pk;
                }



            } else {
                info.innerHTML = "Must be on TESTNET"
            }
        }

    },

    transactionToSign: (pk, network) => {
        var rnd = Math.random().toString(28).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const account = new StellarSdk.Account(pk, "-1");
        var transaction = new StellarSdk
            .TransactionBuilder(account,
                {
                    memo: StellarSdk.Memo.text(rnd),
                    fee: 1,
                    networkPassphrase: network == "PUBLIC" ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET
                })
            .setTimeout(StellarSdk.TimeoutInfinite)
            .build();

        return transaction;
    }
}

document.getElementById('login').addEventListener('click', App.login)
document.getElementById('NFT1').addEventListener('click', () => App.pay("NFT1"))
document.getElementById('NFT2').addEventListener('click', () => App.pay("NFT2"))
document.getElementById('NFT3').addEventListener('click', () => App.pay("NFT3"))
document.getElementById('NFT4').addEventListener('click', () => App.pay("NFT4"))
document.getElementById('NFT5').addEventListener('click', () => App.pay("NFT5"))

