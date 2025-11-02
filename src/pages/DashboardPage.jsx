// src/pages/DashboardPage.jsx 
// ^ FIX #1: Corrected file name comment

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';

// We rename the function back to DashboardPage
export default function DashboardPage() {
  
  // === THE FIX ===
  // We move this line *inside* the component function
  const navigate = useNavigate(); 

  const [deckId, setDeckId] = useState(null); 
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This useEffect (for fetching data) is unchanged
  useEffect(() => {
    if (!deckId) return;

    setIsLoading(true);
    setError(null);
    setDeck([]); 

    const endpoint = (deckId === 'difficult')
      ? 'http://localhost:4000/api/decks/difficult'
      : 'http://localhost:4000/api/decks';

    fetch(endpoint)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setDeck(data);
        setCurrentIndex(0); 
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
    
  }, [deckId]); 

  
  function handleSrsReview(wordId, rating) {
    console.log(`Reviewing word ${wordId} with rating: ${rating}`);
    
    fetch('http://localhost:4000/api/review', {
      method: 'POST',
      headers: { 
        // FIX #2: Corrected 'application/json' typo
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ id: wordId, rating: rating }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Server failed to update');
      }
      return response.json();
    })
    .then(data => {
      const updatedWord = data.data; 

      if (deckId === 'difficult' && updatedWord.difficulty === 'good') {
        
        // FIX #3: Corrected 'disappear' comment typo
        // This is what makes it disappear from the UI instantly.
        const newDeck = deck.filter(word => word._id !== updatedWord._id);
        setDeck(newDeck);
        
        if (currentIndex >= newDeck.length) {
          setCurrentIndex(0); 
        }
        // Note: We do *not* call handleNext() here, because
        // the card "disappears" and the next card takes its place.

      } else {
        handleNext();
      }
    })
    .catch(err => {
      console.error('Error sending review:', err);
      handleNext();
    });
  }


  function handleNext() {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleGoBack() {
    setDeckId(null); 
    setDeck([]);
    setError(null);
  }

  // This function is now correctly defined *inside* the component
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-700">Loading your deck...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-red-600">Error: {error}</h1>
        <button onClick={handleGoBack} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  if (!deckId) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-10">Vocab-Builder</h1>
        <div className="space-y-4 w-full max-w-xs">
          <button 
            onClick={() => setDeckId('full')}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg shadow font-semibold text-lg hover:bg-blue-700 transition-all"
          >
            Study Full Deck
          </button>
          <button 
            onClick={() => setDeckId('difficult')}
            className="w-full px-6 py-4 bg-white text-slate-700 rounded-lg shadow font-semibold text-lg hover:bg-slate-50 transition-all"
          >
            Review "Difficult" Words
          </button>
        </div>
        <button 
          onClick={handleLogout}
          className="absolute top-4 right-4 text-sm text-blue-600 hover:underline"
        >
          Logout
        </button>
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-700">This deck is empty!</h1>
        
        { deckId === 'difficult' && (
          <p className="text-slate-500 mb-6">You have no words marked as "difficult".</p>
        )}
        
        <button onClick={handleGoBack} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700">
          Go Back
        </button>
        <button 
          onClick={handleLogout}
          className="absolute top-4 right-4 text-sm text-blue-600 hover:underline"
        >
          Logout
        </button>
      </div>
    );
  }

  const currentWord = deck[currentIndex];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-lg mb-2 flex justify-between items-center">
        <button onClick={handleGoBack} className="text-sm text-blue-600 hover:underline">
          &larr; Change Deck
        </button>
        {/* Added the logout button here too, from my previous message */}
        <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
          Logout
        </button>
      </div>

      <Flashcard 
        key={currentWord._id} 
        word={currentWord.word} 
        meaning={currentWord.meaning} 
        sentence={currentWord.sentence}
        wordId={currentWord._id} 
        onReview={handleSrsReview}
      />

      <div className="flex justify-between w-full max-w-lg mt-6">
        <button 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-white rounded-lg shadow font-semibold text-slate-700 
                     hover:bg-slate-50
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex === deck.length - 1}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold 
                     hover:bg-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}