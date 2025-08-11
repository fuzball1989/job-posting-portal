import { Router } from 'express';
import {
  createJob,
  searchJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobCategories,
} from '../controllers/jobs.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/search', optionalAuth, searchJobs);
router.get('/categories', getJobCategories);
router.get('/:id', optionalAuth, getJobById);

// Protected routes
router.post('/', authenticate, authorize('employer'), createJob);
router.put('/:id', authenticate, authorize('employer'), updateJob);
router.delete('/:id', authenticate, authorize('employer'), deleteJob);

export default router;
