import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import logoPath from "@assets/logo1-removebg-preview_1753975552317.png";

export default function Header() {
  const { isAuthenticated, isLoading, user } = useAuth();

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-gradient-to-br from-blue-500 to-gray-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo (clickable home link) */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <img src={logoPath} alt="CalculateThis Logo" className="h-12 w-auto" />
          </Link>
          
          {/* Navigation & Auth */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#calculators" className="text-white hover:text-gray-200 font-medium transition-colors">Calculators</a>
              <a href="#about" className="text-white hover:text-gray-200 font-medium transition-colors">About</a>
              <a href="#contact" className="text-white hover:text-gray-200 font-medium transition-colors">Contact</a>
              {isAuthenticated && (
                <Link href="/dashboard" className="text-white hover:text-gray-200 font-medium transition-colors">
                  Dashboard
                </Link>
              )}
            </nav>
            
            {/* Authentication buttons */}
            <div className="flex items-center space-x-3">
              {isLoading ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {user?.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-white font-medium">
                    {user?.firstName || user?.email || 'User'}
                  </span>
                  <button 
                    onClick={handleSignOut}
                    className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-all font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleSignIn}
                    className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-blue-600 transition-all font-medium"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleSignIn}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all font-medium shadow-md"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
