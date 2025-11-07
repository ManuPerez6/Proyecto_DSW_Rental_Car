export class Car {

    constructor(
        public id: number | undefined,
        public brand: string,
        public model: string,
        public year: number,
        public color: string,
        public price: number,
        public available: boolean
    ) {}

    toJSON() {
        return {
            id: this.id,
            brand: this.brand,
            model: this.model,
            year: this.year,
            color: this.color,
            price: Math.round((this.price ?? 0) * 100) / 100,
            available: this.available
        };
    }

}