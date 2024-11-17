import { saveItem } from "../model/StockModel.js";
import { getItems } from "../model/StockModel.js";
import { deleteItem } from "../model/StockModel.js";
import { updateItem } from "../model/StockModel.js";

document
  .querySelector("#stock #stockForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

$(document).ready(function () {
  refresh();
});

var itemCode;
var itemName;
var itemPrice;
var itemQty;

// Save Item

$("#stock #addBtn").click(function () {
  itemName = $("#stock #itemName").val();
  itemCode = $("#stock #itemCode").val();
  itemPrice = $("#stock #itemPrice").val();
  itemQty = $("#stock #itemQty").val();

  let item = {
    itemName: itemName,
    itemCode: itemCode,
    itemQty: itemQty,
    itemPrice: itemPrice,
  };

  if (validate(item)) {
    saveItem(item);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Item has been added",
      showConfirmButton: false,
      timer: 1500,
    });
    refresh();
  }
});

// Delete Item

$("#stock #deleteBtn").click(function () {
  let id = $("#stock #itemCode").val();
  let items = getItems();
  let item = items.findIndex((item) => item.itemCode === id);
  if (item >= 0) {
    deleteItem(item);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Item has been deleted",
      showConfirmButton: false,
      timer: 1500,
    });
    refresh();
  } else {
    $("#stock .invalidCode").text("Item Code does not exist");
  }
});

// Update Item

$("#stock #updateBtn").click(function () {
  let item = {
    itemName: $("#stock #itemName").val(),
    itemCode: "I00",
    itemQty: $("#stock #itemQty").val(),
    itemPrice: $("#stock #itemPrice").val(),
  };

  let valid = validate(item);

  item.itemId = $("#stock #itemCode").val();

  if (valid) {
    let items = getItems();
    let index = items.findIndex((i) => i.itemId === item.itemCode);
    updateItem(index, item);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Item has been updated",
      showConfirmButton: false,
      timer: 1500,
    });
    refresh();
  }
});

// Clear Fields

$("#stock #clearBtn").click(function () {
  refresh();
});

// Validation
function validate(item) {
  let valid = true;

  // Code Validation

  if (/^I0[0-9]+$/.test(item.itemCode)) {
    $("#stock .invalidCode").text("");
    valid = true;
  } else {
    $("#stock .invalidCode").text("Invalid Item Code");
    valid = false;
  }

  // Name Validation

  if (/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/.test(item.itemName)) {
    $("#stock .invalidName").text("");

    if (valid) {
      valid = true;
    }
  } else {
    $("#stock .invalidName").text("Invalid Item Name");
    valid = false;
  }

  // Quantity Validation

  if (item.itemQty != null && item.itemQty > 0) {
    $("#stock .invalidQty").text("");
    if (valid) {
      valid = true;
    }
  } else {
    $("#stock .invalidQty").text("Invalid Item Quantity");
    valid = false;
  }

  // Price Validation

  if (item.itemPrice != null && item.itemPrice > 0) {
    $("#stock .invalidPrice").text("");
    if (valid) {
      valid = true;
    }
  } else {
    $("#stock .invalidPrice").text("Invalid Item Price");
    valid = false;
  }

  let items = getItems();

  return valid;
}

function extractNumber(id) {
  var match = id.match(/I0(\d+)/);
  if (match && match.length > 1) {
    return match[1];
  }
  return null;
}

function refresh() {
  $("#stock #itemCode").val(generateId());
  $("#stock #itemName").val("");
  $("#stock #itemQty").val("");
  $("#stock #itemPrice").val("");
  $("#stock .invalidCode").text("");
  $("#stock .invalidName").text("");
  $("#stock .invalidQty").text("");
  $("#stock .invalidPrice").text("");
  loadTable();
}

function generateId() {
  let items = getItems();
  console.log(items);

  if (!items || items.length == 0) {
    return "I01";
  } else {
    let lastItem = items[items.length - 1];
    let number = extractNumber(lastItem.itemCode);
    number++;
    return "I0" + number;
  }
}

function loadTable() {
  let items = getItems();
  $("#stock .tableRow").empty();
  for (let i = 0; i < items.length; i++) {
    $("#stock .tableRow").append(
      "<tr> " +
        "<td>" +
        items[i].itemCode +
        "</td>" +
        "<td>" +
        items[i].itemName +
        "</td>" +
        "<td>" +
        items[i].itemQty +
        "</td>" +
        "<td>" +
        items[i].itemPrice +
        "</td>" +
        "</tr>"
    );
  }
}

$("#stock .tableRow").on("click", "tr", function () {
  let id = $(this).children("td:eq(0)").text();
  let name = $(this).children("td:eq(1)").text();
  let qty = $(this).children("td:eq(2)").text();
  let price = $(this).children("td:eq(3)").text();

  $("#stock #itemCode").val(id);
  $("#stock #itemName").val(name);
  $("#stock #itemQty").val(qty);
  $("#stock #itemPrice").val(price);
});
