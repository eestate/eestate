
import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useGetTermsAndConditionsQuery } from '../redux/services/ContentApi';

const TermsAndConditions = () => {
  const { data: terms, isLoading, isError, error } = useGetTermsAndConditionsQuery();
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  React.useEffect(() => {
    if (isError) {
      setSnackbar({ open: true, message: error?.data?.message || 'Failed to load Terms and Conditions', severity: 'error' });
    }
  }, [isError, error]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Terms and Conditions</h1>
        {isLoading ? (
          <p className="text-gray-600">Loading Terms and Conditions...</p>
        ) : terms ? (
          <>
            <p className="text-gray-600 mb-4">Last updated: {new Date(terms.lastUpdated).toLocaleDateString()}</p>
            <div className="space-y-6 text-gray-700" style={{ whiteSpace: 'pre-line' }}
            >
              <p>{terms.content}</p>
            </div>
          </>
        ) : (
          <p className="text-gray-600">No Terms and Conditions available.</p>
        )}
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

export default TermsAndConditions;