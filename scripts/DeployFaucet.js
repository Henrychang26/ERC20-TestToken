const hre = require("hardhat");

async function main() {
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(
    "0x0DE9c24141001cB0cA124dbce8A88544d4871536"
  );

  await faucet.deployed();

  console.log("Faucet Contract deployed: ", faucet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
