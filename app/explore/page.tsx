"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Loader, ChevronDown, Home, User, Menu, X, Grid, List } from 'lucide-react';
import { FaChessKing } from 'react-icons/fa';
import ScrollToTop from '../components/scrollToTop';
import OpeningCard from '../components/openingCard';
import { useDebounce } from '../hooks/useDebounce';
import UserButton from '../components/userButton';

export interface Opening {
  id: string;
  fen: string;
  name: string;
  eco: string;
  moves: string;
  src: string;
  scid?: string;
  isEcoRoot?: boolean;
  aliases: Array<{
    id: string;
    source: string;
    value: string;
  }>;
}

const ExplorePage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedEco, setSelectedEco] = useState('');
  const [ecoOptions, setEcoOptions] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [totalLoaded, setTotalLoaded] = useState(0);

  // Debounce para el search term (300ms de delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Ref para trackear si es el primer render
  const isFirstRender = useRef(true);

  // Fetch openings
  const fetchOpenings = useCallback(async (page: number = 1, append: boolean = false, search: string = '', eco: string = '') => {
    if (page === 1 && loading) return;
    if (page > 1 && loadingMore) return;

    if (page === 1) {
      setLoading(true);
      if (!append) setOpenings([]);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(
        `/api/openings?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}&eco=${encodeURIComponent(eco)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (append) {
        setOpenings(prev => {
          const allOpenings = [...prev, ...data.openings];
          const uniqueOpenings = Array.from(
            new Map(allOpenings.map(opening => [opening.id, opening])).values()
          );
          return uniqueOpenings;
        });
      } else {
        setOpenings(data.openings || []);
        
        if (page === 1) {
          const ecoCodes = [...new Set(data.ecoOptions)] as string[];
          setEcoOptions(ecoCodes.sort());
        }
      }

      setHasMore(data.openings.length === itemsPerPage);
      setCurrentPage(page);
      setTotalLoaded(prev => append ? prev + data.openings.length : data.openings.length);
      
    } catch (error) {
      console.error('Error fetching openings:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [itemsPerPage, loading, loadingMore]);

  // Efecto para búsquedas y filtros
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchOpenings(1, false, '', '');
      return;
    }

    setCurrentPage(1);
    setHasMore(true);
    setTotalLoaded(0);
    
    fetchOpenings(1, false, debouncedSearchTerm, selectedEco);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, selectedEco]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchOpenings(currentPage + 1, true, debouncedSearchTerm, selectedEco);
    }
  };

  const handleOpeningClick = (openingId: string) => {
    router.push(`/practice/${openingId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEco('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEcoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEco(e.target.value);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className=" bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href='/' className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="h-8 w-8 bg-yellow-400 rounded-lg flex items-center justify-center group-hover:bg-yellow-300 transition-colors">
                  <span className="text-slate-900 font-bold text-lg">♔</span>
                </div>
                <div className="absolute inset-0 bg-yellow-400/20 rounded-lg group-hover:bg-yellow-400/30 transition-colors blur-sm"></div>
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                ChessMaster
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 z-20">
              <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors group">
                <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </Link>
              <Link href="/free-practice" className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors group">
                <span>Free Practice</span>
              </Link>
              <div className="h-6 w-px bg-slate-600"></div>
             <UserButton/>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-yellow-500/50 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700/50">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="flex items-center space-x-3 text-gray-300 hover:text-yellow-400 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link href="/free-practice" className="flex items-center space-x-3 text-gray-300 hover:text-yellow-400 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                  <span>Free Practice</span>
                </Link>
                 <UserButton/>
               </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaChessKing className="h-12 w-12 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Chess Openings Explorer
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {totalLoaded > 0 
              ? `Found ${openings.length} opening${openings.length !== 1 ? 's' : ''}` 
              : 'Explore thousands of chess openings from our database'
            }
            {loading && ' (Searching...)'}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, ECO code, moves (e.g., 'Sicilian Defense', 'B20', '1. e4 c5')"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="h-5 w-5 animate-spin text-yellow-400" />
                  </div>
                )}
              </div>
            </div>

            {/* ECO Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedEco}
                onChange={handleEcoChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none"
              >
                <option value="">All ECO Codes</option>
                {ecoOptions.map(eco => (
                  <option key={eco} value={eco}>{eco}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Controls and Active Filters */}
          <div className="flex items-center justify-between">
            {/* Active Filters */}
            {(debouncedSearchTerm || selectedEco) && (
              <div className="text-sm text-gray-300">
                Searching for: 
                {debouncedSearchTerm && ` "${debouncedSearchTerm}"`}
                {selectedEco && ` in ECO ${selectedEco}`}
                {loading && '...'}
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-slate-700/50 rounded-xl p-1 border border-slate-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/25' 
                      : 'text-gray-400 hover:text-yellow-400 hover:bg-slate-600/50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/25' 
                      : 'text-gray-400 hover:text-yellow-400 hover:bg-slate-600/50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Clear Filters Button */}
              {(debouncedSearchTerm || selectedEco) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-700/70 rounded-xl border border-slate-600 hover:border-yellow-500/50"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading openings...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Openings Container */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                : "space-y-4 mb-8"
            }>
              {openings.map((opening) => (
                <OpeningCard
                  key={opening.id}
                  opening={opening}
                  viewMode={viewMode}
                  onClick={handleOpeningClick}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && openings.length > 0 && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-4 bg-yellow-500 text-slate-900 font-semibold rounded-xl hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 border-2 border-yellow-500 hover:border-yellow-400"
                >
                  {loadingMore ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Loading more openings...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-5 w-5" />
                      Load More Openings
                    </>
                  )}
                </button>
              </div>
            )}

            {/* No More Results */}
            {!hasMore && openings.length > 0 && (
              <div className="text-center py-8">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 max-w-md mx-auto">
                  <div className="text-yellow-400 text-2xl mb-2">🎉</div>
                  <p className="text-gray-400 text-lg mb-2">
                    All {openings.length} openings loaded!
                  </p>
                  <p className="text-gray-500 text-sm">
                    You&apos;ve reached the end of the results
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* No Results State */}
        {!loading && openings.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 max-w-2xl mx-auto">
              <FaChessKing className="h-20 w-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-4">
                No openings found
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                {searchTerm || selectedEco 
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "No openings available in the database."
                }
              </p>
              {(searchTerm || selectedEco) && (
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-yellow-500 text-slate-900 font-semibold rounded-xl hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 border-2 border-yellow-500 hover:border-yellow-400"
                >
                  Clear Search & Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <ScrollToTop/>
    </div>
  );
};

// Link component for navigation
const Link = ({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default ExplorePage;