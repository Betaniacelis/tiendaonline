import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Shield, Package, ShoppingCart, ShoppingBag, Menu, X, Home } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

export function Navbar() {
  const { session, role, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const navItems = [
    {
      to: "/profile",
      icon: User,
      label: "Perfil",
      color: "hover:text-purple-600"
    },
    {
      to: "/productos",
      icon: Package,
      label: "Productos",
      color: "hover:text-blue-600"
    },
    {
      to: "/carrito",
      icon: ShoppingCart,
      label: "Carrito",
      color: "hover:text-green-600",
      badge: count > 0 ? (count > 99 ? "99+" : count.toString()) : null
    },
    {
      to: "/mis-compras",
      icon: ShoppingBag,
      label: "Mis Compras",
      color: "hover:text-orange-600"
    },
    ...(role === "admin" ? [{
      to: "/admin",
      icon: Shield,
      label: "Panel Admin",
      color: "hover:text-red-600"
    }] : [])
  ];

  if (!session) return null;

  return (
    <nav className="sticky top-0 z-50 border-0 bg-white/80 backdrop-blur-md shadow-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/profile" 
            className="flex items-center gap-2 group"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Grace Divine Marketplace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 ${item.color} hover:bg-gray-50`}
              >
                <div className="relative">
                  <item.icon className="h-4 w-4" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-[10px] font-bold text-white shadow-md">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <User className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                {session.user?.email?.split('@')[0]}
              </span>
              <Badge className={`ml-2 text-xs px-2 py-0.5 ${
                role === "admin" 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0" 
                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0"
              }`}>
                {role === "admin" ? "👑 Admin" : "🛒 User"}
              </Badge>
            </div>

            {/* Sign Out Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Salir</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-2">
              {/* Mobile User Info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mb-3">
                <User className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  {session.user?.email?.split('@')[0]}
                </span>
                <Badge className={`ml-2 text-xs px-2 py-0.5 ${
                  role === "admin" 
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0" 
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0"
                }`}>
                  {role === "admin" ? "👑 Admin" : "🛒 User"}
                </Badge>
              </div>

              {/* Mobile Nav Items */}
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 ${item.color} hover:bg-gray-50`}
                >
                  <div className="relative">
                    <item.icon className="h-4 w-4" />
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-[10px] font-bold text-white shadow-md">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile Sign Out */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 justify-start"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Salir</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
