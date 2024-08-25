async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", balance.toString());

    const Coinflip = await ethers.getContractFactory("Coinflip");
    const coinflip = await Coinflip.deploy("YOUR_TESTNET_TOKEN_ADDRESS");

    console.log("Coinflip contract deployed to:", coinflip.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
    