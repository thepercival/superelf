import { IAlert } from '../shared/commonmodule/alert';
import { AuthService } from '../lib/auth/auth.service';
import { GlobalEventsManager } from '../shared/commonmodule/eventmanager';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { signal, WritableSignal } from '@angular/core';

export class AuthComponent {
  public alert: IAlert | undefined;
  public processing: WritableSignal<boolean> = signal(true);
  public faSpinner = faSpinner;

  constructor(
    protected authService: AuthService,
    protected globalEventsManager: GlobalEventsManager
  ) {
    this.globalEventsManager.navHeaderInfo.emit(undefined);
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type: type, message: message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}