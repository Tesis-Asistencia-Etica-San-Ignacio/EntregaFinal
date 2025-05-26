import { Router } from 'express'
import { StatsController } from '../controllers/stats.controller'
import { validateRoleMiddleware } from '../middleware/jwtMiddleware'

import { StatsRepositoryImpl } from '../../infrastructure/database/repositories/stats.repository.impl'
import { GetEvaluationStatsUseCase } from '../../application'

const statsRepository = new StatsRepositoryImpl()
const getStatsUseCase = new GetEvaluationStatsUseCase(statsRepository)
const statsController = new StatsController(getStatsUseCase)

const router = Router()

router.get(
    '/evaluations',
    validateRoleMiddleware(['EVALUADOR']),
    statsController.getEvaluationStats
)

export default router
