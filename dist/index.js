"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
var TrustWalletCommand;
(function (TrustWalletCommand) {
    TrustWalletCommand["signMessage"] = "sign-message";
    TrustWalletCommand["signTx"] = "sign-transaction";
})(TrustWalletCommand || (TrustWalletCommand = {}));
class TrustWallet {
    constructor(cbScheme) {
        this.cbScheme = '';
        this.apps = [{
                name: 'Trust',
                scheme: 'trust',
                installURL: 'https://itunes.apple.com/ru/app/trust-ethereum-wallet/id1288339409'
            }];
        this.cbScheme = cbScheme;
    }
    installed() {
        const installed = this.apps.filter((app) => react_native_1.Linking.canOpenURL(app.scheme + '://'));
        return installed.length > 0;
    }
}
function signTransaction(transaction) {
    const promise = new Promise((resolve, reject) => {
        resolve("");
    });
    return promise;
}
exports.signTransaction = signTransaction;
function signMessage(message) {
    const promise = new Promise((resolve, reject) => {
        resolve("");
    });
    return promise;
}
exports.signMessage = signMessage;
