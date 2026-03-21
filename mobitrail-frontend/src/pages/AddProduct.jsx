import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function AddProduct() {
  const { token, user } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    stock: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.isAdmin) {
      alert("Admin only!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/products",
        {
          name: form.name,
          price: Number(form.price),
          image: form.image,
          stock: Number(form.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Product added successfully");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("❌ Failed to add product");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          className="form-control mb-2"
          placeholder="Product Name"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          className="form-control mb-2"
          placeholder="Price"
          onChange={handleChange}
          required
        />

        <input
          name="image"
          className="form-control mb-2"
          placeholder="Image URL"
          onChange={handleChange}
        />

        <input
          name="stock"
          type="number"
          className="form-control mb-2"
          placeholder="Stock"
          onChange={handleChange}
          required
        />

        <button className="btn btn-success w-100">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
