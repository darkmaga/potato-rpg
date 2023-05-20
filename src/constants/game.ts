import { GameStatus } from '@/types/game'

export const initialGameStatus: GameStatus = {
  stats: {
    destiny: 0,
    potatoes: 0,
    orcs: 0,
  },
  orcRemoveCost: 1,
  isEnded: false,
  endMessage: null,
}
