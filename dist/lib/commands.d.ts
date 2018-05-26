export declare enum TrustCommand {
    signMessage = "sign-message",
    signTransaction = "sign-transaction",
}
export declare namespace TrustCommand {
    function parseURL(urlString: string): {
        id: string;
        result: string;
    };
    function getURL(command: TrustCommand, data: Payload, scheme?: string): string;
}
export interface Payload {
    id: string;
    callbackScheme: string;
    toQuery(): string;
}
export declare class MessagePayload implements Payload {
    id: string;
    message: string;
    address: string;
    callbackScheme: string;
    constructor(message: string, callbackScheme: string);
    toQuery(): string;
}
export declare class TransactionPayload implements Payload {
    id: string;
    gasPrice: string;
    gasLimit: string;
    to: string;
    amount: string;
    nonce: string;
    callbackScheme: string;
    constructor(to: string, amount: string, callbackScheme: string, gasPrice?: string, gasLimit?: string, nonce?: string);
    toQuery(): string;
}
