import { Car } from "./car.entity.js";

export interface CarRepository {
    findAll(): Promise<Car[] | undefined>;
    findOne(id: number): Promise<Car | undefined>; // CAMBIADO
    add(car: Car): Promise<Car | undefined>;
    update(id: number, car: Car): Promise<Car | undefined>; // CAMBIADO
    partialUpdate(id: number, updates: Partial<Car>): Promise<Car | undefined>; // CAMBIADO
    delete(id: number): Promise<Car | undefined>; // CAMBIADO
}