import React, { useState } from 'react';

const DriverProfile = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: 'Tom Cook',
    contactInfo: 'tom@example.com',
    vehicle: 'Toyota Camry',
    rating: 4.5,
  });

  // State to manage edit mode
  const [editMode, setEditMode] = useState(false);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement submission logic to update backend with new profile data
    console.log('Form submitted with data:', formData);
    // After submission, switch back to view mode
    setEditMode(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Driver Profile</h2>
      {editMode ? (
        // Edit mode: render form fields
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
            <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="contactInfo" className="block text-gray-700 font-semibold mb-2">Contact Information</label>
            <input type="text" id="contactInfo" value={formData.contactInfo} onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })} className="w-full border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="vehicle" className="block text-gray-700 font-semibold mb-2">Vehicle</label>
            <input type="text" id="vehicle" value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} className="w-full border-gray-300 rounded-md px-4 py-2" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
        </form>
      ) : (
        // View mode: render profile information
        <>
          <div className="mb-4">
            <strong>Name:</strong> {formData.name}
          </div>
          <div className="mb-4">
            <strong>Contact Information:</strong> {formData.contactInfo}
          </div>
          <div className="mb-4">
            <strong>Vehicle:</strong> {formData.vehicle}
          </div>
          <div className="mb-4">
            <strong>Driver Rating:</strong> {formData.rating}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default DriverProfile;

