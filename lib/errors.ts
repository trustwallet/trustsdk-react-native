export enum TrustError {
  none = "none",
  notInstalled = "app_not_installed",

  unknown = "unknown",
  rejectedByUser = "rejected_by_user",
  invalidResponse = "invalid_response",
  coinNotSupported = "coin_not_supported",
  signError = "sign_error",
}

export namespace TrustError {
  export function toString(error: TrustError | string): string {
    switch (error) {
      case TrustError.unknown:
        return "Unknown Error";
      case TrustError.none:
        return "No Error";
      case TrustError.rejectedByUser:
        return "User cancelled";
      case TrustError.invalidResponse:
        return "Trust SDK response invalid";
      case TrustError.coinNotSupported:
        return "Coin is not supported";
      case TrustError.notInstalled:
        return "Trust Wallet is not installed";
      default:
        return "";
    }
  }
}
