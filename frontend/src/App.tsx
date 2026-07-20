import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Bookshelf from './pages/Bookshelf'
import ReadingRoom from './pages/ReadingRoom'
import AITutor from './pages/AITutor'
import NotesSummarizer from './pages/NotesSummarizer'
import QuizGenerator from './pages/QuizGenerator'
import StudyPlanner from './pages/StudyPlanner'
import AssignmentHelper from './pages/AssignmentHelper'
import Flashcards from './pages/Flashcards'
import Settings from './pages/Settings'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import NotFoundPage from './pages/NotFoundPage'
import { ToastProvider } from './components/ui/Toast'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookshelf" element={<Bookshelf />} />
            <Route path="/reading-room" element={<ReadingRoom />} />
            <Route path="/tutor" element={<AITutor />} />
            <Route path="/notes" element={<NotesSummarizer />} />
            <Route path="/quiz" element={<QuizGenerator />} />
            <Route path="/planner" element={<StudyPlanner />} />
            <Route path="/assignment-helper" element={<AssignmentHelper />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
