//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Poolnft is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIds;
    string public baseTokenURI;

    uint256 public constant MAX_ELEMENTS = 1000;
    uint256 public constant PRICE = 0.025 ether;

    mapping(address => uint256) public _allowList;
    mapping(address => bool) public _tokenFree;

    event CreatePoolNFT(uint256 indexed id);
    event SetAllowList(address[] addresses, uint8 numAllowedToFreeMint);

    constructor(string memory baseURI) ERC721("PoolNFT", "PDN") {
        setBaseURI(baseURI);
    }

    function setAllowList(
        address[] calldata addresses,
        uint8 numAllowedToFreeMint
    ) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            _allowList[addresses[i]] = numAllowedToFreeMint-1;
        }
        emit SetAllowList(addresses, numAllowedToFreeMint);
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function mint() public payable returns (uint256) {
        require(_tokenIds.current() < MAX_ELEMENTS, "Sale end");
        if (_tokenFree[msg.sender] == false) {
            if (_allowList[msg.sender] <= 0) {
                _tokenFree[msg.sender] = true;
            } else {
                _allowList[msg.sender]--;
            }
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _mint(msg.sender, newItemId);
            emit CreatePoolNFT(newItemId);
            return newItemId;
        } else {
            require(msg.value >= PRICE, "Value below price");
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _mint(msg.sender, newItemId);
            emit CreatePoolNFT(newItemId);
            return newItemId;
        }
    }
    function walletOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokensId;
    }

    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0);
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed.");
    }
}
