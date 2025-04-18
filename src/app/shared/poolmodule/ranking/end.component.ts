import { Component, OnInit, OnChanges, SimpleChanges, input } from '@angular/core';
import { EndRankingItem, Structure, Competitor } from 'ngx-sport';
import { VoetbalRange } from 'ngx-sport';

@Component({
  selector: 'app-pool-endranking',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss']
})
export class EndRankingComponent implements OnInit, OnChanges {

  readonly structure = input<Structure>();
  readonly favorites = input<Competitor[]>();
  readonly range = input<VoetbalRange>();

  public items: EndRankingItem[] | undefined;

  constructor() {
  }

  ngOnInit() {
    this.updateItems();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.structure !== undefined && changes.structure.currentValue !== changes.structure.previousValue
      && changes.structure.firstChange === false) {
      this.updateItems();
    } else if (changes.range !== undefined && changes.range.isFirstChange() === false
      && changes.range.currentValue !== changes.range.previousValue) {
      this.updateItems();
    }
  }

  protected updateItems() {
    if (!this.structure()) {
      return;
    }
    // const endRankingService = new EndRankingService(this.structure, RankingService.RULESSET_WC);
    // this.items = endRankingService.getItems();
    // const range = this.range ? this.range : undefined;
    // if (range !== undefined) {
    //   this.items = this.items.filter(item => item.getUniqueRank() >= range.min && item.getUniqueRank() <= range.max);
    // }
  }

  hasMedal(rank: number): boolean {
    return (rank === 1 || rank === 2 || rank === 3);
  }

  getMedalColor(rank: number): string {
    return 'text-' + (rank === 1 ? 'gold' : (rank === 2 ? 'silver' : 'bronze'));
  }

  isFavorite(competitorName: string) {
    const favorites = this.favorites();
    return favorites && favorites.some(competitor => competitor.getName() === competitorName);
  }
}
