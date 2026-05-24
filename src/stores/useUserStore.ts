import { useState, useEffect } from 'react'

export type UserStatus = 'Pending' | 'Approved' | 'Rejected'
export type PlanType = 'Trial' | 'Essential' | 'Premium'

export interface UserRecord {
  id: string
  name: string
  email: string
  status: UserStatus
  registeredAt: string
  planType: PlanType
  notes: string
  lastAccess: string
  avatar?: string
  expirationDate: string
}

let globalUsers: UserRecord[] = [
  {
    id: '1',
    name: 'Admin Patrono',
    email: 'admin@patronoclear.com.br',
    status: 'Approved',
    registeredAt: '2023-01-15T10:00:00Z',
    planType: 'Premium',
    notes: 'Administrador geral do sistema.',
    lastAccess: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    status: 'Approved',
    registeredAt: '2023-10-20T14:30:00Z',
    planType: 'Trial',
    notes: 'Cliente em fase final do trial.',
    lastAccess: '2023-10-21T09:12:00Z',
    expirationDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(), // Expires in 5 days
  },
  {
    id: '3',
    name: 'Maria Costa',
    email: 'maria@exemplo.com',
    status: 'Approved',
    registeredAt: '2023-09-05T09:15:00Z',
    planType: 'Essential',
    notes: 'Assinatura vencida.',
    lastAccess: '2023-11-12T16:40:00Z',
    expirationDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // Expired 2 days ago
  },
  {
    id: '4',
    name: 'Demo User',
    email: 'demo@google.com',
    status: 'Approved',
    registeredAt: '2023-11-01T16:45:00Z',
    planType: 'Premium',
    notes: 'Usuário de demonstração.',
    lastAccess: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: '5',
    name: 'Pedro Alves',
    email: 'pedro@spam.com',
    status: 'Rejected',
    registeredAt: '2023-08-12T11:20:00Z',
    planType: 'Trial',
    notes: 'Acesso revogado por inatividade.',
    lastAccess: '2023-08-15T14:20:00Z',
    expirationDate: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: '6',
    name: 'aneccr',
    email: 'aneccr@hotmail.com',
    status: 'Approved',
    registeredAt: new Date().toISOString(),
    planType: 'Premium',
    notes: 'Administradora da plataforma Patrono Clear.',
    lastAccess: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
  },
]

let listeners: (() => void)[] = []
const emit = () => listeners.forEach((l) => l())

export default function useUserStore() {
  const [users, setUsers] = useState<UserRecord[]>(globalUsers)

  useEffect(() => {
    const listener = () => setUsers([...globalUsers])
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  const updateStatus = (id: string, status: UserStatus) => {
    globalUsers = globalUsers.map((u) => (u.id === id ? { ...u, status } : u))
    emit()
  }

  const updatePlanType = (id: string, planType: PlanType) => {
    globalUsers = globalUsers.map((u) => (u.id === id ? { ...u, planType } : u))
    emit()
  }

  const updateNotes = (id: string, notes: string) => {
    globalUsers = globalUsers.map((u) => (u.id === id ? { ...u, notes } : u))
    emit()
  }

  const updateLastAccess = (id: string, lastAccess: string) => {
    globalUsers = globalUsers.map((u) => (u.id === id ? { ...u, lastAccess } : u))
    emit()
  }

  const updateExpirationDate = (id: string, expirationDate: string) => {
    globalUsers = globalUsers.map((u) => (u.id === id ? { ...u, expirationDate } : u))
    emit()
  }

  const updateProfile = (id: string, updates: Partial<UserRecord>) => {
    globalUsers = globalUsers.map((u) => (u.id === id ? { ...u, ...updates } : u))
    emit()
  }

  const addUser = (user: Omit<UserRecord, 'expirationDate'>) => {
    const newUser: UserRecord = {
      ...user,
      expirationDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(), // Default 7 days trial
    }
    globalUsers = [...globalUsers, newUser]
    emit()
  }

  const getUserByEmail = (email: string) => {
    return globalUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
  }

  return {
    users,
    updateStatus,
    updatePlanType,
    updateNotes,
    updateLastAccess,
    updateExpirationDate,
    updateProfile,
    addUser,
    getUserByEmail,
  }
}
