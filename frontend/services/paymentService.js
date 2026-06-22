"use client";

import apiClient, { unwrap } from "./apiClient";

export const paymentService = {
  getAll: async () => unwrap(await apiClient.get("/payments")),
  create: async (payload) => unwrap(await apiClient.post("/payments", payload)),
  update: async (id, payload) => unwrap(await apiClient.put(`/payments/${id}`, payload)),
  remove: async (id) => unwrap(await apiClient.delete(`/payments/${id}`))
};
