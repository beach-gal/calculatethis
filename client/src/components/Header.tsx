import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import logoPath from "@assets/new_logo-removebg-preview_1760971211931.png";

export default function Header() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, navigate] = useLocation();

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const scrollToCalculators = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("calculators");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("contact");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <header className="bg-blue-50 shadow-md sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo (clickable home link) */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={logoPath} alt="CalculateThis.org Logo" className="h-20 w-auto" data-testid="logo-image" />
          </Link>
          
          {/* Navigation & Auth */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="/#calculators" 
                onClick={scrollToCalculators}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                data-testid="link-calculators"
              >
                Calculators
              </a>
              <a 
                href="/#contact" 
                onClick={scrollToContact}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                data-testid="link-contact"
              >
                Contact
              </a>
              {isAuthenticated && (
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Dashboard
                </Link>
              )}
            </nav>
            
            {/* Authentication buttons */}
            <div className="flex items-center space-x-3">
              {isLoading ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {user?.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                      data-testid="img-profile"
                    />
                  )}
                  <span className="text-gray-700 font-medium" data-testid="text-username">
                    {user?.firstName || user?.email || 'User'}
                  </span>
                  <button 
                    onClick={handleSignOut}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-medium"
                    data-testid="button-signout"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleSignIn}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-medium"
                    data-testid="button-signin"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleSignIn}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md"
                    data-testid="button-signup"
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
