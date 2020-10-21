import {
  CoinType,
  TrustCommand,
  AccountsRequest,
  TransactionRequest,
  AndroidTransactionRequest,
  DAppMetadata,
} from "../dist";

const TestCallbackScheme = "trust-rn-example";
const timestamp = 1527496572770;

describe("Test AccountsRequest.toQuery()", () => {
  const message_id = "acc_" + timestamp;
  it("coins is empty ", () => {
    let request = new AccountsRequest([], message_id);
    let query = TrustCommand.processQuery(request.toQuery());
    expect(query).toBe("");
  });
  it("coins: [ethereum, bitcoin]", () => {
    let request = new AccountsRequest(
      [CoinType.ethereum, CoinType.bitcoin],
      message_id
    );
    let query = TrustCommand.processQuery(request.toQuery());
    expect(query).toBe("coins.0=60&coins.1=0&id=acc_1527496572770");
  });
  it("coins + callback scheme", () => {
    let request = new AccountsRequest(
      [CoinType.binance],
      message_id,
      TestCallbackScheme
    );
    let query = TrustCommand.processQuery(request.toQuery());
    expect(query).toBe(
      "coins.0=714&app=trust-rn-example&callback=sdk_get_accounts&id=acc_1527496572770"
    );
  });
});

describe("Test TransactionRequest.toQuery()", () => {
  const sign_id = "sign_" + timestamp;
  const data =
    "ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA";
  const meta = new DAppMetadata("Test", "https://dapptest.com");
  it("coin + data + callback scheme", () => {
    const request = new TransactionRequest(
      CoinType.ethereum,
      data,
      sign_id,
      false,
      meta,
      TestCallbackScheme,
      "sdk_sign_result"
    );
    let query = TrustCommand.processQuery(request.toQuery());
    expect(query).toBe(
      "coin=60&data=ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA&meta.__name=dApp&meta.name=Test&meta.url=https://dapptest.com&send=false&app=trust-rn-example&callback=sdk_sign_result&id=sign_1527496572770"
    );
  });
});
describe("Test TransactionRequest.toQuery()", () => {
  const sign_id = "sign_" + timestamp;
  const data =
    "ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA";
  const meta = new DAppMetadata("Test", "https://dapptest.com");
  it("coin + data + callback scheme", () => {
    const request = new TransactionRequest(
      CoinType.ethereum,
      data,
      sign_id,
      false,
      meta,
      TestCallbackScheme,
      "sdk_sign_result"
    );
    let query = TrustCommand.processQuery(request.toQuery());
    expect(query).toBe(
      "coin=60&data=ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA&meta.__name=dApp&meta.name=Test&meta.url=https://dapptest.com&send=false&app=trust-rn-example&callback=sdk_sign_result&id=sign_1527496572770"
    );
  });
});

describe("Test AndroidTransactionRequest.toQuery()", () => {
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
    const url = TrustCommand.processQuery(request.toQuery());
    expect(url).toBe(
      "asset=c60&to=0xdeadbef&meta=meta&nonce=1&fee_price=1&fee_limit=1&wei_amount=1&action=transfer&confirm_type=send&callback=sampleapp://sdk_sign&id=id"
    );
  });
});
