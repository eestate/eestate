// src/layouts/AgentLayout.jsx
import { AgentNavbar } from '@/pages/Agent/AgentNavbar';
import { Outlet } from 'react-router-dom';


const AgentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AgentNavbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet /> 
      </div>
    </div>
  );
};

export default AgentLayout;