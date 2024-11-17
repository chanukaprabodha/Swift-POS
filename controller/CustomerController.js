import { saveCustomer } from "../model/CustomerModel.js";
import { updateCustomer } from "../model/CustomerModel.js";
import { deleteCustomer } from "../model/CustomerModel.js";
import { getCustomers } from "../model/CustomerModel.js";

$(document).ready(function () {
  refresh();
});

document
  .querySelector("#customer #customerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

var cusId;
var cusName;
var cusAddress;
var cusEmail;
var cusMobile;

// Save Customer

$("#customer #saveBtn").click(function () {
  cusId = $("#customer #cusId").val();
  cusName = $("#customer #cusName").val();
  cusAddress = $("#customer #cusAddress").val();
  cusEmail = $("#customer #cusEmail").val();
  cusMobile = $("#customer #cusMobile").val();

  let customer = {
    cusId: cusId,
    cusName: cusName,
    cusAddress: cusAddress,
    cusEmail: cusEmail,
    cusMobile: cusMobile,
  };

  let validResult = validate(customer);

  if (validResult) {
    saveCustomer(customer);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Customer has been saved",
      showConfirmButton: false,
      timer: 1500,
    });
    refresh();
  }
});

// Clear

$("#customer #clearBtn").click(function () {
  refresh();
});

// Update Customer

$("#customer #updateBtn").click(function () {
  let UpdateCustomer = {
    cusId: "C00",
    cusName: $("#customer #cusName").val(),
    cusAddress: $("#customer #cusAddress").val(),
    cusEmail: $("#customer #cusSalary").val(),
    cusMobile: $("#customer #cusMobile").val(),
  };

  let validResult = validate(UpdateCustomer);

  UpdateCustomer.cusId = $("#customer #cusId").val();

  if (validResult) {
    let customers = getCustomers();
    let index = customers.findIndex((c) => c.cusId === UpdateCustomer.cusId);
    updateCustomer(index, UpdateCustomer);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Customer has been updated",
      showConfirmButton: false,
      timer: 1500,
    });
    refresh();
  }
});

// Delete Customer

$("#customer #deleteBtn").click(function () {
  let customers = getCustomers();
  let id = $("#customer #cusId").val();

  let index = customers.findIndex((c) => c.cusId === id);
  if (index >= 0) {
    deleteCustomer(index);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Customer has been deleted",
      showConfirmButton: false,
      timer: 1500,
    });
    refresh();
  } else {
    alert("Customer Not Found");
  }
});

// Validate
function validate(customer) {
  let valid = true;

  // ID Validation

  if (/^C0[0-9]+$/.test(customer.cusId)) {
    $("#customer .invalidcusId").text("");
    valid = true;
  } else {
    $("#customer .invalidcusId").text("Invalid Customer Id");
    valid = false;
  }

  // Name Validation

  if ((/^[A-Z][a-z]+( [A-Z][a-z]+)*$/).test(customer.cusName)) {
    $("#customer .invalidcusName").text("");

    if (valid) {
      valid = true;
    }
  } else {
    $("#customer .invalidcusName").text("Invalid Customer Name");
    valid = false;
  }

  // Address Validation

  if ((/^[A-Za-z0-9\s,]+$/
).test(customer.cusAddress)) {
    $("#customer .invalidcusAddress").text("");

    if (valid) {
      valid = true;
    }
  } else {
    $("#customer .invalidcusAddress").text("Invalid Customer Address");
    valid = false;
  }

  // Email Validation

  if (
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(customer.cusEmail)
  ) {
    $("#customer .invalidCusEmail").text("");
    if (valid) {
      valid = true;
    }
  } else {
    $("#customer .invalidCusEmail").text("Invalid Customer Email");
    valid = false;
  }

  // Mobile Validation

  if (/^[0-9]{10}$/.test(customer.cusMobile)) {
    $("#customer .invalidcusMobile").text("");
    if (valid) {
      valid = true;
    }
  } else {
    $("#customer .invalidcusMobile").text("Invalid Customer Mobile");
    valid = false;
  }

  let customers = getCustomers();
  for (let i = 0; i < customers.length; i++) {
    if (customers[i].cusId === customer.cusId) {
      $("#customer .invalidcusId").text("Customer Id Already Exists");
      valid = false;
    }
  }

  return valid;
}

function loadTable(customer) {
  $("#customer .tableRow").append(
    "<tr> " +
      "<td>" +
      customer.cusId +
      "</td>" +
      "<td>" +
      customer.cusName +
      "</td>" +
      "<td>" +
      customer.cusAddress +
      "</td>" +
      "<td>" +
      customer.cusEmail +
      "</td>" +
      "<td>" +
      customer.cusMobile +
      "</td>" +
      "</tr>"
  );
}

function extractNumber(id) {
  var match = id.match(/C0(\d+)/);
  if (match && match.length > 1) {
    return parseInt(match[1]);
  }
  return null;
}

function createCustomerId() {
  let customers = getCustomers();

  if (!customers || customers.length === 0) {
    return "C01";
  } else {
    let lastCustomer = customers[customers.length - 1];
    let id = lastCustomer && lastCustomer.cusId ? lastCustomer.cusId : "C00";

    let number = extractNumber(id);
    number++;
    return "C0" + number;
  }
}

function refresh() {
  $("#customer #cusId").val(createCustomerId());
  $("#customer #cusName").val("");
  $("#customer #cusAddress").val("");
  $("#customer #cusEmail").val("");
  $("#customer #cusMobile").val("");
  $("#customer .invalidcusId").text("");
  $("#customer .invalidcusName").text("");
  $("#customer .invalidcusAddress").text("");
  $("#customer .invalidCusEmail").text("");
  $("#customer .invalidcusMobile").text("");
  $(".count .customers h4").text(getCustomers().length);
  reloadTable();
}

function reloadTable() {
  let customers = getCustomers();
  $("#customer .tableRow").empty();
  customers.forEach((c) => {
    loadTable(c);
  });
}

// Clicked Row

$("#customer .tableRow").on("click", "tr", function () {
  let id = $(this).children("td:eq(0)").text();
  let name = $(this).children("td:eq(1)").text();
  let address = $(this).children("td:eq(2)").text();
  let email = $(this).children("td:eq(3)").text();
  let mobile = $(this).children("td:eq(4)").text();

  $("#customer #cusId").val(id);
  $("#customer #cusName").val(name);
  $("#customer #cusAddress").val(address);
  $("#customer #cusEmail").val(email);
  $("#customer #cusMobile").val(mobile);
});
