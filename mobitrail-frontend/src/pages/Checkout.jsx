import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debug: Check if clearCart exists
  console.log("CartContext - clearCart available:", !!clearCart);
  console.log("Cart items:", cart);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // For Vite, use import.meta.env instead of process.env
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // Configure axios with auth token
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Add request/response interceptors for debugging
  api.interceptors.request.use(request => {
    console.log('Starting Request:', request.url, request.data);
    return request;
  });

  api.interceptors.response.use(
    response => {
      console.log('Response:', response.data);
      return response;
    },
    error => {
      console.error('API Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if script already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const loadRazorpay = async () => {
    try {
      setLoading(true);
      setError("");

      // Check if user is logged in
      if (!user) {
        setError("Please login to continue");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      // Check if token exists
      if (!token) {
        setError("Authentication token missing. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      // Check if cart is empty
      if (cart.length === 0) {
        setError("Your cart is empty");
        setTimeout(() => navigate("/products"), 2000);
        return;
      }

      // Check if total is valid
      if (total <= 0) {
        setError("Invalid total amount");
        return;
      }

      // Check if Razorpay key exists
      if (!RAZORPAY_KEY_ID) {
        setError("Razorpay key is missing. Please check your environment configuration.");
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please check your internet connection.");
        return;
      }

      console.log("Creating order with amount:", total);

      // 1️⃣ Create order from backend
      const orderResponse = await api.post("/payment/create-order", {
        amount: total,
      });

      console.log("Order created:", orderResponse.data);
      const order = orderResponse.data;

      // 2️⃣ Razorpay options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "My Shop",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          console.log("✅ Payment successful:", response);
          
          try {
            // Verify payment signature
            console.log("🔐 Verifying payment signature...");
            const verifyResponse = await api.post("/payment/verify-payment", {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            console.log("📝 Verification response:", verifyResponse.data);

            if (verifyResponse.data.success) {
              console.log("💾 Saving order to database...");
              
              // Prepare order data
              const orderData = {
                items: cart.map(item => ({
                  _id: item._id,
                  name: item.name,
                  price: Number(item.price),
                  quantity: Number(item.quantity)
                })),
                totalAmount: Number(total),
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              };
              
              console.log("📦 Order data being sent:", orderData);

              // Save order
              const saveOrderResponse = await api.post("/orders", orderData);

              console.log("✅ Order saved response:", saveOrderResponse.data);

              if (saveOrderResponse.data.success || saveOrderResponse.data.order) {
                // Check if clearCart exists before calling it
                if (typeof clearCart === 'function') {
                  console.log("Clearing cart...");
                  clearCart();
                } else {
                  console.warn("clearCart is not a function, skipping cart clear");
                }
                
                alert("✅ Payment Successful & Order Placed!");
                navigate("/orders");
              } else {
                throw new Error(saveOrderResponse.data.error || "Failed to save order");
              }
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("❌ Post-payment error:", {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
            });
            
            // Show more specific error message
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            setError(`Payment successful but order placement failed: ${errorMsg}. Please contact support with payment ID: ${response.razorpay_payment_id}`);
            
            // Don't clear cart so user can try again
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: "",
        },
        theme: {
          color: "#0d6efd",
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            setLoading(false);
          }
        },
      };

      console.log("Opening Razorpay with options:", {
        ...options,
        key: "HIDDEN"
      });
      
      // 3️⃣ Open Razorpay popup
      const razorpay = new window.Razorpay(options);
      
      // Add error handler
      razorpay.on('payment.failed', function(response) {
        console.error("❌ Payment failed:", response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpay.open();
      
    } catch (error) {
      console.error("❌ Payment error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });

      // Handle specific error cases
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Session expired. Please login again.");
            setTimeout(() => navigate("/login"), 2000);
            break;
          case 400:
            setError(error.response.data.error || "Invalid request. Please check your cart.");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError(error.response.data.error || "Payment failed. Please try again.");
        }
      } else if (error.request) {
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        setError(error.message || "Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h2>Please Login to Checkout</h2>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">💳 Checkout</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center">
          <h4>Your cart is empty</h4>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {cart.map((item) => (
                      <li className="list-group-item d-flex justify-content-between align-items-center" key={item._id}>
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">Quantity: {item.quantity}</small>
                        </div>
                        <span className="fw-bold">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between">
                    <h5>Total Amount:</h5>
                    <h5 className="text-primary">₹{total}</h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Payment Details</h5>
                </div>
                <div className="card-body">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <hr />
                  <button 
                    className="btn btn-success w-100" 
                    onClick={loadRazorpay}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      "Pay with Razorpay"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;