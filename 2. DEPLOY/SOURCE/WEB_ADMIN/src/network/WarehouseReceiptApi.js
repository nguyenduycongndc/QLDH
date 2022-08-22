import { ApiClient } from "./Api";

export const couponList = (payload) =>
  ApiClient.get("/WarehouseReceipt/Search", payload);
export const createCoupon = (payload) =>
  ApiClient.post("/WarehouseReceipt/CreateWarehouseReceipt", payload);
export const updateCoupon = (payload) =>
  ApiClient.post("/WarehouseReceipt/UpdateWarehouseReceipt", payload);
export const deleteCoupon = (payload) =>
  ApiClient.post("/WarehouseReceipt/delete", payload);
export const couponDetail = (payload) =>
  ApiClient.get("/WarehouseReceipt/Detail", payload);

export const filteredSupplierList = (payload) =>
  ApiClient.get("/WarehouseReceipt/DetailProviderName", payload);
export const filteredOrderList = (payload) =>
  ApiClient.get("/WarehouseReceipt/GetOrder", payload);
