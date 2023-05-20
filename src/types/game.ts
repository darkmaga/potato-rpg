export type GameStatus = {
  stats: { destiny: number; potatoes: number; orcs: number }
  orcRemoveCost: number
  isEnded: boolean
  endMessage: string | null
}

export type EventMessage = {
  type: string
  message: string
}
