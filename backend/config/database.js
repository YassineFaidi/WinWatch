const { ClickHouse } = require('clickhouse');

const clickhouse = new ClickHouse({
  host: process.env.CLICKHOUSE_HOST || '192.168.56.103',
  port: process.env.CLICKHOUSE_PORT || 8123,
  user: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || 'default',
  timeout: 60000,
  requestTimeout: 60000,
  maxOpenConnections: 10,
  debug: process.env.NODE_ENV === 'development'
});

// Test connection
const testConnection = async () => {
  try {
    await clickhouse.query('SELECT 1').toPromise();
    console.log('✅ ClickHouse connection successful');
    return true;
  } catch (error) {
    console.error('❌ ClickHouse connection failed:', error.message);
    return false;
  }
};

module.exports = { clickhouse, testConnection };

