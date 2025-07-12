
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, User, Plus, Home, HelpCircle, Settings, Hash, Shield, BookOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const notificationCount = 3; // Mock notification count
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <HelpCircle className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Stack<span className="text-blue-600">It</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/questions" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/questions') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Questions</span>
            </Link>

            <Link 
              to="/tags" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/tags') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Hash className="h-4 w-4" />
              <span>Tags</span>
            </Link>
            
            <Link 
              to="/ask" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/ask') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Ask Question</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-lg mx-8">
            <Link to="/search" className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <div className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/70 text-gray-500 cursor-pointer hover:bg-white transition-colors">
                Search questions, tags, or users...
              </div>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative p-2">
                      <Bell className="h-5 w-5 text-gray-600" />
                      {notificationCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                          {notificationCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-3 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <DropdownMenuItem className="p-3 cursor-pointer">
                        <div className="flex-1">
                          <p className="text-sm font-medium">New answer on your question</p>
                          <p className="text-xs text-gray-500 mt-1">Someone answered "How to implement JWT authentication in React?"</p>
                          <p className="text-xs text-blue-600 mt-1">2 minutes ago</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-3 cursor-pointer">
                        <div className="flex-1">
                          <p className="text-sm font-medium">Your answer was upvoted</p>
                          <p className="text-xs text-gray-500 mt-1">+5 reputation points</p>
                          <p className="text-xs text-blue-600 mt-1">1 hour ago</p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <div className="p-3 border-t">
                      <Link to="/notifications">
                        <Button variant="ghost" size="sm" className="w-full text-blue-600">
                          View All Notifications
                        </Button>
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <User className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to={`/profile/${user.id}`} className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/guidelines" className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Guidelines</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <span>Sign In</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Sign Up</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Link to="/search">
                <Button variant="ghost" size="sm">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
