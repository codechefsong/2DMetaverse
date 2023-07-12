//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract YourGarden {
    address public immutable owner;
    Box[] public grid;
    Box[] public myBag;
    uint256[] public nums;

    struct Box {
        uint256 index;
        uint256 id;
        string typeGrid;
        uint256 content;
    }

    constructor(address _owner) {
        owner = _owner;

        uint256 id = 0;

        for (uint256 row = 0; row < 5; row++) {
            for (uint256 col = 0; col < 5; col++) {
                grid.push(Box(id, id, "base", id + 1));
                id++;
            }
        }

        myBag.push(Box(26, 26, "mybags", 26 + 1));
    }

    modifier isOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    function getGrid() public view returns (Box[] memory){
        return grid;
    }

    function getMyBags() public view returns (Box[] memory){
        return myBag;
    }

    function getNums() public view returns (uint256[] memory){
        return nums;
    }

    function moveItem(uint256 index) public {
        grid[index].content = 999;

        nums.push(index);
    }

    function withdraw() isOwner public {
        (bool success,) = owner.call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
    }

    receive() external payable {}
}
