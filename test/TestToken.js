const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("TestToken contract", function () {
  let Token;
  let testToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async () => {
    //get the contract factory and signer here
    Token = await ethers.getContractFactory("TestToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    testToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await testToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of token to the owner", async () => {
      const ownerBalance = await testToken.balanceOf(owner.address);
      expect(await testToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped to the argument provided during deployment", async () => {
      const cap = await testToken.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async () => {
      const blockReward = await testToken.blockReward();
      expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(
        tokenBlockReward
      );
    });
  });

  describe("Transactions", () => {
    it("Should transfer tokens between accounts", async () => {
      //Transfer 50 tokens from owner to addr1
      await testToken.transfer(addr1.address, 50);
      const addr1Balance = await testToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
    });

    it("Should fail is sender doesn't have enough tokens", async () => {
      const initialOwnerBalance = await testToken.balanceOf(owner.address);
      //Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      //"Require" will evaluate false and revert the function
      await expect(
        testToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      //Owner balance should not have changed.

      expect(await testToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async () => {
      const initialOwnerBalance = await testToken.balanceOf(owner.address);

      //Transfer 100 tokens from owner to addr1.
      await testToken.transfer(addr1.address, 100);

      //Transfer another 50 tokens from owner to addr2.

      await testToken.transfer(addr2.address, 50);

      //check balances
      const finalOwnerBalance = await testToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await testToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await testToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
