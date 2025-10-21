import { db } from '../db'; // Import the database instance
import { Adopter } from '../models/adopter'; // Import the Adopter model

export class AdopterService {
    // Method to create a new adopter
    async createAdopter(adopterData: Adopter): Promise<Adopter> {
        const { name, contactInfo } = adopterData;
        const result = await db.run('INSERT INTO adopters (name, contact_info) VALUES (?, ?)', [name, contactInfo]);
        return { id: result.lastID, ...adopterData };
    }

    // Method to get all adopters
    async getAllAdopters(): Promise<Adopter[]> {
        const adopters = await db.all('SELECT * FROM adopters');
        return adopters;
    }

    // Method to get an adopter by ID
    async getAdopterById(id: number): Promise<Adopter | null> {
        const adopter = await db.get('SELECT * FROM adopters WHERE id = ?', [id]);
        return adopter || null;
    }

    // Method to update an adopter
    async updateAdopter(id: number, adopterData: Partial<Adopter>): Promise<Adopter | null> {
        const { name, contactInfo } = adopterData;
        await db.run('UPDATE adopters SET name = ?, contact_info = ? WHERE id = ?', [name, contactInfo, id]);
        return this.getAdopterById(id);
    }

    // Method to delete an adopter
    async deleteAdopter(id: number): Promise<void> {
        await db.run('DELETE FROM adopters WHERE id = ?', [id]);
    }
}