Task: write and deploy an NFT and minting system to Ropsten TestNet. Users should be able to mint 1 NFT per address for free. As a bonus, develop a system for additional allowlist users to mint more NFTs. Assume you will receive a list of addresses during deployment. You may create a set of mock addresses to start.

Please add private keys in secreatsManager.js

npx hardhat run scripts/deploy.js --network ropsten
npx hardhat verify --network ropsten 0xDbA27008B23b45cd489828c4e03CBa45802AD151  "https://ipfs.io/ipfs/QmdmM3ayV4GnozbMToi7LF5wzsShqDAZhUSvWXSBxJd4KB/"

https://ropsten.etherscan.io/address/0xDbA27008B23b45cd489828c4e03CBa45802AD151#code