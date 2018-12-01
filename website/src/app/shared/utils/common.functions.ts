export class CommonFunctions {
    public static getters(): string[] {
        return Object.keys(this.prototype).filter(name => {
            return typeof Object.getOwnPropertyDescriptor(this.prototype, name)['get'] === 'function';
        });
    }

    public static setters(): string[] {
        return Object.keys(this.prototype).filter(name => {
            return typeof Object.getOwnPropertyDescriptor(this.prototype, name)['set'] === 'function';
        });
    }
}
