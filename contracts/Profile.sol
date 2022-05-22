//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Profile {
    address public owner;
    address[] allUsers;

    constructor() {
        owner = msg.sender;
    }

    struct userProfile {
        string name;
        string avatar;
        bool canBattle;
    }

    mapping(address=>userProfile) public users;

    function addUser(string memory name, string memory avatar) public {
        userProfile storage user = users[msg.sender];
        user.name = name;
        user.avatar = avatar;
        allUsers.push(msg.sender);
        if(msg.sender==owner) user.canBattle = true;
        else user.canBattle = false;
    }

    function getUserData() public view returns (userProfile memory) {
        return users[msg.sender];
    }

    function getUsersList() public view returns (address[] memory) {
        return allUsers;
    }

    function changeAvatar(string memory avatar) public {
        users[msg.sender].avatar = avatar;
    }
    
    function changeName(string memory name) public {
        users[msg.sender].name = name;
    }
}