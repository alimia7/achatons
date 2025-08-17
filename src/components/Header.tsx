
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/images/achatons.png" 
              alt="Achat'ons" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-achatons-orange transition-colors">
              Accueil
            </Link>
            <Link to="/produits" className="text-gray-700 hover:text-achatons-orange transition-colors">
              Offres
            </Link>
            <a href="#comment" className="text-gray-700 hover:text-achatons-orange transition-colors">
              Comment ça marche
            </a>
            <a href="#impact" className="text-gray-700 hover:text-achatons-orange transition-colors">
              Notre impact
            </a>
            <Link to="/faq" className="text-gray-700 hover:text-achatons-orange transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Mon compte</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <User className="h-4 w-4 mr-2" />
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-achatons-orange hover:bg-achatons-brown">
                  Se connecter
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-achatons-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/produits" 
                className="text-gray-700 hover:text-achatons-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Offres
              </Link>
              <a 
                href="#comment" 
                className="text-gray-700 hover:text-achatons-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Comment ça marche
              </a>
              <a 
                href="#impact" 
                className="text-gray-700 hover:text-achatons-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Notre impact
              </a>
              <Link 
                to="/faq" 
                className="text-gray-700 hover:text-achatons-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              
              <div className="pt-4 border-t">
                {user ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="block text-achatons-brown hover:text-achatons-orange transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Administration
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block text-gray-700 hover:text-achatons-orange transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="bg-achatons-orange hover:bg-achatons-brown w-full">
                      Se connecter
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
