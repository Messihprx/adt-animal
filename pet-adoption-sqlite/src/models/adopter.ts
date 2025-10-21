export interface Adopter {
    id: number;
    name: string;
    contactInfo: string;
    adoptionHistory: number[]; // Array of pet IDs that the adopter has adopted
}