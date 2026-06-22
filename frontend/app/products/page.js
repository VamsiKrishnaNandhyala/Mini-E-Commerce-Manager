"use client";

import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { productService } from "../../services/productService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const emptyForm = { name: "", price: "", quantity: "" };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setProducts(await productService.getAll());
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({ name: product.name, price: String(product.price), quantity: String(product.quantity) });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      price: Number(form.price),
      quantity: Number(form.quantity)
    };

    try {
      if (editing) {
        await productService.update(editing.id, payload);
      } else {
        await productService.create(payload);
      }
      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await productService.remove(id);
    await loadProducts();
  };

  if (loading) return <Loader label="Loading products" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink">Products</h2>
          <p className="mt-1 text-sm text-muted">Create and maintain inventory records.</p>
        </div>
        <Button onClick={openCreate}>Add Product</Button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Table
        data={products}
        columns={[
          { key: "name", label: "Name" },
          { key: "price", label: "Price", render: (row) => formatCurrency(row.price) },
          { key: "quantity", label: "Quantity" },
          { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Button variant="secondary" className="min-h-8 px-3 py-1" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Button variant="danger" className="min-h-8 px-3 py-1" onClick={() => deleteProduct(row.id)}>
                  Delete
                </Button>
              </div>
            )
          }
        ]}
      />

      <Modal
        title={editing ? "Edit Product" : "Add Product"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="product-form" disabled={saving}>
              {saving ? "Saving" : "Save"}
            </Button>
          </>
        }
      >
        <form id="product-form" className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Field
            label="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(value) => setForm({ ...form, price: value })}
          />
          <Field
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={(value) => setForm({ ...form, quantity: value })}
          />
        </form>
      </Modal>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", step }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        required
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
