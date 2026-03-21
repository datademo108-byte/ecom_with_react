// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("orders");
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     totalUsers: 0,
//     totalRevenue: 0,
//     pendingOrders: 0,
//     processingOrders: 0,
//     shippedOrders: 0,
//     deliveredOrders: 0,
//     cancelledOrders: 0,
//   });
//   const [userStats, setUserStats] = useState({
//     totalSpent: 0,
//     pendingOrders: 0,
//     deliveredOrders: 0,
//     cancelledOrders: 0,
//   });
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [dateFilter, setDateFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [updatingStatus, setUpdatingStatus] = useState(false);

//   const { user, token } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const api = axios.create({
//     baseURL: "http://localhost:5000/api",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     fetchData();
//   }, [user]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       if (user.isAdmin) {
//         // Admin: fetch all orders and users
//         const ordersResponse = await api.get("/orders/admin/all");
//         const ordersData = ordersResponse.data;
//         setOrders(ordersData);
        
//         const usersResponse = await api.get("/auth/all-users");
//         const usersData = usersResponse.data;
//         setUsers(usersData);
        
//         calculateAdminStats(ordersData, usersData);
//       } else {
//         // Regular user: fetch only their orders
//         const ordersResponse = await api.get("/orders/my-orders");
//         const ordersData = ordersResponse.data;
//         setOrders(ordersData);
        
//         calculateUserStats(ordersData);
//       }
      
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateAdminStats = (ordersData, usersData) => {
//     const totalOrders = ordersData.length;
//     const totalUsers = usersData.length;
//     const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
//     const pendingOrders = ordersData.filter(o => o.orderStatus === "pending").length;
//     const processingOrders = ordersData.filter(o => o.orderStatus === "processing").length;
//     const shippedOrders = ordersData.filter(o => o.orderStatus === "shipped").length;
//     const deliveredOrders = ordersData.filter(o => o.orderStatus === "delivered").length;
//     const cancelledOrders = ordersData.filter(o => o.orderStatus === "cancelled").length;

//     setStats({
//       totalOrders,
//       totalUsers,
//       totalRevenue,
//       pendingOrders,
//       processingOrders,
//       shippedOrders,
//       deliveredOrders,
//       cancelledOrders,
//     });
//   };

//   const calculateUserStats = (ordersData) => {
//     const totalSpent = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
//     const pendingOrders = ordersData.filter(o => o.orderStatus === "pending").length;
//     const deliveredOrders = ordersData.filter(o => o.orderStatus === "delivered").length;
//     const cancelledOrders = ordersData.filter(o => o.orderStatus === "cancelled").length;

//     setUserStats({
//       totalSpent,
//       pendingOrders,
//       deliveredOrders,
//       cancelledOrders,
//     });

//     setStats({
//       totalOrders: ordersData.length,
//       totalUsers: 1,
//       totalRevenue: totalSpent,
//       pendingOrders,
//       processingOrders: ordersData.filter(o => o.orderStatus === "processing").length,
//       shippedOrders: ordersData.filter(o => o.orderStatus === "shipped").length,
//       deliveredOrders,
//       cancelledOrders,
//     });
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       setUpdatingStatus(true);
//       await api.patch(`/orders/${orderId}/status`, { orderStatus: newStatus });
      
//       // Refresh data
//       if (user.isAdmin) {
//         const ordersResponse = await api.get("/orders/admin/all");
//         setOrders(ordersResponse.data);
//         calculateAdminStats(ordersResponse.data, users);
//       } else {
//         const ordersResponse = await api.get("/orders/my-orders");
//         setOrders(ordersResponse.data);
//         calculateUserStats(ordersResponse.data);
//       }
      
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       alert("Failed to update order status");
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "warning",
//       processing: "info",
//       shipped: "primary",
//       delivered: "success",
//       cancelled: "danger",
//     };
//     return `badge bg-${badges[status] || "secondary"}`;
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: '#ffc107',
//       processing: '#0dcaf0',
//       shipped: '#0d6efd',
//       delivered: '#198754',
//       cancelled: '#dc3545',
//     };
//     return colors[status] || '#6c757d';
//   };

//   // Filter orders based on date and search (admin only)
//   const getFilteredOrders = () => {
//     if (!user?.isAdmin) return orders;
    
//     let filtered = [...orders];
    
//     // Date filter
//     const now = new Date();
//     if (dateFilter === "today") {
//       filtered = filtered.filter(order => {
//         const orderDate = new Date(order.createdAt).toDateString();
//         return orderDate === now.toDateString();
//       });
//     } else if (dateFilter === "week") {
//       const weekAgo = new Date(now.setDate(now.getDate() - 7));
//       filtered = filtered.filter(order => new Date(order.createdAt) >= weekAgo);
//     } else if (dateFilter === "month") {
//       const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
//       filtered = filtered.filter(order => new Date(order.createdAt) >= monthAgo);
//     }
    
//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(order => 
//         order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     return filtered;
//   };

//   // ============= USER DASHBOARD =============
//   const UserDashboard = () => (
//     <div className="container my-5">
//       {/* Welcome Header */}
//       <div className="row mb-4">
//         <div className="col-12">
//           <div className="card bg-primary text-white">
//             <div className="card-body">
//               <h2>Welcome back, {user?.name}! 👋</h2>
//               <p className="mb-0">Here's your order history and summary</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* User Stats Cards */}
//       <div className="row mb-4">
//         <div className="col-md-3 mb-3">
//           <div className="card bg-info text-white h-100">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-white-50">Total Orders</h6>
//                   <h2 className="mb-0">{stats.totalOrders}</h2>
//                 </div>
//                 <i className="bi bi-box-seam fs-1"></i>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3 mb-3">
//           <div className="card bg-success text-white h-100">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-white-50">Total Spent</h6>
//                   <h2 className="mb-0">₹{userStats.totalSpent}</h2>
//                 </div>
//                 <i className="bi bi-currency-rupee fs-1"></i>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3 mb-3">
//           <div className="card bg-warning text-white h-100">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-white-50">Pending Orders</h6>
//                   <h2 className="mb-0">{userStats.pendingOrders}</h2>
//                 </div>
//                 <i className="bi bi-clock-history fs-1"></i>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3 mb-3">
//           <div className="card bg-success text-white h-100">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-white-50">Delivered</h6>
//                   <h2 className="mb-0">{userStats.deliveredOrders}</h2>
//                 </div>
//                 <i className="bi bi-check-circle fs-1"></i>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="card">
//         <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
//           <h5 className="mb-0">📋 My Orders</h5>
//           <button className="btn btn-sm btn-outline-light" onClick={fetchData}>
//             <i className="bi bi-arrow-repeat me-1"></i> Refresh
//           </button>
//         </div>
//         <div className="card-body">
//           {orders.length === 0 ? (
//             <div className="text-center py-5">
//               <i className="bi bi-cart-x fs-1 text-muted"></i>
//               <h4 className="mt-3">No orders yet</h4>
//               <p className="text-muted">Start shopping to place your first order!</p>
//               <button 
//                 className="btn btn-primary mt-2"
//                 onClick={() => navigate("/products")}
//               >
//                 Browse Products
//               </button>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover">
//                 <thead>
//                   <tr>
//                     <th>Order ID</th>
//                     <th>Date</th>
//                     <th>Items</th>
//                     <th>Total</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr key={order._id}>
//                       <td>
//                         <small>{order.orderId?.substring(0, 15)}...</small>
//                       </td>
//                       <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                       <td>{order.items?.length} items</td>
//                       <td><strong>₹{order.totalAmount}</strong></td>
//                       <td>
//                         <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
//                           {order.orderStatus.toUpperCase()}
//                         </span>
//                       </td>
//                       <td>
//                         <button 
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setShowOrderModal(true);
//                           }}
//                         >
//                           <i className="bi bi-eye"></i> View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // ============= ADMIN DASHBOARD =============
//   const AdminDashboard = () => (
//     <div className="container-fluid my-5 px-4">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold">📊 Admin Dashboard</h2>
//         <div>
//           <span className="badge bg-primary p-2 me-2">
//             <i className="bi bi-shield-lock me-1"></i> Admin Access
//           </span>
//           <button className="btn btn-sm btn-outline-primary" onClick={fetchData}>
//             <i className="bi bi-arrow-repeat me-1"></i> Refresh
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="row mb-4">
//         <div className="col-md-3 mb-3">
//           <div className="card bg-primary text-white">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-white-50">Total Orders</h6>
//                   <h2 className="mb-0">{stats.totalOrders}</h2>
//                 </div>
//                 <i className="bi bi-cart fs-1"></i>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3 mb-3">
//           <div className="card bg-success text-white">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-white-50">Total Users</h6>
//                   <h2 className="mb-0">{stats.totalUsers}</h2>
//                 </div>
//                 <i className="bi bi-people fs-1"></i>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3 mb-3">
//           <div className="card bg-warning text-white">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-white-50">Total Revenue</h6>
//                   <h2 className="mb-0">₹{stats.totalRevenue.toLocaleString()}</h2>
//                 </div>
//                 <i className="bi bi-currency-rupee fs-1"></i>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3 mb-3">
//           <div className="card bg-danger text-white">
//             <div className="card-body">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-white-50">Pending Orders</h6>
//                   <h2 className="mb-0">{stats.pendingOrders}</h2>
//                 </div>
//                 <i className="bi bi-clock-history fs-1"></i>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Status Overview */}
//       <div className="row mb-4">
//         <div className="col-12">
//           <div className="card">
//             <div className="card-body">
//               <h5 className="card-title mb-3">Order Status Overview</h5>
//               <div className="row text-center">
//                 {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
//                   <div className="col" key={status}>
//                     <div className="p-3" style={{backgroundColor: `${getStatusColor(status)}20`, borderRadius: '8px'}}>
//                       <span className={`badge bg-${getStatusBadge(status).split(' ')[1]}`}>
//                         {status.toUpperCase()}
//                       </span>
//                       <h4 className="mt-2">{stats[`${status}Orders`]}</h4>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <ul className="nav nav-tabs mb-4">
//         <li className="nav-item">
//           <button 
//             className={`nav-link ${activeTab === 'orders' ? 'active fw-bold' : ''}`}
//             onClick={() => setActiveTab('orders')}
//           >
//             <i className="bi bi-cart me-1"></i> Orders Management
//           </button>
//         </li>
//         <li className="nav-item">
//           <button 
//             className={`nav-link ${activeTab === 'users' ? 'active fw-bold' : ''}`}
//             onClick={() => setActiveTab('users')}
//           >
//             <i className="bi bi-people me-1"></i> Users Management
//           </button>
//         </li>
//       </ul>

//       {/* Orders Tab */}
//       {activeTab === 'orders' && (
//         <div className="card">
//           <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">📋 All Orders</h5>
//             <div className="d-flex gap-2">
//               <select 
//                 className="form-select form-select-sm bg-dark text-white border-secondary"
//                 style={{width: '150px'}}
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//               >
//                 <option value="all">All Time</option>
//                 <option value="today">Today</option>
//                 <option value="week">Last 7 Days</option>
//                 <option value="month">Last 30 Days</option>
//               </select>
//               <input 
//                 type="text" 
//                 className="form-control form-control-sm bg-dark text-white border-secondary"
//                 style={{width: '250px'}}
//                 placeholder="Search orders..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="card-body">
//             <div className="table-responsive">
//               <table className="table table-hover">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Order ID</th>
//                     <th>Customer</th>
//                     <th>Date</th>
//                     <th>Items</th>
//                     <th>Total</th>
//                     <th>Status</th>
//                     <th>Payment</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {getFilteredOrders().map((order) => (
//                     <tr key={order._id}>
//                       <td>
//                         <small>{order.orderId?.substring(0, 12)}...</small>
//                       </td>
//                       <td>
//                         <strong>{order.user?.name}</strong><br />
//                         <small className="text-muted">{order.user?.email}</small>
//                       </td>
//                       <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                       <td>{order.items?.length}</td>
//                       <td><strong>₹{order.totalAmount}</strong></td>
//                       <td>
//                         <select 
//                           className="form-select form-select-sm"
//                           style={{
//                             backgroundColor: getStatusColor(order.orderStatus),
//                             color: 'white',
//                             border: 'none',
//                             fontWeight: 'bold'
//                           }}
//                           value={order.orderStatus}
//                           onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                           disabled={updatingStatus}
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="processing">Processing</option>
//                           <option value="shipped">Shipped</option>
//                           <option value="delivered">Delivered</option>
//                           <option value="cancelled">Cancelled</option>
//                         </select>
//                       </td>
//                       <td>
//                         <small className="text-muted">{order.paymentId?.substring(0, 8)}...</small>
//                       </td>
//                       <td>
//                         <button 
//                           className="btn btn-sm btn-outline-info"
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setShowOrderModal(true);
//                           }}
//                         >
//                           <i className="bi bi-eye"></i> view
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Users Tab */}
//       {activeTab === 'users' && (
//         <div className="card">
//           <div className="card-header bg-dark text-white">
//             <h5 className="mb-0">👥 Registered Users</h5>
//           </div>
//           <div className="card-body">
//             <div className="table-responsive">
//               <table className="table table-hover">
//                 <thead className="table-light">
//                   <tr>
//                     <th>#</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Orders</th>
//                     <th>Total Spent</th>
//                     <th>Joined</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((userItem, index) => {
//                     const userOrders = orders.filter(o => o.user?._id === userItem._id);
//                     const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
                    
//                     return (
//                       <tr key={userItem._id}>
//                         <td>{index + 1}</td>
//                         <td>
//                           <strong>{userItem.name}</strong>
//                           {userItem.isAdmin && <i className="bi bi-shield-fill-check ms-2 text-primary"></i>}
//                         </td>
//                         <td>{userItem.email}</td>
//                         <td>
//                           {userItem.isAdmin ? (
//                             <span className="badge bg-danger">Admin</span>
//                           ) : (
//                             <span className="badge bg-secondary">User</span>
//                           )}
//                         </td>
//                         <td>
//                           <span className="badge bg-primary">{userOrders.length}</span>
//                         </td>
//                         <td>
//                           <strong>₹{totalSpent.toLocaleString()}</strong>
//                         </td>
//                         <td>
//                           {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'N/A'}
//                         </td>
//                         <td>
//                           <span className="badge bg-success">Active</span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // ============= ORDER DETAILS MODAL =============
//   const OrderDetailsModal = () => (
//     <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//       <div className="modal-dialog modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Order Details</h5>
//             <button 
//               type="button" 
//               className="btn-close"
//               onClick={() => setShowOrderModal(false)}
//             ></button>
//           </div>
//           <div className="modal-body">
//             <div className="row mb-3">
//               <div className="col-md-6">
//                 <h6 className="text-muted">Customer Information</h6>
//                 <p>
//                   <strong>Name:</strong> {selectedOrder.user?.name}<br />
//                   <strong>Email:</strong> {selectedOrder.user?.email}<br />
//                   <strong>User ID:</strong> {selectedOrder.user?._id}
//                 </p>
//               </div>
//               <div className="col-md-6">
//                 <h6 className="text-muted">Order Information</h6>
//                 <p>
//                   <strong>Order ID:</strong> {selectedOrder.orderId}<br />
//                   <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}<br />
//                   <strong>Status:</strong> 
//                   <span className={`badge ${getStatusBadge(selectedOrder.orderStatus)} ms-2`}>
//                     {selectedOrder.orderStatus}
//                   </span><br />
//                   <strong>Payment ID:</strong> {selectedOrder.paymentId}
//                 </p>
//               </div>
//             </div>
            
//             <h6 className="text-muted">Items Purchased</h6>
//             <table className="table table-sm">
//               <thead className="table-light">
//                 <tr>
//                   <th>Product</th>
//                   <th>Price</th>
//                   <th>Quantity</th>
//                   <th>Subtotal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedOrder.items?.map((item, idx) => (
//                   <tr key={idx}>
//                     <td>{item.name}</td>
//                     <td>₹{item.price}</td>
//                     <td>{item.quantity}</td>
//                     <td>₹{item.price * item.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot className="table-light">
//                 <tr>
//                   <th colSpan="3" className="text-end">Total Amount:</th>
//                   <th>₹{selectedOrder.totalAmount}</th>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//           <div className="modal-footer">
//             <button 
//               type="button" 
//               className="btn btn-secondary"
//               onClick={() => setShowOrderModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="container my-5 text-center">
//         <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-3 text-muted">Loading your dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {user?.isAdmin ? <AdminDashboard /> : <UserDashboard />}
//       {showOrderModal && selectedOrder && <OrderDetailsModal />}
//     </>
//   );
// }

// export default Orders;



import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (user.isAdmin) {
        // Admin: fetch all orders and users
        const ordersResponse = await api.get("/orders/admin/all");
        const ordersData = ordersResponse.data;
        setOrders(ordersData);
        
        const usersResponse = await api.get("/auth/all-users");
        const usersData = usersResponse.data;
        setUsers(usersData);
        
        calculateAdminStats(ordersData, usersData);
      } else {
        // Regular user: fetch only their orders
        const ordersResponse = await api.get("/orders/my-orders");
        const ordersData = ordersResponse.data;
        setOrders(ordersData);
        
        calculateUserStats(ordersData);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAdminStats = (ordersData, usersData) => {
    const totalOrders = ordersData.length;
    const totalUsers = usersData.length;
    const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = ordersData.filter(o => o.orderStatus === "pending").length;
    const processingOrders = ordersData.filter(o => o.orderStatus === "processing").length;
    const shippedOrders = ordersData.filter(o => o.orderStatus === "shipped").length;
    const deliveredOrders = ordersData.filter(o => o.orderStatus === "delivered").length;
    const cancelledOrders = ordersData.filter(o => o.orderStatus === "cancelled").length;

    setStats({
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    });
  };

  const calculateUserStats = (ordersData) => {
    const totalSpent = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = ordersData.filter(o => o.orderStatus === "pending").length;
    const deliveredOrders = ordersData.filter(o => o.orderStatus === "delivered").length;
    const cancelledOrders = ordersData.filter(o => o.orderStatus === "cancelled").length;

    setUserStats({
      totalSpent,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
    });

    setStats({
      totalOrders: ordersData.length,
      totalUsers: 1,
      totalRevenue: totalSpent,
      pendingOrders,
      processingOrders: ordersData.filter(o => o.orderStatus === "processing").length,
      shippedOrders: ordersData.filter(o => o.orderStatus === "shipped").length,
      deliveredOrders,
      cancelledOrders,
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await api.patch(`/orders/${orderId}/status`, { orderStatus: newStatus });
      
      // Refresh data
      if (user.isAdmin) {
        const ordersResponse = await api.get("/orders/admin/all");
        setOrders(ordersResponse.data);
        calculateAdminStats(ordersResponse.data, users);
      } else {
        const ordersResponse = await api.get("/orders/my-orders");
        setOrders(ordersResponse.data);
        calculateUserStats(ordersResponse.data);
      }
      
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "danger",
    };
    return `badge bg-${badges[status] || "secondary"}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#0dcaf0',
      shipped: '#0d6efd',
      delivered: '#198754',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  // ============= PDF GENERATION FUNCTION =============
  const downloadOrderPDF = async (order) => {
    try {
      setDownloadingPdf(true);
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add company logo/header
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204);
      doc.text("MY SHOP", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Order Invoice", 105, 30, { align: "center" });
      
      // Add horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Order Information
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      doc.setFont("helvetica", "bold");
      doc.text("ORDER INFORMATION", 20, 45);
      doc.setFont("helvetica", "normal");
      
      doc.text(`Order ID: ${order.orderId}`, 20, 52);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 58);
      doc.text(`Status: ${order.orderStatus.toUpperCase()}`, 20, 64);
      doc.text(`Payment ID: ${order.paymentId}`, 20, 70);
      
      // Customer Information
      doc.setFont("helvetica", "bold");
      doc.text("CUSTOMER INFORMATION", 120, 45);
      doc.setFont("helvetica", "normal");
      
      doc.text(`Name: ${order.user?.name || 'N/A'}`, 120, 52);
      doc.text(`Email: ${order.user?.email || 'N/A'}`, 120, 58);
      doc.text(`User ID: ${order.user?._id || 'N/A'}`, 120, 64);
      
      // Items Table
      doc.setFont("helvetica", "bold");
      doc.text("ORDER ITEMS", 20, 85);
      
      const tableColumn = ["Product", "Price", "Quantity", "Subtotal"];
      const tableRows = [];
      
      order.items?.forEach(item => {
        const itemData = [
          item.name,
          `₹${item.price}`,
          item.quantity,
          `₹${item.price * item.quantity}`
        ];
        tableRows.push(itemData);
      });
      
      autoTable(doc, {
        startY: 90,
        head: [tableColumn],
        body: tableRows,
        foot: [['', '', 'Total Amount:', `₹${order.totalAmount}`]],
        theme: 'striped',
        headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 40 }
        }
      });
      
      // Footer
      const finalY = doc.lastAutoTable.finalY || 150;
      doc.setLineWidth(0.5);
      doc.line(20, finalY + 10, 190, finalY + 10);
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("This is a computer generated invoice", 105, finalY + 20, { align: "center" });
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, finalY + 25, { align: "center" });
      
      // Save PDF
      doc.save(`Order_${order.orderId}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // ============= DOWNLOAD ALL ORDERS PDF (ADMIN ONLY) =============
  const downloadAllOrdersPDF = async () => {
    try {
      setDownloadingPdf(true);
      
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204);
      doc.text("MY SHOP", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("All Orders Report", 105, 30, { align: "center" });
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Summary Stats
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("SUMMARY STATISTICS", 20, 45);
      doc.setFont("helvetica", "normal");
      
      doc.text(`Total Orders: ${stats.totalOrders}`, 20, 52);
      doc.text(`Total Users: ${stats.totalUsers}`, 20, 58);
      doc.text(`Total Revenue: ₹${stats.totalRevenue}`, 20, 64);
      doc.text(`Pending Orders: ${stats.pendingOrders}`, 20, 70);
      
      // Status Breakdown
      doc.setFont("helvetica", "bold");
      doc.text("STATUS BREAKDOWN", 120, 45);
      doc.setFont("helvetica", "normal");
      
      doc.text(`Pending: ${stats.pendingOrders}`, 120, 52);
      doc.text(`Processing: ${stats.processingOrders}`, 120, 58);
      doc.text(`Shipped: ${stats.shippedOrders}`, 120, 64);
      doc.text(`Delivered: ${stats.deliveredOrders}`, 120, 70);
      doc.text(`Cancelled: ${stats.cancelledOrders}`, 120, 76);
      
      // All Orders Table
      doc.setFont("helvetica", "bold");
      doc.text("ALL ORDERS", 20, 90);
      
      const tableColumn = ["Order ID", "Customer", "Date", "Items", "Total", "Status"];
      const tableRows = [];
      
      getFilteredOrders().forEach(order => {
        const orderData = [
          order.orderId?.substring(0, 12) + '...',
          order.user?.name || 'N/A',
          new Date(order.createdAt).toLocaleDateString(),
          order.items?.length || 0,
          `₹${order.totalAmount}`,
          order.orderStatus
        ];
        tableRows.push(orderData);
      });
      
      autoTable(doc, {
        startY: 95,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 15 },
          4: { cellWidth: 20 },
          5: { cellWidth: 25 }
        }
      });
      
      // Footer
      const finalY = doc.lastAutoTable.finalY || 150;
      doc.setLineWidth(0.5);
      doc.line(20, finalY + 10, 190, finalY + 10);
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Generated by Admin", 105, finalY + 20, { align: "center" });
      doc.text(`Report generated on: ${new Date().toLocaleString()}`, 105, finalY + 25, { align: "center" });
      
      doc.save(`All_Orders_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Filter orders based on date and search (admin only)
  const getFilteredOrders = () => {
    if (!user?.isAdmin) return orders;
    
    let filtered = [...orders];
    
    // Date filter
    const now = new Date();
    if (dateFilter === "today") {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt).toDateString();
        return orderDate === now.toDateString();
      });
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(order => new Date(order.createdAt) >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(order => new Date(order.createdAt) >= monthAgo);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // ============= USER DASHBOARD =============
  const UserDashboard = () => (
    <div className="container my-5">
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h2>Welcome back, {user?.name}! 👋</h2>
              <p className="mb-0">Here's your order history and summary</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Total Orders</h6>
                  <h2 className="mb-0">{stats.totalOrders}</h2>
                </div>
                <i className="bi bi-box-seam fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Total Spent</h6>
                  <h2 className="mb-0">₹{userStats.totalSpent}</h2>
                </div>
                <i className="bi bi-currency-rupee fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Pending Orders</h6>
                  <h2 className="mb-0">{userStats.pendingOrders}</h2>
                </div>
                <i className="bi bi-clock-history fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Delivered</h6>
                  <h2 className="mb-0">{userStats.deliveredOrders}</h2>
                </div>
                <i className="bi bi-check-circle fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📋 My Orders</h5>
          <div>
            <button className="btn btn-sm btn-outline-light me-2" onClick={fetchData}>
              <i className="bi bi-arrow-repeat me-1"></i> Refresh
            </button>
          </div>
        </div>
        <div className="card-body">
          {orders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart-x fs-1 text-muted"></i>
              <h4 className="mt-3">No orders yet</h4>
              <p className="text-muted">Start shopping to place your first order!</p>
              <button 
                className="btn btn-primary mt-2"
                onClick={() => navigate("/products")}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <small>{order.orderId?.substring(0, 15)}...</small>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.items?.length} items</td>
                      <td><strong>₹{order.totalAmount}</strong></td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                        >
                          <i className="bi bi-eye"></i> view
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => downloadOrderPDF(order)}
                          disabled={downloadingPdf}
                        >
                          <i className="bi bi-file-pdf"></i> download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ============= ADMIN DASHBOARD =============
  const AdminDashboard = () => (
    <div className="container-fluid my-5 px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📊 Admin Dashboard</h2>
        <div>
          <span className="badge bg-primary p-2 me-2">
            <i className="bi bi-shield-lock me-1"></i> Admin Access
          </span>
          <button 
            className="btn btn-sm btn-outline-primary me-2" 
            onClick={fetchData}
            disabled={downloadingPdf}
          >
            <i className="bi bi-arrow-repeat me-1"></i> Refresh
          </button>
          <button 
            className="btn btn-sm btn-success"
            onClick={downloadAllOrdersPDF}
            disabled={downloadingPdf || orders.length === 0}
          >
            <i className="bi bi-file-pdf me-1"></i> 
            {downloadingPdf ? 'Generating...' : 'Download All Orders PDF'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Total Orders</h6>
                  <h2 className="mb-0">{stats.totalOrders}</h2>
                </div>
                <i className="bi bi-cart fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Total Users</h6>
                  <h2 className="mb-0">{stats.totalUsers}</h2>
                </div>
                <i className="bi bi-people fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Total Revenue</h6>
                  <h2 className="mb-0">₹{stats.totalRevenue.toLocaleString()}</h2>
                </div>
                <i className="bi bi-currency-rupee fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50">Pending Orders</h6>
                  <h2 className="mb-0">{stats.pendingOrders}</h2>
                </div>
                <i className="bi bi-clock-history fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">Order Status Overview</h5>
              <div className="row text-center">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <div className="col" key={status}>
                    <div className="p-3" style={{backgroundColor: `${getStatusColor(status)}20`, borderRadius: '8px'}}>
                      <span className={`badge bg-${getStatusBadge(status).split(' ')[1]}`}>
                        {status.toUpperCase()}
                      </span>
                      <h4 className="mt-2">{stats[`${status}Orders`]}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'orders' ? 'active fw-bold' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-cart me-1"></i> Orders Management
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active fw-bold' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-1"></i> Users Management
          </button>
        </li>
      </ul>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📋 All Orders</h5>
            <div className="d-flex gap-2">
              <select 
                className="form-select form-select-sm bg-dark text-white border-secondary"
                style={{width: '150px'}}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <input 
                type="text" 
                className="form-control form-control-sm bg-dark text-white border-secondary"
                style={{width: '250px'}}
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOrders().map((order) => (
                    <tr key={order._id}>
                      <td>
                        <small>{order.orderId?.substring(0, 12)}...</small>
                      </td>
                      <td>
                        <strong>{order.user?.name}</strong><br />
                        <small className="text-muted">{order.user?.email}</small>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.items?.length}</td>
                      <td><strong>₹{order.totalAmount}</strong></td>
                      <td>
                        <select 
                          className="form-select form-select-sm"
                          style={{
                            backgroundColor: getStatusColor(order.orderStatus),
                            color: 'white',
                            border: 'none',
                            fontWeight: 'bold'
                          }}
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          disabled={updatingStatus}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <small className="text-muted">{order.paymentId?.substring(0, 8)}...</small>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-info me-1"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                        >
                          <i className="bi bi-eye"></i> view
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => downloadOrderPDF(order)}
                          disabled={downloadingPdf}
                        >
                          <i className="bi bi-file-pdf"></i> download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">👥 Registered Users</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem, index) => {
                    const userOrders = orders.filter(o => o.user?._id === userItem._id);
                    const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
                    
                    return (
                      <tr key={userItem._id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{userItem.name}</strong>
                          {userItem.isAdmin && <i className="bi bi-shield-fill-check ms-2 text-primary"></i>}
                        </td>
                        <td>{userItem.email}</td>
                        <td>
                          {userItem.isAdmin ? (
                            <span className="badge bg-danger">Admin</span>
                          ) : (
                            <span className="badge bg-secondary">User</span>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-primary">{userOrders.length}</span>
                        </td>
                        <td>
                          <strong>₹{totalSpent.toLocaleString()}</strong>
                        </td>
                        <td>
                          {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <span className="badge bg-success">Active</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============= ORDER DETAILS MODAL =============
  const OrderDetailsModal = () => (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Details</h5>
            <button 
              type="button" 
              className="btn-close"
              onClick={() => setShowOrderModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h6 className="text-muted">Customer Information</h6>
                <p>
                  <strong>Name:</strong> {selectedOrder.user?.name}<br />
                  <strong>Email:</strong> {selectedOrder.user?.email}<br />
                  <strong>User ID:</strong> {selectedOrder.user?._id}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted">Order Information</h6>
                <p>
                  <strong>Order ID:</strong> {selectedOrder.orderId}<br />
                  <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}<br />
                  <strong>Status:</strong> 
                  <span className={`badge ${getStatusBadge(selectedOrder.orderStatus)} ms-2`}>
                    {selectedOrder.orderStatus}
                  </span><br />
                  <strong>Payment ID:</strong> {selectedOrder.paymentId}
                </p>
              </div>
            </div>
            
            <h6 className="text-muted">Items Purchased</h6>
            <table className="table table-sm">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-light">
                <tr>
                  <th colSpan="3" className="text-end">Total Amount:</th>
                  <th>₹{selectedOrder.totalAmount}</th>
                </tr>
              </tfoot>
            </table>
            
            <div className="text-center mt-3">
              <button 
                className="btn btn-success"
                onClick={() => {
                  downloadOrderPDF(selectedOrder);
                  setShowOrderModal(false);
                }}
                disabled={downloadingPdf}
              >
                <i className="bi bi-file-pdf me-1"></i> 
                {downloadingPdf ? 'Generating PDF...' : 'Download Invoice PDF'}
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setShowOrderModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {user?.isAdmin ? <AdminDashboard /> : <UserDashboard />}
      {showOrderModal && selectedOrder && <OrderDetailsModal />}
    </>
  );
}

export default Orders;