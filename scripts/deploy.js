const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const feeRecipient = "0x0df214be853caE6f646c9929EAfF857cb3452EFd";
  const deployFee = ethers.parseEther("0.001");

  const Factory = await ethers.getContractFactory("CoinFactory");
  const factory = await Factory.deploy(deployFee, feeRecipient);

  await factory.waitForDeployment();
  console.log("CoinFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
