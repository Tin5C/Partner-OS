import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StoryItem, storyTypeColors
 } from '@/lib/stories';
import { cn } from '@/lib/utils';

interface CompetitorStorySlidesProps {
  story: StoryItem;
  onComplete?: () => void;
}

export function CompetitorStorySlides({ story, onComplete }: CompetitorStorySlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Create slides from story data
  const slides = [
    // Slide 1: Title + Main move
    {
      type: 'intro',
      content: {
        headline: story.title.replace('Competitor: ', ''),
        bullet: story.bullets[0],
      }
    },
    // Slide 2: Market read
    {
      type: 'insight',
      content: {
        headline: 'Market Read',
        bullet: story.bullets[1],
      }
    },
    // Slide 3: Your position + Why it matters
    {
      type: 'action',
      content: {
        headline: 'Your Position',
        bullet: story.bullets[2],
        whyItMatters: story.whyItMatters,
      }
    },
  ];

  const totalSlides = slides.length;
  const autoAdvanceTime = 5000; // 5 seconds per slide

  // Auto-advance timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (autoAdvanceTime / 100);
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          // Move to next slide
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide(curr => curr + 1);
            return 0;
          } else {
            // Completed all slides
            onComplete?.();
            return 100;
          }
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentSlide, totalSlides, onComplete]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
      setProgress(0);
    }
  };

  const handleTapLeft = () => goToSlide(currentSlide - 1);
  const handleTapRight = () => goToSlide(currentSlide + 1);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3">
        {slides.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: idx < currentSlide ? '100%' : idx === currentSlide ? `${progress}%` : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        {story.imageUrl && (
          <img 
            src={story.imageUrl} 
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Tap zones for navigation */}
      <div className="absolute inset-0 z-10 flex">
        <button 
          className="w-1/3 h-full focus:outline-none" 
          onClick={handleTapLeft}
          aria-label="Previous slide"
        />
        <div className="w-1/3 h-full" />
        <button 
          className="w-1/3 h-full focus:outline-none" 
          onClick={handleTapRight}
          aria-label="Next slide"
        />
      </div>

      {/* Navigation arrows (desktop) */}
      <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none z-20 max-sm:hidden">
        <button
          onClick={handleTapLeft}
          className={cn(
            "pointer-events-auto p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white transition-all",
            currentSlide === 0 && "opacity-30 cursor-not-allowed"
          )}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleTapRight}
          className={cn(
            "pointer-events-auto p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white transition-all",
            currentSlide === totalSlides - 1 && "opacity-30 cursor-not-allowed"
          )}
          disabled={currentSlide === totalSlides - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Content overlay */}
      <div className="relative z-[15] flex-1 flex flex-col justify-center px-6 py-16 pointer-events-none">
        {/* Type badge */}
        <span className={cn(
          "self-start px-3 py-1 text-xs font-semibold rounded-full border mb-4",
          storyTypeColors[story.type]
        )}>
          COMPETITOR INTEL
        </span>

        {/* Slide content with animation */}
        <div key={currentSlide} className="animate-fade-in space-y-4">
          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg">
            {currentSlideData.content.headline}
          </h2>

          {/* Bullet fact - styled as a card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-lg text-white font-medium leading-relaxed">
              {currentSlideData.content.bullet}
            </p>
          </div>

          {/* Why it matters (only on last slide) */}
          {currentSlideData.type === 'action' && currentSlideData.content.whyItMatters && (
            <div className="mt-4 bg-orange-500/20 backdrop-blur-md rounded-xl p-4 border border-orange-500/30">
              <p className="text-sm text-orange-200">
                <span className="font-semibold text-orange-300">Why it matters: </span>
                {currentSlideData.content.whyItMatters}
              </p>
            </div>
          )}
        </div>

        {/* Slide indicator */}
        <div className="mt-8 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all pointer-events-auto",
                idx === currentSlide ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
