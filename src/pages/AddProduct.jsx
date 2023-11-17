// import Link from "next/link";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const AddProduct = () => {
  const [productId, setProductId] = useState(uuidv4());
  const [productData, setProductData] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [fieldErrors, setFieldErrors] = useState({
    productName: "",
    description: "",
    metaTagTitle: "",
    modelName: "",
  });

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    metaTagTitle: "",
    metaTagDescription: "",
    modelName: "",
    sku: 0,
    mpn: 0,
    upc: 0,
    price: 0,
    quantity: 0,
    minimumQuantity: 0,
    outOfStockStatus: "",
    date: "",
    lengths: 0,
    widths: 0,
    heights: 0,
    dimensionClass: "",
    weight: 0,
    weightClass: "",
    status: "",
    thumbnail: "",
    uploadedImages: [],
    video: [],
  });
  console.log(
    "🚀 ~ file: AddProduct.jsx:45 ~ AddProduct ~ formData:",
    formData
  );

  useEffect(() => {
    const storedData = localStorage.getItem("productFormData");
    if (storedData) {
      setProductData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    // Load data based on the current product ID
    const currentProduct = productData.find(
      (product) => product.id === productId
    );
    if (currentProduct) {
      setFormData(currentProduct.data);
    }
  }, [productId, productData]);

  const handleTabChange = (tabNumber) => {
    setActiveTab(tabNumber);
  };

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
    if (field === "quantity") {
      const quantityError =
        value < formData.minimumQuantity
          ? "Quantity must be more than Minimum Quantity"
          : "";
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        quantity: quantityError,
      }));
    }

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    // ---------------
    // setFormData((prevData) => ({
    //   ...prevData,
    //   [field]: value,
    // }));
    // setFieldErrors((prevErrors) => ({
    //   ...prevErrors,
    //   [field]: "",
    // }));
  };
  const handleSave = () => {
    // Validate Product Name
    // if (!formData.productName.trim()) {
    //   setFieldErrors((prevErrors) => ({
    //     ...prevErrors,
    //     productName: "Product Name is required",
    //   }));
    //   return;
    // }
    // // Validate Description
    // if (!formData.description.trim()) {
    //   setFieldErrors((prevErrors) => ({
    //     ...prevErrors,
    //     description: "Description is required",
    //   }));
    //   return;
    // }

    // // Validate Meta Tag Title
    // if (!formData.metaTagTitle.trim()) {
    //   setFieldErrors((prevErrors) => ({
    //     ...prevErrors,
    //     metaTagTitle: "Meta Tag Title is required",
    //   }));
    //   return;
    // }

    // // // Validate Model Name
    // if (!formData.modelName.trim()) {
    //   setFieldErrors((prevErrors) => ({
    //     ...prevErrors,
    //     modelName: "Model Name is required",
    //   }));
    //   return;
    // }

    // Minimum quantity Validation
    // if (formData.quantity < formData.minimumQuantity) {
    //   setFieldErrors((prevErrors) => ({
    //     ...prevErrors,
    //     quantity: "Quantity must be more than Minimum Quantity",
    //   }));
    //   return;
    // }

    const requiredFields = ["productName", "description", "metaTagTitle", "modelName"];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    if (missingFields.length > 0) {
      missingFields.forEach(field => {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [field]: `${field} is required`,
        }));
      });
      return;
    }


      // Check for validation errors
      const hasErrors = Object.values(fieldErrors).some((error) => !!error);

      // If there are errors, stop further execution
      if (hasErrors) {
        // You can also display a message or take any other action to inform the user
        console.log("Validation errors. Cannot save data.");
        return;
      }



    const optionId = uuidv4();
    const newOption = {
      id: optionId,
      data: formData,
    };
    setProductData([...productData, newOption]);
    // reset the values
    setFormData({
      productName: "",
      description: "",
      metaTagTitle: "",
      metaTagDescription: "",
      modelName: "",
      sku: 0,
      mpn: 0,
      upc: 0,
      price: 0,
      quantity: 0,
      minimumQuantity: 0,
      outOfStockStatus: "",
      date: "",
      lengths: 0,
      widths: 0,
      heights: 0,
      dimensionClass: "",
      weight: 0,
      weightClass: "",
      status: "",
      thumbnail: "",
      uploadedImages: [],
      video: [],
    });

    const optionData =
      JSON.parse(localStorage.getItem("productFormData")) || [];
    // Reset the stored data in localStorage
    localStorage.setItem(
      "productFormData",
      JSON.stringify([...productData, newOption])
    );

    // Clear stored images and thumbnails
    localStorage.removeItem("image");
    localStorage.removeItem("thumbnail");
    toast.success("Product Added Successfully!!!😊😊👌");
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image") ? "image" : "video",
    }));
    // newMedia.find((media) => media.type === "video")?.url || "",
    setFormData((prevData) => ({
      ...prevData,
      uploadedImages: [
        ...(prevData.uploadedImages || []),
        ...newMedia.filter((media) => media.type === "image"),
      ],
      video: [
        ...(prevData.video || []),
        ...newMedia.filter((media) => media.type === "video"),
      ],
    }));

    const storedMedia = JSON.parse(localStorage.getItem("productMedia")) || [];
    localStorage.setItem(
      "productMedia",
      JSON.stringify([...storedMedia, ...newMedia])
    );
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    const thumbnailURL = URL.createObjectURL(file);
    setFormData((prevData) => ({
      ...prevData,
      thumbnail: thumbnailURL,
    }));

    localStorage.setItem("thumbnail", JSON.stringify(thumbnailURL));
  };

  const handleImageRemove = (index) => {
    const updatedMedia = [...formData.uploadedImages];
    updatedMedia.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      uploadedImages: updatedMedia,
    }));
    localStorage.setItem("productMedia", JSON.stringify(updatedMedia));
  };

  const handleVideoRemove = (index) => {
    const updatedVideoMedia = [...formData.video];
    updatedVideoMedia.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      video: updatedVideoMedia,
    }));
    localStorage.setItem("productMedia", JSON.stringify(updatedVideoMedia));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto my-8 p-6 bg-gray-100 rounded-md shadow-md text-gray-800"
    >
      <Link
        to="/productlist"
        className="text-blue-500 hover:underline block text-center mb-6"
      >
        Go to Product List
      </Link>

      <div className="flex justify-between items-center mb-4">
        <p className="text-4xl text-blue-700 font-bold">Add Product</p>
        <motion.div whileHover={{ scale: 1.2 }}>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            onClick={handleSave}
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
      </div>

      <div>
        {activeTab === 1 && (
          <div>
            <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
              Product Name:
            </label>
            <input
              type="text"
              className={`w-full border p-2 rounded ${
                fieldErrors.productName ? "border-red-500" : ""
              }`}
              value={formData.productName}
              onChange={(e) => handleInputChange("productName", e.target.value)}
            />
            {fieldErrors.productName && (
              <p className="text-red-500 text-sm">{fieldErrors.productName}</p>
            )}

            <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
              Description:
            </label>
            <input
              type="text"
              className={`w-full border p-2 rounded ${
                fieldErrors.description ? "border-red-500" : ""
              }`}
              value={formData.description}
              required
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-sm">{fieldErrors.description}</p>
            )}

            <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
              Meta Tag Title:
            </label>
            <input
              type="text"
              className={`w-full border p-2 rounded ${
                fieldErrors.metaTagTitle ? "border-red-500" : ""
              }`}
              value={formData.metaTagTitle}
              required
              onChange={(e) =>
                handleInputChange("metaTagTitle", e.target.value)
              }
            />
            {fieldErrors.metaTagTitle && (
              <p className="text-red-500 text-sm">{fieldErrors.metaTagTitle}</p>
            )}

            <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
              Meta Tag Description:
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.metaTagDescription}
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
                className={`w-full border p-2 rounded ${
                  fieldErrors.modelName ? "border-red-500" : ""
                }`}
                required
                value={formData.modelName}
                onChange={(e) => handleInputChange("modelName", e.target.value)}
              />
              {fieldErrors.modelName && (
                <p className="text-red-500 text-sm">{fieldErrors.modelName}</p>
              )}
              <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                Stock Keeping Unit(SKU):
              </label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
              />{" "}
              <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                Manufacture Part Number(MPN):
              </label>
              <input
                type="number"
                className="w-full border p-2 rounded mb-4"
                value={formData.mpn}
                onChange={(e) => handleInputChange("mpn", e.target.value)}
              />
              <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                Universal Product Code(UPC):
              </label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={formData.upc}
                onChange={(e) => handleInputChange("upc", e.target.value)}
              />
            </div>

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
                value={formData.price}
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
                value={formData.minimumQuantity}
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
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
              />

              {fieldErrors.quantity && (
                <p className="text-red-500 text-sm">{fieldErrors.quantity}</p>
              )}
              <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
                Out Of Stock Status:
              </label>
              <select
                className="w-full border p-2 rounded mb-4"
                value={formData.outOfStockStatus}
                onChange={(e) =>
                  handleInputChange("outOfStockStatus", e.target.value)
                }
              >
                <option>---None---</option>
                <option>2-3days</option>
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
                value={formData.date}
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
                value={formData.lengths}
                placeholder="length"
                onChange={(e) => handleInputChange("lengths", e.target.value)}
              />
              {/* width */}
              <input
                type="number"
                className="w-full border p-2 rounded mb-4"
                value={formData.widths}
                placeholder="width"
                onChange={(e) => handleInputChange("widths", e.target.value)}
              />
              {/* height */}
              <input
                type="number"
                className="w-full border p-2 rounded mb-4"
                value={formData.heights}
                placeholder="height"
                onChange={(e) => handleInputChange("heights", e.target.value)}
              />
            </div>

            <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
              Dimension Class:
            </label>
            <select
              className="w-full border p-2 rounded mb-4"
              value={formData.dimensionClass}
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
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
            <label className="block mb-2 text-lg font-semibold text-gray-800 text-left">
              Weight Class:
            </label>
            <select
              className="w-full border p-2 rounded mb-4"
              value={formData.weightClass}
              onChange={(e) => handleInputChange("weightClass", e.target.value)}
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
              value={formData.status}
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
              {formData.thumbnail && (
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail"
                  className="w-full h-32 object-cover rounded"
                />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">
              Image And Video Upload and Display
            </h1>
            <input
              type="file"
              onChange={handleUpload}
              multiple
              className="mb-4 border border-gray-300 p-2"
            />
            <div className="flex flex-wrap -mx-2">
              {/* Display Images from uploadedImages */}
              {formData.uploadedImages?.map((image, index) => (
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
                    Remove
                  </button>
                </div>
              ))}

              {/* Display Video from video */}
              {formData.video?.map((data, index) => (
                <div key={index} className="relative w-1/4 p-2">
                  <video controls width="100%" autoPlay height="20%">
                    <source src={data.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleVideoRemove(index)}
                    title="Remove Video"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AddProduct;
