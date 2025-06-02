import video from '../assets/video.mp4'



const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Video Section */}
      <div className="relative h-[60vh] w-[1200px] lg:h-[70vh] bg-black flex items-center justify-center m-auto rounded-xl">
        {/* Video placeholder - you can replace this with your video */}
        <div className="absolute inset-0 ">
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
          <div className="bg-white rounded-lg p- flex flex-col lg:flex-row gap-2 shadow-lg">
            <select className="flex p-2 border-0 outline-none text-gray-700">
              <option>Property Type</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
            </select>
            <input
              type="text"
              placeholder="Please enter any district or town here"
              className="flex-1 p-3 border-0 outline-none text-gray-700"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
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

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Home</h3>
              <h3 className="font-semibold mb-4">About</h3>
              <h3 className="font-semibold mb-4">Property</h3>
              <h3 className="font-semibold mb-4">Contact us</h3>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Terms & Conditions</h3>
              <h3 className="font-semibold mb-4">Privacy Policy</h3>
              <h3 className="font-semibold mb-4">Help Center</h3>
            </div>
            <div className="lg:col-span-2 flex justify-end items-center">
              <div className="flex space-x-4 mb-4">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-black text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-black text-sm">ig</span>
                </div>
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-black text-sm">x</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <h2 className="text-4xl lg:text-6xl font-light mb-4 lg:mb-0">eestate</h2>
            <p className="text-gray-400 text-sm">© 2025 eestate. All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
