import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const StoryCollector = () => {
  const [stories, setStories] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [sentence1, setSentence1] = useState('');
  const [sentence2, setSentence2] = useState('');
  const [sentence3, setSentence3] = useState('');
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState('write'); // 'write' or 'view'
  const [reviewText, setReviewText] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [selectedStoryForReview, setSelectedStoryForReview] = useState(null);

  // Load stories from localStorage (since window.storage might not be available)
  useEffect(() => {
    const stored = localStorage.getItem('storyworthy-stories');
    if (stored) {
      try {
        setStories(JSON.parse(stored).sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.log('First time using app');
      }
    }
  }, []);

  // Auto-save current story
  useEffect(() => {
    if (sentence1 || sentence2 || sentence3) {
      setSaved(false);
      const timer = setTimeout(() => {
        try {
          const story = {
            date: currentDate,
            sentence1,
            sentence2,
            sentence3,
            savedAt: new Date().toISOString()
          };
          // Don't permanently save draft, just show feedback
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        } catch (error) {
          console.error('Save failed:', error);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sentence1, sentence2, sentence3, currentDate]);

  const saveStory = async () => {
    if (!sentence1 && !sentence2 && !sentence3) return;

    const story = {
      date: currentDate,
      sentence1,
      sentence2,
      sentence3,
      savedAt: new Date().toISOString()
    };

    try {
      const updatedStories = [
        story,
        ...stories.filter(s => s.date !== currentDate)
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setStories(updatedStories);
      localStorage.setItem('storyworthy-stories', JSON.stringify(updatedStories));

      setSentence1('');
      setSentence2('');
      setSentence3('');
      setCurrentDate(new Date().toISOString().split('T')[0]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const exportToCSV = () => {
    if (stories.length === 0) return;

    const csv = [
      ['Date', 'Story (3 Sentences)'],
      ...stories.map(story => [
        story.date,
        `${story.sentence1} ${story.sentence2} ${story.sentence3}`
      ])
    ];

    const csvContent = csv.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stories-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const sendToClaudeForReview = async (story) => {
    if (!story) return;

    setReviewing(true);
    setReviewText('');
    setSelectedStoryForReview(story);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `I'm following Matthew Dicks' "Storyworthy" daily story practice. Here's my three-sentence story for ${story.date}:

"${story.sentence1} ${story.sentence2} ${story.sentence3}"

Please review this story for:
1. **Clarity**: Are the nouns (people, places, things) clear?
2. **Emotion**: Does the emotion come through?
3. **Memorability**: Is there a visual or emotional element that sticks?
4. **One suggestion**: One small edit or idea to make it stronger.

Keep the feedback brief and encouraging.`
            }
          ]
        })
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        setReviewText(data.content[0].text);
      }
    } catch (error) {
      setReviewText('Error connecting to Claude. Please check your internet connection and try again.');
    } finally {
      setReviewing(false);
    }
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-1">Story</h1>
          <p className="text-sm text-slate-600">Three sentences from your day</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('write')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'write'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Write
          </button>
          <button
            onClick={() => setView('view')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              view === 'view'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            View ({stories.length})
          </button>
        </div>

        {/* WRITE VIEW */}
        {view === 'write' && (
          <div className="space-y-4">
            {/* Date Selector */}
            <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-slate-200">
              <button
                onClick={() => changeDate(-1)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ChevronLeft size={20} />
              </button>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="text-center font-medium border-none text-slate-900"
              />
              <button
                onClick={() => changeDate(1)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Template Helper */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
              <p className="font-medium mb-2">Template:</p>
              <p className="text-xs leading-relaxed">
                <span className="font-medium">[Person/Place/Thing]</span> + <span className="font-medium">[What happened]</span> + <span className="font-medium">[How you felt / Why it mattered]</span>
              </p>
            </div>

            {/* Sentence Inputs */}
            <div className="space-y-3">
              <textarea
                value={sentence1}
                onChange={(e) => setSentence1(e.target.value)}
                placeholder="First sentence..."
                className="w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-base resize-none"
                rows="2"
              />
              <textarea
                value={sentence2}
                onChange={(e) => setSentence2(e.target.value)}
                placeholder="Second sentence..."
                className="w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-base resize-none"
                rows="2"
              />
              <textarea
                value={sentence3}
                onChange={(e) => setSentence3(e.target.value)}
                placeholder="Third sentence..."
                className="w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-base resize-none"
                rows="2"
              />
            </div>

            {/* Save Indicator */}
            {saved && (
              <div className="text-sm text-green-600 text-center font-medium">
                ✓ Auto-saved
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={saveStory}
              disabled={!sentence1 && !sentence2 && !sentence3}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              Save Story
            </button>

            {/* Export Button */}
            {stories.length > 0 && (
              <button
                onClick={exportToCSV}
                className="w-full bg-white text-slate-900 py-3 rounded-lg font-medium flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Download size={20} />
                Export All to Spreadsheet
              </button>
            )}
          </div>
        )}

        {/* VIEW & REVIEW */}
        {view === 'view' && (
          <div className="space-y-4">
            {stories.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="mb-2">No stories yet</p>
                <p className="text-sm">Write your first story to get started</p>
              </div>
            ) : (
              <>
                {stories.map((story) => (
                  <div key={story.date} className="bg-white rounded-lg p-4 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-slate-900">
                        {new Date(story.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {story.sentence1} {story.sentence2} {story.sentence3}
                    </p>
                    <button
                      onClick={() => sendToClaudeForReview(story)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 mt-2"
                    >
                      <Sparkles size={16} />
                      Get feedback
                    </button>

                    {/* Review Result */}
                    {selectedStoryForReview?.date === story.date && reviewText && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                        <p className="text-xs font-medium text-amber-900 mb-2">Claude's Feedback:</p>
                        <p className="text-xs text-amber-900 leading-relaxed whitespace-pre-wrap">
                          {reviewText}
                        </p>
                      </div>
                    )}

                    {reviewing && selectedStoryForReview?.date === story.date && (
                      <div className="text-xs text-slate-500 animate-pulse">
                        Getting feedback...
                      </div>
                    )}
                  </div>
                ))}

                {/* Export Button */}
                <button
                  onClick={exportToCSV}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors mt-4"
                >
                  <Download size={20} />
                  Export All to Spreadsheet
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryCollector;
