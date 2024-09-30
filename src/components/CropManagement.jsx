import { useState } from "react";
import {
  useAddCropDetailsMutation,
  useFetchCropsQuery,
  usePublishCropMutation,
  useRemoveCropMutation,
  useUpdateCropMutation,
} from "../features/apiSlice";

const CropManagement = () => {
  const {
    data: crops = [],
    error: fetchError,
    isLoading: fetchingCrops,
    refetch,
  } = useFetchCropsQuery();
  const [addCropDetails, { isLoading: addingDetails, error: addError }] =
    useAddCropDetailsMutation();
  const [updateCrop, { isLoading: updatingDetails, error: updateError }] =
    useUpdateCropMutation();
  const [removeCrop, { isLoading: removingCrop, error: removeError }] =
    useRemoveCropMutation();
  const [publishCrop, { isLoading: publishingCrop, error: publishError }] =
    usePublishCropMutation(); // Use the new mutation

  const [currentCropId, setCurrentCropId] = useState(null);
  const [name, setName] = useState("");
  const [bag, setBag] = useState("");
  const [quantity, setQuantity] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [datetime, setDatetime] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewCrop, setViewCrop] = useState(null);

  const handleEdit = (crop) => {
    setCurrentCropId(crop.id);
    setName(crop.name || "");
    setBag(crop.bag || "");
    setQuantity(crop.qty || "");
    setBasePrice(crop.base_price || "");
    setTriggerPrice(crop.trigger_price || "");
    setDatetime(crop.created_at ? crop.created_at.substring(0, 16) : "");
    setSellerId(crop.seller_id || "");
    setShowModal(true);
    setViewCrop(null);
  };

  const handleSubmit = async () => {
    const cropData = {
      name,
      bag: parseFloat(bag),
      qty: parseInt(quantity, 10),
      base_price: parseFloat(basePrice),
      trigger_price: parseFloat(triggerPrice),
      created_at: new Date(datetime).toISOString(),
      seller_id: sellerId,
    };

    console.log("Submitting Crop Data:", cropData);

    if (
      !name ||
      !bag ||
      !quantity ||
      !basePrice ||
      !triggerPrice ||
      !datetime ||
      !sellerId
    ) {
      alert("All fields are required.");
      return;
    }

    try {
      if (currentCropId) {
        await updateCrop({ id: currentCropId, ...cropData }).unwrap();
      } else {
        await addCropDetails(cropData).unwrap();
      }
      refetch();
      setShowModal(false);
      setCurrentCropId(null);
      setSellerId("");
    } catch (err) {
      console.error("Failed to save crop details:", err);
    }
  };

  const handleRemoveCrop = async (cropId) => {
    try {
      await removeCrop(cropId).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to remove crop:", err);
      alert(`Failed to remove crop: ${err.data?.message || err.message}`);
    }
  };

  const handlePublishCrop = async (cropId) => {
    try {
      await publishCrop(cropId).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to publish crop:", err);
    }
  };

  const handleView = (crop) => {
    console.log("Viewing Crop:", crop);
    setViewCrop(crop);
    setShowModal(false);
  };

  const handleCloseView = () => {
    setViewCrop(null);
  };

  if (fetchingCrops) return <p>Loading crops...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Crop Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crop Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Bag
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Base Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Trigger Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {crops.map((crop) => (
              <tr key={crop.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {crop.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {crop.bag}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {crop.qty}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {crop.base_price}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {crop.trigger_price}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {new Date(crop.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex flex-row space-x-2">
                  <button
                    onClick={() => handleView(crop)}
                    className="bg-[#007bff] text-white px-3 py-1 rounded lg:hidden"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(crop)}
                    className={`bg-[#4a7c59] text-white px-3 py-1 rounded ${
                      addingDetails ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveCrop(crop.id)}
                    className={`bg-[#b02d2d] text-white px-3 py-1 rounded ${
                      removingCrop ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handlePublishCrop(crop.id)}
                    className={`bg-[#ffc107] text-white px-3 py-1 rounded ${
                      publishingCrop ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Publish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {fetchError && (
        <p className="text-red-500 mt-2">
          Error fetching crops: {fetchError.message}
        </p>
      )}
      {addError && (
        <p className="text-red-500 mt-2">
          Error adding crop details: {addError.message}
        </p>
      )}
      {updateError && (
        <p className="text-red-500 mt-2">
          Error updating crop details: {updateError.message}
        </p>
      )}
      {removeError && (
        <p className="text-red-500 mt-2">
          Error removing crop: {removeError.message}
        </p>
      )}
      {publishError && (
        <p className="text-red-500 mt-2">
          Error publishing crop: {publishError.message}
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {currentCropId ? "Edit Crop" : "Add Crop"}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="bag"
                className="block text-sm font-medium text-gray-700"
              >
                Bag
              </label>
              <input
                id="bag"
                type="number"
                value={bag}
                onChange={(e) => setBag(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="qty"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                id="qty"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="basePrice"
                className="block text-sm font-medium text-gray-700"
              >
                Base Price
              </label>
              <input
                id="basePrice"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="triggerPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Trigger Price
              </label>
              <input
                id="triggerPrice"
                type="number"
                value={triggerPrice}
                onChange={(e) => setTriggerPrice(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="datetime"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                id="datetime"
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSubmit}
                className={`bg-[#4a7c59] text-white px-4 py-2 rounded ${
                  updatingDetails ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={`bg-[#b02d2d] text-white px-4 py-2 rounded ${
                  updatingDetails ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {viewCrop && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Crop Details</h2>
            <p>
              <strong>Name:</strong> {viewCrop.name}
            </p>
            <p>
              <strong>Bag:</strong> {viewCrop.bag}
            </p>
            <p>
              <strong>Quantity:</strong> {viewCrop.qty}
            </p>
            <p>
              <strong>Base Price:</strong> {viewCrop.base_price}
            </p>
            <p>
              <strong>Trigger Price:</strong> {viewCrop.trigger_price}
            </p>
            <p>
              <strong>Seller ID:</strong> {viewCrop.seller_id}
            </p>
            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(viewCrop.created_at).toLocaleString()}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseView}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropManagement;