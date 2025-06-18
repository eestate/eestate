import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import video from '../assets/video.mp4';
import { Search, X } from 'lucide-react';
import { assets } from '@/assets/assets';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useGetDistrictSuggestionsQuery } from '@/redux/services/propertyApi';

const searchSchema = z.object({
  propertyType: z.string().optional(),
  location: z.string().optional(),
});

const Home = () => {
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      propertyType: '',
      location: '',
    },
  });

  const navigate = useNavigate();
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const suggestionsRef = useRef(null);
  const location = watch('location');
  const propertyType = watch('propertyType');

  const { data: suggestions, isFetching: isSuggestionsFetching } = useGetDistrictSuggestionsQuery(
    { state_district: location, propertyType: propertyType || undefined },
    { skip: location?.length < 2 }
  );

  useEffect(() => {
    if (location?.length >= 2 && suggestions?.length) {
      setIsSuggestionsOpen(true);
    } else {
      setIsSuggestionsOpen(false);
    }
  }, [location, suggestions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = (data) => {
      console.log('Navigating with filters:', {
    state_district: data.location,
    propertyType: data.propertyType
  });
    navigate('/properties', {
      state: {
        filters: {
          state_district: data.location || undefined,
          propertyType: data.propertyType || undefined,
          page: 1,
          limit: 9,
        },
      },
    });
  };

  const handleClear = () => {
    setValue('location', '');
    setValue('propertyType', '');
    setIsSuggestionsOpen(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setValue('location', suggestion);
    setIsSuggestionsOpen(false);
    handleSubmit(onSubmit)();
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
                    <option value="">Property Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="land">Land</option>
                    <option value="hostel">Hostel</option>
                  </select>
                )}
              />
              {errors.propertyType && (
                <p className="text-red-500 text-sm mt-1">{errors.propertyType.message}</p>
              )}
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
                    {(field.value || propertyType) && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                )}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
              {isSuggestionsOpen && suggestions?.length > 0 && (
                <ul
                  ref={suggestionsRef}
                  className="absolute z-20 w-full bg-white rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto border border-gray-200"
                >
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 text-gray-700 hover:bg-blue-100 cursor-pointer"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch gap-8">
            <div className="relative h-full border-r-2 border-gray-300 pr-6">
              <div className="absolute top-1/4 left-0 right-0">
                <h2 className="font-manrope text-2xl lg:text-3xl font-semibold mb-4">Industrial Building</h2>
                <p className="font-biorhyme text-gray-600 mb-6">
                  Explore premium commercial land listings with expert guidance and support
                </p>
                <button className="text-gray-600 hover:underline">view all →</button>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 pl-6">
              {assets.commercial.map((image, index) => (
                <img
                  key={`building-${index}`}
                  src={image}
                  alt={`Building property ${index + 1}`}
                  className="w-full h-48 object-cover rounded-md shadow"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Shop/Showroom Section */}
        <div className="max-w-7xl mx-auto mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="relative order-1 lg:order-2 border-l-2 border-gray-300 pl-6 text-right">
              <div className="absolute top-1/4 right-0 w-full pr-6">
                <h2 className="font-manrope text-2xl lg:text-3xl font-semibold mb-4">Shop/Showroom</h2>
                <p className="font-biorhyme text-gray-600 mb-6">
                  Discover top shop and showroom spaces with expert guidance and support
                </p>
                <button className="text-gray-600 hover:underline">view all →</button>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 order-2 lg:order-1">
              {assets.building.map((image, index) => (
                <img
                  key={`building-${index}`}
                  src={image}
                  alt={`Building property ${index + 1}`}
                  className="w-full h-48 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Industrial Building Section */}
        <div className="max-w-7xl mx-auto mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch gap-8">
            <div className="relative h-full border-r-2 border-gray-300 pr-6">
              <div className="absolute top-1/4 left-0 right-0">
                <h2 className="font-manrope text-2xl lg:text-3xl font-semibold mb-4">Industrial Building</h2>
                <p className="font-biorhyme text-gray-600 mb-6">
                  Find the ideal industrial space tailored to your business needs
                </p>
                <button className="text-gray-600 hover:underline">view all →</button>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 pl-6">
              {assets.office.map((image, index) => (
                <img
                  key={`building-${index}`}
                  src={image}
                  alt={`Building property ${index + 1}`}
                  className="w-full h-48 object-cover rounded-md shadow"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;