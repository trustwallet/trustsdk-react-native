import {
  CoinType,
  TrustCommand,
  AccountsRequest,
  MessageRequest,
  TransactionRequest,
  AndroidTransactionRequest,
  TrustError,
} from "../dist";

const TestCallbackScheme = "trust-rn-example";

describe("Test TrustCommand enum", () => {
  it(".requestAccounts should equal to sdk_get_accounts", () => {
    expect(TrustCommand.requestAccounts).toBe("sdk_get_accounts");
  });

  it(".signTransaction should equal to sdk_sign", () => {
    expect(TrustCommand.signTransaction).toBe("sdk_sign");
  });
});

describe("Test TrustCommand.getURL()", () => {
  it("get url for .requestAccounts", () => {
    const request = new AccountsRequest(
      [CoinType.ethereum, CoinType.binance],
      "request_test",
      TestCallbackScheme
    );
    const url = TrustCommand.getURL(request);
    expect(url).toBe(
      "trust://sdk_get_accounts?coins.0=60&coins.1=714&app=trust-rn-example&callback=sdk_get_accounts&id=request_test"
    );
  });

  it("get url for .signMessage", () => {
    const request = new MessageRequest(
      CoinType.ethereum,
      "deadbeaf",
      "message_test",
      TestCallbackScheme
    );
    const url = TrustCommand.getURL(request);
    expect(url).toBe(
      "trust://sdk_sign_message?coin=60&data=deadbeaf&app=trust-rn-example&callback=sdk_sign_message&id=message_test"
    );
  });

  it("get url for .signTransaction", () => {
    const request = new TransactionRequest(
      CoinType.ethereum,
      "0xdeadbef",
      "tx",
      true,
      undefined,
      TestCallbackScheme
    );
    const url = TrustCommand.getURL(request);
    expect(url).toBe(
      "trust://sdk_sign?coin=60&data=0xdeadbef&send=true&app=trust-rn-example&callback=sdk_sign&id=tx"
    );
  });

  it("get url for .androidTransaction", () => {
    const request = new AndroidTransactionRequest(
      CoinType.ethereum,
      "0xdeadbef",
      "1",
      "sampleapp://",
      true,
      "id",
      "1",
      "1",
      "1",
      "meta"
    );
    const url = TrustCommand.getURL(request);
    expect(url).toBe(
      "trust://sdk_transaction?asset=c60&to=0xdeadbef&meta=meta&nonce=1&fee_price=1&fee_limit=1&wei_amount=1&action=transfer&confirm_type=send&callback=sampleapp://sdk_sign&id=id"
    );
  });
});

describe("Test TrustCommand.parseResult()", () => {
  it("parse result for .requestAccounts", () => {
    const result = TrustCommand.parseURL(
      "trust-rn-example://sdk_sign_result?accounts=0xFC6CD054fAc48Df3744B42ea82E1Dd0fa7027086,bnb16cddarwr2gnf825fx5gyf676rakc4mwcnxzs7c&id=acc_1527509558565"
    );
    expect(result.id).toBe("acc_1527509558565");
    expect(result.result).toBe(
      "0xFC6CD054fAc48Df3744B42ea82E1Dd0fa7027086,bnb16cddarwr2gnf825fx5gyf676rakc4mwcnxzs7c"
    );
    expect(result.error).toEqual(TrustError.none);
  });

  it("parse result for .signTransaction", () => {
    const result = TrustCommand.parseURL(
      "trust-rn-example://sdk_sign_result?coin=60&data=Cm34a4IB3YR94pAAglIIlHKLAjdyMLXfc6pOMZLom2CQ3XMShlrzEHpAAIAmoB0Yegc2ZqxtkSkXlYo_TEg4eBrjopGUj9ySxJh6JlfToGqR7yNKzV8cD_yN_jVR5YrVaTANO05X2_9HleO8htQqEgEmGiAdGHoHNmasbZEpF5WKP0xIOHga46KRlI_cksSYeiZX0yIgapHvI0rNXxwP_I3-NVHlitVpMA07Tlfb_0eV47yG1Co&id=tx_1527509748703"
    );
    expect(result.id).toBe("tx_1527509748703");
    expect(result.result).toBe(
      "Cm34a4IB3YR94pAAglIIlHKLAjdyMLXfc6pOMZLom2CQ3XMShlrzEHpAAIAmoB0Yegc2ZqxtkSkXlYo_TEg4eBrjopGUj9ySxJh6JlfToGqR7yNKzV8cD_yN_jVR5YrVaTANO05X2_9HleO8htQqEgEmGiAdGHoHNmasbZEpF5WKP0xIOHga46KRlI_cksSYeiZX0yIgapHvI0rNXxwP_I3-NVHlitVpMA07Tlfb_0eV47yG1Co"
    );
  });

  it("parse cancel error", () => {
    const result = TrustCommand.parseURL(
      "trust-rn-example://sdk_sign_result?id=acc_1528786624065&error=rejected_by_user"
    );
    expect(result.result).toBe("");
    expect(result.error).toBe(TrustError.rejectedByUser);
  });

  it("parse unknown error", () => {
    const result = TrustCommand.parseURL(
      "trust-rn-example://sdk_sign_result?id=acc_1528786624065&error=unknown"
    );
    expect(result.error).toBe(TrustError.unknown);
  });
});
