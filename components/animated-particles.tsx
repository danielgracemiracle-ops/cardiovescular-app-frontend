'use client'

import { useMemo } from 'react'
import Particles from '@tsparticles/react'

export function AnimatedParticles() {

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: false,
      },

      fpsLimit: 60,

      background: {
        color: 'transparent',
      },

      particles: {
        number: {
          value: 120,
        },

        color: {
          value: ['#10b981', '#06b6d4', '#14b8a6'],
        },

        links: {
          enable: true,
          color: '#10b981',
          distance: 150,
          opacity: 0.4,
          width: 1,
        },

        move: {
          enable: true,
          speed: 1.5,
          random: true,

          outModes: {
            default: 'bounce' as const,
          },
        },

        opacity: {
          value: 0.7,
        },

        size: {
          value: {
            min: 1,
            max: 4,
          },
        },
      },

      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'grab',
          },
        },

        modes: {
          grab: {
            distance: 180,

            links: {
              opacity: 0.8,
            },
          },
        },
      },

      detectRetina: true,
    }),
    []
  )

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="fixed inset-0 z-[999]"
    />
  )
}