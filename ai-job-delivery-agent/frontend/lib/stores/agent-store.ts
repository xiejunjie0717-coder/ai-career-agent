import { create } from 'zustand'

interface AgentState {
  isRunning: boolean
  isPaused: boolean
  sentCount: number
  failedCount: number
  currentJobConfig: string | null
  currentTemplate: string | null
  setRunning: (isRunning: boolean) => void
  setPaused: (isPaused: boolean) => void
  setStatus: (status: {
    sentCount?: number
    failedCount?: number
    currentJobConfig?: string
    currentTemplate?: string
  }) => void
  reset: () => void
}

export const useAgentStore = create<AgentState>((set) => ({
  isRunning: false,
  isPaused: false,
  sentCount: 0,
  failedCount: 0,
  currentJobConfig: null,
  currentTemplate: null,
  setRunning: (isRunning) => set({ isRunning }),
  setPaused: (isPaused) => set({ isPaused }),
  setStatus: (status) =>
    set((state) => ({
      sentCount: status.sentCount ?? state.sentCount,
      failedCount: status.failedCount ?? state.failedCount,
      currentJobConfig: status.currentJobConfig ?? state.currentJobConfig,
      currentTemplate: status.currentTemplate ?? state.currentTemplate,
    })),
  reset: () =>
    set({
      isRunning: false,
      isPaused: false,
      sentCount: 0,
      failedCount: 0,
      currentJobConfig: null,
      currentTemplate: null,
    }),
}))
