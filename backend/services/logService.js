const { clickhouse } = require('../config/database');
const LogEntry = require('../models/LogEntry');
const logger = require('../utils/logger');

class LogService {
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

  async getLogs(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 50, sortBy = 'timestamp', sortOrder = 'DESC' } = pagination;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE 1=1';
      let query = `
        SELECT 
          record_number as id,
          timestamp,
          severity,
          hostname,
          source_name as source,
          message,
          category,
          event_id,
          subject_user_name as user,
          process_name as process,
          process_id as thread,
          '' as raw_data
        FROM ${this.tableName}
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ${limit} OFFSET ${offset}
      `;

      // Apply filters
      if (filters.severity) {
        query = query.replace('WHERE 1=1', `WHERE severity = '${filters.severity}'`);
      }
      if (filters.hostname) {
        const whereKeyword = query.includes('WHERE severity =') ? 'AND' : 'WHERE';
        query = query.replace('WHERE 1=1', `${whereKeyword} hostname = '${filters.hostname}'`);
        if (whereKeyword === 'AND') {
          query = query.replace('WHERE 1=1', '');
        }
      }
      if (filters.source) {
        const whereKeyword = query.includes('WHERE') ? 'AND' : 'WHERE';
        query = query.replace('WHERE 1=1', `${whereKeyword} source = '${filters.source}'`);
        if (whereKeyword === 'AND') {
          query = query.replace('WHERE 1=1', '');
        }
      }
      if (filters.category) {
        const whereKeyword = query.includes('WHERE') ? 'AND' : 'WHERE';
        query = query.replace('WHERE 1=1', `${whereKeyword} category = '${filters.category}'`);
        if (whereKeyword === 'AND') {
          query = query.replace('WHERE 1=1', '');
        }
      }
      // Apply date filters using helper method
      query = this.applyDateFilters(query, filters);
      if (filters.search) {
        const whereKeyword = query.includes('WHERE') ? 'AND' : 'WHERE';
        query = query.replace('WHERE 1=1', `${whereKeyword} (message LIKE '%${filters.search}%')`);
        if (whereKeyword === 'AND') {
          query = query.replace('WHERE 1=1', '');
        }
      }

      const result = await clickhouse.query(query);
      const logs = await result.toPromise();

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total
        FROM ${this.tableName}
        WHERE 1=1
      `;

      // Apply the same filters to count query
      if (filters.severity) {
        countQuery = countQuery.replace('WHERE 1=1', `WHERE severity = '${filters.severity}'`);
      }
      if (filters.hostname) {
        const whereKeyword = countQuery.includes('WHERE severity =') ? 'AND' : 'WHERE';
        countQuery = countQuery.replace('WHERE 1=1', `${whereKeyword} hostname = '${filters.hostname}'`);
        if (whereKeyword === 'AND') {
          countQuery = countQuery.replace('WHERE 1=1', '');
        }
      }
      if (filters.source) {
        const whereKeyword = countQuery.includes('WHERE') ? 'AND' : 'WHERE';
        countQuery = countQuery.replace('WHERE 1=1', `${whereKeyword} source = '${filters.source}'`);
        if (whereKeyword === 'AND') {
          countQuery = countQuery.replace('WHERE 1=1', '');
        }
      }
      if (filters.category) {
        const whereKeyword = countQuery.includes('WHERE') ? 'AND' : 'WHERE';
        countQuery = countQuery.replace('WHERE 1=1', `${whereKeyword} category = '${filters.category}'`);
        if (whereKeyword === 'AND') {
          countQuery = countQuery.replace('WHERE 1=1', '');
        }
      }
      // Apply date filters using helper method
      countQuery = this.applyDateFilters(countQuery, filters);
      if (filters.search) {
        const whereKeyword = countQuery.includes('WHERE') ? 'AND' : 'WHERE';
        countQuery = countQuery.replace('WHERE 1=1', `${whereKeyword} (message LIKE '%${filters.search}%')`);
        if (whereKeyword === 'AND') {
          countQuery = countQuery.replace('WHERE 1=1', '');
        }
      }

      const countResult = await clickhouse.query(countQuery);
      const countData = await countResult.toPromise();
      const total = countData[0]?.total || 0;

      return {
        logs: logs.map(log => LogEntry.fromClickHouseRow(log)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching logs:', error);
      throw new Error('Failed to fetch logs');
    }
  }

  async getLogById(id) {
    try {
      const query = `
        SELECT 
          record_number as id,
          timestamp,
          severity,
          hostname,
          source_name as source,
          message,
          category,
          event_id,
          subject_user_name as user,
          process_name as process,
          process_id as thread,
          '' as raw_data
        FROM ${this.tableName}
        WHERE record_number = '${id}'
        LIMIT 1
      `;

      const result = await clickhouse.query(query);
      const logs = await result.toPromise();

      if (logs.length === 0) {
        return null;
      }

      return LogEntry.fromClickHouseRow(logs[0]);
    } catch (error) {
      logger.error('Error fetching log by ID:', error);
      throw new Error('Failed to fetch log');
    }
  }

  async getDistinctValues(field) {
    try {
      const query = `
        SELECT DISTINCT ${field} as value
        FROM ${this.tableName}
        WHERE ${field} IS NOT NULL AND ${field} != ''
        ORDER BY ${field}
      `;

      const result = await clickhouse.query(query);
      const values = await result.toPromise();

      return values.map(row => row.value);
    } catch (error) {
      logger.error(`Error fetching distinct values for ${field}:`, error);
      throw new Error(`Failed to fetch distinct ${field} values`);
    }
  }

  async getLogStats(filters = {}) {
    try {
      let whereClause = 'WHERE 1=1';
      let query = `
        SELECT 
          severity,
          hostname,
          source_name as source,
          category,
          COUNT(*) as count
        FROM ${this.tableName}
        ${whereClause}
        GROUP BY severity, hostname, source_name, category
        ORDER BY count DESC
      `;

      // Apply date filters using helper method
      query = this.applyDateFilters(query, filters);

      const result = await clickhouse.query(query);
      const stats = await result.toPromise();

      return stats;
    } catch (error) {
      logger.error('Error fetching log stats:', error);
      throw new Error('Failed to fetch log statistics');
    }
  }
}

module.exports = new LogService();

