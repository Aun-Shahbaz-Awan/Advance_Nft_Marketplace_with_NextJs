require("@nomiclabs/hardhat-waffle");
// const project_id = "fd8c82f8245c47f3a94ee7fa9a4d8701";
const fs = require("fs");
private_key = fs.readFileSync(".secret").toString().trim();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.RPC_Provider_Id}`,
      //url: `https://rinkeby.infura.io/v3/fd8c82f8245c47f3a94ee7fa9a4d8701`,
      accounts: [private_key],
    },
  },
  solidity: {
    version: "0.8.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
