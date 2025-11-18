import { Car } from "../car/car.entity.js";
import { IUser } from "../user/user.entity.js";
import { formatDateToSQL } from "../utils/date.utils.js";

export function calculateDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
}

export class Rental {
    public id?: number;
    public user: IUser;
    public car: Car;
    public startDate: Date;
    public endDate: Date;
    public price: number; 

    constructor(
        user: IUser,
        car: Car,
        startDate: Date,
        endDate: Date,
        id?: number,
        price?: number 
    ) {
        this.id = id;
        this.user = user;
        this.car = car;
        this.startDate = startDate;
        this.endDate = endDate;
        
        if (price !== undefined) {
            this.price = Math.round(Number(price) * 100) / 100;
        } else {
            const days = calculateDays(startDate, endDate);
            this.price = Math.round((days * car.price) * 100) / 100; 
        }
    }

    toJSON() {
        return {
            id: this.id,
            user: this.user,
            car: this.car,
            // send dates in unified ISO-like YYYY-MM-DD format to the frontend;
            // the frontend will format for display (dd/MM/yyyy)
            startDate: formatDateToSQL(this.startDate),
            endDate: formatDateToSQL(this.endDate),
            price: Math.round(this.price * 100) / 100,
        };
    }
}