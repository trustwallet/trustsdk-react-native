import TrustWallet, { CoinType } from "../dist";

describe("Test import CoinType", () => {
  it("test CoinType.ethereum", () => {
    const eth = CoinType.ethereum;
    expect(eth).toEqual(60);
    expect(CoinType.symbol(eth)).toEqual("ETH");
  });
});

describe("Test TrustWallet class", () => {
  const wallet = new TrustWallet("test");
  wallet.callbackId = 1527509558000;

  it("constructor()", () => {
    expect(wallet.callbackScheme).toBe("test");
  });

  it("cleanup()", () => {
    const testWallet = new TrustWallet("test");
    testWallet.cleanup();

    expect(testWallet.resolvers).toEqual({});
  });

  it("installed()", () => {
    return wallet.installed().then((result) => {
      expect(result).toEqual(true);
    });
  });

  it("requestAccounts()", () => {
    setTimeout(() => {
      wallet["handleOpenURL"]({
        url:
          "test://sdk_sign_result?accounts=0xFC6CD054fAc48Df3744B42ea82E1Dd0fa7027086,bnb16cddarwr2gnf825fx5gyf676rakc4mwcnxzs7c&id=acc_1527509558001",
      });
    }, 1000);
    return wallet
      .requestAccounts([CoinType.ethereum, CoinType.binance])
      .then((result) => {
        expect(result).toEqual([
          "0xFC6CD054fAc48Df3744B42ea82E1Dd0fa7027086",
          "bnb16cddarwr2gnf825fx5gyf676rakc4mwcnxzs7c",
        ]);
      });
  });

  it("signMessage(CoinType.ethereum)", () => {
    setTimeout(() => {
      wallet["handleOpenURL"]({
        url:
          "test://sdk_sign_result?signature=c8ec59d0a1628d1b5f4edef41e0ce65e38ac6b34098cd58a885e33e7028962c141fe0819320e4467a1d3257a46e191f4c096d9c57999c6a6f39ec0241f2737401b&id=msg_1527509558002",
      });
    }, 1000);

    // sha3(ethereum message prefix + "Some data")
    return wallet
      .signMessage(
        "4fe61e1a9fb1d18a78977ad1e9611e8c546d54743cf2ff1836fc6933df9f1a54",
        CoinType.ethereum
      )
      .then((result) => {
        expect(result).toEqual(
          "c8ec59d0a1628d1b5f4edef41e0ce65e38ac6b34098cd58a885e33e7028962c141fe0819320e4467a1d3257a46e191f4c096d9c57999c6a6f39ec0241f2737401b"
        );
      });
  });

  it("signIOSTransaction(CoinType.ethereum)", () => {
    const input = {
      toAddress: "0x3535353535353535353535353535353535353535",
      chainId: Buffer.from("0x01", "hex"),
      nonce: Buffer.from("0x09", "hex"),
      gasPrice: Buffer.from("0x04a817c800", "hex"),
      gasLimit: Buffer.from("0x5208", "hex"),
      amount: Buffer.from("0x0de0b6b3a7640000"),
    };
    setTimeout(() => {
      wallet["handleOpenURL"]({
        url:
          "test://sdk_sign_result?data=ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA&id=tx_1527509558003",
      });
    }, 10);
    return wallet["signIOSTransaction"](input, CoinType.ethereum).then((result) => {
      expect(result).toEqual(
        "ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA"
      );
    });
  });
  it("signAndroidTransaction(input, CoinType.ethereum, true)", () => {
    const input = {
      toAddress: "0x3535353535353535353535353535353535353535",
      chainId: Buffer.from("0x01", "hex"),
      nonce: Buffer.from("0x09", "hex"),
      gasPrice: Buffer.from("0x04a817c800", "hex"),
      gasLimit: Buffer.from("0x5208", "hex"),
      amount: Buffer.from("0x0de0b6b3a7640000"),
    };
    setTimeout(() => {
      wallet["handleOpenURL"]({
        url:
          "test://tx_callback?transaction_sign=ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA&id=tx_1527509558004",
      });
    }, 10);
    return wallet["signAndroidTransaction"](input, CoinType.ethereum, true).then((result) => {
      expect(result).toEqual(
        "ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA"
      );
    });
  });
});
