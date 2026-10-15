import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { ChatError, MAX_MESSAGE_LENGTH, requestReply } from './api'
import type { ChatTurn, PageContext } from './api'

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  error?: ChatError
}

interface AssistantValue {
  isOpen: boolean
  hasOpened: boolean
  messages: ChatMessage[]
  sending: boolean
  open: (trigger?: HTMLElement | null) => void
  close: () => void
  toggle: (trigger?: HTMLElement | null) => void
  send: (text: string) => void
  retry: () => void
  clear: () => void
}

const AssistantContext = createContext<AssistantValue | null>(null)

let preload: Promise<unknown> | null = null
/** Warms the panel chunk on hover/focus of a launcher, before the first click. */
export function preloadAssistant(): void {
  preload ??= import('./AssistantPanel')
}

function pageContextFor(pathname: string): PageContext | null {
  const project = /^\/projects\/([a-z0-9-]+)\/?$/.exec(pathname)
  if (project) return { kind: 'project', slug: project[1] }
  const note = /^\/writing\/([a-z0-9-]+)\/?$/.exec(pathname)
  if (note) return { kind: 'note', slug: note[1] }
  return null
}

const historyFrom = (list: ChatMessage[]): ChatTurn[] =>
  list.filter((m) => !m.error).map((m) => ({ role: m.role, content: m.content }))

export function AssistantProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [isOpen, setOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const sendingRef = useRef(false)
  const nextId = useRef(1)
  const pathRef = useRef(pathname)
  pathRef.current = pathname
  const messagesRef = useRef<ChatMessage[]>([])

  const commit = useCallback((next: ChatMessage[]) => {
    messagesRef.current = next
    setMessages(next)
  }, [])

  const open = useCallback((trigger?: HTMLElement | null) => {
    if (trigger) triggerRef.current = trigger
    preloadAssistant()
    setHasOpened(true)
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    // Return focus to whatever opened the panel.
    const trigger = triggerRef.current
    if (trigger && document.contains(trigger)) window.requestAnimationFrame(() => trigger.focus())
  }, [])

  const toggle = useCallback(
    (trigger?: HTMLElement | null) => {
      if (isOpen) close()
      else open(trigger)
    },
    [isOpen, open, close],
  )

  const run = useCallback(async (history: ChatTurn[]) => {
    sendingRef.current = true
    setSending(true)
    try {
      const reply = await requestReply(history, pageContextFor(pathRef.current))
      commit([...messagesRef.current, { id: nextId.current++, role: 'assistant', content: reply }])
    } catch (error) {
      const chatError = error instanceof ChatError ? error : new ChatError('unavailable')
      commit([...messagesRef.current, { id: nextId.current++, role: 'assistant', content: '', error: chatError }])
    } finally {
      sendingRef.current = false
      setSending(false)
    }
  }, [commit])


  const send = useCallback(
    (text: string) => {
      const content = text.trim().slice(0, MAX_MESSAGE_LENGTH)
      // A ref, not state, so a rapid double Enter/click cannot slip past the guard.
      if (!content || sendingRef.current) return
      sendingRef.current = true
      const next = [...messagesRef.current.filter((m) => !m.error), { id: nextId.current++, role: 'user' as const, content }]
      commit(next)
      void run(historyFrom(next))
    },
    [run, commit],
  )

  const retry = useCallback(() => {
    if (sendingRef.current) return
    const next = messagesRef.current.filter((m) => !m.error)
    if (!next.length || next[next.length - 1].role !== 'user') return
    sendingRef.current = true
    commit(next)
    void run(historyFrom(next))
  }, [run, commit])

  const clear = useCallback(() => {
    if (!sendingRef.current) commit([])
  }, [commit])

  const value = useMemo(
    () => ({ isOpen, hasOpened, messages, sending, open, close, toggle, send, retry, clear }),
    [isOpen, hasOpened, messages, sending, open, close, toggle, send, retry, clear],
  )
  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
}

export function useAssistant(): AssistantValue {
  const value = useContext(AssistantContext)
  if (!value) throw new Error('useAssistant must be used inside AssistantProvider')
  return value
}
