
import { useState, useEffect } from "react";
import profile from '../assets/image.png'
import AuthModal from "../pages/AuthModal";
import MenuModal from "./MenuModel";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout, isLoggingOut, refetch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      localStorage.removeItem('user');    
      await logout();
      navigate('/', { replace: true });
      window.location.reload();
      setIsLoginOpen(false);
      setIsMenuOpen(false);
      setIsLogoutModalOpen(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
      if (user) localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      setIsLoginOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-between items-center px-4 lg:px-10 py-4">
        <h2 className="font-manrope text-4xl lg:text-8xl font-light">eestate</h2>
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-4 lg:px-10 py-4 mt-0 lg:mt-[-35px] gap-4 lg:gap-0">
        <Link to="/"><h2 className="font-manrope text-4xl lg:text-8xl font-light lg:ml-10 lg:mt-10 leading-none">eestate</h2></Link>

        <div className="hidden lg:block text-center">
          <h6 className="font-marcellus leading-tight m-0 text-sm text-left">
            Buy or sell your dream <br />
            properties easily and securely
          </h6>
        </div>

        <div className="hidden lg:block text-center">
          <h3 className="font-marcellus leading-tight m-0 text-sm text-left">
            Based on <br /> <span className="text-[#616161]" >India</span>
          </h3>
        </div>

        <div className="menu flex items-center gap-3 cursor-pointer lg:mr-14">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                  <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                    <AvatarImage src={user?.profilePic} className="object-cover" />
                    <AvatarFallback className="bg-gray-200">
                      {user?.name ? (
                        user.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuItem onClick={handleProfileClick}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <p
                className="font-mplus text-sm lg:text-base font-bold cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
              >
                MENU+
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-1"
              >
                <User className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" />
                <span className="sr-only">Login</span>
              </button>
              <p
                className="font-mplus text-sm lg:text-base font-bold cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
              >
                MENU+
              </p>
            </>
          )}
        </div>
      </div>

      <div className="lg:hidden px-4 pb-4 space-y-2">
        <p className="font-marcellus text-xs text-center">
          Buy or sell your dream properties easily and securely
        </p>
        <p className="font-marcellus text-xs text-center">Based on India</p>
      </div>

      <AuthModal isOpen={isLoginOpen} onClose={() => { setIsLoginOpen(false); }} />

      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLoginClick={() => {
          setIsMenuOpen(false);
          setIsLoginOpen(true);
        }}
      />

      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoggingOut ? 'Logging Out...' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;