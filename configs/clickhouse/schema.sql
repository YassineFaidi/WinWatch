-- ClickHouse Schema for Windows Logs Pipeline
-- This file contains the ClickHouse table schema and useful queries for the Windows log data

-- Create database
CREATE DATABASE IF NOT EXISTS logs;

-- Use the database
USE logs;

-- Create windows_logs table with all String fields (including new important fields)
CREATE TABLE windows_logs (
    timestamp String,
    hostname String,
    event_id String,
    event_type String,
    source_name String,
    message String,
    channel String,
    category String,
    severity String,
    process_name String,
    subject_user_name String,
    target_user_name String,
    logon_type String,
    process_id String,
    ip_address String,
    record_number String
) ENGINE = MergeTree()
ORDER BY (timestamp, hostname, event_id);

-- Optional: Create an index for better search performance
-- ALTER TABLE windows_logs ADD INDEX idx_event_id event_id TYPE bloom_filter GRANULARITY 1;

-- Show table structure
DESCRIBE windows_logs;

-- Useful queries for dashboard:

-- 1. Total log count
-- SELECT COUNT(*) as total_logs FROM windows_logs;

-- 2. Logs by severity level
-- SELECT severity, COUNT(*) as count FROM windows_logs GROUP BY severity ORDER BY count DESC;

-- 3. Recent logs (last 100)
-- SELECT timestamp, hostname, event_id, severity, message FROM windows_logs ORDER BY timestamp DESC LIMIT 100;

-- 4. Logs by event type
-- SELECT event_type, COUNT(*) as count FROM windows_logs GROUP BY event_type ORDER BY count DESC;

-- 5. Logs by source
-- SELECT source_name, COUNT(*) as count FROM windows_logs GROUP BY source_name ORDER BY count DESC;

-- 6. Logs per hour (for time series chart)
-- SELECT toStartOfHour(parseDateTimeBestEffort(timestamp)) as hour, COUNT(*) as count 
-- FROM windows_logs 
-- WHERE timestamp >= now() - INTERVAL 24 HOUR 
-- GROUP BY hour ORDER BY hour;

-- 7. Error logs count
-- SELECT COUNT(*) as error_count FROM windows_logs WHERE severity IN ('Error', 'Critical');

-- 8. Logs by hostname
-- SELECT hostname, COUNT(*) as count FROM windows_logs GROUP BY hostname ORDER BY count DESC;
