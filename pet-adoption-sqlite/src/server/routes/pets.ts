import { Router } from 'express';
import PetsController from '../controllers/petsController';

const router = Router();
const petsController = new PetsController();

router.get('/', petsController.getAllPets.bind(petsController));
router.get('/:id', petsController.getPetById.bind(petsController));
router.post('/', petsController.createPet.bind(petsController));
router.put('/:id', petsController.updatePet.bind(petsController));
router.delete('/:id', petsController.deletePet.bind(petsController));

export default router;