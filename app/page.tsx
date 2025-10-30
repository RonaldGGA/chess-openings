import Link from 'next/link';
import { FaChessKing, FaChessBoard, FaSearch, FaUser, FaGithub, FaTwitter } from 'react-icons/fa';
import UserButton from './components/userButton';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* Navigation - Simple y elegante */}
      <nav className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <FaChessKing className="h-8 w-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors blur-sm"></div>
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                ChessMaster
              </span>
            </Link>

            {/* Navigation Links - Minimalista */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/free-practice" 
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors group"
              >
                <FaChessBoard className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Free Practice</span>
              </Link>
              <Link 
                href="/explore" 
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors group"
              >
                <FaSearch className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Explore Openings</span>
              </Link>
            </div>

            {/* Auth Button - Sutil */}
           <UserButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
                Master Chess Openings
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Explore, practice, and master chess openings with interactive tools. 
              From beginner to advanced, elevate your game with our comprehensive opening database.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Free Practice Card */}
            <Link 
              href="/free-practice" 
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 group-hover:border-yellow-500/40 transition-colors">
                  <FaChessBoard className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-yellow-400 transition-colors">
                  Free Practice
                </h3>
                <p className="text-gray-400 text-sm">
                  Practice openings freely with real-time suggestions and related variations
                </p>
              </div>
            </Link>

            {/* Explore Card */}
            <Link 
              href="/explore" 
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 group-hover:border-yellow-500/40 transition-colors">
                  <FaSearch className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-yellow-400 transition-colors">
                  Explore Database
                </h3>
                <p className="text-gray-400 text-sm">
                  Search and discover thousands of chess openings with detailed analysis
                </p>
              </div>
            </Link>

            {/* Coming Soon Card */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 group">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <FaUser className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">
                  Personal Progress
                </h3>
                <p className="text-gray-400 text-sm">
                  Save favorite openings, track progress, and get personalized recommendations
                </p>
                <span className="mt-3 inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full border border-purple-500/30">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-400">1,000+</div>
                <div className="text-gray-400 text-sm">Chess Openings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">50+</div>
                <div className="text-gray-400 text-sm">ECO Variations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">Real-time</div>
                <div className="text-gray-400 text-sm">Move Suggestions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">Free</div>
                <div className="text-gray-400 text-sm">Forever</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-linear-to-r from-slate-800/50 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Ready to Improve Your Game?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Start exploring chess openings today and take your chess strategy to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/free-practice" 
                className="px-8 py-4 bg-yellow-500 text-slate-900 font-semibold rounded-xl hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 border-2 border-yellow-500 hover:border-yellow-400 flex items-center justify-center gap-3"
              >
                <FaChessBoard className="h-5 w-5" />
                Start Free Practice
              </Link>
              <Link 
                href="/explore" 
                className="px-8 py-4 bg-transparent text-yellow-400 font-semibold rounded-xl hover:bg-yellow-400/10 transition-all duration-300 border-2 border-yellow-400/50 hover:border-yellow-400 flex items-center justify-center gap-3"
              >
                <FaSearch className="h-5 w-5" />
                Explore Openings
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Minimalista */}
      <footer className="bg-slate-800/30 backdrop-blur-sm border-t border-slate-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <FaChessKing className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">
                © 2025 ChessMaster. All rights reserved.
              </span>
            </div>

            {/* Footer Links */}
            <div className="flex items-center space-x-6">
              <Link href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                About
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Terms
              </Link>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <FaGithub className="h-4 w-4" />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <FaTwitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;