
import { Building, FileText, Home, Bell, MessageSquare, User, Send, Paperclip, Mic } from "lucide-react";
import React, { useState } from "react";
const AgentEnquiries = () => {
    const [activeTab, setActiveTab] = useState('all');
  
    const enquiries = [
      {
        id: 1,
        user: 'Clint',
        property: 'Modern Apartment with Sea',
        dateTime: '11:00 AM\n26-05-2025',
        status: 'pending'
      },
      {
        id: 2,
        user: 'Tony',
        property: 'Waterfront Land',
        dateTime: '4:30 PM\n18-05-2025',
        status: 'accepted'
      },
      {
        id: 3,
        user: 'Bruce',
        property: 'Luxury Villa With Private Pool',
        dateTime: '8:00 PM\n03-05-2025',
        status: 'rejected'
      },
      {
        id: 4,
        user: 'Steve',
        property: 'Commercial Space in Business',
        dateTime: '10:00 AM\n25-04-2025',
        status: 'pending'
      }
    ];
  
    const getFilteredEnquiries = () => {
      switch (activeTab) {
        case 'accepted':
          return enquiries.filter(enquiry => enquiry.status === 'accepted');
        case 'rejected':
          return enquiries.filter(enquiry => enquiry.status === 'rejected');
        default:
          return enquiries;
      }
    };
  
    const filteredEnquiries = getFilteredEnquiries();
  
    return (
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'accepted'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'rejected'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
  
        {/* Enquiries Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Id</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Property</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date/Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{enquiry.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{enquiry.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{enquiry.property}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-line">{enquiry.dateTime}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {/* View/Eye Icon */}
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      {/* Accept/Check Icon - only show if not accepted */}
                      {enquiry.status !== 'accepted' && (
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Reject/X Icon - only show if not rejected */}
                      {enquiry.status !== 'rejected' && (
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredEnquiries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No enquiries found for this category.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default AgentEnquiries