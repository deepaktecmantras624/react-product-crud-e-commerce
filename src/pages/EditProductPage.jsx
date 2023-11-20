import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const EditProductPage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    productName: "",
    description: "",
    metaTagTitle: "",
    modelName: "",
  });

  const navigate = useNavigate();

  const handleTabChange = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  useEffect(() => {
    const productDetails =
      JSON.parse(localStorage.getItem("productFormData")) || [];
    const selectedProduct = productDetails.find((product) => product.id === id);
    setProduct(selectedProduct);

    // Initialize editedProduct state with the product data
    setEditedProduct(selectedProduct ? { ...selectedProduct.data } : null);
  }, [id]);

  //   ------------------------3.1

  const handleSaveEdit = () => {
    const requiredFields = [
      "productName",
      "description",
      "metaTagTitle",
      "modelName",
    ];
    const missingFields = requiredFields.filter(
      (field) => !editedProduct[field].trim()
    );
    if (missingFields.length > 0) {
      missingFields.forEach((field) => {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [field]: `${field} is required`,
        }));
      });
      toast.error("Please fill all the field Correctly");
      return;
    }

    // Check for validation errors
    const hasErrors = Object.values(fieldErrors).some((error) => !!error);

    // If there are errors, stop further execution
    if (hasErrors) {
      //Display a message
      console.log("Validation errors. Cannot save data.");
      return;
    }

    if (editedProduct) {
      // Update the product in the localStorage
      const storedProducts =
        JSON.parse(localStorage.getItem("productFormData")) || [];

      const updatedProducts = storedProducts.map((storedProduct) =>
        storedProduct.id === id
          ? {
              ...storedProduct,
              data: { ...storedProduct.data, ...editedProduct },
            }
          : storedProduct
      );

      localStorage.setItem("productFormData", JSON.stringify(updatedProducts));

      // Update the product in the state
      setProduct((prevProduct) => ({
        ...prevProduct,
        data: { ...prevProduct.data, ...editedProduct },
      }));

      // Redirect to the product list page

      toast.success("Edit Successfull!! 😎😎😎");
      navigate("/productlist");
    }
  };

  // const handleThumbnailUpload = (e) => {
  //   const file = e.target.files[0];
  //   const thumbnailUrl = URL.createObjectURL(file);

  //   setEditedProduct((prevProduct) => ({
  //     ...prevProduct,
  //     thumbnail: thumbnailUrl,
  //   }));
  // };
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];

    // Check if the selected file is an image
    if (file && file.type.startsWith("image")) {
      const thumbnailURL = URL.createObjectURL(file);
      setEditedProduct((prevData) => ({
        ...prevData,
        thumbnail: thumbnailURL,
      }));

      localStorage.setItem("thumbnail", JSON.stringify(thumbnailURL));
    } else {
      // Display an error message if a non-image file is selected for the thumbnail
      toast.error("Please select a valid image file for the thumbnail.");
      // Optionally, you can clear the file input to allow the user to select another file
      e.target.value = null;
    }
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImages = [];
    const newVideos = [];

    for (const file of files) {
      const mediaObject = {
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image") ? "image" : "video",
        productId: id, // Include the product ID when adding new media
      };

      if (mediaObject.type === "image") {
        newImages.push(mediaObject);
      } else {
        newVideos.push(mediaObject);
      }
    }

    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      uploadedImages: [...prevProduct.uploadedImages, ...newImages],
      video: [...prevProduct.video, ...newVideos],
    }));

    const storedMedia = JSON.parse(localStorage.getItem("productMedia")) || [];
    localStorage.setItem(
      "productMedia",
      JSON.stringify([...storedMedia, ...newImages, ...newVideos])
    );
  };

  const handleImageRemove = (index) => {
    const updatedMedia = [...editedProduct.uploadedImages];
    updatedMedia.splice(index, 1);
    setEditedProduct((prevData) => ({
      ...prevData,
      uploadedImages: updatedMedia,
    }));
    localStorage.setItem("productMedia", JSON.stringify(updatedMedia));
  };

  const handleVideoRemove = (index) => {
    const updatedVideo = [...editedProduct.video];
    updatedVideo.splice(index, 1);
    setEditedProduct((prevData) => ({
      ...prevData,
      video: updatedVideo,
    }));
    localStorage.setItem("productMedia", JSON.stringify(updatedVideo));
  };

  //   --------------------
  if (!product) {
    return <div>Loading...</div>;
  }

  // -=-==-=-=-=-=-=-=-=-=--=-=-==-=

  const handleInputChange = (field, value) => {
    if (
      [
        "price",
        "sku",
        "lengths",
        "widths",
        "heights",
        "weight",
        "mpn",
        "upc",
        "quantity",
        "minimumQuantity",
      ].includes(field)
    ) {
      value = parseFloat(value);
    }

    // --------------
    if (typeof value === "string") {
      if (value.trim() === "") {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [field]: `${field} is required`,
        }));
      } else {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
      }
    }

    // Additional validation logic for specific fields if needed
    // Quantity
    if (field === "quantity") {
      const quantityError =
        value < editedProduct.minimumQuantity
          ? "Quantity must be more than Minimum Quantity"
          : "";
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        quantity: quantityError,
      }));
    }

    // Update form data
    setEditedProduct((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  // Render the edit form using the product details
  return (
    <div>
      <Link
        to="/productlist"
        className="text-blue-500 hover:underline block text-center mb-6"
      >
        Go to Product List
      </Link>

      <Link
        to="/"
        className="text-blue-500 hover:underline block text-center mb-6"
      >
        Go to Add Product
      </Link>

      {product && (
        <div className="max-w-xl mx-auto my-8 p-6 bg-gray-100 rounded-md shadow-md text-gray-800">
          <div className="flex justify-between items-center mb-4">
            <p className="text-4xl text-blue-700 font-bold">Edit Products</p>
            <motion.div whileHover={{ scale: 1.2 }}>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </motion.div>
          </div>

          <div className="flex mb-4">
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={`cursor-pointer mr-4 py-2 px-4 rounded ${
                activeTab === 1 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              onClick={() => handleTabChange(1)}
            >
              General
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={`cursor-pointer py-2 px-4 rounded ${
                activeTab === 2 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              onClick={() => handleTabChange(2)}
            >
              Data
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={`cursor-pointer py-2 ml-4 px-4 rounded ${
                activeTab === 3 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              onClick={() => handleTabChange(3)}
            >
              Specification
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={`cursor-pointer py-2 ml-4 px-4 rounded ${
                activeTab === 4 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              onClick={() => handleTabChange(4)}
            >
              Images
            </motion.div>
            {/* Add more tabs as needed */}
          </div>

          <div>
            {activeTab === 1 && (
              <div>
                <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                  Product Name:
                </label>
                {/* <input
                  type="text"
                  className="w-full border p-2 rounded mb-4"
                  value={editedProduct?.productName || ""}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      productName: e.target.value,
                    })
                  }
                /> */}
                <input
                  type="text"
                  className={`w-full border p-2 rounded ${
                    fieldErrors.productName ? "border-red-500" : ""
                  }`}
                  value={editedProduct?.productName || ""}
                  onChange={(e) =>
                    handleInputChange("productName", e.target.value)
                  }
                />
                {fieldErrors.productName && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors.productName}
                  </p>
                )}
                <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                  Description:
                </label>

                <input
                  type="text"
                  className={`w-full border p-2 rounded ${
                    fieldErrors.description ? "border-red-500" : ""
                  }`}
                  value={editedProduct?.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                {fieldErrors.description && (
                  <p className="text-red-600 text-sm">
                    {fieldErrors.description}
                  </p>
                )}

                <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                  Meta Tag Title:
                </label>
                <input
                  type="text"
                  className={`w-full border p-2 rounded ${
                    fieldErrors.metaTagTitle ? "border-red-500" : ""
                  }`}
                  value={editedProduct?.metaTagTitle || ""}
                  onChange={(e) =>
                    handleInputChange("metaTagTitle", e.target.value)
                  }
                />
                {fieldErrors.metaTagTitle && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors.metaTagTitle}
                  </p>
                )}

                <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                  Meta Tag Description:
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={editedProduct?.metaTagDescription || ""}
                  onChange={(e) =>
                    handleInputChange("metaTagDescription", e.target.value)
                  }
                />
              </div>
            )}

            {activeTab === 2 && (
              <div>
                {/* Model Section */}
                <div>
                  <h1 className="text-3xl underline text-gray-700 text-left">
                    Model
                  </h1>
                  <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                    Model Name:
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded mb-4"
                    value={editedProduct?.modelName || ""}
                    onChange={(e) =>
                      handleInputChange("modelName", e.target.value)
                    }
                  />
                  {fieldErrors.modelName && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.modelName}
                    </p>
                  )}
                  <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                    Stock Keeping Unit(SKU):
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={editedProduct?.sku || ""}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                  />{" "}
                  <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                    Manufacture Part Number(MPN):
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded mb-4"
                    value={editedProduct?.mpn || ""}
                    onChange={(e) => handleInputChange("mpn", e.target.value)}
                  />
                  <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                    Universal Product Code(UPC):
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={editedProduct?.upc || ""}
                    onChange={(e) => handleInputChange("upc", e.target.value)}
                  />
                </div>
                <br />
                {/* Price Section */}
                <div>
                  <h1 className="text-3xl underline text-gray-700 text-left">
                    Price
                  </h1>

                  <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                    Price:
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded mb-4"
                    value={editedProduct?.price || ""}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>
                {/* Stock Section */}
                <div>
                  <h1 className="text-3xl underline text-gray-700 text-left">
                    Stock
                  </h1>

                  <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                    Minimum Quantity:
                  </label>
                  <input
                    type="number"
                    className={`w-full border p-2 rounded ${
                      fieldErrors.minimumQuantity ? "border-red-500" : ""
                    }`}
                    value={editedProduct?.minimumQuantity || ""}
                    onChange={(e) =>
                      handleInputChange("minimumQuantity", e.target.value)
                    }
                  />

                  <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    className={`w-full border p-2 rounded ${
                      fieldErrors.quantity ? "border-red-500" : ""
                    }`}
                    value={editedProduct?.quantity || ""}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                  />
                  {fieldErrors.quantity && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.quantity}
                    </p>
                  )}

                  <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                    Out Of Stock Status:
                  </label>
                  <select
                    className="w-full border p-2 rounded mb-4"
                    value={editedProduct?.outOfStockStatus || ""}
                    onChange={(e) =>
                      handleInputChange("outOfStockStatus", e.target.value)
                    }
                  >
                    <option>---None---</option>
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                    <option>Pre-Order</option>
                  </select>
                  <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                    Date Available:
                  </label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded mb-4"
                    min={new Date().toISOString().split("T")[0]}
                    value={editedProduct?.date || ""}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Specification Section */}
            {activeTab === 3 && (
              <div>
                <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                  Dimensions(L X W X H):
                </label>
                <div className="flex">
                  {/* length */}
                  <input
                    type="number"
                    className="w-full border p-2 rounded mb-4"
                    value={editedProduct?.lengths || ""}
                    placeholder="length"
                    onChange={(e) =>
                      handleInputChange("lengths", e.target.value)
                    }
                  />
                  {/* width */}
                  <input
                    type="number"
                    className="w-full border p-2 rounded mb-4"
                    value={editedProduct?.widths || ""}
                    placeholder="width"
                    onChange={(e) =>
                      handleInputChange("widths", e.target.value)
                    }
                  />
                  {/* height */}
                  <input
                    type="number"
                    className="w-full border p-2 rounded mb-4"
                    value={editedProduct?.heights || ""}
                    placeholder="height"
                    onChange={(e) =>
                      handleInputChange("heights", e.target.value)
                    }
                  />
                </div>

                <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                  Dimension Class:
                </label>
                <select
                  className="w-full border p-2 rounded mb-4"
                  value={editedProduct?.dimensionClass || ""}
                  onChange={(e) =>
                    handleInputChange("dimensionClass", e.target.value)
                  }
                >
                  <option>---None---</option>
                  <option>Centimeter</option>
                  <option>Milimeter</option>
                  <option>Inch</option>
                </select>

                <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                  Weight:
                </label>
                <input
                  type="number"
                  className="w-full border p-2 rounded mb-4"
                  value={editedProduct?.weight || ""}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
                <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                  Weight Class:
                </label>
                <select
                  className="w-full border p-2 rounded mb-4"
                  value={editedProduct?.weightClass || ""}
                  onChange={(e) =>
                    handleInputChange("weightClass", e.target.value)
                  }
                >
                  <option>---None---</option>
                  <option>Kilogram</option>
                  <option>Gram</option>
                  <option>Pound</option>
                  <option>Ounce</option>
                </select>

                <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                  Status:
                </label>
                <select
                  className="w-full border p-2 rounded mb-4"
                  value={editedProduct?.status || ""}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option>---None---</option>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
            )}

            {/* Image Section */}
            {activeTab === 4 && (
              <div className="container mx-auto my-8 p-8 bg-gray-100 rounded shadow-lg">
                <h2 className="text-2xl font-bold mt-8">Thumbnail Image</h2>
                <input
                  type="file"
                  onChange={handleThumbnailUpload}
                  className="mb-4 border border-gray-300 p-2"
                />

                <div className="w-1/4 p-2">
                  <img
                    src={editedProduct?.thumbnail}
                    alt="Thumbnail"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>

                <h1 className="text-3xl font-bold mb-4">
                  Image Upload and Display
                </h1>
                <input
                  type="file"
                  onChange={handleUpload}
                  multiple
                  className="mb-4 border border-gray-300 p-2"
                />
                <div className="flex flex-wrap -mx-2">
                  {editedProduct.uploadedImages?.map((image, index) => (
                    <div key={index} className="relative w-1/4 p-2">
                      <img
                        src={image.url}
                        alt={`Uploaded ${index}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleImageRemove(index)}
                        title="Remove Image"
                      >
                        x
                      </button>
                    </div>
                  ))}

                  {/* Display Video from video */}
                  {editedProduct.video?.map((data, index) => (
                    <div key={index} className="relative w-1/3 p-2">
                      <video controls width="100%" height="80%">
                        <source src={data.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleVideoRemove(index)}
                        title="Remove Video"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
