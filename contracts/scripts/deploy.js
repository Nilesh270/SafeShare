const hre = require("hardhat");

async function main() {
  const DriveStorage = await hre.ethers.getContractFactory("DriveStorage");
  const drive = await DriveStorage.deploy(); // This already deploys the contract in Ethers v6
  console.log(`DriveStorage deployed to: ${drive.target}`); // Use .target instead of .address in Ethers v6
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//contract address: 0x2021081D1AEed11612ED135d39Dade89071544B1
