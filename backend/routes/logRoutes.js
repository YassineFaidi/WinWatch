const express = require('express');
const logService = require('../services/logService');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/logs - Get logs with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      sortBy = 'timestamp',
      sortOrder = 'DESC',
      severity,
      hostname,
      source,
      category,
      startDate,
      endDate,
      search
    } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 1000) {
      return res.status(400).json({
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 1000.'
      });
    }

    // Validate sort parameters
    const allowedSortFields = ['timestamp', 'severity', 'hostname', 'source', 'category', 'message'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: `Invalid sort field. Allowed fields: ${allowedSortFields.join(', ')}`
      });
    }

    if (!allowedSortOrders.includes(sortOrder.toUpperCase())) {
      return res.status(400).json({
        error: 'Invalid sort order. Must be ASC or DESC'
      });
    }

    const filters = {
      severity,
      hostname,
      source,
      category,
      startDate,
      endDate,
      search
    };

    const pagination = {
      page: pageNum,
      limit: limitNum,
      sortBy,
      sortOrder: sortOrder.toUpperCase()
    };

    const result = await logService.getLogs(filters, pagination);
    
    res.json({
      success: true,
      data: result.logs,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Error in GET /logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logs',
      message: error.message
    });
  }
});

// GET /api/logs/:id - Get a specific log by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Log ID is required'
      });
    }

    const log = await logService.getLogById(id);
    
    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Log not found'
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    logger.error('Error in GET /logs/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch log',
      message: error.message
    });
  }
});

// GET /api/logs/distinct/:field - Get distinct values for a field
router.get('/distinct/:field', async (req, res) => {
  try {
    const { field } = req.params;
    
    if (!field) {
      return res.status(400).json({
        success: false,
        error: 'Field name is required'
      });
    }

    // Validate field name to prevent SQL injection
    const allowedFields = ['severity', 'hostname', 'source', 'category', 'user', 'process'];
    
    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        error: `Invalid field. Allowed fields: ${allowedFields.join(', ')}`
      });
    }

    const values = await logService.getDistinctValues(field);
    
    res.json({
      success: true,
      data: values
    });
  } catch (error) {
    logger.error(`Error in GET /logs/distinct/${req.params.field}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch distinct values',
      message: error.message
    });
  }
});

// GET /api/logs/stats - Get log statistics
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters = { startDate, endDate };
    const stats = await logService.getLogStats(filters);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error in GET /logs/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch log statistics',
      message: error.message
    });
  }
});

module.exports = router;

