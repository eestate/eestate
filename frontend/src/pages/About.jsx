// import React from 'react';
// import { Building, Home, Users, MessageSquare } from 'lucide-react';

// const About = () => {
//   return (
//     <div className="bg-white text-black font-sans">
//       {/* Hero Section */}
//       <section className="relative bg-gray-900 text-white py-20">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">About Eestate</h1>
//           <p className="text-lg md:text-xl max-w-2xl mx-auto">
//             Connecting you to your dream property with seamless real estate solutions.
//           </p>
//         </div>
//       </section>

//       {/* Mission Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
//             <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
//               At Eestate, we aim to simplify the real estate journey by providing a platform that connects buyers, sellers, and agents effortlessly. Our innovative chat system ensures real-time communication, making property transactions transparent and efficient.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className="py-16 bg-gray-100">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Services</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <Home className="w-12 h-12 text-gray-900 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Search</h3>
//               <p className="text-gray-600">
//                 Browse a wide range of properties tailored to your needs, from cozy homes to luxury estates.
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <Users className="w-12 h-12 text-gray-900 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Agent Connections</h3>
//               <p className="text-gray-600">
//                 Connect with experienced agents who guide you through every step of the process.
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <MessageSquare className="w-12 h-12 text-gray-900 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Chat</h3>
//               <p className="text-gray-600">
//                 Communicate instantly with agents and sellers via our integrated chat platform.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
//               <h3 className="text-xl font-semibold text-gray-900">John Doe</h3>
//               <p className="text-gray-600">Founder & CEO</p>
//             </div>
//             <div className="text-center">
//               <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
//               <h3 className="text-xl font-semibold text-gray-900">Jane Smith</h3>
//               <p className="text-gray-600">Chief Operations Officer</p>
//             </div>
//             <div className="text-center">
//               <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
//               <h3 className="text-xl font-semibold text-gray-900">Alex Johnson</h3>
//               <p className="text-gray-600">Lead Developer</p>
//             </div>
//           </div>
//         </div>
//       </section>    
//     </div>
//   );
// };

// export default About;


import React from 'react';
import { Home, Users, MessageSquare } from 'lucide-react';
import { useGetAboutQuery } from '@/redux/services/AboutApi';
const iconMap = {
  Home: Home,
  Users: Users,
  MessageSquare: MessageSquare,
};

const About = () => {
  const { data, isLoading, isError } = useGetAboutQuery();

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (isError || !data) return <div className="text-center py-20 text-red-500">Failed to load About info.</div>;

  return (
    <div className="bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.heading}</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              {data.mission}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.services?.map((service, idx) => {
              const Icon = iconMap[service.icon] || Home;
              return (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <Icon className="w-12 h-12 text-gray-900 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.team?.map((member, idx) => (
              <div key={idx} className="text-center">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;