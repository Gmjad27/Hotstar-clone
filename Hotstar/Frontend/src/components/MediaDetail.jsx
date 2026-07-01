import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, Star, Clock, Calendar, ChevronDown } from 'lucide-react';

// Mock Data
const mediaData = {
  title: "Cyber Nexus",
  type: "Series", // or "Movie"
  rating: "4.8",
  releaseYear: "2024",
  duration: "TV-MA",
  genres: ["Sci-Fi", "Thriller", "Action"],
  synopsis: "In a neon-drenched metropolis, a rogue AI developer uncovers a conspiracy that bridges the gap between human consciousness and the digital void. As the boundaries of reality blur, she must race against time to prevent a global system override.",
  heroImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1920&q=80",
  cast: ["Elena Rostova", "Marcus Vance", "Jin-Soo Park", "Sarah Connor"],
  seasons: [
    {
      id: 1,
      title: "Season 1",
      episodes: [
        { id: 101, title: "The Awakening", duration: "45m", desc: "A routine system check goes horribly wrong.", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=60" },
        { id: 102, title: "Ghost in the Wire", duration: "42m", desc: "Elena traces a phantom signal to the lower levels.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=60" },
        { id: 103, title: "Firewall Down", duration: "50m", desc: "The team must manually reboot the mainframe.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=60" }
      ]
    },
    {
      id: 2,
      title: "Season 2",
      episodes: [
        { id: 201, title: "Echoes", duration: "48m", desc: "A new threat emerges from the deep web.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=60" },
        { id: 202, title: "Root Access", duration: "44m", desc: "Vance makes a dangerous deal with a data broker.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=60" }
      ]
    }
  ]
};

const MediaDetail = () => {
  const [activeSeason, setActiveSeason] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentSeason = mediaData.seasons[activeSeason];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        {/* Background Image with Gradient Overlays */}
        <div className="absolute inset-0">
          <img 
            src={mediaData.heroImage} 
            alt={mediaData.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-8 md:px-16 lg:px-24 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            {mediaData.title}
          </h1>
          
          {/* Meta Info */}
          <div className="flex items-center space-x-4 text-sm md:text-base font-medium text-gray-300 mb-6">
            <span className="flex items-center text-yellow-400"><Star className="w-4 h-4 mr-1 fill-current" /> {mediaData.rating}</span>
            <span>{mediaData.releaseYear}</span>
            <span className="border border-gray-500 px-1.5 py-0.5 rounded-sm text-xs">{mediaData.duration}</span>
            <span>{mediaData.type}</span>
          </div>

          <p className="text-gray-300 text-lg max-w-2xl mb-8 leading-relaxed line-clamp-3">
            {mediaData.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center bg-white text-black px-6 py-3 rounded-md font-bold text-lg hover:bg-gray-200 transition-colors">
              <Play className="w-6 h-6 mr-2 fill-current" /> Play
            </button>
            <button className="flex items-center bg-gray-600/60 hover:bg-gray-600/80 text-white px-6 py-3 rounded-md font-bold text-lg backdrop-blur-sm transition-colors">
              <Plus className="w-6 h-6 mr-2" /> My List
            </button>
            <button className="p-3 border border-gray-500 rounded-full hover:bg-gray-800 transition-colors">
              <ThumbsUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Details & Episodes Layout */}
      <div className="px-8 md:px-16 lg:px-24 py-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left Column: Episodes */}
        <div className="md:col-span-2">
          {mediaData.type === "Series" && (
            <>
              {/* Season Selector */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Episodes</h2>
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    <span>{currentSeason.title}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-xl z-50 overflow-hidden">
                      {mediaData.seasons.map((season, index) => (
                        <button
                          key={season.id}
                          onClick={() => {
                            setActiveSeason(index);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors ${activeSeason === index ? 'text-white bg-gray-800' : 'text-gray-400'}`}
                        >
                          {season.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Episode List */}
              <div className="space-y-4">
                {currentSeason.episodes.map((episode, index) => (
                  <div key={episode.id} className="flex flex-col sm:flex-row group bg-gray-900/50 hover:bg-gray-800/80 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-700">
                    <div className="sm:w-48 h-28 relative flex-shrink-0">
                      <img src={episode.image} alt={episode.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                      </div>
                    </div>
                    <div className="p-4 flex flex-col justify-center flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">
                          {index + 1}. {episode.title}
                        </h3>
                        <span className="text-gray-400 text-sm">{episode.duration}</span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                        {episode.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Additional Details */}
        <div className="space-y-8">
          <div>
            <h3 className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wider">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {mediaData.genres.map(genre => (
                <span key={genre} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wider">Cast</h3>
            <div className="flex flex-col space-y-2">
              {mediaData.cast.map(actor => (
                <span key={actor} className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                  {actor}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="font-semibold text-lg mb-4">About this show</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p className="flex justify-between"><span className="text-gray-500">Maturity Rating:</span> <span className="text-white">{mediaData.duration}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Release Year:</span> <span className="text-white">{mediaData.releaseYear}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Audio:</span> <span className="text-white">English, Hindi, Japanese</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Subtitles:</span> <span className="text-white">English, Hindi</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};q1

export default MediaDetail;