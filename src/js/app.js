App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
  	//$('.something').text('ttt');
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
      
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('SupplyChain.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var SupplyChainArtifact = data;
      App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);

      // Set the provider for our contract.
      App.contracts.SupplyChain.setProvider(App.web3Provider);
     //return App.getDefaultName();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#SaveOrder', App.saveOrder);
    $(document).on('click', '#ViewOrder', App.viewOrder);
  },


  saveOrder : function(event) {
  	event.preventDefault();

  	var orderId = $('#OrderId').val();
    var shipComp = $('#ShipComp').val();
  	var receiptComp = $('#ReceiptComp').val();
    var productId = $('#ProductId').val();
    var quantity = $('#Quantity').val();
  	console.log('Saving order with orderId' + orderId);

  	var SupplyChainInstance;

  	web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

     var account = accounts[0]; 

     App.contracts.SupplyChain.deployed().then(function(instance){
     	SupplyChainInstance = instance;
     	return SupplyChainInstance.saveOrder(orderId, shipComp, receiptComp, productId, quantity, {from: account});
     }).then(function(result) {
        //$(document).find('#Name').text('');
        document.getElementById("OrderId").value="";
        document.getElementById("ShipComp").value="";
        document.getElementById("ReceiptComp").value="";
        document.getElementById("ProductId").value="";
        document.getElementById("Quantity").value="";
        alert('Order saved ');

     }).catch(function(err) {
        console.log(err.message);
     });
    });   	
  },


  viewOrder : function(event) {
  	event.preventDefault();

    var orderId = $('#vieworder').val();

  	console.log('Retrieving Order Details');
  	var SupplyChainInstance;

  	web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

     var account = accounts[0]; 

     App.contracts.SupplyChain.deployed().then(function(instance){
     	SupplyChainInstance = instance;
     	return SupplyChainInstance.viewOrder(orderId,{from: account});
     }).then(function(result) {
        alert(result);
        document.getElementById("vieworder").value="";
        $('.OrderDetails').text(result);
     }).catch(function(err) {
        console.log(err.message);
     });
    });   	
  }
	
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});