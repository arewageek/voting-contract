# Voting Smart Contract

The Ballot smart contract is a simple voting system where the chairperson can grant voting rights to voters, who can then vote on a list of proposals. The contract allows for secure and transparent voting and ensures that each voter can vote only once.

## Overview

The Ballot contract consists of two main entities: voters and proposals. The chairperson is responsible for initializing the proposals and granting voting rights. Voters can vote on proposals, and the contract tracks the votes to determine the winning proposal.

## Features

- **Voter Management**: The chairperson can grant voting rights to addresses.
- **Voting Mechanism**: Voters can vote on proposals, and their votes are weighted.
- **Winning Proposal**: Functions to determine and display the winning proposal based on the vote count.

## Technologies Used

- **Solidity 0.8.20**: The programming language for writing smart contracts on the Ethereum blockchain.

## Smart Contract

### Ballot

#### State Variables

- `struct Voter`: Defines a voter with the following properties:
  - `uint vote`: The proposal number the voter voted for.
  - `bool voted`: Indicates if the voter has voted.
  - `uint weight`: The weight of the voter's vote.
- `struct Proposal`: Defines a proposal with the following properties:
  - `bytes32 name`: The name of the proposal.
  - `uint voteCount`: The number of votes the proposal has received.
- `Proposal[] public proposals`: An array of all proposals.
- `mapping(address => Voter) public voters`: A mapping of voter addresses to Voter structs.
- `address public chairperson`: The address of the chairperson.

#### Modifiers

- `OnlyChairperson`: Ensures that only the chairperson can call the function.
- `CanVote(address voter)`: Ensures that the voter has the right to vote.
- `NotVotedYet(address voter)`: Ensures that the voter has not already voted.

#### Constructor

```solidity
constructor(bytes32[] memory initialProposals)
```

- Initializes the contract with a list of proposal names.
- Sets the chairperson and grants them the initial voting right.

## Functions

### grantVotingRight(address voter) public OnlyChairperson NotVotedYet(voter)

- Grants voting rights to the specified address.
- Ensures the address has not already been granted voting rights and has not voted yet.

### vote(uint \_proposal) public CanVote(msg.sender) NotVotedYet(msg.sender)

- Allows a voter to vote for a proposal.
- Updates the vote count of the selected proposal based on the voter's weight.

### winningProposal() public CanVote(msg.sender) view returns (uint \_winningProposal)

- Determines the proposal with the highest vote count.
- Returns the index of the winning proposal.

### winningProposalName() public CanVote(msg.sender) view returns (bytes32 \_winningPropName)

- Returns the name of the winning proposal.
- Calls `winningProposal()` to get the index of the winning proposal.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ballot-smart-contract.git
   cd ballot-smart-contract
   ```
2. Install dependencies:
   ` npm install`
3. Compile the contracts:
   `truffle compile`
4. Run tests to ensure contract functionality:
   `truffle test`
5. Deploy the smart contracts to the desired Ethereum network:
   `truffle migrate --network <network-name>`

## Details of Deployed Contract

1. **Conract address of deployed token:** 0x0c2873627ce61a2e70eea476668ee8042cab377d11dfff2968ca658b01310cf4

2. **Network:** Sepolia

3. **Epxlorer:** _[https://sepolia.etherscan.io/tx/0x0c2873627ce61a2e70eea476668ee8042cab377d11dfff2968ca658b01310cf4]()_
