// Freighter

const freighter = window.freighterApi;
const Freighter = {

  isConnected: async () => {
    console.log(window)
    if (freighter.isConnected()) {
      return true;
    }

    return false;
  },

  getPublicKey: async () => {
    let publicKey = "";
    let error = "";

    try {
      publicKey = await freighter.getPublicKey();
    } catch (e) {
      error = e;
    }

    if (error) {
      return error;
    }

    return publicKey;
  },

  sign: async (xdr, network) => {
    let signedTransaction = "";
    let error = "";

    try {
      signedTransaction = await freighter.signTransaction(xdr, network);
    } catch (e) {
      error = e;
    }

    if (error) {
      return error;
    }

    return signedTransaction;
  },

  getNetwork: async () => {
    let network = "";
    let error = "";

    try {
      network = await window.freighterApi.getNetwork();
    } catch (e) {
      error = e;
    }

    if (error) {
      return error;
    }

    return network;
  }


}

export { Freighter };


