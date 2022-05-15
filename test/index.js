const { expect } = require("chai");
const { utils } = require("ethers");
const { ethers } = require("hardhat");

describe("PoolNFT", function () {
    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // console.log("Deploying contracts with the account:", owner.address);

        // console.log("Account balance:", (await owner.getBalance()).toString());

        const Poolnft = await ethers.getContractFactory("Poolnft");
        poolnft = await Poolnft.deploy(
            "https://ipfs.io/ipfs/QmQtN81i9eNrD3wxcr67scDpLvZDDXxbmAvNXMaZh3D6tB/"
        );
        await poolnft.deployed();
        // console.log("Poolnft deployed to:", poolnft.address);
        await poolnft.setAllowList(
            [
                "0x688e185bef2a5b4302166115436ECA5FDFaf993E",
                "0xd562FFBbb55A07A7b6D90Ed750e903EDa9A2Ce28",
                addr2.address,
            ],
            4
        );
    });
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await poolnft.owner()).to.equal(owner.address);
        });
    });
    describe("Check allowlist and baseURI", function () {
        it("Check allowlist", async function () {
            expect(
                await poolnft._allowList(
                    "0x688e185bef2a5b4302166115436ECA5FDFaf993E"
                )
            ).to.equal(3);
            expect(
                await poolnft._allowList(
                    "0xd562FFBbb55A07A7b6D90Ed750e903EDa9A2Ce28"
                )
            ).to.equal(3);
            expect(
                await poolnft._allowList(
                    "0x736791a57E751A67FD2Abd14FcE019CD90D1B952"
                )
            ).to.equal(0);
        });
        it("Check baseURI", async function () {
            expect(await poolnft.baseTokenURI()).to.equal(
                "https://ipfs.io/ipfs/QmQtN81i9eNrD3wxcr67scDpLvZDDXxbmAvNXMaZh3D6tB/"
            );
            await poolnft.setBaseURI(
                "https://ipfs.io/ipfs/QmQtN81i9eNrD3wxcr67scDpLvZDDXxbmAvNXMaZh3D6CC/"
            );
            expect(await poolnft.baseTokenURI()).to.equal(
                "https://ipfs.io/ipfs/QmQtN81i9eNrD3wxcr67scDpLvZDDXxbmAvNXMaZh3D6CC/"
            );
            await expect(
              poolnft.connect(addr1).setBaseURI("https://ipfs.io/ipfs/QmQtN81i9eNrD3wxcr67scDpLvZDDXxbmAvNXMaZh3D6CC/")
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
    describe("Check Mint", function () {
        it("should work first free mint and second one price mint with normal account", async function () {
            await expect(await poolnft.connect(addr1).mint())
                .to.emit(poolnft, "CreatePoolNFT")
                .withArgs(1);
            await expect(
                await poolnft.connect(addr1).mint({
                    value: utils.parseEther("0.025"),
                })
            )
                .to.emit(poolnft, "CreatePoolNFT")
                .withArgs(2);
        });
        it("should work first 4 free mint with listed account", async function () {
            await expect(await poolnft.connect(addr2).mint())
                .to.emit(poolnft, "CreatePoolNFT")
                .withArgs(1);
            await expect(await poolnft.connect(addr2).mint())
                .to.emit(poolnft, "CreatePoolNFT")
                .withArgs(2);
            await expect(await poolnft.connect(addr2).mint())
                .to.emit(poolnft, "CreatePoolNFT")
                .withArgs(3);
            await expect(await poolnft.connect(addr2).mint())
                .to.emit(poolnft, "CreatePoolNFT")
                .withArgs(4);
            await expect(poolnft.connect(addr2).mint()).to.be.revertedWith(
                "Value below price"
            );
        });
        it("should not work second free mint with normal account", async function () {
            await expect(await poolnft.connect(addr1).mint())
                .to.emit(poolnft, "CreatePoolNFT")
                .withArgs(1);
            await expect(poolnft.connect(addr1).mint()).to.be.revertedWith(
                "Value below price"
            );
        });
    });
});
