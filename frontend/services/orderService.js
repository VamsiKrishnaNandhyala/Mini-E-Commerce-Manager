"use client";

import apiClient, { unwrap } from "./apiClient";

export const orderService = {
  getAll: async () => unwrap(await apiClient.get("/orders")),
  create: async (payload) => unwrap(await apiClient.post("/orders", payload)),
  update: async (id, payload) => unwrap(await apiClient.put(`/orders/${id}`, payload)),
  remove: async (id) => unwrap(await apiClient.delete(`/orders/${id}`))
};
