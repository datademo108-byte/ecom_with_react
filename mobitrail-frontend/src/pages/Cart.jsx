import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  // Destructure all needed functions from CartContext
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate total price
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container my-4">
      <h2 className="fw-bold">🛒 My Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info">Your cart is empty</div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {cart.map((item) => (
              <div className="card mb-3" key={item._id}>
                <div className="row g-0 p-2 align-items-center">
                  <div className="col-3 text-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ height: "100px", objectFit: "cover" }}
                      className="img-fluid rounded"
                    />
                  </div>

                  <div className="col-6">
                    <h6>{item.name}</h6>
                    <p>₹{item.price}</p>

                    {/* Decrease quantity button - uses updateQuantity with quantity-1 */}
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    {/* Increase quantity button - uses updateQuantity with quantity+1 */}
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="col-3">
                    {/* Remove button */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card p-3">
              <h5>Total: ₹{total}</h5>
              <button
                className="btn btn-success w-100 mt-3"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;