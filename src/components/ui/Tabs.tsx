'use client'

import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  label: string
  tabs: TabItem[]
  defaultTabId?: string
}

export function Tabs({ label, tabs, defaultTabId }: TabsProps) {
  const baseId = useId()
  const [selectedId, setSelectedId] = useState(defaultTabId ?? tabs[0]?.id)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const tabDomId = (id: string) => `${baseId}-tab-${id}`
  const panelDomId = (id: string) => `${baseId}-panel-${id}`

  function activate(index: number) {
    setSelectedId(tabs[index].id)
    tabRefs.current[index]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1
    let next: number
    switch (event.key) {
      case 'ArrowRight':
        next = index === last ? 0 : index + 1
        break
      case 'ArrowLeft':
        next = index === 0 ? last : index - 1
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = last
        break
      default:
        return
    }
    event.preventDefault()
    activate(next)
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex border-b border-line">
        {tabs.map((tab, index) => {
          const selected = tab.id === selectedId
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              type="button"
              role="tab"
              id={tabDomId(tab.id)}
              aria-controls={panelDomId(tab.id)}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setSelectedId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`-mb-px min-h-11 flex-1 border-b-2 px-3 py-2 text-sm font-medium sm:flex-none sm:px-6 sm:text-base ${
                selected ? 'border-jjok text-jjok' : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelDomId(tab.id)}
          aria-labelledby={tabDomId(tab.id)}
          tabIndex={0}
          hidden={tab.id !== selectedId}
          className="py-8"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
