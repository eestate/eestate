import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import video from '../assets/video.mp4';
import { Search } from 'lucide-react';

const searchSchema = z.object({
  propertyType: z.string().nonempty('Please select a property type'),
  location: z.string().min(1, 'Please enter a district or town'),
});

const Home = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      propertyType: '',
      location: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Search submitted:', data);
  };

  return (
    <div className="min-h-screen mt-8">
      <div className="relative h-[60vh] w-[1250px] lg:h-[70vh] bg-black flex items-center justify-center m-auto rounded-xl">
        <div className="absolute inset-0">
          <div className="w-full h-full flex items-center justify-center text-white">
            <p className="text-lg opacity-50">
              <video
                src={video}
                autoPlay
                loop
                muted
                className="absolute top-1/2 left-1/2 w-full h-full object-cover z-0 rounded-[10px]"
                style={{
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </p>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="relative z-10 w-full max-w-2xl mx-4 md:ml">
  <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-1 flex flex-col lg:flex-row gap-2 shadow-lg">
    {/* Property Type Dropdown with Vertical Line */}
    <div className="flex items-center relative">
      <Controller
        name="propertyType"
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className="flex p-2 border-0 outline-none text-gray-700"
          >
            <option value="">Property Type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        )}
      />
      {errors.propertyType && (
        <p className="text-red-500 text-sm mt-1">{errors.propertyType.message}</p>
      )}
      {/* Vertical Line */}
      <div className="h-8 w-px bg-gray-300 mx-2 hidden lg:block"></div>
    </div>

    {/* Location Input with Search Icon */}
    <div className="flex-1 relative">
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input
              {...field}
              type="text"
              placeholder="Please enter any district or town here"
              className="flex-1 p-3 pl-10 border-0 outline-none text-gray-700 w-full"
            />
          </div>
        )}
      />
      {errors.location && (
        <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
      )}
    </div>

    <button
      type="submit"
      className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
    >
      Search
    </button>
  </form>
</div>
      </div>

      {/* Property Categories Section */}
      <div className="py-12 lg:py-20 px-4 lg:px-8">
        {/* Commercial Land Section */}
        <div className="max-w-7xl mx-auto mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Commercial Land</h2>
              <p className="text-gray-600 mb-6">
                Explore premium commercial land listings with expert guidance and support
              </p>
              <button className="text-blue-600 hover:underline">view all →</button>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Commercial land"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Commercial land"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Commercial land"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Commercial land"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Shop/Showroom Section */}
        <div className="max-w-7xl mx-auto mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 order-2 lg:order-1">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Shop showroom"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Shop showroom"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Shop showroom"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Shop showroom"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="lg:col-span-1 order-1 lg:order-2 text-right">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Shop/Showroom</h2>
              <p className="text-gray-600 mb-6">
                Discover top shop and showroom spaces with expert guidance and support
              </p>
              <button className="text-blue-600 hover:underline">view all →</button>
            </div>
          </div>
        </div>

        {/* Industrial Building Section */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Industrial Building</h2>
              <p className="text-gray-600 mb-6">Find the ideal industrial space tailored to your business needs</p>
              <button className="text-blue-600 hover:underline">view all →</button>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Industrial building"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Industrial building"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Industrial building"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Industrial building"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;