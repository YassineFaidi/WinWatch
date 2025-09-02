const express = require('express');
const statsService = require('../services/statsService');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/stats/summary - Get dashboard summary
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters = { startDate, endDate };
    const summary = await statsService.getDashboardSummary(filters);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    logger.error('Error in GET /stats/summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard summary',
      message: error.message
    });
  }
});

// GET /api/stats/severity - Get severity distribution
router.get('/severity', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters = { startDate, endDate };
    const distribution = await statsService.getSeverityDistribution(filters);
    
    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    logger.error('Error in GET /stats/severity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch severity distribution',
      message: error.message
    });
  }
});

// GET /api/stats/hostnames - Get hostname distribution
router.get('/hostnames', async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    const filters = { startDate, endDate };
    const distribution = await statsService.getHostnameDistribution(filters, parseInt(limit));
    
    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    logger.error('Error in GET /stats/hostnames:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hostname distribution',
      message: error.message
    });
  }
});

// GET /api/stats/sources - Get source distribution
router.get('/sources', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters = { startDate, endDate };
    const distribution = await statsService.getSourceDistribution(filters);
    
    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    logger.error('Error in GET /stats/sources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch source distribution',
      message: error.message
    });
  }
});

// GET /api/stats/categories - Get category distribution
router.get('/categories', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters = { startDate, endDate };
    const distribution = await statsService.getCategoryDistribution(filters);
    
    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    logger.error('Error in GET /stats/categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category distribution',
      message: error.message
    });
  }
});

// GET /api/stats/timeseries - Get time series data
router.get('/timeseries', async (req, res) => {
  try {
    const { startDate, endDate, interval = '1 hour' } = req.query;
    
    // Validate interval parameter
    const allowedIntervals = ['1 minute', '5 minutes', '15 minutes', '30 minutes', '1 hour', '6 hours', '12 hours', '1 day'];
    
    if (!allowedIntervals.includes(interval)) {
      return res.status(400).json({
        success: false,
        error: `Invalid interval. Allowed intervals: ${allowedIntervals.join(', ')}`
      });
    }
    
    const filters = { startDate, endDate };
    const timeSeries = await statsService.getTimeSeriesData(filters, interval);
    
    res.json({
      success: true,
      data: timeSeries
    });
  } catch (error) {
    logger.error('Error in GET /stats/timeseries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch time series data',
      message: error.message
    });
  }
});

// GET /api/stats/overview - Get all statistics in one call
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filters = { startDate, endDate };
    
    // Fetch all statistics in parallel
    const [summary, severity, hostnames, sources, categories] = await Promise.all([
      statsService.getDashboardSummary(filters),
      statsService.getSeverityDistribution(filters),
      statsService.getHostnameDistribution(filters, 10),
      statsService.getSourceDistribution(filters),
      statsService.getCategoryDistribution(filters)
    ]);
    
    res.json({
      success: true,
      data: {
        summary,
        severity,
        hostnames,
        sources,
        categories
      }
    });
  } catch (error) {
    logger.error('Error in GET /stats/overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overview statistics',
      message: error.message
    });
  }
});

module.exports = router;

