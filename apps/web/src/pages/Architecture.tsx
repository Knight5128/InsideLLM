import { useEffect } from 'react'

import { LayerView } from '@/llm-viz/LayerView'
import { KeyboardManagerContext, KeyboardManager } from '@/llm-viz/utils/keyboard'

const keyboardManager = new KeyboardManager()

export function ArchitecturePage() {
  useEffect(() => {
    const handleKeyDown = keyboardManager.handleKey;
    const handleKeyUp = keyboardManager.handleKey;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <KeyboardManagerContext.Provider value={keyboardManager}>
      <div className="llm-viz-root" style={{ height: 'calc(100vh - 5.5rem)', marginTop: '-1rem' }}>
        <LayerView />
        <div id="portal-container" />
      </div>
    </KeyboardManagerContext.Provider>
  )
}
