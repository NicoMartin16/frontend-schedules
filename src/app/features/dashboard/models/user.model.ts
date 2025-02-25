import { Role } from "./role.enum";

export interface User {
    addr: string;
    role: Role;
    isActive: boolean;
}