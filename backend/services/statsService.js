const { clickhouse } = require('../config/database');
const logger = require('../utils/logger');

class StatsService {
  constructor() {
    this.tableName = 'logs.windows_logs';
  }

  // Helper method to apply date filters to queries
  applyDateFilters(query, filters) {
    if (filters.startDate) {
      query = query.replace('WHERE 1=1', `WHERE parseDateTimeBestEffort(timestamp) >= parseDateTimeBestEffort('${filters.startDate}')`);
    }
    if (filters.endDate) {
      const whereKeyword = query.includes('WHERE parseDateTimeBestEffort(timestamp) >=') ? 'AND' : 'WHERE';
      query = query.replace('WHERE 1=1', `${whereKeyword} parseDateTimeBestEffort(timestamp) <= parseDateTimeBestEffort('${filters.endDate}')`);
      if (whereKeyword === 'AND') {
        query = query.replace('WHERE 1=1', '');
      }
    }
    return query;
  }

  async getSeverityDistribution(filters = {}) {
    try {
      let whereClause = 'WHERE 1=1';
      let query = `
        SELECT 
          severity,
          COUNT(*) as count
        FROM ${this.tableName}
        ${whereClause}
        GROUP BY severity
        ORDER BY count DESC
      `;

      // Apply date filters using helper method
      query = this.applyDateFilters(query, filters);

      const result = await clickhouse.query(query);
      const stats = await result.toPromise();

      return stats.map(row => ({
        label: row.severity,
        value: parseInt(row.count),
        color: this.getSeverityColor(row.severity)
      }));
    } catch (error) {
      logger.error('Error fetching severity distribution:', error);
      throw new Error('Failed to fetch severity distribution');
    }
  }

  async getHostnameDistribution(filters = {}, limit = 10) {
    try {
      let whereClause = 'WHERE 1=1';
      let query = `
        SELECT 
          hostname,
          COUNT(*) as count
        FROM ${this.tableName}
        ${whereClause}
        GROUP BY hostname
        ORDER BY count DESC
        LIMIT ${limit}
      `;

      // Apply date filters using helper method
      query = this.applyDateFilters(query, filters);

      const result = await clickhouse.query(query);
      const stats = await result.toPromise();

      return stats.map(row => ({
        label: row.hostname,
        value: parseInt(row.count)
      }));
    } catch (error) {
      logger.error('Error fetching hostname distribution:', error);
      throw new Error('Failed to fetch hostname distribution');
    }
  }

  async getTimeSeriesData(filters = {}, interval = '1 hour') {
    try {
      let whereClause = 'WHERE 1=1';
      let query = `
        SELECT 
          toStartOfHour(parseDateTimeBestEffort(timestamp)) as time_bucket,
          COUNT(*) as count,
          severity
        FROM ${this.tableName}
        ${whereClause}
        GROUP BY time_bucket, severity
        ORDER BY time_bucket ASC
      `;

      // Apply date filters using helper method
      query = this.applyDateFilters(query, filters);

      const result = await clickhouse.query(query);
      const stats = await result.toPromise();

      // Group by time bucket and severity
      const timeSeries = {};
      stats.forEach(row => {
        const timeKey = row.time_bucket;
        if (!timeSeries[timeKey]) {
          timeSeries[timeKey] = {};
        }
        timeSeries[timeKey][row.severity] = parseInt(row.count);
      });

      return Object.keys(timeSeries).map(time => ({
        time,
        ...timeSeries[time]
      }));
    } catch (error) {
      logger.error('Error fetching time series data:', error);
      throw new Error('Failed to fetch time series data');
    }
  }

  async getSourceDistribution(filters = {}) {
    try {
      let whereClause = 'WHERE 1=1';
      let query = `
        SELECT 
          source_name as source,
          COUNT(*) as count
        FROM ${this.tableName}
        ${whereClause}
        GROUP BY source_name
        ORDER BY count DESC
        LIMIT 15
      `;

      // Apply date filters using helper method
      query = this.applyDateFilters(query, filters);

      const result = await clickhouse.query(query);
      const stats = await result.toPromise();

      return stats.map(row => ({
        label: row.source,
        value: parseInt(row.count)
      }));
    } catch (error) {
      logger.error('Error fetching source distribution:', error);
      throw new Error('Failed to fetch source distribution');
    }
  }

  async getCategoryDistribution(filters = {}) {
    try {
      let whereClause = 'WHERE 1=1';
      let query = `
        SELECT 
          category,
          COUNT(*) as count
        FROM ${this.tableName}
        ${whereClause}
        GROUP BY category
        ORDER BY count DESC
        LIMIT 20
      `;

      // Apply date filters using helper method
      query = this.applyDateFilters(query, filters);

      const result = await clickhouse.query(query);
      const stats = await result.toPromise();

      return stats.map(row => ({
        label: row.category || 'Unknown',
        value: parseInt(row.count)
      }));
    } catch (error) {
      logger.error('Error fetching category distribution:', error);
      throw new Error('Failed to fetch category distribution');
    }
  }

  async getDashboardSummary(filters = {}) {
    try {
      let whereClause = 'WHERE 1=1';
      let query = `
        SELECT 
          COUNT(*) as total_logs,
          COUNT(DISTINCT hostname) as unique_hosts,
          COUNT(DISTINCT source_name) as unique_sources,
          COUNT(DISTINCT category) as unique_categories,
          COUNT(CASE WHEN severity = 'ERROR' THEN 1 END) as error_count,
          COUNT(CASE WHEN severity = 'WARNING' THEN 1 END) as warning_count,
          COUNT(CASE WHEN severity = 'INFO' THEN 1 END) as info_count
        FROM ${this.tableName}
        ${whereClause}
      `;

      // Apply date filters using helper method
      query = this.applyDateFilters(query, filters);

      const result = await clickhouse.query(query);
      const summary = await result.toPromise();

      return {
        totalLogs: parseInt(summary[0]?.total_logs || 0),
        uniqueHosts: parseInt(summary[0]?.unique_hosts || 0),
        uniqueSources: parseInt(summary[0]?.unique_sources || 0),
        uniqueCategories: parseInt(summary[0]?.unique_categories || 0),
        errorCount: parseInt(summary[0]?.error_count || 0),
        warningCount: parseInt(summary[0]?.warning_count || 0),
        infoCount: parseInt(summary[0]?.info_count || 0)
      };
    } catch (error) {
      logger.error('Error fetching dashboard summary:', error);
      throw new Error('Failed to fetch dashboard summary');
    }
  }

  getSeverityColor(severity) {
    const colors = {
      'ERROR': '#ef4444',
      'WARNING': '#f59e0b',
      'INFO': '#3b82f6',
      'DEBUG': '#6b7280',
      'CRITICAL': '#dc2626',
      'FATAL': '#7c2d12'
    };
    return colors[severity] || '#6b7280';
  }
}

module.exports = new StatsService();

