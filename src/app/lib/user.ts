export class User {
    static readonly MIN_LENGTH_EMAIL = 6;
    static readonly MAX_LENGTH_EMAIL = 100;
    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 15;
    static readonly MIN_LENGTH_PASSWORD = 3;
    static readonly MAX_LENGTH_PASSWORD = 50;

    protected id: number;
    protected emailaddress: string | undefined;
    protected name: string | undefined;

    constructor(id: number) {
        this.id = id;
    }

    getId(): number {
        return this.id;
    }

    getEmailaddress(): string | undefined {
        return this.emailaddress;
    }

    setEmailaddress(emailaddress: string | undefined): void {
        this.emailaddress = emailaddress;
    }

    getName(): string | undefined {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }
}
