export interface Pet {
    id: number;
    name: string;
    age: number;
    breed: string;
    adoptionStatus: 'available' | 'adopted';
}

export interface Adopter {
    id: number;
    name: string;
    contactInfo: string;
    adoptionHistory: number[]; // Array of pet IDs that the adopter has adopted
}