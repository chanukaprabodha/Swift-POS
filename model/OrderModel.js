import { Orders } from "../db/DB";

export function saveOrder(order) {
    Orders.push(order);
}

export function getOrders() {
    return Orders;
}