import React, { useState, useRef, useEffect } from "react";

export default function CustomDropdown({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref}>
      <label className="filter-label">
        {label}
      </label>

      {/* Selected Box */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "12px 16px",
          background: "white",
          borderRadius: "12px",
          border: "2px solid #e2e8f0",
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s ease",
          fontWeight: 500,
          color: value ? "#2d3748" : "#a0aec0",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#667eea";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span>{value || "All"}</span>
        <span 
          style={{ 
            transform: open ? "rotate(180deg)" : "none", 
            transition: "transform 0.2s ease",
            fontSize: "12px"
          }}
        >
          ▼
        </span>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            marginTop: 8,
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
            maxHeight: "220px",
            overflowY: "auto",
            animation: "fadeIn 0.2s ease-out",
            zIndex: 10,
            position: "relative",
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          
          {/* ALL option */}
          <div
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              borderBottom: "1px solid #f7fafc",
              fontWeight: value === "" ? 600 : 400,
              background: value === "" ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))" : "white",
              color: value === "" ? "#667eea" : "#4a5568",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (value !== "") {
                e.target.style.background = "#f7fafc";
                e.target.style.paddingLeft = "20px";
              }
            }}
            onMouseLeave={(e) => {
              if (value !== "") {
                e.target.style.background = "white";
                e.target.style.paddingLeft = "16px";
              }
            }}
          >
            All
          </div>

          {/* List options */}
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: value === opt ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))" : "white",
                fontWeight: value === opt ? 600 : 400,
                color: value === opt ? "#667eea" : "#4a5568",
              }}
              onMouseEnter={(e) => {
                if (value !== opt) {
                  e.target.style.background = "#f7fafc";
                  e.target.style.paddingLeft = "20px";
                }
              }}
              onMouseLeave={(e) => {
                if (value !== opt) {
                  e.target.style.background = "white";
                  e.target.style.paddingLeft = "16px";
                }
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}