'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface MediaUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video' | 'document' | 'any';
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const ALLOWED_DOC_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** Safely parse a fetch response — prevents the "Unexpected token '<'" crash */
async function safeJsonParse(res: Response): Promise<{ ok: boolean; data: any }> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      return { ok: false, data: { error: `Server error (${res.status}): returned HTML instead of JSON` } };
    }
    return { ok: false, data: { error: `Unexpected response (${res.status}): ${text.slice(0, 150)}` } };
  }
  try {
    const data = await res.json();
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { error: `Failed to parse response (${res.status})` } };
  }
}

export default function MediaUploader({ label, value, onChange, type = 'any' }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = type === 'image'
      ? ALLOWED_IMAGE_TYPES
      : type === 'video'
        ? ALLOWED_VIDEO_TYPES
        : type === 'document'
          ? ALLOWED_DOC_TYPES
          : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_DOC_TYPES];

    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type: ${file.type}. Allowed: ${allowedTypes.map(t => t.split('/')[1] || t).join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max: ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }
    return null;
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
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
    setSuccess('');
    setProgress(0);

    // Check if Cloudinary is configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      // ── Local upload fallback ──
      setUploading(true);
      try {
        const localFormData = new FormData();
        localFormData.append('file', file);

        // Use XMLHttpRequest for progress tracking
        const url = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/upload');

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          });

          xhr.addEventListener('load', () => {
            try {
              const contentType = xhr.getResponseHeader('content-type') || '';
              if (!contentType.includes('application/json')) {
                reject(new Error(`Server error (${xhr.status}): Expected JSON response`));
                return;
              }
              const data = JSON.parse(xhr.responseText);
              if (xhr.status >= 200 && xhr.status < 300 && (data.url || data.data?.url)) {
                resolve(data.url || data.data?.url);
              } else {
                reject(new Error(data.error || 'Upload failed'));
              }
            } catch {
              reject(new Error('Failed to parse upload response'));
            }
          });

          xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
          xhr.addEventListener('abort', () => reject(new Error('Upload was cancelled')));

          xhr.send(localFormData);
        });

        onChange(url);
        setError('');
        showSuccess('✓ Uploaded successfully');
      } catch (e: any) {
        setError(e.message || 'Upload failed');
      } finally {
        setUploading(false);
        setProgress(0);
      }
      return;
    }

    // ── Cloudinary upload ──
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const resourceType = 'auto';
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await fetch(endpoint, { method: 'POST', body: formData });
      const { ok, data } = await safeJsonParse(res);

      if (ok && data.secure_url) {
        onChange(data.secure_url);
        setError('');
        showSuccess('✓ Uploaded to cloud');
      } else {
        setError(data.error?.message || data.error || 'Upload failed. Please try again.');
      }
    } catch (e: any) {
      setError('Error uploading file: ' + e.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleReplace = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    onChange('');
    setError('');
    setSuccess('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || value?.includes('youtube.com') || value?.includes('youtu.be') || value?.includes('video/upload');
  const isDoc = value?.match(/\.(pdf)$/i) || type === 'document';

  const acceptStr = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : type === 'document' ? 'application/pdf' : 'image/*,video/*,application/pdf';

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
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full border-2 border-neon-purple/30 border-t-neon-purple animate-spin" />
                <span className="font-mono text-xs text-neon-purple">Uploading... {progress > 0 ? `${progress}%` : ''}</span>
                {progress > 0 && (
                  <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl mb-2 opacity-50">☁️</div>
                <p className="font-mono text-xs text-gray-400">Click to Upload or Drag & Drop</p>
                <p className="font-mono text-[10px] text-gray-600 mt-1">
                  {type === 'image' ? 'JPG, PNG, WebP, GIF, SVG' : type === 'video' ? 'MP4, WebM, OGG' : type === 'document' ? 'PDF only' : 'JPG, PNG, WebP, MP4, PDF'} · Max 10MB
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
            ) : isDoc ? (
              <div className="relative w-full h-32 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl">
                <div className="text-4xl mb-2">📄</div>
                <div className="text-xs font-mono text-gray-400">PDF Document</div>
                <a href={value} target="_blank" rel="noreferrer" className="text-[10px] text-neon-cyan mt-1 hover:underline">Preview</a>
              </div>
            ) : (
              <div className="relative w-full h-64 bg-black/50 overflow-hidden">
                <Image src={value} fill sizes="(max-width: 768px) 100vw, 400px" alt="Preview" className="object-contain" />
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

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg bg-emerald-950/30 border border-emerald-500/20 animate-[fadeUp_0.3s_ease-out]">
          <span className="text-emerald-400 text-xs">✓</span>
          <p className="text-emerald-400 text-xs font-mono">{success}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg bg-red-950/30 border border-red-500/20">
          <span className="text-red-400 text-xs">✕</span>
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}
    </div>
  );
}
