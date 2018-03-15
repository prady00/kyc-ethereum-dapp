var Verification = artifacts.require("./Verification.sol");
var Strings = artifacts.require("./Strings.sol");
var Integers = artifacts.require("./Integers.sol");

module.exports = function(deployer) {
  
  deployer.deploy(Strings);
  deployer.deploy(Integers);
  deployer.link(Strings, Verification);
  deployer.link(Integers, Verification);
  deployer.deploy(Verification);
  
};
