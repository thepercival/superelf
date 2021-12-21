import { IAlert } from '../shared/commonmodule/alert';
import { AuthService } from '../lib/auth/auth.service';
import { GlobalEventsManager } from '../shared/commonmodule/eventmanager';

export class AuthComponent {
    public alert: IAlert | undefined;
    public processing = true;

    constructor(
        protected authService: AuthService,
        protected globalEventsManager: GlobalEventsManager
    ) {
        this.globalEventsManager.navHeaderInfo.emit(undefined);
    }

    protected setAlert(type: string, message: string) {
        this.alert = { 'type': type, 'message': message };
    }

    protected resetAlert(): void {
        this.alert = undefined;
    }
}