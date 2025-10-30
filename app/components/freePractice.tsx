"use client";

import { Chess, Square } from "chess.js";
import React, { useEffect, useRef, useState } from "react";
import {
  Chessboard,
  PieceDropHandlerArgs,
  SquareHandlerArgs,
} from "react-chessboard";
import Link from "next/link";
import { ArrowRight, RotateCw, Home, Search, User, Menu, X } from "lucide-react";
import { Opening } from "../generated/prisma/client";
import UserButton from "./userButton";

interface StockfishAnalysis {
  bestMove: string;
  ponder: string;
  evaluation: string;
  continuation: string;
  mate: string | null;
}

const FreePractice = () => {
  const chessGameRef = useRef(new Chess());
  const [relatedOpenings, setRelatedOpenings] = useState<Opening[]>([]);
  const [moveAnalysis, setMoveAnalysis] = useState<StockfishAnalysis | null>(null);
  const [chessPosition, setChessPosition] = useState("start");
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [movesHistory, setMovesHistory] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setChessPosition(chessGameRef.current.fen());
  }, []);

  // Function to analyze position with Stockfish
  const analyzePosition = async (fen: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=13`
      );

      if (!response.ok) {
        throw new Error(`Stockfish error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Error analyzing the position");
      }

      // Parse the bestmove string correctly
      const bestMoveParts = data.bestmove?.split(" ") || [];
      const newData: StockfishAnalysis = {
        bestMove: bestMoveParts[1] || "",
        ponder: bestMoveParts[3] || "",
        evaluation: data.evaluation || "0",
        continuation: data.continuation || "",
        mate: data.mate,
      };
      setMoveAnalysis(newData);
    } catch (error) {
      console.error("Error analyzing position:", error);
      setMoveAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to fetch related openings
  const fetchRelatedOpenings = async (moves: string[]) => {
    try {
      // Convert moves array to the format expected by the API
      const response = await fetch(`/api/openings/match?moveHistory=${JSON.stringify(moves)}`);
      const data = await response.json();
      setRelatedOpenings(data.openings || []);
    } catch (error) {
      console.error("Error fetching related openings:", error);
      setRelatedOpenings([]);
    }
  };

  // Update analysis and openings when position changes
  useEffect(() => {
    if (chessPosition !== "start" && !chessGameRef.current.isGameOver()) {
      analyzePosition(chessPosition);
      fetchRelatedOpenings(movesHistory);
    }
  }, [chessPosition, movesHistory]);

  function getMoveOptions(square: Square) {
    const chessGame = chessGameRef.current;
    const moves = chessGame.moves({
      square,
      verbose: true,
    });

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, React.CSSProperties> = {};

    for (const move of moves) {
      newSquares[move.to] = {
        background:
          chessGame.get(move.to) &&
          chessGame.get(move.to)?.color !== chessGame.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }

    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };

    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick({ square, piece }: SquareHandlerArgs) {
    const chessGame = chessGameRef.current;

    // Piece clicked to move
    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(square as Square);
      if (hasMoveOptions) {
        setMoveFrom(square);
      }
      return;
    }

    // Square clicked to move to
    const moves = chessGame.moves({
      square: moveFrom as Square,
      verbose: true,
    });
    const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);

    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(square as Square);
      setMoveFrom(hasMoveOptions ? square : "");
      return;
    }

    // Make the move
    try {
      chessGame.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      setChessPosition(chessGame.fen());
      setMoveFrom("");
      setOptionSquares({});
      setMovesHistory(chessGame.history());
    } catch {
      const hasMoveOptions = getMoveOptions(square as Square);
      setMoveFrom(hasMoveOptions ? square : "");
    }
  }

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!targetSquare) {
      return false;
    }

    const chessGame = chessGameRef.current;
    
    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      setChessPosition(chessGame.fen());
      setMoveFrom("");
      setOptionSquares({});
      setMovesHistory(chessGame.history());
      return true;
    } catch {
      return false;
    }
  }

  const resetBoard = () => {
    chessGameRef.current = new Chess();
    setChessPosition(chessGameRef.current.fen());
    setMovesHistory([]);
    setMoveAnalysis(null);
    setRelatedOpenings([]);
    setOptionSquares({});
    setMoveFrom("");
  };

  const chessboardOptions = {
    onPieceDrop,
    onSquareClick,
    position: chessPosition,
    squareStyles: optionSquares,
    id: "click-or-drag-to-move",
  };

  if (chessPosition === "start") {
    return <span>Loading...</span>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
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
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors group"
              >
                <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </Link>
              <Link 
                href="/explore" 
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors group"
              >
                <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Explore</span>
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
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 text-gray-300 hover:text-yellow-400 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link 
                  href="/explore" 
                  className="flex items-center space-x-3 text-gray-300 hover:text-yellow-400 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="h-5 w-5" />
                  <span>Explore Openings</span>
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
          <h1 className="text-4xl font-bold bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            Free Practice Board
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Practice chess openings freely with real-time analysis and related opening suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Related Openings - Left Panel */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-yellow-400">Related Openings</h2>
                <span className="bg-yellow-500/20 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full">
                  {relatedOpenings.length}
                </span>
              </div>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {relatedOpenings.map((opening) => (
                  <Link
                    key={opening.id}
                    href={`/practice/${opening.id}`}
                    className="block p-4 bg-slate-700/30 rounded-xl border border-slate-600 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-2 py-1 bg-yellow-500 text-slate-900 text-xs font-semibold rounded-full">
                            {opening.eco}
                          </span>
                          {opening.isEcoRoot && (
                            <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                              ECO Root
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 mb-1">
                          {opening.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono bg-slate-800/50 rounded-lg p-2 border border-slate-600">
                          {opening.moves}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-yellow-400 ml-2 flex-shrink-0 mt-6" />
                    </div>
                  </Link>
                ))}
                {relatedOpenings.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No related openings found</p>
                    <p className="text-gray-500 text-sm mt-1">Make some moves to see suggestions</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chess Board - Center */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              {/* Controls */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={resetBoard}
                  className="px-6 py-3 bg-yellow-500 text-slate-900 font-semibold rounded-xl hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 border-2 border-yellow-500 hover:border-yellow-400 flex items-center gap-3"
                >
                  <RotateCw className="h-5 w-5" />
                  Reset Board
                </button>
              </div>
              
              {/* Chessboard Container */}
              <div className="flex justify-center mb-6">
                <div className="bg-slate-700/30 rounded-2xl p-4 border border-slate-600">
                  <Chessboard options={chessboardOptions} />
                </div>
              </div>

              {/* Move History */}
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>Move History</span>
                  {movesHistory.length > 0 && (
                    <span className="bg-slate-600 text-gray-300 text-xs px-2 py-1 rounded-full">
                      {movesHistory.length} moves
                    </span>
                  )}
                </h3>
                <div className="min-h-[60px]">
                  {movesHistory.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {movesHistory.map((move, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-slate-600 text-white text-sm font-mono rounded-lg border border-slate-500"
                        >
                          {Math.floor(index / 2) + 1}.{index % 2 === 0 ? '' : '..'} {move}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-2">No moves yet - start playing!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Move Analysis - Right Panel */}
          <div className="lg:col-span-3 order-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-yellow-400">Position Analysis</h2>
                {isAnalyzing && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                )}
              </div>
              
              <div className="space-y-4">
                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-3"></div>
                    <p className="text-gray-400">Analyzing position...</p>
                  </div>
                ) : moveAnalysis ? (
                  <>
                    {/* Best Move */}
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                      <h4 className="font-semibold text-yellow-400 text-sm mb-2">Best Move</h4>
                      <p className="text-white font-mono text-lg">{moveAnalysis.bestMove || "N/A"}</p>
                    </div>

                    {/* Evaluation */}
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                      <h4 className="font-semibold text-yellow-400 text-sm mb-2">Evaluation</h4>
                      <p className="text-white font-mono text-lg">
                        {moveAnalysis.mate ? `Mate in ${moveAnalysis.mate}` : moveAnalysis.evaluation}
                      </p>
                    </div>

                    {/* Continuation */}
                    {moveAnalysis.continuation && (
                      <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                        <h4 className="font-semibold text-yellow-400 text-sm mb-2">Continuation</h4>
                        <p className="text-white text-sm font-mono wrap-break-words">
                          {moveAnalysis.continuation}
                        </p>
                      </div>
                    )}

                    {/* Ponder */}
                    {moveAnalysis.ponder && (
                      <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                        <h4 className="font-semibold text-yellow-400 text-sm mb-2">Ponder</h4>
                        <p className="text-white font-mono text-sm">{moveAnalysis.ponder}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No analysis available</p>
                    <p className="text-gray-500 text-sm mt-1">Make a move to see analysis</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreePractice;