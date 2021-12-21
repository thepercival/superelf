import { EventEmitter, Injectable } from '@angular/core';
import { NavHeaderInfo } from '../layoutmodule/nav/nav.component';

@Injectable()
export class GlobalEventsManager {
    public navHeaderInfo: EventEmitter<NavHeaderInfo> = new EventEmitter();
}
