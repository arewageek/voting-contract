const Ballot = artifacts.require("Ballot");
const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");

contract("Ballot", (accounts) => {
  const [chairperson, voter1, voter2, voter3] = accounts;
  const initialProposals = [
    web3.utils.asciiToHex("Proposal1"),
    web3.utils.asciiToHex("Proposal2"),
  ];

  let ballotInstance;

  beforeEach(async () => {
    ballotInstance = await Ballot.new(initialProposals, { from: chairperson });
  });

  it("should initialize with correct chairperson and proposals", async () => {
    const chairpersonAddress = await ballotInstance.chairperson();
    expect(chairpersonAddress).to.equal(chairperson);

    const proposal1 = await ballotInstance.proposals(0);
    const proposal2 = await ballotInstance.proposals(1);
    expect(proposal1.name).to.equal(initialProposals[0]);
    expect(proposal2.name).to.equal(initialProposals[1]);
  });

  it("should allow the chairperson to grant voting rights", async () => {
    await ballotInstance.grantVotingRight(voter1, { from: chairperson });
    const voter = await ballotInstance.voters(voter1);
    expect(voter.weight.toNumber()).to.equal(1);
  });

  it("should not allow non-chairperson to grant voting rights", async () => {
    await truffleAssert.reverts(
      ballotInstance.grantVotingRight(voter1, { from: voter2 }),
      "Only chairperson can call this function"
    );
  });

  it("should allow voters to vote", async () => {
    await ballotInstance.grantVotingRight(voter1, { from: chairperson });
    await ballotInstance.vote(0, { from: voter1 });

    const voter = await ballotInstance.voters(voter1);
    expect(voter.voted).to.be.true;
    expect(voter.vote.toNumber()).to.equal(0);

    const proposal1 = await ballotInstance.proposals(0);
    expect(proposal1.voteCount.toNumber()).to.equal(1);
  });

  it("should not allow voters to vote twice", async () => {
    await ballotInstance.grantVotingRight(voter1, { from: chairperson });
    await ballotInstance.vote(0, { from: voter1 });

    await truffleAssert.reverts(
      ballotInstance.vote(0, { from: voter1 }),
      "Already voted"
    );
  });

  it("should determine the winning proposal", async () => {
    await ballotInstance.grantVotingRight(voter1, { from: chairperson });
    await ballotInstance.grantVotingRight(voter2, { from: chairperson });
    await ballotInstance.grantVotingRight(voter3, { from: chairperson });

    await ballotInstance.vote(0, { from: voter1 });
    await ballotInstance.vote(1, { from: voter2 });
    await ballotInstance.vote(1, { from: voter3 });

    const winningProposal = await ballotInstance.winningProposal();
    expect(winningProposal.toNumber()).to.equal(1);

    const winningProposalName = await ballotInstance.winningProposalName();
    expect(winningProposalName).to.equal(initialProposals[1]);
  });

  it("should not allow non-voters to call winningProposal or winningProposalName", async () => {
    await truffleAssert.reverts(
      ballotInstance.winningProposal({ from: accounts[4] }),
      "No voting access"
    );

    await truffleAssert.reverts(
      ballotInstance.winningProposalName({ from: accounts[4] }),
      "No voting access"
    );
  });
});
