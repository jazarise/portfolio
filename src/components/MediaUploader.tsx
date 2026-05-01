'use client';

import { useState, useRef } from 'react';

interface MediaUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video' | 'any';
}

<<<<<<< HEAD
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function MediaUploader({ label, value, onChange, type = 'any' }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = type === 'image'
      ? ALLOWED_IMAGE_TYPES
      : type === 'video'
        ? ALLOWED_VIDEO_TYPES
        : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type: ${file.type}. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max: ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

=======
export default function MediaUploader({ label, value, onChange, type = 'any' }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
    // Check if cloud name and upload preset are available
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
<<<<<<< HEAD
      setError('Cloudinary is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.');
=======
      alert("Cloudinary is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.");
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
<<<<<<< HEAD

=======
      
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
<<<<<<< HEAD

      if (data.secure_url) {
        onChange(data.secure_url);
        setError('');
      } else {
        setError(data.error?.message || 'Upload failed. Please try again.');
      }
    } catch (e: any) {
      setError('Error uploading file: ' + e.message);
=======
      
      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        alert(data.error?.message || "Upload failed.");
      }
    } catch (e: any) {
      alert("Error uploading file: " + e.message);
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

<<<<<<< HEAD
  const handleReplace = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    onChange('');
    setError('');
    // Reset file input
    if (inputRef.current) inputRef.current.value = '';
  };

  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || value?.includes('youtube.com') || value?.includes('youtu.be') || value?.includes('video/upload');

  const acceptStr = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/*,video/*';

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono tracking-widest text-gray-500 uppercase">{label}</label>

      {/* Show upload zone when no value */}
      {!value ? (
        <>
          {/* File Dropzone */}
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
              ${drag ? 'border-neon-purple bg-neon-purple/10' : 'border-white/10 hover:border-neon-purple/50 bg-white/5'}
              ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              accept={acceptStr}
              onChange={e => e.target.files && handleUpload(e.target.files[0])}
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-neon-purple/30 border-t-neon-purple animate-spin" />
                <span className="font-mono text-xs text-neon-purple">Uploading to cloud...</span>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl mb-2 opacity-50">☁️</div>
                <p className="font-mono text-xs text-gray-400">Click to Upload or Drag & Drop</p>
                <p className="font-mono text-[10px] text-gray-600 mt-1">
                  {type === 'image' ? 'JPG, PNG, WebP, GIF, SVG' : type === 'video' ? 'MP4, WebM, OGG' : 'JPG, PNG, WebP, MP4'} · Max 10MB
                </p>
              </div>
            )}
          </div>

          {/* Or Paste URL */}
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs text-gray-600">OR PASTE URL:</span>
            <input
              type="text"
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="e.g. https://... or YouTube URL"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
            />
          </div>
        </>
      ) : (
        <>
          {/* Media Preview Box */}
          <div className="relative rounded-xl border border-white/10 bg-black overflow-hidden">
            {isVideo ? (
              <div className="w-full relative pt-[56.25%]">
                {value.includes('youtube.com') || value.includes('youtu.be') ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${value.split('v=')[1]?.split('&')[0] || value.split('/').pop()}`}
                    allowFullScreen
                  />
                ) : (
                  <video src={value} controls className="absolute inset-0 w-full h-full object-contain" />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center bg-black/50">
                <img src={value} alt="Preview" className="max-h-64 object-contain w-full" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={handleReplace}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono
                text-purple-400 border border-purple-500/30 bg-purple-500/5
                hover:bg-purple-500/15 hover:border-purple-500/50 transition-all"
            >
              <span>↻</span> Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono
                text-red-400 border border-red-500/30 bg-red-500/5
                hover:bg-red-500/15 hover:border-red-500/50 transition-all"
            >
              <span>✕</span> Remove
            </button>
          </div>

          {/* URL display (readonly) */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              readOnly
              className="flex-1 bg-white/3 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-gray-500 font-mono truncate"
            />
          </div>

          {/* Hidden file input for replace */}
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept={acceptStr}
            onChange={e => e.target.files && handleUpload(e.target.files[0])}
          />
        </>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/30 border border-red-500/20">
          <span className="text-red-400 text-xs">✕</span>
          <p className="text-red-400 text-xs font-mono">{error}</p>
=======
  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || value?.includes('youtube.com') || value?.includes('youtu.be') || value?.includes('video/upload');

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono tracking-widest text-gray-500 uppercase">{label}</label>
      
      {/* File Dropzone */}
      <div 
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
          ${drag ? 'border-neon-purple bg-neon-purple/10' : 'border-white/10 hover:border-neon-purple/50 bg-white/5'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input 
          type="file" 
          ref={inputRef}
          className="hidden" 
          accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/*,video/*'} 
          onChange={e => e.target.files && handleUpload(e.target.files[0])} 
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-neon-purple/30 border-t-neon-purple animate-spin" />
            <span className="font-mono text-xs text-neon-purple">Uploading to cloud...</span>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-2xl mb-2 opacity-50">☁️</div>
            <p className="font-mono text-xs text-gray-400">Drag & Drop or Click to Upload</p>
            <p className="font-mono text-[10px] text-gray-600 mt-1">Supports JPG, PNG, WebP, MP4</p>
          </div>
        )}
      </div>

      {/* Or Paste URL */}
      <div className="flex items-center gap-2 mt-1">
        <span className="font-mono text-xs text-gray-600">OR PASTE URL:</span>
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="e.g. https://... or YouTube URL"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
        />
      </div>

      {/* Media Preview Box */}
      {value && (
        <div className="mt-3 relative rounded-xl border border-white/10 bg-black overflow-hidden flex items-center justify-center">
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center text-xs hover:bg-red-500 z-10"
            title="Remove Media"
          >
            ✕
          </button>
          
          {isVideo ? (
            <div className="w-full relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
              {value.includes('youtube.com') || value.includes('youtu.be') ? (
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${value.split('v=')[1]?.split('&')[0] || value.split('/').pop()}`}
                  allowFullScreen
                />
              ) : (
                <video src={value} controls className="absolute inset-0 w-full h-full object-contain" />
              )}
            </div>
          ) : (
            <img src={value} alt="Preview" className="max-h-64 object-contain w-full" />
          )}
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
        </div>
      )}
    </div>
  );
}
