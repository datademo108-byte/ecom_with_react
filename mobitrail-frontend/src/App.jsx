
// import { Routes, Route } from "react-router-dom";
// import './App.css'
// import Navbar from './components/Navbar'
// import Home from './pages/Home'
// import About from "./pages/About";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import { DataContext } from "./context/DataContext";
// import { useState } from "react";
// import Products from "./pages/Products";
// import AddProduct from "./pages/AddProduct";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";

// function App() {
//   // 🌞🌙 Theme State
//   const [theme, setTheme] = useState("light");

//   // Toggle Service
//   const toggleTheme = () => {
//     setTheme(prev => (prev === "light" ? "dark" : "light"));
//   };

//   // Data Service
//   function data() {
//     return "name of data from function";
//   }

//   return (
//     <DataContext.Provider value={{ data, toggleTheme, theme }}>
//       <Routes>
//         <Route path='/' element={<> <Navbar /> <Home /> </>} />
//         <Route path='/about' element={<> <Navbar /> <About prop="name of data" data={data()} /> </>} />
//         <Route path='/login' element={<> <Navbar /> <Login /> </>} />
//         <Route path='/register' element={<> <Navbar /> <Register /> </>} />
//         <Route path="/products" element={<><Navbar /><Products /></>} />
//         <Route path="/add-product" element={<><Navbar /><AddProduct /></>} />
//         <Route path="/cart" element={<><Navbar /><Cart /></>} />
//         <Route path="/checkout" element={<><Navbar /><Checkout /></>} />

//       </Routes>
//     </DataContext.Provider>

//   )
// }

// export default App


import { Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { DataContext } from "./context/DataContext";
import { useState } from "react";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders"; // 👈 ADD THIS

function App() {
  // 🌞🌙 Theme State
  const [theme, setTheme] = useState("light");

  // Toggle Service
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Data Service
  function data() {
    return "name of data from function";
  }

  return (
    <DataContext.Provider value={{ data, toggleTheme, theme }}>
      <Routes>
        <Route path='/' element={<> <Navbar /> <Home /> </>} />
        <Route path='/about' element={<> <Navbar /> <About prop="name of data" data={data()} /> </>} />
        <Route path='/login' element={<> <Navbar /> <Login /> </>} />
        <Route path='/register' element={<> <Navbar /> <Register /> </>} />
        <Route path="/products" element={<><Navbar /><Products /></>} />
        <Route path="/add-product" element={<><Navbar /><AddProduct /></>} />
        <Route path="/cart" element={<><Navbar /><Cart /></>} />
        <Route path="/checkout" element={<><Navbar /><Checkout /></>} />
        <Route path="/orders" element={<><Navbar /><Orders /></>} /> {/* 👈 ADD THIS */}
      </Routes>
    </DataContext.Provider>
  )
}

export default App
