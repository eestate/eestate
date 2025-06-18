import React, { useEffect, useState } from 'react';
import { useGetAboutQuery, useUpdateAboutMutation } from '@/redux/services/AboutApi';
import { Toaster, toast } from 'sonner';

const AdminAboutPage = () => {
  const { data: aboutData, isLoading } = useGetAboutQuery();
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();

  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    mission: '',
    services: [],
    team: [],
  });
  const [imagePreviews, setImagePreviews] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (aboutData) {
      setFormData({
        heading: aboutData.heading || '',
        description: aboutData.description || '',
        mission: aboutData.mission || '',
        services: aboutData.services?.map(s => ({ ...s })) || [],
        team: aboutData.team?.map(t => ({ ...t })) || [],
      });
      const previews = {};
      aboutData.team?.forEach((member, idx) => {
        if (member.image) {
          previews[idx] = member.image;
        }
      });
      setImagePreviews(previews);
    }
  }, [aboutData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...formData.services];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const handleTeamChange = (index, field, value) => {
    const updated = [...formData.team];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, team: updated }));
  };

  const handleImageChange = (index, file) => {
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type for team member ${index + 1}. Allowed: ${validTypes.join(', ')}`);
        toast.error(`Invalid file type for team member ${index + 1}`);
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError(`File size for team member ${index + 1} exceeds 15MB limit`);
        toast.error(`File too large (max 15MB)`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [index]: previewUrl }));
      const updatedTeam = [...formData.team];
      updatedTeam[index] = { ...updatedTeam[index], image: file };
      setFormData(prev => ({ ...prev, team: updatedTeam }));
      setError(null);
    }
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { title: '', description: '' }],
    }));
    toast('Added new service field');
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, { name: '', role: '', image: '' }],
    }));
    toast('Added new team member field');
  };

  const removeService = (index) => {
    const updated = [...formData.services];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, services: updated }));
    toast('Service removed', { type: 'warning' });
  };

  const removeTeamMember = (index) => {
    const updated = [...formData.team];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, team: updated }));
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
    toast.error('Team member removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('heading', formData.heading);
      formDataUpload.append('description', formData.description);
      formDataUpload.append('mission', formData.mission);
      formDataUpload.append('services', JSON.stringify(formData.services));
      const teamData = formData.team.map(member => ({
        name: member.name,
        role: member.role,
        image: typeof member.image === 'string' ? member.image : '',
      }));
      formDataUpload.append('team', JSON.stringify(teamData));
      formData.team.forEach((member, index) => {
        if (member.image instanceof File) {
          formDataUpload.append(`team[${index}][image]`, member.image);
        }
      });

      await updateAbout(formDataUpload).unwrap();
      toast.success('About page updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      const errorMessage = error.data?.error || error.message || 'Failed to update about info';
      setError(errorMessage);
      toast.error(`Update failed: ${errorMessage}`);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <Toaster position="top-right" richColors expand={true} />

      <h2 className="text-2xl font-bold mb-6">Edit About Page</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium">Heading</label>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            rows={3}
          />
        </div>
        <div>
          <label className="block font-medium">Mission</label>
          <textarea
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            rows={2}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mt-8 mb-2">Services</h3>
          {formData.services.map((service, idx) => (
            <div key={idx} className="border p-4 rounded mb-3">
              <input
                type="text"
                placeholder="Title"
                value={service.title}
                onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <textarea
                placeholder="Description"
                value={service.description}
                onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => removeService(idx)}
                className="text-red-500 mt-2 block"
              >
                Remove Service
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addService}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Service
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mt-8 mb-2">Team Members</h3>
          {formData.team.map((member, idx) => (
            <div key={idx} className="border p-4 rounded mb-3">
              <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) => handleTeamChange(idx, 'name', e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                placeholder="Role"
                value={member.role}
                onChange={(e) => handleTeamChange(idx, 'role', e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <div className="mb-2">
                <label className="block font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => handleImageChange(idx, e.target.files[0])}
                  className="w-full border p-2 rounded"
                />
              </div>
              {imagePreviews[idx] && (
                <div className="mb-2">
                  <img
                    src={imagePreviews[idx]}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeTeamMember(idx)}
                className="text-red-500 mt-2 block"
              >
                Remove Member
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTeamMember}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Team Member
          </button>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {isUpdating ? 'Updating...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminAboutPage;