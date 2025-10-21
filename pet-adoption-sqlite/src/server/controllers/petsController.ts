class PetsController {
    constructor(private petService: any) {}

    async getAllPets(req: any, res: any) {
        try {
            const pets = await this.petService.getAllPets();
            res.status(200).json(pets);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving pets', error });
        }
    }

    async getPetById(req: any, res: any) {
        const { id } = req.params;
        try {
            const pet = await this.petService.getPetById(id);
            if (pet) {
                res.status(200).json(pet);
            } else {
                res.status(404).json({ message: 'Pet not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving pet', error });
        }
    }

    async createPet(req: any, res: any) {
        const newPet = req.body;
        try {
            const createdPet = await this.petService.createPet(newPet);
            res.status(201).json(createdPet);
        } catch (error) {
            res.status(500).json({ message: 'Error creating pet', error });
        }
    }

    async updatePet(req: any, res: any) {
        const { id } = req.params;
        const updatedPet = req.body;
        try {
            const result = await this.petService.updatePet(id, updatedPet);
            if (result) {
                res.status(200).json({ message: 'Pet updated successfully' });
            } else {
                res.status(404).json({ message: 'Pet not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating pet', error });
        }
    }

    async deletePet(req: any, res: any) {
        const { id } = req.params;
        try {
            const result = await this.petService.deletePet(id);
            if (result) {
                res.status(200).json({ message: 'Pet deleted successfully' });
            } else {
                res.status(404).json({ message: 'Pet not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting pet', error });
        }
    }
}

export default PetsController;