import { create } from 'zustand'

import {
  DEFAULT_MODE,
  DEFAULT_VENDOR,
  type DetailMode,
  type ExperienceMode,
  type VendorId,
} from '@insidellm/shared'

interface AppState {
  mode: ExperienceMode
  vendor: VendorId
  detailMode: DetailMode
  motionReduced: boolean
  setMode: (mode: ExperienceMode) => void
  setVendor: (vendor: VendorId) => void
  setDetailMode: (detailMode: DetailMode) => void
  toggleReducedMotion: () => void
}

export const useAppStore = create<AppState>((set) => ({
  mode: DEFAULT_MODE,
  vendor: DEFAULT_VENDOR,
  detailMode: 'basic',
  motionReduced: false,
  setMode: (mode) => set({ mode }),
  setVendor: (vendor) => set({ vendor }),
  setDetailMode: (detailMode) => set({ detailMode }),
  toggleReducedMotion: () =>
    set((state) => ({
      motionReduced: !state.motionReduced,
    })),
}))
