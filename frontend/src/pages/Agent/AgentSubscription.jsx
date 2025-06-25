
import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetStripeProductsQuery,
  useCreateCheckoutSessionMutation,
  useVerifySubscriptionMutation,
  useCancelSubscriptionMutation,
} from '@/redux/services/SubscriptionApi';

const AgentSubscription = () => {
  const { user, userId, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAlreadySubscribedModal, setShowAlreadySubscribedModal] = useState(false); // New state for already subscribed modal

  const {
    data: products,
    isLoading,
    error,
    refetch: refetchProducts,
  } = useGetStripeProductsQuery();
  
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [verifySubscription, { data: subscriptionData }] = useVerifySubscriptionMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'agent' && userId) {
      verifySubscription({ userId });
    }
  }, [isAuthenticated, user, userId, verifySubscription]);

  const handlePlanSelection = async (product) => {
    if (!isAuthenticated || !userId) {
      alert('Please log in to select a plan');
      navigate('/login');
      return;
    }

    if (subscriptionData?.isSubscribed && subscriptionData.subscriptionType !== product.name.toLowerCase()) {
      setShowAlreadySubscribedModal(true); 
      return;
    }

    try {
      const res = await createCheckoutSession({
        planName: product.name,
        userId,
      }).unwrap();

      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.data?.error || 'Payment initialization failed. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription({ subscriptionId: subscriptionData.subscriptionId }).unwrap();
      setShowCancelModal(false);
      alert('Subscription cancellation requested');
      refetchProducts();
      verifySubscription({ userId });
    } catch (error) {
      console.error('Cancellation error:', error);
      alert(error.data?.error || 'Failed to cancel subscription');
    }
  };

  const renderDescriptionPoints = (description) => {
    if (!description) return null;
    
    const points = description.split(',').filter(point => point.trim() !== '');
    
    return (
      <ul className="flex-grow space-y-2 mb-6 text-gray-700">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start">
            <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-2"></span>
            <span>{point.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (!isAuthenticated || user?.role !== 'agent') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-900">
          <p className="text-lg mb-4">Please log in as an agent to view subscription plans.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading products: {error.data?.error || error.message}
          <button
            onClick={refetchProducts}
            className="ml-4 bg-gray-900 text-white px-4 py-1 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans py-16">
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-xl font-semibold">Confirm Cancellation</h3>
            </div>
            <p className="mb-6">
              Are you sure you want to cancel your subscription? 
              {subscriptionData?.cancelAtPeriodEnd ? (
                ' Your subscription will remain active until the end of the current billing period.'
              ) : (
                ' This will cancel your subscription immediately.'
              )}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Already Subscribed Modal */}
      {showAlreadySubscribedModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-xl font-semibold">Already Subscribed</h3>
            </div>
            <p className="mb-6">
              You are currently subscribed to the{' '}
              <span className="font-semibold">
                {subscriptionData?.subscriptionType.charAt(0).toUpperCase() + subscriptionData?.subscriptionType.slice(1)}
              </span>{' '}
              plan. To subscribe to a different plan, please cancel your current subscription first.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAlreadySubscribedModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  setShowAlreadySubscribedModal(false);
                  setShowCancelModal(true); // Open cancel subscription modal
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel Current Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Subscription Plan</h2>

        {subscriptionData?.isSubscribed && (
          <div className="mb-8 p-6 rounded-lg text-center border border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-sm">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-green-800">
                Active Subscription: {subscriptionData.subscriptionType.charAt(0).toUpperCase() + subscriptionData.subscriptionType.slice(1)} Plan
              </h3>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
              {!subscriptionData?.cancelAtPeriodEnd ? (
                <>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Cancel Subscription
                  </button>
                </>
              ) : (
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span>Your subscription will end at the end of the billing period</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.map((product) => {
            const price = product.price;
            const isCurrentPlan = subscriptionData?.subscriptionType === product.name.toLowerCase();

            return (
              <div
                key={product.id}
                className={`bg-white p-6 rounded-lg shadow-md flex flex-col border-2 ${
                  isCurrentPlan ? 'border-green-500' : 'border-transparent'
                } transition-all hover:shadow-lg`}
              >
                {product.images?.[0] ? (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-32 object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex justify-center items-center h-32 bg-gray-200 rounded-lg">
                    <DollarSign className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                </div>

                {renderDescriptionPoints(product.description)}

                <p className="text-2xl font-bold text-center mb-4">
                  ₹{(price?.unit_amount / 100).toFixed(2)} / {price?.recurring?.interval}
                </p>

                {product.metadata?.features && (
                  <ul className="flex-grow space-y-2 mb-6 text-gray-700">
                    {product.metadata.features.split(',').map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-gray-900 rounded-full mr-2"></span>
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => handlePlanSelection(product)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-lg transition-all ${
                    isCurrentPlan
                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-700 hover:shadow-md'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentSubscription;