//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./Battle.sol";

contract NFTBetting is Battle {
    uint256 nftID = 0;
    uint256 maxNFTs = 6;

    struct NFTStruct {
        NFT nft;
        address[] betters;
        uint256 bets;
        bool winner;
    }

    struct NFT {
        address nftAddress;
        string image;
        string name;
    }

    mapping(uint256=>mapping(uint256=>NFTStruct)) NFTMapping;


    function addNFTS(string memory name, string memory image, address nftAddress) public onlyOwner areBattlesPaused{
        nftID += 1;
        NFTStruct storage NFTInstance = NFTMapping[monthNo][nftID];
        NFTInstance.nft.name = name;
        NFTInstance.nft.image = image;
        NFTInstance.nft.nftAddress = nftAddress;
        NFTInstance.bets = 0;
        NFTInstance.winner = false;
    }

    function bet(uint256 nftid) payable public {
        require(msg.value==0.01 ether, 'Not correct bet amount');
        NFTMapping[monthNo][nftid].betters.push(msg.sender);
    }

    function getNFTNum() public view returns (uint256) {
        return nftID;
    }

    function getNFTs(uint256 nftId) public view returns (NFTStruct memory) {
        return NFTMapping[monthNo][nftId];
    }

    modifier onlyOwner(){
        require(msg.sender==owner, 'Only Owner can add NFTs');
        require(nftID+uint256(1)<=maxNFTs, 'MAX NFTs added');
        _;
    }
}
