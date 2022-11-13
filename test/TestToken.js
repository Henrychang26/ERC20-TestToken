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
});
