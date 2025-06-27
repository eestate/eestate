import React from 'react';
import { Link } from 'react-router-dom';

const SubscriptionRequiredModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Subscription Required</h3>
        <p className="mb-4">
          You need an active subscription to create properties. Please subscribe to a plan to continue.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
          <Link
            to="/agent/subscription"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequiredModal;