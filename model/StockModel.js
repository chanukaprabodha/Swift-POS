import { Stock } from "../db/DB.js";

export function saveItem(item) {
    Stock.push(item);
}

export function deleteItem(index) {
    Stock.splice(index, 1);
}

export function updateItem(index, item) {
    Stock[index] = item;
}

export function getItems() {
    return Stock;
}