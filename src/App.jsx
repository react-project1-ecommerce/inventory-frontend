import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Product from "./pages/Products";
import AddProduct from "./pages/AddProduct"; 
import EditProduct from "./pages/EditProduct";
import Categories from "./pages/Categories.jsx";
import EditCategory from "./pages/EditCategory";

import { ToastContainer } from "react-toastify";

function App() {

  return (
    <BrowserRouter>
      
      <ToastContainer/>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/products" element={<Product/>}/>
        <Route path="/add-product" element={<AddProduct/>}/>
        <Route path="/edit-product/:id" element={<EditProduct/>}/>
        <Route path="/categories" element={<Categories/>}/>
        <Route path="/edit-category/:id"  element={<EditCategory/>}/>

      </Routes>

    </BrowserRouter>
  );
  
}

export default App;
