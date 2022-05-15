// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Poolnft = await ethers.getContractFactory("Poolnft");
  const poolnft = await Poolnft.deploy("https://ipfs.io/ipfs/QmdmM3ayV4GnozbMToi7LF5wzsShqDAZhUSvWXSBxJd4KB/");
  await poolnft.deployed();
  console.log("Poolnft deployed to:", poolnft.address);
  await poolnft.setAllowList(["0x688e185bef2a5b4302166115436ECA5FDFaf993E", "0xd562FFBbb55A07A7b6D90Ed750e903EDa9A2Ce28", "0x9D91C196735DDea821DcC697f820c62f0eE25AbD"], 100);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
