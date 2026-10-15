import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { RotateCcw, Send, Trash2, X } from 'lucide-react'
import { useAssistant } from './AssistantContext'
import { MAX_MESSAGE_LENGTH, errorMessage } from './api'
import { renderReply } from './renderReply'
import { KNOWLEDGE_REVIEWED_AT, formatReviewedDate } from '../lib/site'

const SUGGESTIONS = [
  'What has Davis built with machine learning?',
  'What does Davis do at Kewaunee?',
  'What is his role at One Chaptr?',
  'How are Cade and DHLM different?',
  'Which projects show his full-stack skills?',
  'Where can I read his professional writing?',
]

const WELCOME =
  "Hi, I'm Davis Intelligence, the portfolio assistant. Ask about Davis's experience, projects, education, or writing, and I'll point you to the case study or page that shows the work."

export default function AssistantPanel() {
  const { isOpen, close, messages, sending, send, retry, clear } = useAssistant()
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // Focus the input when the panel opens; Escape closes from anywhere inside.
  useEffect(() => {
    if (!isOpen) return
    const frame = window.requestAnimationFrame(() => textareaRef.current?.focus())
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && panelRef.current?.contains(document.activeElement)) close()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, sending])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
  }, [draft])

  const submit = (text = draft) => {
    if (!text.trim() || sending) return
    send(text)
    setDraft('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  // On phones the panel covers the page, so following a link closes it.
  const onNavigate = () => {
    if (window.matchMedia('(max-width: 640px)').matches) close()
  }

  const remaining = MAX_MESSAGE_LENGTH - draft.length

  return (
    <div
      ref={panelRef}
      id="davis-intelligence"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className={`di-panel ${isOpen ? 'is-open' : ''}`}
      hidden={!isOpen}
    >
      <div className="di-header">
        <div className="min-w-0">
          <p id={titleId} className="di-title">
            Davis Intelligence
          </p>
          <p className="di-subtitle">Portfolio AI Assistant</p>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 ? (
            <button type="button" onClick={clear} disabled={sending} className="di-icon-btn" aria-label="Clear conversation" title="Clear conversation">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
          <button type="button" onClick={close} className="di-icon-btn" aria-label="Close Davis Intelligence">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="di-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">
        <div className="di-bubble bot">
          <p>{WELCOME}</p>
        </div>
        {messages.length === 0 ? (
          <div className="di-chips" role="group" aria-label="Suggested questions">
            {SUGGESTIONS.map((question) => (
              <button key={question} type="button" className="di-chip" onClick={() => submit(question)}>
                {question}
              </button>
            ))}
          </div>
        ) : null}
        {messages.map((message) =>
          message.error ? (
            <div key={message.id} className="di-bubble bot di-error" role="alert">
              <p>{errorMessage(message.error)}</p>
              {message.error.retryable ? (
                <button type="button" className="di-retry" onClick={retry} disabled={sending}>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Try again
                </button>
              ) : null}
            </div>
          ) : (
            <div key={message.id} className={`di-bubble ${message.role === 'user' ? 'user' : 'bot'}`}>
              {message.role === 'user' ? <p>{message.content}</p> : renderReply(message.content, onNavigate)}
            </div>
          ),
        )}
        {sending ? (
          <div className="di-typing" role="status">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span className="sr-only">Davis Intelligence is answering…</span>
          </div>
        ) : null}
      </div>

      <form
        className="di-input-row"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <label htmlFor="di-input" className="sr-only">
          Ask a question about Davis
        </label>
        <textarea
          id="di-input"
          ref={textareaRef}
          rows={1}
          value={draft}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about Davis..."
          aria-describedby="di-hint"
        />
        <button type="submit" className="di-send" disabled={sending || !draft.trim()} aria-label="Send message">
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
      <p id="di-hint" className="di-footer">
        {remaining < 100 ? `${remaining} characters left · ` : 'Enter to send · Shift+Enter for a new line · '}
        Portfolio knowledge updated {formatReviewedDate(KNOWLEDGE_REVIEWED_AT)}. Answers can be incomplete; follow the links for the full source.
      </p>
    </div>
  )
}
