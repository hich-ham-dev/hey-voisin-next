import { City } from '../entities/City';

export interface ICityRepository {
    getCities(query?: string): Promise<City[]>;
    getCityById(id: string): Promise<City | null>;
}
