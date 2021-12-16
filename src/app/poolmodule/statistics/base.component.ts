import { ImageRepository } from '../../lib/image/repository';

import { CSSService } from '../../shared/commonmodule/cssservice';

export class S11PlayerStatisticsComponent {
    public processing = true;
    public sheetActive!: boolean;
    public categoryPoints: CategoryPoints | undefined;

    constructor(
        public imageRepository: ImageRepository,
        public cssService: CSSService) {
    }

    getBackgroundClass(points: number): string {
        return points > 0 ? '' : points < 0 ? 'bg-negative' : 'bg-zero';
    }

    getBorderClass(points: number): string {
        return points > 0 ? '' : points < 0 ? 'border-negative' : 'border-zero';
    }

    getBadgeClass(points: number): string {
        return points != 0 ? 'bg-totals' : 'bg-nopoints';
    }
}

interface CategoryPoints {
    result: number,
    goal: number,
    card: number,
    sheet: number
}
