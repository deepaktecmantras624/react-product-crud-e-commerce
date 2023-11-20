import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const ProductList = () => {
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const optionData =
      JSON.parse(localStorage.getItem("productFormData")) || [];
    setProductDetails(optionData);
  }, []);

  const handleDelete = (id) => {
    const newUpdateOptionAfterDelete = productDetails.filter(
      (e) => e.id !== id
    );

    localStorage.setItem(
      "productFormData",
      JSON.stringify(newUpdateOptionAfterDelete)
    );

    setProductDetails(newUpdateOptionAfterDelete);
    toast.success("Product Deleted Successfully!!!😒😢😢");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 2 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto py-10"
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">
        Product Table
      </h1>

      <Link
        to="/"
        className="text-blue-500 hover:underline block text-center mb-6"
      >
        Go to Add Product
      </Link>
      
      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-w-[80%] m-auto border border-gray-300"
      >
        <thead>
          <tr>
            <th className="border py-2 px-4">Image</th>
            <th className="border py-2 px-4">Product Name</th>
            <th className="border py-2 px-4">Price</th>
            <th className="border py-2 px-4">Quantity</th>
            <th className="border py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productDetails?.map((product, index) => (
            <tr
              key={product.id}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="border py-2 px-4 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.4, transformOrigin: "center" }}
                >
                  <img
                    src={product.data.thumbnail}  
                    alt="error"
                    className="w-12 h-12 object-cover rounded"
                  />
                </motion.div>
              </td>
              <td className="border py-2 px-4">{product.data.productName}</td>
              <td className="border py-2 px-4">$ {product.data.price}</td>
              <td className="border py-2 px-4">{product.data.quantity}</td>
              <td className="border py-2 px-4">
                <div className="ml-4">
                  <Link
                    className="py-1 px-3 ml-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring focus:border-yellow-800"
                    to={`/edit/${product.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="py-1 px-3 ml-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:border-red-800"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default ProductList;
