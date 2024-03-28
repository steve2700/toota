import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Import icons from Font Awesome

const DocumentVerificationMessageForm = () => {
  return (
    <div className="bg-gray-100 p-4 rounded mt-6 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Document Verification Status</h3>
        <p className="text-gray-700 mb-4">Thank you for uploading the documents. We are verifying them. This process usually takes 7-14 business days.</p>
        <div className="flex items-center justify-center">
          <FaExclamationCircle className="text-yellow-500 w-6 h-6 mr-2" /> {/* Icon for pending status */}
          <span className="text-yellow-500 font-semibold">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerificationMessageForm;

