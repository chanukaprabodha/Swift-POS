import { Customers } from "../db/DB.js";

export function saveCustomer(customer) {
    Customers.push(customer);
}

export function updateCustomer(index,customer) {
    Customers[index] = customer;
}
 
export function deleteCustomer(index) {
    Customers.splice(index, 1);
}

export function getCustomers() {
    return Customers;
}