const hre = require("hardhat");

async function main() {
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy(100000000, 50);

  await testToken.deployed();

  console.log("TestToken deployed: ", testToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
