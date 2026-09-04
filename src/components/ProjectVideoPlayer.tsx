'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

interface ProjectVideoPlayerProps {
  youtubeUrl: string;
}

export default function ProjectVideoPlayer({ youtubeUrl }: ProjectVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from different YouTube URL formats
  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }
      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
      return null;
    } catch {
      return null;
    }
  };

  const videoId = getVideoId(youtubeUrl);

  if (!videoId) return null;

  return (
    <div className="w-full mt-4">
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setIsPlaying(true)}
              className="group relative flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 hover:bg-neon-cyan/20 transition-all text-sm font-medium text-neon-cyan overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Play className="w-4 h-4" />
              <span>Watch Demo</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative w-full rounded-xl overflow-hidden border border-neon-cyan/20 bg-black/50"
          >
            <div className="flex justify-between items-center px-4 py-2 bg-dark-glass border-b border-white/10">
              <span className="text-xs font-mono text-neon-cyan flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Demo
              </span>
              <button
                onClick={() => setIsPlaying(false)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full pb-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
