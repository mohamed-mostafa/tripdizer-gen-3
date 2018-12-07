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

    public static parseArabicNumber(num: any): string {
        return num.toString().replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => {
            return d.charCodeAt(0) - 1632; // Convert Arabic numbers
        }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
            return d.charCodeAt(0) - 1776; // Convert Persian numbers
        });
    }
}
