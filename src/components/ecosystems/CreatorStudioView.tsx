import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Download,
  Loader2,
  Sliders,
  Play,
  Copy,
  Check,
  Maximize2,
  Upload,
} from 'lucide-react';
import { generateHighQualityImage, animateImageToVideo } from '../../services/api';

export const CreatorStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'copy'>('image');

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('Cyberpunk neural processor chip floating in a quantum vacuum with intricate golden circuits, glowing fiber optics, photorealistic 8k, volumetric lighting');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K'); // Affordance for 1K, 2K, 4K
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('16:9');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Video Generation State (gemini-omni-1.1-flash via Interactions API)
  const [videoPrompt, setVideoPrompt] = useState('Gentle cinematic camera tilt down, crystalline particle flux swirling in dynamic volumetric mist');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoInputImage, setVideoInputImage] = useState<{ base64: string; preview: string } | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim() || isGeneratingImage) return;

    setIsGeneratingImage(true);
    try {
      const res = await generateHighQualityImage({
        prompt: imagePrompt,
        aspectRatio,
        imageSize,
      });
      if (res.imageUrl) {
        setGeneratedImageUrl(res.imageUrl);
      }
    } catch (err: any) {
      alert(`Image Generation Failed: ${err.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleVideoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const base64 = ev.target?.result as string;
      setVideoInputImage({ base64, preview: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleAnimateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoInputImage || isGeneratingVideo) return;

    setIsGeneratingVideo(true);
    try {
      const res = await animateImageToVideo({
        imageBase64: videoInputImage.base64,
        motionPrompt: videoPrompt,
        aspectRatio: videoAspectRatio,
      });
      if (res.videoUrl) {
        setGeneratedVideoUrl(res.videoUrl);
      }
    } catch (err: any) {
      alert(`Video Animation Failed: ${err.message}`);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">AI CREATOR & MULTIMEDIA STUDIO</h2>
            <p className="text-xs text-slate-400">
              High-resolution image generation (1K/2K/4K) & Image-to-Video animation with gemini-omni-1.1-flash
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'image' ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Studio (1K-4K)</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'video' ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Animate to Video (Omni Flash)</span>
          </button>
        </div>
      </div>

      {activeTab === 'image' ? (
        /* Image Studio Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Controls */}
          <form onSubmit={handleGenerateImage} className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">Image Synthesis Parameters</span>
              <span className="text-[10px] font-mono text-purple-400">gemini-nano-banana-2.1 / 3-pro</span>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Visual Prompt Description:</label>
              <textarea
                value={imagePrompt}
                onChange={e => setImagePrompt(e.target.value)}
                rows={4}
                placeholder="Describe lighting, subject, textures, camera angle..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 resize-none font-sans"
              />
            </div>

            {/* MANDATORY Affordance for User to Specify Image Size (1K, 2K, 4K) */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Resolution Fidelity (imageSize):</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as const).map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                      imageSize === size
                        ? 'bg-purple-950 text-purple-300 border-purple-600 shadow-sm shadow-purple-500/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{size} Ultra</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Aspect Ratio:</label>
              <div className="grid grid-cols-4 gap-2">
                {(['1:1', '16:9', '9:16', '4:3'] as const).map(ratio => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 px-2 rounded-xl border text-xs font-mono transition-all ${
                      aspectRatio === ratio
                        ? 'bg-purple-950 text-purple-300 border-purple-600'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGeneratingImage}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing {imageSize} Canvas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate High-Quality {imageSize} Image</span>
                </>
              )}
            </button>
          </form>

          {/* Canvas Display */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-center items-center shadow-xl min-h-[440px]">
            {isGeneratingImage ? (
              <div className="flex flex-col items-center space-y-3 text-slate-400 font-mono text-xs">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <span>Computing neural diffuse matrix at {imageSize} resolution...</span>
              </div>
            ) : generatedImageUrl ? (
              <div className="w-full h-full flex flex-col items-center space-y-3">
                <div className="relative max-h-[460px] rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
                  <img src={generatedImageUrl} alt="Generated visual asset" className="max-h-[440px] object-contain" />
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-purple-400">Resolution: {imageSize}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">Aspect: {aspectRatio}</span>
                  <a
                    href={generatedImageUrl}
                    download={`nexora_${imageSize.toLowerCase()}_asset.png`}
                    className="ml-3 flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Asset</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 text-purple-400 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-300 font-mono">High-Fidelity Neural Canvas</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Configure your prompt and choose between 1K, 2K, and 4K resolutions to generate production graphics.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Video Animation Tab (gemini-omni-1.1-flash via Interactions API) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Controls */}
          <form onSubmit={handleAnimateVideo} className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">Image-to-Video Animator</span>
              <span className="text-[10px] font-mono text-purple-400">gemini-omni-1.1-flash</span>
            </div>

            {/* Photo Upload Input */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Source Keyframe Photo:</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleVideoImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer p-4 rounded-xl border border-dashed border-slate-700 hover:border-purple-500 bg-slate-950/60 flex flex-col items-center justify-center space-y-2 transition-colors"
              >
                {videoInputImage ? (
                  <div className="flex items-center space-x-3">
                    <img src={videoInputImage.preview} alt="Frame preview" className="w-16 h-16 rounded-lg object-cover" />
                    <div className="text-left">
                      <span className="text-xs font-mono text-emerald-400 font-semibold">Image Frame Ready</span>
                      <p className="text-[10px] text-slate-500">Click to change frame</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-xs text-slate-300 font-mono">Upload Photo to Animate</span>
                    <span className="text-[10px] text-slate-500">PNG, JPG, WebP supported</span>
                  </>
                )}
              </div>
            </div>

            {/* Motion Prompt */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Motion & Physics Prompt:</label>
              <textarea
                value={videoPrompt}
                onChange={e => setVideoPrompt(e.target.value)}
                rows={3}
                placeholder="Describe movement, camera panning, lighting transitions..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 resize-none font-sans"
              />
            </div>

            {/* Mandatory Aspect Ratio Requirement (16:9 or 9:16) */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Target Video Aspect Ratio:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('16:9')}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                    videoAspectRatio === '16:9'
                      ? 'bg-purple-950 text-purple-300 border-purple-600 shadow-sm shadow-purple-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  16:9 (Landscape)
                </button>
                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('9:16')}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                    videoAspectRatio === '9:16'
                      ? 'bg-purple-950 text-purple-300 border-purple-600 shadow-sm shadow-purple-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  9:16 (Portrait)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!videoInputImage || isGeneratingVideo}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              {isGeneratingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Video via Interactions API...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>Animate Image into {videoAspectRatio} Video</span>
                </>
              )}
            </button>
          </form>

          {/* Video Player Display */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-center items-center shadow-xl min-h-[440px]">
            {isGeneratingVideo ? (
              <div className="flex flex-col items-center space-y-3 text-slate-400 font-mono text-xs">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <span>Running Omni Flash video synthesis pipeline (30-60s)...</span>
              </div>
            ) : generatedVideoUrl ? (
              <div className="w-full h-full flex flex-col items-center space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl max-w-lg">
                  <video src={generatedVideoUrl} controls autoPlay loop className="w-full max-h-[440px] rounded-xl" />
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-purple-400 font-semibold">gemini-omni-1.1-flash</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300">Format: {videoAspectRatio}</span>
                  <a
                    href={generatedVideoUrl}
                    download="nexora_omni_animation.mp4"
                    className="ml-3 flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 text-purple-400 flex items-center justify-center mx-auto">
                  <Video className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-300 font-mono">Interactions API Video Engine</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Upload any photo and provide a motion prompt to animate it into a 16:9 or 9:16 high-definition video using gemini-omni-1.1-flash.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
