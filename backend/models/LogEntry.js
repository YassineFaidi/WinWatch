class LogEntry {
  constructor(data) {
    this.id = data.id || null;
    this.timestamp = data.timestamp || new Date();
    this.severity = data.severity || 'INFO';
    this.hostname = data.hostname || '';
    this.source = data.source || '';
    this.message = data.message || '';
    this.category = data.category || '';
    this.eventId = data.event_id || null;
    this.user = data.user || '';
    this.process = data.process || '';
    this.thread = data.thread || '';
    this.rawData = data.raw_data || '';
  }

  static fromClickHouseRow(row) {
    return new LogEntry({
      id: row.id,
      timestamp: new Date(row.timestamp),
      severity: row.severity,
      hostname: row.hostname,
      source: row.source,
      message: row.message,
      category: row.category,
      eventId: row.event_id,
      user: row.user,
      process: row.process,
      thread: row.thread,
      rawData: row.raw_data
    });
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp.toISOString(),
      severity: this.severity,
      hostname: this.hostname,
      source: this.source,
      message: this.message,
      category: this.category,
      eventId: this.eventId,
      user: this.user,
      process: this.process,
      thread: this.thread,
      rawData: this.rawData
    };
  }
}

module.exports = LogEntry;

