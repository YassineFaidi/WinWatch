const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

// ClickHouse configuration
const CLICKHOUSE_CONFIG = {
    host: '192.168.56.103',
    port: 8123,
    database: 'logs',
    table: 'windows_logs'
};

// Middleware
app.use(cors());
app.use(express.json());

// ClickHouse query function
async function queryClickHouse(query) {
    try {
        const url = `http://${CLICKHOUSE_CONFIG.host}:${CLICKHOUSE_CONFIG.port}`;
        const response = await axios.post(url, query, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                default_format: 'JSONEachRow'
            }
        });
        
        // Handle different response data types
        let data = response.data;
        
        console.log('ClickHouse response type:', typeof data);
        console.log('ClickHouse response data:', data);
        
        // If data is a string, process it
        if (typeof data === 'string') {
            if (data.trim()) {
                return data.trim().split('\n').map(line => JSON.parse(line));
            }
            return [];
        }
        
        // If data is already an array, return it
        if (Array.isArray(data)) {
            return data;
        }
        
        // If data is an object, wrap it in an array
        if (typeof data === 'object' && data !== null) {
            return [data];
        }
        
        return [];
    } catch (error) {
        console.error('ClickHouse query error:', error.message);
        throw error;
    }
}

// API Routes
app.get('/api/logs/stats', async (req, res) => {
    try {
        // Query to get total logs and severity breakdown
        const query = `
            SELECT 
                COUNT(*) as total_logs,
                COUNT(CASE WHEN severity = 'INFO' THEN 1 END) as info_count,
                COUNT(CASE WHEN severity = 'WARNING' THEN 1 END) as warning_count,
                COUNT(CASE WHEN severity = 'ERROR' THEN 1 END) as error_count,
                COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_count,
                COUNT(CASE WHEN severity NOT IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL') THEN 1 END) as other_count
            FROM ${CLICKHOUSE_CONFIG.database}.${CLICKHOUSE_CONFIG.table}
        `;
        
        const result = await queryClickHouse(query);
        const stats = result[0] || {};
        
        res.json({
            success: true,
            data: {
                total: parseInt(stats.total_logs) || 0,
                severity: {
                    info: parseInt(stats.info_count) || 0,
                    warning: parseInt(stats.warning_count) || 0,
                    error: parseInt(stats.error_count) || 0,
                    critical: parseInt(stats.critical_count) || 0,
                    other: parseInt(stats.other_count) || 0
                }
            }
        });
    } catch (error) {
        console.error('Error fetching logs stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch logs statistics'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'WinWatch Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 WinWatch Backend running on http://localhost:${PORT}`);
    console.log(`📊 ClickHouse: ${CLICKHOUSE_CONFIG.host}:${CLICKHOUSE_CONFIG.port}`);
    console.log(`🗄️  Database: ${CLICKHOUSE_CONFIG.database}.${CLICKHOUSE_CONFIG.table}`);
});
