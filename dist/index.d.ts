import { TrustCommand, MessagePayload, TransactionPayload } from './lib/commands';
declare class TrustWallet {
    apps: {
        name: string;
        scheme: string;
        installURL: string;
    }[];
    callbacks: {
        [key: string]: (value?: string | undefined) => void;
    };
    constructor();
    cleanup(): void;
    installed(): boolean;
    signTransaction(payload: TransactionPayload, callback: (value?: string | undefined) => void): void;
    signMessage(payload: MessagePayload, callback: (value?: string | undefined) => void): void;
    private handleOpenURL(event);
}
export default TrustWallet;
export { TrustCommand, MessagePayload, TransactionPayload };
