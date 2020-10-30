export class Role {
    static readonly ADMIN = 1;
    static readonly SYSADMIN = 2;
    static readonly ALL = 3;

    static getName(role: number): string {
        if (role === Role.ADMIN) {
            return 'pool-beheerder';
        } else if (role === Role.SYSADMIN) {
            return 'systeem-beheerder';
        }
        return 'onbekend';
    }
}
