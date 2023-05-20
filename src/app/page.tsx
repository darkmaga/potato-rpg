'use client'

import { initialGameStatus } from '@/constants/game'
import { Messages, MessagesKeys } from '@/constants/messages'
import { EventMessage, GameStatus } from '@/types/game'
import { useEffect, useRef, useState } from 'react'
import TheEnd from './components/TheEndScreen'
import { firstCapital } from './utils/default'
import { rollSixSidedDie } from './utils/rollEvent'

export default function Home() {
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    () => initialGameStatus
  )
  const [eventMessage, setEventMessage] = useState<EventMessage>()
  const isOrcRemoved = useRef<boolean>(false)

  const increaseGameStats = (key: keyof GameStatus['stats'], value: number) => {
    setGameStatus((prev) => {
      if (prev.stats[key] === 0 && value < 0) return prev

      return {
        ...prev,
        stats: { ...prev.stats, [key]: prev.stats[key] + value },
      }
    })
  }

  const increaseOrcRemoveCost = (value: number) => {
    setGameStatus((prev) => ({
      ...prev,
      orcRemoveCost: prev.orcRemoveCost + value,
    }))
  }

  useEffect(() => {
    const endFieldName = (
      Object.keys(gameStatus.stats) as (keyof GameStatus['stats'])[]
    ).find((key) => gameStatus.stats[key] >= 10)

    if (!endFieldName) return

    const messageKey = `End${firstCapital(endFieldName)}` as MessagesKeys

    setGameStatus((prev) => ({
      ...prev,
      isEnded: true,
      endMessage: Messages[messageKey],
    }))
  }, [gameStatus.stats])

  const generateEvent = () => {
    isOrcRemoved.current = false
    const firstRoll = rollSixSidedDie()

    const setEvent = (
      key: Extract<MessagesKeys, 'InGarden' | 'KnockAtDoor' | 'WorldDarker'>
    ) => {
      const secondRoll = rollSixSidedDie()

      if (key === 'InGarden') {
        switch (secondRoll) {
          case 1:
            increaseGameStats('potatoes', 1)
            break
          case 2:
            increaseGameStats('potatoes', 1)
            increaseGameStats('destiny', 1)
            break
          case 3:
            increaseGameStats('orcs', 1)
            increaseGameStats('destiny', 1)
            break
          case 4:
            increaseGameStats('orcs', 1)
            increaseGameStats('potatoes', -1)
            break
          case 5:
            increaseGameStats('potatoes', -1)
            break
          case 6:
            increaseGameStats('potatoes', 2)
            break
        }
      } else if (key === 'KnockAtDoor') {
        switch (secondRoll) {
          case 1:
            increaseGameStats('orcs', 1)
            break
          case 2:
            increaseGameStats('destiny', 1)
            break
          case 3:
            increaseGameStats('orcs', 1)
            increaseGameStats('destiny', 1)
            break
          case 4:
            increaseGameStats('orcs', 2)
            increaseGameStats('potatoes', -1)
            break
          case 5:
            increaseGameStats('destiny', 1)
            break
          case 6:
            increaseGameStats('potatoes', 2)
            break
        }
      } else {
        increaseOrcRemoveCost(1)
      }

      const messageKey = `${key}-${secondRoll}` as MessagesKeys

      setEventMessage({
        type: Messages[key],
        message: Messages[messageKey],
      })
    }

    switch (firstRoll) {
      case 1:
      case 2:
        setEvent('InGarden')
        break

      case 3:
      case 4:
        setEvent('KnockAtDoor')
        break

      case 5:
      case 6:
        setEvent('WorldDarker')
        break

      default:
        break
    }
  }

  return (
    <main className='flex h-full flex-col gap-5 justify-center items-center'>
      <div className='flex flex-col gap-3'>
        <span>Destiny: {gameStatus.stats.destiny}</span>
        <span>Potatoes: {gameStatus.stats.potatoes}</span>
        <span>Orcs: {gameStatus.stats.orcs}</span>
      </div>
      {eventMessage && (
        <div className='flex flex-col gap-2'>
          <span>{eventMessage.type}</span>
          <p>{eventMessage.message}</p>
        </div>
      )}
      <div className='flex gap-3'>
        <button
          className='bg-black p-3 rounded-xl text-white disabled:bg-white disabled:text-gray-400'
          disabled={
            gameStatus.orcRemoveCost > gameStatus.stats.potatoes ||
            isOrcRemoved.current
          }
          onClick={() => {
            increaseGameStats('potatoes', -1)
            increaseGameStats('orcs', -1)
            isOrcRemoved.current = true
          }}
        >
          Trade {gameStatus.orcRemoveCost} POTATO to remove 1 ORC
        </button>
        <button
          className='bg-black p-3 rounded-xl text-white'
          onClick={generateEvent}
        >
          Advance to the next day
        </button>
      </div>

      {gameStatus.isEnded && gameStatus.endMessage && (
        <TheEnd
          message={gameStatus.endMessage}
          restart={() => setGameStatus(initialGameStatus)}
        />
      )}
    </main>
  )
}
