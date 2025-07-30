import crypto from 'node:crypto'

export class Car {

    constructor(
        public brand: string,
        public model: string,
        public year: number,
        public color: string,
        public price: number,
        public available: boolean
    ) {}

}