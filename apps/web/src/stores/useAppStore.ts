import { create } from 'zustand'

import {
  DEFAULT_VENDOR,
  type DetailMode,
  type VendorId,
} from '@insidellm/shared'

interface AppState {
  vendor: VendorId
  detailMode: DetailMode
  motionReduced: boolean
  setVendor: (vendor: VendorId) => void
  setDetailMode: (detailMode: DetailMode) => void
  toggleReducedMotion: () => void
}

export const useAppStore = create<AppState>((set) => ({
  vendor: DEFAULT_VENDOR,
  detailMode: 'basic',
  motionReduced: false,
  setVendor: (vendor) => set({ vendor }),
  setDetailMode: (detailMode) => set({ detailMode }),
  toggleReducedMotion: () =>
    set((state) => ({
      motionReduced: !state.motionReduced,
    })),
}))
