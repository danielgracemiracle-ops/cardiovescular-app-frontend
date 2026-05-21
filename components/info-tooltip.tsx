'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import { Info } from 'lucide-react'

interface InfoTooltipProps {
  text: string
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center"
          >
            <Info
              className="
                h-4 w-4
                text-muted-foreground
                hover:text-primary
                transition-colors
              "
            />
          </button>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={8}
            className="
              z-50
              max-w-xs
              rounded-xl
              bg-black/90
              px-4
              py-3
              text-xs
              leading-relaxed
              text-white
              shadow-xl
              backdrop-blur-sm
              animate-in
              fade-in-0
              zoom-in-95
            "
          >
            {text}

            <Tooltip.Arrow className="fill-black/90" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}