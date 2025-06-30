
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { useGetHelpFAQsQuery } from '../redux/services/ContentApi';

const Help = () => {
  const { data: faqs = [], isLoading, isError, error } = useGetHelpFAQsQuery();
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isError) {
      setSnackbar({ open: true, message: error?.data?.message || 'Failed to load FAQs', severity: 'error' });
    }
  }, [isError, error]);

  const handleContactClick = () => {
    setSnackbar({ open: true, message: 'Redirecting to Contact Us page...', severity: 'info' });
    setTimeout(() => navigate('/contact-us'), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Help Center</h1>
        <p className="text-gray-600 mb-6">
          Find answers to common questions or contact us for further assistance.
        </p>
        <div className="space-y-6">
          {isLoading ? (
            <p className="text-gray-600">Loading FAQs...</p>
          ) : faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold text-gray-800">{faq.question}</h2>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No FAQs available.</p>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Still Need Help?</h2>
          <button
            onClick={handleContactClick}
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Contact Support
          </button>
        </div>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Help;