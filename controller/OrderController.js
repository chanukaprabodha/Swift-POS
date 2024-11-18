import { getAllOrders } from "../model/OrderModel.js";
import { getCustomers } from "../model/CustomerModel.js";
import { getItems, updateItem } from "../model/ItemModel.js";
import { saveOrder } from "../model/OrderModel.js";

var itemId;
var itemQty;
var orderQty;

$(document).ready(function () {
  refresh();
});

$(".place-OrderBtn").click(function () {
  refresh();
});

function refresh() {
  $("#place-Order #orderId").val(generateId());
  $("#place-Order #orderDate").val(new Date().toISOString().split("T")[0]);
  loadCustomer();
  loadItems();
  $("#place-Order #total").text("");
  // $('#place-Order .SubTotal').text("");
  // $('#place-Order .SubTotal').text("");
  // $('#place-Order .Balance').val("");
  $("#place-Order #Cash").val("");
  $("#place-Order #discount").val("");

  $(".counts .orders h2").text(getAllOrders().length);
}

function extractNumber(id) {
  var match = id.match(/OD(\d+)/);
  if (match && match.length > 1) {
    return match[1];
  }
  return null;
}

function generateId() {
  let orders = getAllOrders();

  // alert(orders.length);

  if (orders.length === 0) {
    return "OD01";
  } else {
    // alert('awa');
    let orderId = orders[orders.length - 1].orderId;
    let number = extractNumber(orderId);
    number++;
    // alert('OD0' + number);
    return "OD0" + number;
  }
}

function loadCustomer() {
  let cmb = $("#place-Order #cusId");
  cmb.empty();
  let option = [];
  let customers = getCustomers();
  option.unshift("");
  for (let i = 0; i < customers.length; i++) {
    option.push(customers[i].cusId);
  }

  $.each(option, function (index, value) {
    cmb.append($("<option>").val(value).text(value));
  });
}

$("#place-Order #cusId").change(function () {
  let customer = getCustomers().find((c) => c.cusId === $(this).val());
  $("#place-Order #custAddress").val(customer.cusAddress);
});

function loadItems() {
  let cmb = $("#place-Order .itemCmb");
  cmb.empty();
  let option = [];
  let items = getItems();

  for (let i = 0; i < items.length; i++) {
    option.push(items[i].itemId);
  }

  option.unshift("");

  $.each(option, function (index, value) {
    cmb.append($("<option>").val(value).text(value));
  });
}

$("#place-Order .itemCmb").change(function () {
  let item = getItems().find((i) => i.itemId === $(this).val());
  itemId = item.itemId;
  // alert(item.itemQty);
  itemQty = item.itemQty;
  $("#place-Order .addBtn").text("Add");
  $("#place-Order .itemCode").val(item.itemId);
  $("#place-Order .itemName").val(item.itemName);
  $("#place-Order .itemQty").val(item.itemQty);
  $("#place-Order .itemPrice").val(item.itemPrice);
});

let getItems = [];

function clear(tableCount) {
  if (tableCount === 1) {
    $("#place-Order .itemCode").val("");
    $("#place-Order .itemName").val("");
    $("#place-Order .itemPrice").val("");
    $("#place-Order .itemQty").val("");
    $("#place-Order .orderQty").val("");
    $("#place-Order .SubTotal").text("");
    $("#place-Order .Cash").val("");
    $("#place-Order .Total").text("");
    $("#place-Order .Discount").val("");
    $("#place-Order .itemCmb").val("");
  } else {
    $("#place-Order .custId").val("");
    $("#place-Order .custName").val("");
    $("#place-Order .custAddress").val("");
    $("#place-Order .custSalary").val("");
    $("#place-Order .itemCode").val("");
    $("#place-Order .itemName").val("");
    $("#place-Order .itemPrice").val("");
    $("#place-Order .itemQty").val("");
    $("#place-Order .orderQty").val("");
  }
}

$("#place-Order .addBtn").click(function () {
  if ($("#place-Order .addBtn").text() === "delete") {
    dropItem();
  } else {
    let getItem = {
      itemCode: $("#place-Order .itemCode").val(),
      getItems: $("#place-Order .itemName").val(),
      itemPrice: parseFloat($("#place-Order .itemPrice").val()),
      itemQty: parseInt($("#place-Order .orderQty").val(), 10),
      total:
        parseFloat($("#place-Order .itemPrice").val()) *
        parseInt($("#place-Order .orderQty").val(), 10),
    };

    let itemQty = parseInt($("#place-Order .itemQty").val(), 10);
    let orderQty = parseInt($("#place-Order .orderQty").val(), 10);

    if (itemQty >= orderQty) {
      if (
        $("#place-Order .custId").val() !== "" &&
        $("#place-Order .custName").val() !== null
      ) {
        if (orderQty > 0) {
          let item = getItems.find((I) => I.itemCode === getItem.itemCode);
          if (item == null) {
            getItems.push(getItem);
            loadTable();
            clear(1);
            setTotal();
          } else {
            alert("Already Added");
          }
        } else {
          alert("Invalid Quantity");
        }
      } else {
        alert("Invalid Customer");
      }
    } else {
      alert("Not Enough Quantity");
    }
  }
});

function loadTable() {
  $("#place-Order .tableRows").empty();
  for (let i = 0; i < getItems.length; i++) {
    $("#place-Order .tableRows").append(
      "<div> " +
        "<div>" +
        getItems[i].itemCode +
        "</div>" +
        "<div>" +
        getItems[i].getItems +
        "</div>" +
        "<div>" +
        getItems[i].itemPrice +
        "</div>" +
        "<div>" +
        getItems[i].itemQty +
        "</div>" +
        "<div>" +
        getItems[i].total +
        "</div>" +
        "</tr>"
    );
  }
}

function setTotal() {
  let total = 0;
  for (let i = 0; i < getItems.length; i++) {
    total += getItems[i].total;
  }
  $("#place-Order .Total").text(total);
}

$("#place-Order .placeOrder").click(function () {
  let cash = parseFloat($("#place-Order .Cash").val());
  let total = parseFloat($("#place-Order .Total").text());
  let discount = parseFloat($("#place-Order .Discount").val());

  // alert(cash + ' ' + total + ' ' + discount);

  if (cash >= total) {
    if (discount >= 0 && discount <= 100) {
      let subTotal = total - (total * discount) / 100;
      $("#place-Order .SubTotal").text(subTotal.toFixed(2));
      let balance = cash - subTotal;
      $("#place-Order .Balance").val(balance.toFixed(2));

      let Order = {
        orderId: $("#place-Order .orderId").val(),
        orderDate: $("#place-Order .orderDate").val(),
        custId: $("#place-Order .custId").val(),
        items: getItems,
        total: total,
        discount: discount,
        subTotal: subTotal,
        cash: cash,
        balance: balance,
      };

      saveOrder(Order);
      updateItemData();
      getItems = [];
      loadTable();
      clear(2);
      alert("Order Placed");
      refresh();
    } else {
      alert("Invalid Discount");
    }
  } else {
    alert("Not Enough Cash");
  }
});

function updateItemData() {
  let items = getItems();
  for (let i = 0; i < getItems.length; i++) {
    let item = items.find((I) => I.itemId === getItems[i].itemCode);
    item.itemQty -= getItems[i].itemQty;
    let index = items.findIndex((I) => I.itemId === getItems[i].itemCode);
    updateItem(index, item);
  }
}

$(".mainTable .tableRows").on("click", "div", function () {
  let itemCode = $(this).children("div:eq(0)").text();
  let itemName = $(this).children("div:eq(1)").text();
  let price = $(this).children("div:eq(2)").text();
  let qty = $(this).children("div:eq(3)").text();

  $("#place-Order .itemCode").val(itemCode);
  $("#place-Order .itemName").val(itemName);
  $("#place-Order .itemPrice").val(price);
  $("#place-Order .orderQty").val(qty);

  $("#place-Order .ItemSelect .addBtn").text("delete");
  $("#place-Order .ItemSelect .addBtn").css("background-color", "red");
});

function dropItem() {
  let itemCode = $("#place-Order .itemCode").val();
  let item = getItems.find((I) => I.itemCode === itemCode);
  let index = getItems.findIndex((I) => I.itemCode === itemCode);
  getItems.splice(index, 1);
  alert("Item Removed");
  loadTable();
  clear(1);
  setTotal();
}

// $('#place-Order .clearBtn').click(function(){
//  clearFeilds();
// });
// function clearFeilds(){
//     $('#place-Order .itemCode').val('');
//     $('#place-Order .itemName').val('');
//     $('#place-Order .itemPrice').val('');
//     $('#place-Order .orderQty').val('');
// }
