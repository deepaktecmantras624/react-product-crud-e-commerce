import React from "react";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../pages/AddProduct";
import ProductList from "../pages/ProductList";
import EditProductPage from "../pages/EditProductPage";
const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AddProduct />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/edit/:id" element={<EditProductPage />} />

        
      </Routes>
    </div>
  );
};

export default AllRoutes;
