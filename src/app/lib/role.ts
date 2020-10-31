export class Role {
    static readonly COMPETITOR = 1;
    static readonly ADMIN = 2;
    static readonly SYSADMIN = 4;
    static readonly ALL = 7;

    static getName(role: number): string {
        if (role === Role.COMPETITOR) {
            return 'pool-deelnemer';
        } else if (role === Role.ADMIN) {
            return 'pool-beheerder';
        } else if (role === Role.SYSADMIN) {
            return 'systeem-beheerder';
        }
        return 'onbekend';
    }
}
