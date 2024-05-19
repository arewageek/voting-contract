const Ballot = artifacts.require("Ballot");

module.exports = function (deployer) {
  const initialProposals = [];

  deployer.deploy(Ballot, initialProposals);
};
