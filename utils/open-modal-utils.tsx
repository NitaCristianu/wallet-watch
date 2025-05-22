'use client'

import { action_type } from '@/constants/types'
import { createContext, useContext } from 'react'

const TriggerContext = createContext<((d: action_type | null) => void) | null>(null)

export function TriggerProvider({
    children,
    onTrigger,
}: {
    children: React.ReactNode
    onTrigger: (d : action_type | null) => void
}) {
    return <TriggerContext.Provider value={onTrigger}>{children}</TriggerContext.Provider>
}

export function useTrigger() {
    const ctx = useContext(TriggerContext)
    if (!ctx) throw new Error('useTrigger must be used inside TriggerProvider')
    return ctx
}
