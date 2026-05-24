import { useState, useEffect } from 'react'

export interface AppNotification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
}

let globalNotifications: AppNotification[] = [
  {
    id: '1',
    title: 'Sistema',
    message: 'Patrono Clear atualizado para a versão mais recente.',
    date: new Date().toISOString(),
    read: false,
  },
]

let listeners: (() => void)[] = []
const emit = () => listeners.forEach((l) => l())

export default function useAppStore() {
  const [notifications, setNotifications] = useState<AppNotification[]>(globalNotifications)

  useEffect(() => {
    const listener = () => setNotifications([...globalNotifications])
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  const addNotification = (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    globalNotifications = [
      { id: String(Date.now()), date: new Date().toISOString(), read: false, ...notif },
      ...globalNotifications,
    ]
    emit()
  }

  const markAsRead = (id: string) => {
    globalNotifications = globalNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    emit()
  }

  const markAllAsRead = () => {
    globalNotifications = globalNotifications.map((n) => ({ ...n, read: true }))
    emit()
  }

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    addNotification,
    markAsRead,
    markAllAsRead,
  }
}
