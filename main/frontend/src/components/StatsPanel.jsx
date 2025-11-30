import React, { useMemo } from "react";

export default function StatsPanel({ rows, field }) {
  const stats = useMemo(() => {
    if (!rows || !rows.length) return { avg: 0, min: 0, max: 0, total: 0 };
    
    // If the row has _totalPlaces, it means we got data from stats API
    if (rows[0] && rows[0]._totalPlaces !== undefined) {
      return {
        avg: rows[0][field] || 0,
        min: rows[0]._minRating || 0,
        max: rows[0]._maxRating || 0,
        total: rows[0]._totalPlaces || 0,
      };
    }
    
    // Otherwise calculate from array of places
    const values = rows.map(r => Number(r[field]) || 0);
    return {
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
      total: rows.length,
    };
  }, [rows, field]);

  return (
    <div className="stats-grid">
      {/* Total Places */}
      <div className="stat-card">
        <div className="stat-label">Total Places</div>
        <div className="stat-value">{stats.total}</div>
      </div>
      {/* Average */}
      <div className="stat-card">
        <div className="stat-label">Average {field}</div>
        <div className="stat-value">{stats.avg}</div>
      </div>
      {/* Min */}
      <div className="stat-card">
        <div className="stat-label">Min {field}</div>
        <div className="stat-value">{stats.min}</div>
      </div>
      {/* Max */}
      <div className="stat-card">
        <div className="stat-label">Max {field}</div>
        <div className="stat-value">{stats.max}</div>
      </div>
    </div>
  );
}