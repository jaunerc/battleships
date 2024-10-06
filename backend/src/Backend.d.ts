export interface Player {
    id: string
    name?: string;
}

export interface GameState {
    players: Player[]
}