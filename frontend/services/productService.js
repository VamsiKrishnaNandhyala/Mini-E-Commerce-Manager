"use client";

import apiClient, { unwrap } from "./apiClient";

export const productService = {
  getAll: async () => unwrap(await apiClient.get("/products")),
  create: async (payload) => unwrap(await apiClient.post("/products", payload)),
  update: async (id, payload) => unwrap(await apiClient.put(`/products/${id}`, payload)),
  remove: async (id) => unwrap(await apiClient.delete(`/products/${id}`))
};
