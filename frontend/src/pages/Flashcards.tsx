
import React, { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { useSearch } from '../context/SearchContext'
import { useToast } from '../components/ui/Toast'
import { generateFlashcards, getApiErrorMessage } from '../services/api'
import {
  Bookmark,
  BookmarkCheck,
  Star,
  Search,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  FolderOpen,
  Pin,
  Sparkles,
  RefreshCw
} from 'lucide-react'

interface Flashcard {
  id: string
  subject: string
  code: string
  question: string
  answer: string
  shelfNum: string
}

const Flashcards: React.FC = () => {
  const { showToast } = useToast()
  const [deck, setDeck] = useState<Flashcard[]>([])
  const [topic, setTopic] = useState('Operating Systems - Virtual Memory')
  const [isGenerating, setIsGenerating] = useState(false)

  const { searchQuery, setSearchQuery } = useSearch()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['f1']))
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(['f2']))

  // Filter deck based on search query
  const filteredDeck = deck.filter(
    (card) =>
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCard = filteredDeck[currentIndex]

  const handleNext = () => {
    if (filteredDeck.length <= 1) return
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredDeck.length)
    }, 150)
  }

  const handlePrev = () => {
    if (filteredDeck.length <= 1) return
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredDeck.length) % filteredDeck.length)
    }, 150)
  }

  const handleShuffle = () => {
    setIsFlipped(false)
    setTimeout(() => {
      const shuffled = [...deck].sort(() => Math.random() - 0.5)
      setDeck(shuffled)
      setCurrentIndex(0)
    }, 150)
  }

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // prevent card flipping when clicking favorite star
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // prevent card flipping when clicking bookmark icon
    setBookmarks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleGenerateDeck = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    try {
      const data = await generateFlashcards(topic)
      const generatedDeck: Flashcard[] = data.flashcards.map((card, idx) => ({
        id: `${Date.now()}-${idx}`,
        subject: topic,
        code: 'AI',
        question: card.question,
        answer: card.answer,
        shelfNum: `GEN-${idx + 1}`
      }))
      setDeck(generatedDeck)
      setCurrentIndex(0)
      setIsFlipped(false)
    } catch (error) {
      showToast(getApiErrorMessage(error))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif text-text mb-1">Library Index Cards</h1>
        <p className="text-sm text-text/60 font-sans">
          Study key concepts using traditional catalog cards. Click cards to flip between question and answers.
        </p>
      </div>

      {/* SEARCH & CONTROL BAR */}
      <div className="bg-card border border-border rounded-[10px] p-5 shadow-[0_2px_6px_rgba(139,94,60,0.04)] flex flex-col gap-4">

        {/* AI Generator Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex items-center flex-grow">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Operating Systems - Virtual Memory"
              className="w-full px-3.5 py-2 text-xs bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/40 font-sans"
              aria-label="Flashcard generation topic"
            />
          </div>
          <Button
            onClick={handleGenerateDeck}
            variant="primary"
            size="sm"
            className="text-xs h-9 px-4 flex items-center justify-center gap-1.5 whitespace-nowrap"
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Generate Flashcards
              </>
            )}
          </Button>
        </div>

        <div className="h-px bg-border/60" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex items-center w-full max-w-sm">
            <span className="absolute left-3.5 text-text/40">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentIndex(0)
              }}
              placeholder="Search index by subject or keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/40 font-sans"
            />
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleShuffle}
              variant="outline"
              size="sm"
              className="text-xs h-9 px-4 flex items-center gap-1.5"
              disabled={filteredDeck.length <= 1}
            >
              <Shuffle className="w-3.5 h-3.5" /> Shuffle Deck
            </Button>

            <span className="text-xs font-sans font-semibold text-text/45 px-3 py-1.5 border border-border rounded-[10px] bg-background">
              Card {filteredDeck.length > 0 ? currentIndex + 1 : 0} of {filteredDeck.length}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CARDS VIEWPORT */}
      <div className="flex flex-col items-center justify-center py-6 min-h-[360px]">
        {isGenerating ? (
          <Loading message="Consulting the library & compiling flashcards..." />
        ) : activeCard ? (
          <div className="space-y-6 w-full max-w-md">
            
            {/* 3D FLIP CARD CONTAINER */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-72 cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-full h-full duration-500 transition-transform relative"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 1. FRONT SIDE: Library Index Question Card */}
                <div
                  className="absolute inset-0 bg-card border border-border/80 p-6 rounded-[10px] shadow-[0_4px_12px_rgba(139,94,60,0.06)] flex flex-col justify-between"
                  style={{
                    backfaceVisibility: 'hidden',
                    backgroundImage: 'linear-gradient(transparent, transparent 27px, var(--color-border) 27px, var(--color-border) 28px)',
                    backgroundSize: '100% 28px',
                    lineHeight: '28px'
                  }}
                >
                  {/* Card Red Top Margin Rule line */}
                  <div className="absolute top-10 left-0 right-0 h-[1.5px] bg-red-200/60 pointer-events-none" />

                  {/* Header Meta */}
                  <div className="flex items-center justify-between text-[10px] font-sans font-bold text-text/45 uppercase tracking-wider relative z-10">
                    <div className="flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5 text-primary" />
                      <span>{activeCard.subject} &bull; {activeCard.code}</span>
                    </div>
                    <span>Shelf: {activeCard.shelfNum}</span>
                  </div>

                  {/* Question Content (Aligned to ruled lines) */}
                  <div className="flex-grow pt-8 flex items-center justify-center relative z-10 px-4">
                    <h3 className="font-serif text-sm font-bold text-text text-center leading-[28px]">
                      {activeCard.question}
                    </h3>
                  </div>

                  {/* Bottom Footer (punch hole detail and card flip helper) */}
                  <div className="flex items-center justify-between mt-auto relative z-10">
                    <button
                      onClick={(e) => toggleFavorite(activeCard.id, e)}
                      className="p-1 rounded-md text-text/30 hover:text-amber-500 transition-colors focus:outline-none"
                      aria-label="Add to favorites"
                    >
                      <Star className={`w-4 h-4 ${favorites.has(activeCard.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>

                    {/* Catalog Rod Punch Hole details */}
                    <div className="h-5.5 w-5.5 rounded-full bg-background border border-border/70 flex items-center justify-center shadow-inner relative -bottom-2">
                      <div className="h-2 w-2 rounded-full bg-border" />
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(activeCard.id, e)}
                      className="p-1 rounded-md text-text/30 hover:text-accent transition-colors focus:outline-none"
                      aria-label="Bookmark index card"
                    >
                      {bookmarks.has(activeCard.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-accent" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. BACK SIDE: Library Index Answer Card */}
                <div
                  className="absolute inset-0 bg-card border border-border/80 p-6 rounded-[10px] shadow-[0_4px_12px_rgba(139,94,60,0.06)] flex flex-col justify-between"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundImage: 'linear-gradient(transparent, transparent 27px, var(--color-border) 27px, var(--color-border) 28px)',
                    backgroundSize: '100% 28px',
                    lineHeight: '28px'
                  }}
                >
                  {/* Card Red Top Margin Rule line */}
                  <div className="absolute top-10 left-0 right-0 h-[1.5px] bg-red-200/60 pointer-events-none" />

                  {/* Header Meta */}
                  <div className="flex items-center justify-between text-[10px] font-sans font-bold text-text/45 uppercase tracking-wider relative z-10">
                    <div className="flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5 text-accent" />
                      <span>Answer Key &bull; Verification</span>
                    </div>
                    <span>{activeCard.code}</span>
                  </div>

                  {/* Answer Content */}
                  <div className="flex-grow pt-8 flex items-center justify-center relative z-10 px-4 overflow-y-auto max-h-[140px] scrollbar-thin">
                    <p className="font-sans text-xs text-text/80 text-center leading-relaxed">
                      {activeCard.answer}
                    </p>
                  </div>

                  {/* Bottom Footer (punch hole detail & controls) */}
                  <div className="flex items-center justify-between mt-auto relative z-10">
                    <div className="text-[9px] font-sans font-semibold text-accent/60 uppercase tracking-wider flex items-center gap-1">
                      <RotateCw className="w-3 h-3 animate-spin-slow" /> Index Card
                    </div>

                    {/* Catalog Rod Punch Hole details */}
                    <div className="h-5.5 w-5.5 rounded-full bg-background border border-border/70 flex items-center justify-center shadow-inner relative -bottom-2">
                      <div className="h-2 w-2 rounded-full bg-border" />
                    </div>

                    <span className="text-[9px] font-mono text-text/30">
                      ID: {activeCard.id.toUpperCase()}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* DECK NAVIGATION CONTROLS */}
            <div className="flex items-center justify-between px-2">
              <Button
                onClick={handlePrev}
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs font-semibold flex items-center gap-1"
                disabled={filteredDeck.length <= 1}
                aria-label="Previous index card"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <span className="text-[10px] text-text/50 font-sans italic">
                Click index card to flip
              </span>
              <Button
                onClick={handleNext}
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs font-semibold flex items-center gap-1"
                disabled={filteredDeck.length <= 1}
                aria-label="Next index card"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

          </div>
        ) : (
          <EmptyState
            title="No flashcards in your library."
            description={
              searchQuery
                ? 'No catalog index matches your current search term. Try searching for a different keyword or category.'
                : 'Enter a topic above and click Generate Flashcards to build your first study deck.'
            }
          />
        )}
      </div>

    </div>
  )
}

export default Flashcards
