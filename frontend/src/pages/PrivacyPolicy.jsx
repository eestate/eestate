

import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useGetPrivacyPolicyQuery } from '../redux/services/ContentApi';

const PrivacyPolicy = () => {
  const { data: policy, isLoading, isError, error } = useGetPrivacyPolicyQuery();
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  React.useEffect(() => {
    if (isError) {
      setSnackbar({ open: true, message: error?.data?.message || 'Failed to load Privacy Policy', severity: 'error' });
    }
  }, [isError, error]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Privacy Policy</h1>
        {isLoading ? (
          <p className="text-gray-600">Loading Privacy Policy...</p>
        ) : policy ? (
          <>
            <p className="text-gray-600 mb-4">Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}</p>
            <div className="space-y-6 text-gray-700" style={{ whiteSpace: 'pre-line' }}>
              <p>{policy.content}</p>
            </div>
          </>
        ) : (
          <p className="text-gray-600">No Privacy Policy available.</p>
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

export default PrivacyPolicy;