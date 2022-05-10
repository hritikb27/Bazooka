//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Battle {
    address public owner;
    uint256 public monthNo = 1;
    uint256 public battleID = 0;
    uint256 public maxBattles = 100;

    struct BattleStruct {
        NFT nft1;
        NFT nft2;
        uint256 votes1;
        address[] _votes1;
        uint256 votes2;
        address[] _votes2;
        address[] allVotes;
        uint256 amount;
        bool finalized;
        uint256 _id;
    }

    struct NFT {
        address nftAddress;
        address ownerAddress;
        string image;
        string name;
    }

    mapping(uint256 => mapping(uint256 => BattleStruct)) public BattlesMapping;

    constructor() {
        owner = msg.sender;
    }

    function getVotes(uint256 battleId) public view returns (uint256, uint256) {
        uint vote1 = BattlesMapping[monthNo][battleId].votes1;
        uint vote2 = BattlesMapping[monthNo][battleId].votes2;
        return (vote1, vote2);
    }

    function getVoters1(uint256 battleId) public view returns (address[] memory) {
        return BattlesMapping[monthNo][battleId]._votes1;
    }

    function IncrementVote1(uint256 battleId) public {
        bool canVote;
        require(BattlesMapping[monthNo][battleId].finalized == true, 'Finalize the battle first');
        if(BattlesMapping[monthNo][battleId].allVotes.length==0) canVote=true;
        else{
            for(uint i=BattlesMapping[monthNo][battleId].allVotes.length; i>0; i=i-1){
                if(BattlesMapping[monthNo][battleId].allVotes[i-1]==msg.sender) {
                    canVote=false;
                    break;
                }
                else canVote=true;
            }     
        }   
        require(canVote==true, 'Already Voted!');
        BattlesMapping[monthNo][battleId].votes1 = BattlesMapping[monthNo][battleId].votes1 + 1;
        BattlesMapping[monthNo][battleId]._votes1.push(msg.sender);
        BattlesMapping[monthNo][battleId].allVotes.push(msg.sender);
    }
    
    function IncrementVote2(uint256 battleId) public {
        bool canVote;
        require(BattlesMapping[monthNo][battleId].finalized == true, 'Finalize the battle first');
        if(BattlesMapping[monthNo][battleId].allVotes.length==0) canVote=true;
        else{
            for(uint i=BattlesMapping[monthNo][battleId].allVotes.length; i>0; i=i-1){
                if(BattlesMapping[monthNo][battleId].allVotes[i-1]==msg.sender) {
                    canVote=false;
                    break;
                }
                else canVote=true;
            }     
        }   
        require(canVote==true, 'Already Voted!');
        BattlesMapping[monthNo][battleId].votes2 = BattlesMapping[monthNo][battleId].votes2 + 1;
        BattlesMapping[monthNo][battleId]._votes2.push(msg.sender);
        BattlesMapping[monthNo][battleId].allVotes.push(msg.sender);
    }

    function finalizeBattle(uint256 battleId, address _candidate2, string memory image, string memory name) payable checkAmount(msg.value) public {
        require(battleId<=battleID, 'Initialize a battle first');
        require(BattlesMapping[monthNo][battleId].finalized == false, 'Battle already finalized');
        require(BattlesMapping[monthNo][battleId].nft1.ownerAddress != msg.sender, "You can't battle yourself, sorry!");
        BattlesMapping[monthNo][battleId].nft2.nftAddress = _candidate2;
        BattlesMapping[monthNo][battleId].nft2.ownerAddress = msg.sender;
        BattlesMapping[monthNo][battleId].nft2.image = image;
        BattlesMapping[monthNo][battleId].nft2.name = name;
        BattlesMapping[monthNo][battleId].votes1 = 0;
        BattlesMapping[monthNo][battleId].votes2 = 0;
        BattlesMapping[monthNo][battleId].amount += msg.value;
        BattlesMapping[monthNo][battleId].finalized = true;
    }

    function createInitialBattle(address _candidate1, string memory image, string memory name) payable checkAmount(msg.value) public {
        console.log(msg.value);
        require(battleID+1<=maxBattles,'Battles limit exceeded!');
        battleID += 1;
        BattleStruct storage battle = BattlesMapping[monthNo][battleID];
        battle.nft1.nftAddress = _candidate1;
        battle.nft1.ownerAddress = msg.sender;
        battle.nft1.image = image;
        battle.nft1.name = name;
        battle.amount = msg.value;
        battle.finalized = false;
        battle._id = battleID;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getBattleAmount() public view returns (uint256) {
        return battleID;
    }

    function getBattleData(uint256 battleId) public view returns (BattleStruct memory){
        return BattlesMapping[monthNo][battleId];
    }

    function getBattleNumber() public view returns (uint256) {
        return battleID;
    }

    modifier checkAmount(uint256 amount) {
        require(amount == 25000000000000000000 || amount == 50000000000000000000 || amount == 100000000000000000000,'Not correct amount');
        _;
    }
}
