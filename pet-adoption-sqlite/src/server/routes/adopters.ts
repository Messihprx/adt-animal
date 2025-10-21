import { Router } from 'express';
import AdoptersController from '../controllers/adoptersController';

const router = Router();
const adoptersController = new AdoptersController();

// Define routes for adopters
router.get('/', adoptersController.getAllAdopters.bind(adoptersController));
router.get('/:id', adoptersController.getAdopterById.bind(adoptersController));
router.post('/', adoptersController.createAdopter.bind(adoptersController));
router.put('/:id', adoptersController.updateAdopter.bind(adoptersController));
router.delete('/:id', adoptersController.deleteAdopter.bind(adoptersController));

export default router;