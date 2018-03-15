App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Verification.json", function (verification) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Verification = TruffleContract(verification);
      // Connect provider to interact with contract
      App.contracts.Verification.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    
  },

  render: function () {

    // Load account data and show on UI
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
      }
     });

  },

  signCustomer: function () {

    var name = $('#name').val();
    var dob = $('#dob').val();
    var bankAccount = $('#account').val();
    var message = name + dob + bankAccount;

    message = web3.sha3(message);
    
    // Account data - show on UI
    $("#accountAddress").html("Your Ethereum Account: " + App.account);

    // show message on UI
    $('#messageHolder').html("Your unique message is: " + message);

    // sign the message with eth account
    web3.eth.sign( App.account, message, function (error, signature) {
      // save signature on eth
      App.contracts.Verification.deployed()
        .then(function (instance) {
          verificationInstance = instance;
          verificationInstance.addCustomerSignature(bankAccount,signature);
        }).catch(function (error) {
          console.warn(error);
        });

    });

  },

  verifyCustomer: function () {

    var name = $('#name').val();
    var dob = $('#dob').val();
    var bankAccount = $('#account').val();
    var account = $('#ethAccount').val();
    var message = name + dob + bankAccount;

    message = web3.sha3(message);

    // retrieve signatures
    App.contracts.Verification.deployed()
        .then(function (instance) {
          App.verificationInstance = instance;
          return instance.getCustomerSignature(bankAccount);

        }).then(function (signature) {

          if(signature == ''){

            alert("No signature found on ethereum");

          }else{

            // show signature on UI
            $('#signatureHolder').html("Customer's signature is: <br> "+signature);

            // validate if account is a valid address
            if(!web3.isAddress(account)){
              alert("Invalid ethereum address");
              return;
            }

            // do signature verification 
            App.verificationInstance.verifyCustomerSignature(message,account,signature)
              .then(function (verificationStatus){

                if(verificationStatus == true){
                  alert("verification success");
                }else{
                  alert("verification failed")
                }

              }).catch(function (error) {
                console.warn(error);
              });

          }
        }).catch(function (error) {
          console.warn(error);
        });

  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
