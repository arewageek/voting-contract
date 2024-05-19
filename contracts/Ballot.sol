// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Ballot{
    struct Voter{
        uint vote;
        bool voted;
        uint weight;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    Proposal[] public proposals;
    mapping(address => Voter) public voters;

    address public chairperson;

    modifier OnlyChairperson {
        require(msg.sender == chairperson, "Only chairperson can call this function");
        _;
    }

    constructor(bytes32[] memory initialProposals){
        for(uint8 i; i < initialProposals.length; i++){
            proposals.push(Proposal({
                name: initialProposals[i],
                voteCount: 0
            }));
        }

        chairperson = msg.sender;
    }
}