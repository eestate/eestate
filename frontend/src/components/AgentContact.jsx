import React, { useState } from 'react'
import { UserIcon, MailIcon, PhoneIcon, MessageSquareIcon } from 'lucide-react'

const AgentContact = ({ agent }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [showChat, setShowChat] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Message sent to agent!')
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <img
          src={agent.photo}
          alt={agent.name}
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold">{agent.name}</h3>
          <p className="text-gray-600">Property Agent</p>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <PhoneIcon size={16} className="mr-2 text-gray-600" />
          <span>{agent.phone}</span>
        </div>
        <div className="flex items-center">
          <MailIcon size={16} className="mr-2 text-gray-600" />
          <span>{agent.email}</span>
        </div>
      </div>
      <div className="mb-6">
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center items-center"
        >
          <MessageSquareIcon size={16} className="mr-2" />
          Chat with Agent
        </button>
      </div>
      {showChat ? (
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <div className="chat-messages h-40 overflow-y-auto mb-4 bg-white p-2 rounded">
            <p className="text-center text-gray-500 text-sm">
              Start a conversation with the agent
            </p>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-l-md"
            />
            <button className="bg-blue-600 text-white px-4 rounded-r-md">
              Send
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <UserIcon size={16} />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 p-2 border border-gray-300 rounded"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <MailIcon size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <PhoneIcon size={16} />
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 p-2 border border-gray-300 rounded"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="I'm interested in this property..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  )
}

export default AgentContact
