import { PRIMARY_VENDORS } from '@insidellm/shared'

import { useAppStore } from '@/stores/useAppStore'

const vendorLabels = {
  openai: 'OpenAI',
  google: 'Google',
  anthropic: 'Anthropic',
} as const

export function VendorSelect() {
  const vendor = useAppStore((state) => state.vendor)
  const setVendor = useAppStore((state) => state.setVendor)

  return (
    <select
      aria-label="选择模型厂商"
      className="rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-cyan-300"
      onChange={(event) => setVendor(event.target.value as typeof vendor)}
      value={vendor}
    >
      {PRIMARY_VENDORS.map((item) => (
        <option key={item} value={item}>
          {vendorLabels[item]}
        </option>
      ))}
    </select>
  )
}
