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
    $(document).on('click', '#ViewTransaction', App.viewTransaction);
    $(document).on('click', '#ViewBlock', App.viewBlock);
    $(document).on('click', '#ViewOrderList', App.viewOrderList);
    $(document).on('click', '#CountOrders', App.countOrders);
  },


  saveOrder : function(event) {
  	event.preventDefault();
  	//var orderId = $('#OrderId').val();
    var orderId = Math.floor((Math.random() * 500) + 1);
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
        
        document.getElementById("ShipComp").value="";
        document.getElementById("ReceiptComp").value="";
        document.getElementById("ProductId").value="";
        document.getElementById("Quantity").value="";
        alert('Order saved ');
        $('.OrderDetails').text('Your Order is saved with orderId:' + orderId);
        
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
  },

  viewOrderList : function(event) {
    event.preventDefault();

    console.log('Retrieving Order List');
    var SupplyChainInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

     var account = accounts[0]; 

     App.contracts.SupplyChain.deployed().then(function(instance){
      SupplyChainInstance = instance;
      return SupplyChainInstance.viewOrderList({from: account});
     }).then(function(result) {
       // alert(result);
        $('.OrderDetails').text('Order List with Order ids : ' + result);
     }).catch(function(err) {
        console.log(err.message);
     });
    });     
  },

  countOrders : function(event) {
    event.preventDefault();

    console.log('Counting total Orders');
    var SupplyChainInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

     var account = accounts[0]; 

     App.contracts.SupplyChain.deployed().then(function(instance){
      SupplyChainInstance = instance;
      return SupplyChainInstance.countOrders({from: account});
     }).then(function(result) {
       // alert(result);
        $('.OrderDetails').text('Total number of orders are : ' + result);
     }).catch(function(err) {
        console.log(err.message);
     });
    });     
  },
  

  viewTransaction :  function(event) {
    web3.eth.getBlock("latest", function (error, latestBlock) {
      if(!error) 
        GetTransaction(latestBlock);
      else
        console.error(error);
    });

    function GetTransaction(latestBlock) {
      console.log("getting transaction: " + latestBlock.transactions[0]);
      var txhash = latestBlock.transactions[0];

      console.log('Current Transaction hash is : ' + txhash );
      web3.eth.getTransaction(txhash, function(error, tx){
        if(!error){
         // $('.OrderDetails').text('Current Transaction Details are : ' + tx);
         $('.OrderDetails').text("  tx hash : " + tx.hash + "\n" 
          + "   nonce           : " + tx.nonce + "\n"
          + "   blockHash       : " + tx.blockHash + "\n"
          + "   blockNumber     : " + tx.blockNumber + "\n"
          + "   value           : " + tx.value + "\n"
          + "   gasPrice        : " + tx.gasPrice + "\n"
          + "   gas             : " + tx.gas + "\n"
          );
        } else
            console.error(error);
      });

    }

  },

  viewBlock : function(event) {
    
  }
	
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});