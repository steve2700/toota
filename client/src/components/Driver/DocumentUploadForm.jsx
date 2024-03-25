import React, { useState } from 'react';
import { FaIdCard, FaPassport, FaFile, FaCheck, FaTimes } from 'react-icons/fa'; // Import icons from Font Awesome
import DocumentVerificationMessageForm from './DocumentVerificationMessageForm'; // Import the message form component

const DocumentUploadForm = () => {
  const [formData, setFormData] = useState({
    idDocument: null,
    passport: null,
    license: null,
    criminalRecordCheck: null, // Add criminalRecordCheck to the state
  });

  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [fileType]: file });
  };

  const handleRemoveFile = (fileType) => {
    setFormData({ ...formData, [fileType]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if driver's license is uploaded
    if (!formData.license || !formData.criminalRecordCheck) { // Check if license and criminalRecordCheck are uploaded
      alert('Driver license and Criminal Record Check are required'); // Update error message
      return;
    }
    // Handle form submission logic here
    console.log(formData); // Temporary: Display uploaded files in console
    // After successful submission, set submissionSuccess to true
    setSubmissionSuccess(true);
  };

  return (
    <div className="flex items-center justify-center h-screen mt-8 px-4">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded shadow-md p-6">
          {!submissionSuccess ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Welcome to Toota Driver Document Verification</h2>
              <p className="text-gray-700 mb-4">
                To verify your identity and ensure compliance, we require you to upload the following documents:
              </p>
              <p className="text-sm text-gray-700 mb-4">
                Please upload a clear image or scanned copy of your National ID Card or Passport, along with your
                Driver's License. Ensure the documents are legible and contain all required details.
              </p>
              <form onSubmit={handleSubmit}>
                {/* Input fields for document upload */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2" htmlFor="idDocument">
                    <FaIdCard className="inline-block mr-2" />
                    National ID Card or Passport <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    {formData.idDocument ? (
                      <div className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        <span className="text-gray-700">{formData.idDocument.name}</span>
                        <FaTimes className="text-red-500 ml-2 cursor-pointer" onClick={() => handleRemoveFile('idDocument')} />
                      </div>
                    ) : (
                      <input
                        type="file"
                        id="idDocument"
                        name="idDocument"
                        onChange={(e) => handleFileChange(e, 'idDocument')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2" htmlFor="license">
                    <FaFile className="inline-block mr-2" />
                    Driver's License <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    {formData.license ? (
                      <div className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        <span className="text-gray-700">{formData.license.name}</span>
                        <FaTimes className="text-red-500 ml-2 cursor-pointer" onClick={() => handleRemoveFile('license')} />
                      </div>
                    ) : (
                      <input
                        type="file"
                        id="license"
                        name="license"
                        onChange={(e) => handleFileChange(e, 'license')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2" htmlFor="criminalRecordCheck">
                    <FaFile className="inline-block mr-2" />
                    Criminal Record Check <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      id="criminalRecordCheck"
                      name="criminalRecordCheck"
                      onChange={(e) => handleFileChange(e, 'criminalRecordCheck')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                    {formData.criminalRecordCheck && (
                      <FaCheck className="text-green-500 ml-2" />
                    )}
                  </div>
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline-black"
                  >
                    Submit Documents
                  </button>
                </div>
              </form>
            </>
          ) : (
            <DocumentVerificationMessageForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;

