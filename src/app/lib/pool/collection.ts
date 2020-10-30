export class PoolCollection {
    protected id: number;
    public static MIN_LENGTH_NAME = 3;
    public static MAX_LENGTH_NAME = 20;

    constructor(protected name: string) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }
}
