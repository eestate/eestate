
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, ChevronDown, ChevronUp,Eye } from 'lucide-react';
import { 
  Snackbar, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Modal,
  Box,
  Typography
} from '@mui/material';
import {
  useGetContactSubmissionsQuery,
  useDeleteContactSubmissionMutation,
  useCreateTermsAndConditionsMutation,
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
  useDeleteTermsAndConditionsMutation,
  useCreateHelpFAQMutation,
  useGetHelpFAQsQuery,
  useUpdateHelpFAQMutation,
  useDeleteHelpFAQMutation,
  useCreatePrivacyPolicyMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useDeletePrivacyPolicyMutation,
} from '../../redux/services/ContentApi';

const AdminContentManagement = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editDialog, setEditDialog] = useState({ open: false, type: '', id: null, data: {} });
  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    terms: true,
    faqs: true,
    policy: true
  });
 const [viewModal, setViewModal] = useState({ open: false, submission: null });

  // Contact Submissions
  const { 
    data: contactSubmissions = [], 
    isLoading: contactLoading, 
    isError: contactError, 
    error: contactErrorData,
    refetch: refetchContacts 
  } = useGetContactSubmissionsQuery();

  // Terms and Conditions
  const { 
    data: terms, 
    isLoading: termsLoading, 
    isError: termsError, 
    error: termsErrorData,
    refetch: refetchTerms 
  } = useGetTermsAndConditionsQuery();

  // Help FAQs
  const { 
    data: faqs = [], 
    isLoading: faqsLoading, 
    isError: faqsError, 
    error: faqsErrorData,
    refetch: refetchFaqs 
  } = useGetHelpFAQsQuery();

  // Privacy Policy
  const { 
    data: policy, 
    isLoading: policyLoading, 
    isError: policyError, 
    error: policyErrorData,
    refetch: refetchPolicy 
  } = useGetPrivacyPolicyQuery();

  // Mutation hooks
  const [deleteContactSubmission] = useDeleteContactSubmissionMutation();
  const [createTerms] = useCreateTermsAndConditionsMutation();
  const [updateTerms] = useUpdateTermsAndConditionsMutation();
  const [deleteTerms] = useDeleteTermsAndConditionsMutation();
  const [createFAQ] = useCreateHelpFAQMutation();
  const [updateFAQ] = useUpdateHelpFAQMutation();
  const [deleteFAQ] = useDeleteHelpFAQMutation();
  const [createPolicy] = useCreatePrivacyPolicyMutation();
  const [updatePolicy] = useUpdatePrivacyPolicyMutation();
  const [deletePolicy] = useDeletePrivacyPolicyMutation();

  // Helper functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditOpen = (type, id, data) => {
    setEditDialog({ open: true, type, id, data: data || {} });
  };

  const handleEditClose = () => {
    setEditDialog({ open: false, type: '', id: null, data: {} });
  };

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setEditDialog(prev => ({
    ...prev,
    data: {
      ...prev.data,
      [name]: value
    }
  }));
};

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      const { type, id, data } = editDialog;
      
      if (type === 'terms') {
        result = id ? await updateTerms({ id, ...data }).unwrap() : await createTerms(data).unwrap();
        showSnackbar(`Terms and Conditions ${id ? 'updated' : 'created'} successfully!`);
        refetchTerms();
      } else if (type === 'faq') {
        result = id ? await updateFAQ({ id, ...data }).unwrap() : await createFAQ(data).unwrap();
        showSnackbar(`FAQ ${id ? 'updated' : 'created'} successfully!`);
        refetchFaqs();
      } else if (type === 'policy') {
        result = id ? await updatePolicy({ id, ...data }).unwrap() : await createPolicy(data).unwrap();
        showSnackbar(`Privacy Policy ${id ? 'updated' : 'created'} successfully!`);
        refetchPolicy();
      }
      
      handleEditClose();
    } catch (error) {
      showSnackbar(error?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      if (type === 'contact') {
        await deleteContactSubmission(id).unwrap();
        showSnackbar('Contact submission deleted successfully!');
        refetchContacts();
      } else if (type === 'terms') {
        await deleteTerms(id).unwrap();
        showSnackbar('Terms and Conditions deleted successfully!');
        refetchTerms();
      } else if (type === 'faq') {
        await deleteFAQ(id).unwrap();
        showSnackbar('FAQ deleted successfully!');
        refetchFaqs();
      } else if (type === 'policy') {
        await deletePolicy(id).unwrap();
        showSnackbar('Privacy Policy deleted successfully!');
        refetchPolicy();
      }
    } catch (error) {
      showSnackbar(error?.data?.message || 'Deletion failed', 'error');
    }
  };

  // Show errors in snackbar
  useEffect(() => {
    if (contactError) showSnackbar(contactErrorData?.message || 'Failed to load contact submissions', 'error');
    if (termsError) showSnackbar(termsErrorData?.message || 'Failed to load Terms and Conditions', 'error');
    if (faqsError) showSnackbar(faqsErrorData?.message || 'Failed to load FAQs', 'error');
    if (policyError) showSnackbar(policyErrorData?.message || 'Failed to load Privacy Policy', 'error');
  }, [contactError, termsError, faqsError, policyError]);

  // Loading state component
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center py-8">
      <CircularProgress size={24} />
      <span className="ml-2">Loading...</span>
    </div>
  );

  // Empty state component
  const EmptyState = ({ message, action }) => (
    <div className="text-center py-8 text-gray-500">
      <p>{message}</p>
      {action && (
        <Button 
          variant="contained" 
          startIcon={<Plus size={16} />}
          onClick={action.onClick}
          sx={{ mt: 2, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
 const handleViewOpen = (submission) => {
    setViewModal({ open: true, submission });
  };

  const handleViewClose = () => {
    setViewModal({ open: false, submission: null });
  };
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '80vh',
    overflowY: 'auto'
  };
  const ContactSubmissionsSection = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div 
        className="flex justify-between items-center cursor-pointer mb-4"
        onClick={() => toggleSection('contact')}
      >
        <h2 className="text-2xl font-semibold text-gray-800">Contact Submissions</h2>
        {expandedSections.contact ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      
      {expandedSections.contact && (
        <>
          {contactLoading ? (
            <LoadingIndicator />
          ) : contactSubmissions.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contactSubmissions.map((submission) => (
                    <tr key={submission._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewOpen(submission)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete('contact', submission._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No contact submissions found." />
          )}
        </>
      )}
    </div>
  );

  // View Submission Modal
  const ViewSubmissionModal = () => (
    <Modal
      open={viewModal.open}
      onClose={handleViewClose}
      aria-labelledby="view-submission-modal"
      aria-describedby="view-submission-details"
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" className="font-bold mb-4">
          Contact Submission Details
        </Typography>
        {viewModal.submission && (
          <div className="space-y-4">
            <div>
              <Typography variant="subtitle2" className="text-gray-500">Name</Typography>
              <Typography>{viewModal.submission.name}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" className="text-gray-500">Email</Typography>
              <Typography>{viewModal.submission.email}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" className="text-gray-500">Date Submitted</Typography>
              <Typography>{new Date(viewModal.submission.createdAt).toLocaleString()}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" className="text-gray-500">Message</Typography>
              <Typography className="whitespace-pre-line p-2 bg-gray-50 rounded">
                {viewModal.submission.message}
              </Typography>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleViewClose} 
            variant="contained" 
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
          >
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
          <p className="text-gray-600">Manage all content sections of your application</p>
        </div>
        <ContactSubmissionsSection />
        <ViewSubmissionModal />

        {/* Terms and Conditions Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('terms')}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Terms and Conditions</h2>
            {expandedSections.terms ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
          
          {expandedSections.terms && (
            <>
              <div className="flex justify-end mb-4">
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => handleEditOpen('terms', null, { content: '', version: '' })}
                  sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
                >
                  Add Terms
                </Button>
              </div>
              
              {termsLoading ? (
                <LoadingIndicator />
              ) : terms ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Chip label={`Version ${terms.version}`} color="primary" size="small" className="mb-2" />
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(terms.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditOpen('terms', terms._id, { content: terms.content, version: terms.version })}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete('terms', terms._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="prose max-w-none">
<p className="text-gray-700">
  {terms?.content ? `${terms.content.substring(0, 200)}...` : 'No content available'}
</p>                  </div>
                </div>
              ) : (
                <EmptyState 
                  message="No Terms and Conditions found." 
                  action={{ label: 'Create Terms', onClick: () => handleEditOpen('terms', null, { content: '', version: '' }) }}
                />
              )}
            </>
          )}
        </div>

        {/* Help FAQs Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('faqs')}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Help FAQs</h2>
            {expandedSections.faqs ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
          
          {expandedSections.faqs && (
            <>
              <div className="flex justify-end mb-4">
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => handleEditOpen('faq', null, { question: '', answer: '' })}
                  sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
                >
                  Add FAQ
                </Button>
              </div>
              
              {faqsLoading ? (
                <LoadingIndicator />
              ) : faqs.length > 0 ? (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <Accordion key={faq._id} elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                      <AccordionSummary expandIcon={<ChevronDown />}>
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOpen('faq', faq._id, { question: faq.question, answer: faq.answer });
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete('faq', faq._id);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <p className="text-gray-700 whitespace-pre-line">{faq.answer}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Created: {new Date(faq.createdAt).toLocaleDateString()}
                        </p>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  message="No FAQs found." 
                  action={{ label: 'Add FAQ', onClick: () => handleEditOpen('faq', null, { question: '', answer: '' }) }}
                />
              )}
            </>
          )}
        </div>

        {/* Privacy Policy Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('policy')}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Privacy Policy</h2>
            {expandedSections.policy ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
          
          {expandedSections.policy && (
            <>
              <div className="flex justify-end mb-4">
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => handleEditOpen('policy', null, { content: '', version: '' })}
                  sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
                >
                  Add Policy
                </Button>
              </div>
              
              {policyLoading ? (
                <LoadingIndicator />
              ) : policy ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Chip label={`Version ${policy.version}`} color="primary" size="small" className="mb-2" />
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditOpen('policy', policy._id, { content: policy.content, version: policy.version })}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete('policy', policy._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="prose max-w-none">
<p className="text-gray-700">
  {(policy?.content || '').substring(0, 200)}...
</p>
                  </div>
                </div>
              ) : (
                <EmptyState 
                  message="No Privacy Policy found." 
                  action={{ label: 'Create Policy', onClick: () => handleEditOpen('policy', null, { content: '', version: '' }) }}
                />
              )}
            </>
          )}
        </div>

        {/* Edit/Add Dialog */}
        <Dialog 
          open={editDialog.open} 
          onClose={handleEditClose}
          fullWidth
          maxWidth={editDialog.type === 'contact' ? 'sm' : 'md'}
        >
          <DialogTitle className="font-bold">
            {editDialog.id 
              ? `Edit ${editDialog.type.charAt(0).toUpperCase() + editDialog.type.slice(1)}` 
              : `Add New ${editDialog.type.charAt(0).toUpperCase() + editDialog.type.slice(1)}`}
          </DialogTitle>
          <DialogContent dividers>
            <form onSubmit={handleSubmit} className="space-y-4">
              {editDialog.type === 'contact' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="responded"
                    name="responded"
                    checked={editDialog.data.responded || false}
                    onChange={(e) => setEditDialog(prev => ({ ...prev, data: { ...prev.data, responded: e.target.checked } }))}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="responded" className="text-sm font-medium text-gray-700">
                    Mark as responded
                  </label>
                </div>
              ) : editDialog.type === 'faq' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                    <input
                      type="text"
                      name="question"
                      value={editDialog.data.question || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
                    <textarea
                      name="answer"
                      value={editDialog.data.answer || ''}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </>
              ) : (editDialog.type === 'terms' || editDialog.type === 'policy') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                    <textarea
                      name="content"
                      value={editDialog.data.content || ''}
                      onChange={handleInputChange}
                      rows={10}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version *</label>
                    <input
                      type="text"
                      name="version"
                      value={editDialog.data.version || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. 1.0.0"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </>
              )}
              <DialogActions>
                <Button onClick={handleEditClose} color="inherit">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: 'black', 
                    color: 'white', 
                    '&:hover': { 
                      backgroundColor: '#1f2937',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    } 
                  }}
                >
                  {editDialog.id ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%', boxShadow: 3 }}
            elevation={6}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AdminContentManagement;