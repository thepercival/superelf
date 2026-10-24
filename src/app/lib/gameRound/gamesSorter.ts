import { AgainstGame, GameState } from 'ngx-sport';

// Niet-gespeelde wedstrijden (status Created) komen eerst, op starttijd oplopend (eerstvolgende bovenaan).
// Daarna de overige wedstrijden, op starttijd aflopend (meest recent bovenaan).
// Alleen de status bepaalt of een wedstrijd gespeeld is, niet het moment van kijken.
export function sortGamesUpcomingFirst(games: AgainstGame[]): AgainstGame[] {
  const isUnplayed = (game: AgainstGame): boolean => game.getState() === GameState.Created;

  return games.sort((a: AgainstGame, b: AgainstGame): number => {
    const aUnplayed = isUnplayed(a);
    const bUnplayed = isUnplayed(b);
    if (aUnplayed !== bUnplayed) {
      return aUnplayed ? -1 : 1;
    }
    const diff = a.getStartDateTime().getTime() - b.getStartDateTime().getTime();
    return aUnplayed ? diff : -diff;
  });
}
