import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const AgentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    console.log('Stripe Session ID:', sessionId);
  }, [sessionId]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600">🎉 Subscription Successful!</h1>
      <p className="mt-2 text-gray-700">Your session ID: {sessionId}</p>
    </div>
  );
};

export default AgentSuccess;
