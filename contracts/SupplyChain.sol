pragma solidity ^0.4.18;

contract SupplyChain {
    
    struct Order {
        string shipCompId;
        string receiptCompId;
       // uint status;
        string productId;
        uint quantity;

    }
     
    uint orderId; 
    mapping (uint => Order) orders;
    uint[] public orderList;


    function saveOrder(uint _orderId, string _shipCompId, string _receiptCompId, string _productId, uint _quantity) public {
    	var newOrder = orders[_orderId];

    	newOrder.shipCompId = _shipCompId;
    	newOrder.receiptCompId = _receiptCompId;
    	newOrder.productId = _productId;
    	newOrder.quantity = _quantity;

    	orderList.push(_orderId) -1;

    }
    
    
    function viewOrderList() view public returns(uint[]) {
        return orderList;
    }
    
    function viewOrder(uint _orderId) view public returns (string, string, string, uint) {
        return (orders[_orderId].shipCompId, orders[_orderId].receiptCompId, orders[_orderId].productId, orders[_orderId].quantity);
    }
    
    function countOrders() view public returns (uint) {
        return orderList.length;
    }
    
}