import { ApiClient } from "./Api";

// Folder
export const createFolder = (payload) =>
  ApiClient.post("/Folder/CreateFolder", payload);
export const folderDetail = (payload) =>
  ApiClient.get("/Folder/DetailFolder", payload);
export const updateFolder = (payload) =>
  ApiClient.post("/Folder/UpdateFolder", payload);
export const deleteFolder = (payload) =>
  ApiClient.post("/Folder/DeleteFolder", payload);
export const folderList = (payload) =>
  ApiClient.get("/Folder/ListFolder", payload);

// File
export const uploadFile = (payload) =>
  ApiClient.post("/File/UploadFile", payload);
export const deleteFile = (payload) =>
  ApiClient.post("/File/DeleteFile", payload);
