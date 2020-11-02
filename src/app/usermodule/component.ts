import { IAlert } from '../shared/commonmodule/alert';
import { AuthService } from '../lib/auth/auth.service';

export class AuthComponent {
    public alert: IAlert;
    public processing = true;

    constructor(
        protected authService: AuthService,
    ) {
    }

    protected setAlert(type: string, message: string) {
        this.alert = { 'type': type, 'message': message };
    }

    protected resetAlert(): void {
        this.alert = undefined;
    }
}