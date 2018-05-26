"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const commands_1 = require("./lib/commands");
exports.TrustCommand = commands_1.TrustCommand;
exports.MessagePayload = commands_1.MessagePayload;
exports.TransactionPayload = commands_1.TransactionPayload;
class TrustWallet {
    constructor() {
        this.apps = [{
                name: 'Trust',
                scheme: 'trust://',
                installURL: 'https://itunes.apple.com/ru/app/trust-ethereum-wallet/id1288339409'
            }];
        this.callbacks = {};
        // Linking.getInitialURL().then((url: string) => this.handleURL(url));
        react_native_1.Linking.addEventListener('url', this.handleOpenURL.bind(this));
    }
    cleanup() {
        react_native_1.Linking.removeEventListener('url', this.handleOpenURL.bind(this));
        this.callbacks = {};
    }
    installed() {
        const installed = this.apps.filter((app) => react_native_1.Linking.canOpenURL(app.scheme + ''));
        return installed.length > 0;
    }
    signTransaction(payload, callback) {
        if (!this.installed()) {
            callback('');
        }
        this.callbacks[payload.id] = callback;
        const url = commands_1.TrustCommand.getURL(commands_1.TrustCommand.signTransaction, payload);
        react_native_1.Linking.openURL(url);
    }
    signMessage(payload, callback) {
        if (!this.installed()) {
            callback('');
        }
        this.callbacks[payload.id] = callback;
        const url = commands_1.TrustCommand.getURL(commands_1.TrustCommand.signMessage, payload);
        react_native_1.Linking.openURL(url);
    }
    handleOpenURL(event) {
        console.log(event);
        const response = commands_1.TrustCommand.parseURL(event.url);
        const callback = this.callbacks[response.id];
        if (callback) {
            callback(response.result);
            delete this.callbacks[response.id];
        }
    }
}
exports.default = TrustWallet;
