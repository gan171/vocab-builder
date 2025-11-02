// src/components/Flashcard.jsx

import { useState, useEffect } from 'react';

// Step 1: Accept the new props: 'wordId' and 'onReview'
export default function Flashcard({ word, meaning, sentence, wordId, onReview }) {
  
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [word]); 

  function handleFlip() {
    setIsFlipped(!isFlipped); 
  }

  function getGoogleImagesUrl(query) {
    return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  }

  function handleImageSearchClick(e) {
    e.stopPropagation();
    const url = getGoogleImagesUrl(word);
    const windowFeatures = 'width=800,height=600,resizable=yes,scrollbars=yes';
    window.open(url, 'googleImageSearch', windowFeatures);
  }

  // --- NEW: Click handler for the SRS buttons ---
  function handleReviewClick(e, rating) {
    // Stop the click from flipping the card
    e.stopPropagation(); 
    
    // Call the function that was passed down from App.jsx
    onReview(wordId, rating);
  }

  return (
    <div 
      className="w-full max-w-lg min-h-[18rem] bg-white rounded-xl shadow-lg p-8 
                 flex flex-col justify-center cursor-pointer 
                 transition-all duration-300 hover:shadow-xl"
      onClick={handleFlip} 
    >
      
      { !isFlipped ? (
        
        // --- FRONT (Unchanged) ---
        <div className="front">
          <h2 className="text-4xl font-bold text-slate-800 text-center">
            {word}
          </h2>
        </div>

      ) : (

        // --- BACK (Updated with SRS Buttons) ---
        <div className="back">
          <p className="text-xl text-slate-700 mb-3">
            {meaning}
          </p>
          <p className="text-lg text-slate-500 italic mb-4">
            "{sentence}"
          </p> {/* <--- THIS IS THE FIX (was </srsBlock>) */}

          {/* Image Link (Unchanged) */}
          <div 
            onClick={handleImageSearchClick}
            className="text-center text-sm font-medium text-blue-600 hover:underline cursor-pointer mb-5"
          >
            Show Images for "{word}"
          </div>

          {/* === NEW: SRS Button Group === */}
          <div className="flex justify-between space-x-2">
            <button
              onClick={(e) => handleReviewClick(e, 'again')}
              className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Again
            </button>
            <button
              onClick={(e) => handleReviewClick(e, 'hard')}
              className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Hard
            </button>
            <button
              onClick={(e) => handleReviewClick(e, 'good')}
              className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Good
            </button>
            <button
              onClick={(e) => handleReviewClick(e, 'easy')}
              className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Easy
            </button>
          </div>
          
        </div>

      )}

    </div>
  );
}