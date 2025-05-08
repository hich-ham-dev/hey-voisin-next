import {City} from "@/core/domain/entities/City";
import {Avatar} from "@/core/domain/entities/Avatar";

export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    roles: string[];
    city?: City;
    avatar?: Avatar;
    createdAt: Date;
}