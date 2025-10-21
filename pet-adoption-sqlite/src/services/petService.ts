import { db } from '../db'; 
import { Pet } from '../models/pet'; 

export class PetService {
    async getAllPets(): Promise<Pet[]> {
        const query = 'SELECT * FROM pets';
        const pets = await db.all(query);
        return pets;
    }

    async getPetById(id: number): Promise<Pet | null> {
        const query = 'SELECT * FROM pets WHERE id = ?';
        const pet = await db.get(query, [id]);
        return pet || null;
    }

    async createPet(pet: Pet): Promise<Pet> {
        const query = 'INSERT INTO pets (name, age, breed, adoption_status) VALUES (?, ?, ?, ?)';
        const result = await db.run(query, [pet.name, pet.age, pet.breed, pet.adoption_status]);
        return { ...pet, id: result.lastID };
    }

    async updatePet(id: number, pet: Partial<Pet>): Promise<Pet | null> {
        const query = 'UPDATE pets SET name = ?, age = ?, breed = ?, adoption_status = ? WHERE id = ?';
        await db.run(query, [pet.name, pet.age, pet.breed, pet.adoption_status, id]);
        return this.getPetById(id);
    }

    async deletePet(id: number): Promise<void> {
        const query = 'DELETE FROM pets WHERE id = ?';
        await db.run(query, [id]);
    }
}