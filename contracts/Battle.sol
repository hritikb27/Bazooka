//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Battle {
    address public owner;
    uint public monthNo = 1;
    uint256 public battleID = 0;

    struct BattleStruct {
        address _address1;
        address _address2;
        uint  _votes1;
        uint  _votes2;
        uint _id;
    }

    mapping(uint => mapping(uint256 => BattleStruct)) public BattlesMapping;

    constructor() {
        owner = msg.sender;
    }

    function getVotes(uint256 battleId) public view returns (uint, uint) {
        uint vote1 = BattlesMapping[monthNo][battleId]._votes1;
        uint vote2 = BattlesMapping[monthNo][battleId]._votes2;
        return (vote1, vote2);
    }

    function setVotes1(uint256 battleId, uint256 vote) public {
        BattlesMapping[monthNo][battleId]._votes1 = vote;
    }
    
    function setVotes2(uint256 battleId, uint256 vote) public {
        BattlesMapping[monthNo][battleId]._votes2 = vote;
    }

    function createBattle(address _candidate1, address _candidate2) public {
        battleID += 1;
        BattlesMapping[monthNo][battleID] = BattleStruct(_candidate1, _candidate2, 0, 0, battleID);
    }
}
