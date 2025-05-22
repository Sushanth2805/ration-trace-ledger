
const hre = require("hardhat");

async function main() {
  // We get the contract factory to deploy
  const RationDistribution = await hre.ethers.getContractFactory("RationDistribution");
  
  // Initial verification code for the contract
  const initialVerificationCode = "GOVT2024";
  
  // Deploy the contract
  const rationDistribution = await RationDistribution.deploy(initialVerificationCode);

  await rationDistribution.deployed();

  console.log("RationDistribution contract deployed to:", rationDistribution.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
