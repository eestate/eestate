


import React from 'react';
import { DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AgentSubscription = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || user.role !== 'agent') {
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

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for new agents starting out.',
      propertyLimit: 10,
      price: 'Free',
      features: [
        'Up to 10 property listings',
        'Basic support',
        'Standard profile visibility',
      ],
      cta: user.isSubscribed && user.subscriptionType === 'basic' ? 'Current Plan' : 'Select Plan',
      disabled: user.isSubscribed && user.subscriptionType === 'basic',
    },
    {
      name: 'Professional',
      description: 'Ideal for growing real estate businesses.',
      propertyLimit: 50,
      price: '$49/month',
      features: [
        'Up to 50 property listings',
        'Priority support',
        'Enhanced profile visibility',
        'Analytics dashboard',
      ],
      cta: user.isSubscribed && user.subscriptionType === 'professional' ? 'Current Plan' : 'Select Plan',
      disabled: user.isSubscribed && user.subscriptionType === 'professional',
    },
    {
      name: 'Premium',
      description: 'For top-tier agents with unlimited needs.',
      propertyLimit: 'Unlimited',
      price: '$99/month',
      features: [
        'Unlimited property listings',
        'Dedicated support',
        'Premium profile visibility',
        'Advanced analytics',
        'Featured listings',
      ],
      cta: user.isSubscribed && user.subscriptionType === 'premium' ? 'Current Plan' : 'Select Plan',
      disabled: user.isSubscribed && user.subscriptionType === 'premium',
    },
  ];

  const handlePlanSelection = (plan) => {
    if (!user.isSubscribed || user.subscriptionType !== plan.name.toLowerCase()) {
      // Placeholder for subscription logic (e.g., redirect to payment or update subscription)
      alert(`Selected ${plan.name} plan. Implement payment integration here.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Subscription Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col"
            >
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-gray-600 mr-2" />
                <h3 className="text-xl font-semibold">{plan.name}</h3>
              </div>
              <p className="text-gray-600 text-center mb-4">{plan.description}</p>
              <p className="text-2xl font-bold text-center mb-4">{plan.price}</p>
              <p className="text-gray-600 text-center mb-4">
                {typeof plan.propertyLimit === 'number'
                  ? `Up to ${plan.propertyLimit} properties`
                  : plan.propertyLimit}
              </p>
              <ul className="flex-grow space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanSelection(plan)}
                disabled={plan.disabled}
                className={`w-full py-2 rounded-lg ${
                  plan.disabled
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentSubscription;