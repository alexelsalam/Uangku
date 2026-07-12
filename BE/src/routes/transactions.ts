import { Router } from 'express'
import * as controller from '../controllers/transaction.controller.js'

const router = Router()

// CRUD
router.get('/',        controller.getTransactions)
router.post('/',       controller.createTransaction)
router.put('/:id',     controller.updateTransaction)
router.delete('/:id',  controller.deleteTransaction)

// Summary
router.get('/total',   controller.getTotals)

// Chart data
router.get('/data/bar', controller.getBarChart)
router.get('/data/pie', controller.getPieChart)

export default router
