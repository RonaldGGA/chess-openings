// components/OpeningCard.tsx
import { ExternalLink } from 'lucide-react';
import { Opening } from '../explore/page';
;

interface OpeningCardProps {
  opening: Opening;
  viewMode: 'grid' | 'list';
  onClick: (openingId: string) => void;
}

const OpeningCard: React.FC<OpeningCardProps> = ({ opening, viewMode, onClick }) => {
  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onClick(opening.id)}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* ECO Badge and Basic Info */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="shrink-0">
                <span className="inline-block px-3 py-1 bg-yellow-500 text-slate-900 text-sm font-semibold rounded-full">
                  {opening.eco}
                </span>
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors truncate">
                  {opening.name}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {opening.moves}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-400 flex-shrink-0">
              <span>Source: {opening.src}</span>
              {opening.scid && <span>SCID: {opening.scid}</span>}
              {opening.isEcoRoot && (
                <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                  ECO Root
                </span>
              )}
            </div>

            {/* Aliases (truncated) */}
            {opening.aliases.length > 0 && (
              <div className="hidden lg:block shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Also:</span>
                  <span className="text-xs text-gray-400 truncate max-w-xs">
                    {opening.aliases[0].value}
                    {opening.aliases.length > 1 && ` +${opening.aliases.length - 1} more`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-4 shrink-0 ml-4">
            <span className="text-yellow-400 text-sm font-medium group-hover:underline flex items-center">
              Practice
              <ExternalLink className="h-3 w-3 ml-1" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default grid view
  return (
    <div
      onClick={() => onClick(opening.id)}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 cursor-pointer group h-full flex flex-col"
    >
      {/* ECO Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-block px-3 py-1 bg-yellow-500 text-slate-900 text-sm font-semibold rounded-full">
          {opening.eco}
        </span>
        {opening.isEcoRoot && (
          <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
            ECO Root
          </span>
        )}
      </div>

      {/* Opening Name */}
      <h3 className="font-bold text-lg mb-2 text-white group-hover:text-yellow-400 transition-colors line-clamp-2 flex-1">
        {opening.name}
      </h3>

      {/* Moves */}
      <div className="mb-3">
        <p className="text-sm text-gray-400 mb-1">Moves:</p>
        <p className="text-sm font-mono text-gray-300 bg-slate-700/30 rounded-lg p-2 border border-slate-600">
          {opening.moves}
        </p>
      </div>

      {/* Source */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>Source: {opening.src}</span>
        {opening.scid && <span>SCID: {opening.scid}</span>}
      </div>

      {/* Aliases */}
      {opening.aliases.length > 0 && (
        <div className="border-t border-slate-700 pt-3 mt-auto">
          <p className="text-xs text-gray-400 mb-2">Also known as:</p>
          <div className="flex flex-wrap gap-1">
            {opening.aliases.slice(0, 2).map(alias => (
              <span
                key={alias.id}
                className="inline-block px-2 py-1 bg-slate-700/30 text-gray-300 text-xs rounded-md border border-slate-600"
              >
                {alias.value}
              </span>
            ))}
            {opening.aliases.length > 2 && (
              <span className="inline-block px-2 py-1 bg-slate-700/30 text-gray-400 text-xs rounded-md">
                +{opening.aliases.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* View Details CTA */}
      <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-700">
        <span className="text-yellow-400 text-sm font-medium group-hover:underline flex items-center">
          Practice Opening
          <ExternalLink className="h-3 w-3 ml-1" />
        </span>
      </div>
    </div>
  );
};

export default OpeningCard;