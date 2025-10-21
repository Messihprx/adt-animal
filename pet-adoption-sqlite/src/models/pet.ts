export interface Pet {
    id: number;
    name: string;
    age: number;
    breed: string;
    adoptionStatus: 'available' | 'adopted';
}