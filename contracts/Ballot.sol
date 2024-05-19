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
    modifier CanVote (address voter){
        require(voters[voter].weight >= 1, "No voting access");
        _;
    }
    modifier NotVotedYet (address voter){
        require(!voters[voter].voted, "Already voted");
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
        voters[chairperson].weight = 1;
    }

    // an admin function for granting access to voters
    function grantVotingRight(address voter) public OnlyChairperson NotVotedYet(voter) {
        require(voters[voter].weight == 0, "Already has voting right");

        voters[voter].weight = 1;
    }

    // a method function to implement the vote action
    function vote(uint _proposal) public CanVote(msg.sender) NotVotedYet(msg.sender){
        Voter storage sender = voters[msg.sender];
        sender.voted = true;
        sender.vote = _proposal;

        proposals[_proposal].voteCount += sender.weight;
    }

    // show winnign proposals
    
    // 1. winning proposal id
    function winningProposal() public CanVote(msg.sender) view returns (uint _winningProposal){
        uint winningVoteCount = 0;
        
        for(uint i = 0; i < proposals.length; i++){
            if(proposals[i].voteCount > winningVoteCount){
                winningVoteCount = proposals[i].voteCount;
                _winningProposal = i;
            }
        }
    }

    // 2. winning proposal name
    function winningProposalName() public CanVote(msg.sender) view returns(bytes32 _winningPropName){
        _winningPropName = proposals[winningProposal()].name;
    }
}