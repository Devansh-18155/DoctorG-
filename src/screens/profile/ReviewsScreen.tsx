import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Star, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react';

export const ReviewsScreen: React.FC = () => {
  const { goBack, showToast } = useApp();

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Polite Doctor', 'Accurate Diagnosis']);
  const [comment, setComment] = useState('Dr. Mukherjee listened patiently and explained my cardiac prescription in detail.');

  const availableTags = [
    'Polite Doctor',
    'Accurate Diagnosis',
    'Short Wait Time',
    'Clean Hospital OPD',
    'Helpful Staff',
    'Live Patient Queue',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Thank you! Your feedback has been verified and published.', 'success');
    goBack();
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">Reviews & Ratings</span>

        <span className="w-8"></span>
      </div>

      <div className="p-4 space-y-4">
        {/* Rate Service Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-2xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
              Completed Consultation
            </span>
            <h3 className="font-extrabold text-base text-[#172B4D] mt-0.5">
              Rate Dr. Arindam Mukherjee
            </h3>
            <p className="text-xs text-slate-500">Apollo Multispeciality Hospital • Cardiology</p>
          </div>

          {/* 5-Star Selector */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 text-amber-400 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Quick Tags */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              Highlight Highlights
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#087E8B] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Your Review / Experience
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Tell others about doctor consultation, waiting experience, and advice..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all"
          >
            Submit Verified Review
          </button>
        </form>
      </div>
    </div>
  );
};
