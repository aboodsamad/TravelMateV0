import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ rows, field }) {
  if (!rows.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <div className="empty-state-title">No Data Available</div>
        <div className="empty-state-text">
          Try adjusting your filters to see more results
        </div>
      </div>
    );
  }

  const top10 = rows.slice(0, 10);
  const labels = top10.map((r) => r.Location);
  const values = top10.map((r) => +r[field]);

  const data = {
    labels,
    datasets: [
      {
        label: field,
        data: values,
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(118, 75, 162, 0.9)',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: false
      }, 
      title: { 
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">Top 10 Places by {field}</h2>
      <div style={{ width: "100%", height: "400px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}