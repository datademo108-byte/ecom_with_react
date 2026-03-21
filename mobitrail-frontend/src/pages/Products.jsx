import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Products() {
  const { user, token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [qty, setQty] = useState({});

  // =====================
  // FETCH PRODUCTS
  // =====================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  // =====================
  // DELETE PRODUCT (ADMIN)
  // =====================
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // =====================
  // UPDATE PRODUCT (ADMIN)
  // =====================
  const updateProduct = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${editProduct._id}`,
        editProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Failed to update product");
    }
  };

  // =====================
  // ADD TO CART
  // =====================
  const handleAddToCart = (product) => {
    const quantity = qty[product._id] || 1;
    addToCart(product, quantity);
    alert("Product added to cart");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Products</h2>

      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-4" key={p._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={p.image}
                alt={p.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">₹{p.price}</p>
                <p className="card-text">Stock: {p.stock}</p>

                {/* Quantity Input */}
                <input
                  type="number"
                  min="1"
                  className="form-control mb-2"
                  value={qty[p._id] || 1}
                  onChange={(e) =>
                    setQty({ ...qty, [p._id]: Number(e.target.value) })
                  }
                />

                {/* Add to Cart */}
                <button
                  className="btn btn-success mb-2"
                  onClick={() => handleAddToCart(p)}
                >
                  Add to Cart
                </button>

                {/* Admin Actions */}
                {user?.isAdmin && (
                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm w-50"
                      onClick={() => setEditProduct(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm w-50"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================
          EDIT PRODUCT MODAL
      ===================== */}
      {editProduct && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Product</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditProduct(null)}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Price"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Image URL"
                  value={editProduct.image}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, image: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Stock"
                  value={editProduct.stock}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, stock: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditProduct(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={updateProduct}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
