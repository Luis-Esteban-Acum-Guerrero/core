"use client";

import { useEffect, useRef, useState } from "react";

// Define the structure of our financial data
interface MonthlyData {
  [month: string]: number;
}

interface YearlyData {
  [year: string]: MonthlyData;
}

interface FinancialData {
  ingresos: YearlyData;
  egresos: YearlyData;
  cobranza: YearlyData;
  ahorro: YearlyData;
}

// Create mock data (March 2023 to March 2025)
const generateMockData = (): FinancialData => {
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const data: FinancialData = {
    ingresos: { "2023": {}, "2024": {}, "2025": {} },
    egresos: { "2023": {}, "2024": {}, "2025": {} },
    cobranza: { "2023": {}, "2024": {}, "2025": {} },
    ahorro: { "2023": {}, "2024": {}, "2025": {} },
  };

  // Fill 2023 data (March to December)
  for (let i = 2; i < 12; i++) {
    const month = months[i];
    data.ingresos["2023"][month] = Math.floor(Math.random() * 5000) + 2000;
    data.egresos["2023"][month] = Math.floor(Math.random() * 4000) + 1000;
    data.cobranza["2023"][month] = Math.floor(Math.random() * 2000) + 500;
    data.ahorro["2023"][month] = Math.floor(Math.random() * 1500) + 300;
  }

  // Fill 2024 data (all months)
  for (let i = 0; i < 12; i++) {
    const month = months[i];
    data.ingresos["2024"][month] = Math.floor(Math.random() * 6000) + 3000;
    data.egresos["2024"][month] = Math.floor(Math.random() * 5000) + 1500;
    data.cobranza["2024"][month] = Math.floor(Math.random() * 3000) + 800;
    data.ahorro["2024"][month] = Math.floor(Math.random() * 2000) + 500;
  }

  // Fill 2025 data (January to March)
  for (let i = 0; i < 3; i++) {
    const month = months[i];
    data.ingresos["2025"][month] = Math.floor(Math.random() * 7000) + 4000;
    data.egresos["2025"][month] = Math.floor(Math.random() * 6000) + 2000;
    data.cobranza["2025"][month] = Math.floor(Math.random() * 3500) + 1000;
    data.ahorro["2025"][month] = Math.floor(Math.random() * 2500) + 700;
  }

  return data;
};

export default function FinancialChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<FinancialData | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => {
    // This would be replaced with a fetch call to the API endpoint
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('/api/resumen');
    //     if (!response.ok) throw new Error('Failed to fetch data');
    //     const jsonData = await response.json();
    //     setData(jsonData);
    //   } catch (error) {
    //     console.error('Error fetching financial data:', error);
    //     // Fall back to mock data in case of error
    //     setData(generateMockData());
    //   }
    // };
    // fetchData();

    // Using mock data for now
    setData(generateMockData());
  }, []);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get the flat array of all months
    const allMonths: { year: string; month: string; label: string }[] = [];
    ["2023", "2024", "2025"].forEach((year) => {
      Object.keys(data.ingresos[year]).forEach((month) => {
        const monthIndex = [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ].indexOf(month);
        const shortMonth = month.substring(0, 3);
        allMonths.push({
          year,
          month,
          label: `${shortMonth} ${year.substring(2)}`,
        });
      });
    });

    // Sort months chronologically
    allMonths.sort((a, b) => {
      if (a.year !== b.year)
        return Number.parseInt(a.year) - Number.parseInt(b.year);
      const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    // Canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart dimensions
    const chartMargin = { top: 50, right: 50, bottom: 80, left: 80 };
    const chartWidth = width - chartMargin.left - chartMargin.right;
    const chartHeight = height - chartMargin.top - chartMargin.bottom;
    const middleY = chartMargin.top + chartHeight / 2;

    // Colors
    const colors = {
      income: "#34D399", // Green
      collection: "#F87171", // Red
      expense: "#60A5FA", // Blue
      savings: "#8B5CF6", // Purple
      netIncome: "#F59E0B", // Amber (new color for ingresos-egresos)
      axis: "#94A3B8", // Slate
      text: "#1E293B", // Slate dark
      grid: "#E2E8F0", // Slate light
      background: "#ffffff",
    };

    // Find the maximum value among all data types for consistent scaling
    let maxValue = 0;

    allMonths.forEach(({ year, month }) => {
      // Calculate the total height of the stacked bar
      const totalIncome =
        data.ingresos[year][month] +
        data.cobranza[year][month] +
        data.ahorro[year][month];
      const expense = data.egresos[year][month];
      const netIncome = data.ingresos[year][month] - expense;

      maxValue = Math.max(maxValue, totalIncome, expense, Math.abs(netIncome));
    });

    // Use the same scale for both positive and negative values
    const maxScale = Math.ceil(maxValue * 1.1); // Add 10% padding

    // Bar properties
    const barWidth = Math.min(60, chartWidth / allMonths.length - 10);
    const barSpacing =
      (chartWidth - barWidth * allMonths.length) / (allMonths.length - 1);

    // Draw background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    // Draw title
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = colors.text;
    ctx.textAlign = "center";
    ctx.fillText("Resumen Financiero", width / 2, 30);

    // Draw axes
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 2;

    // X-axis (middle)
    ctx.beginPath();
    ctx.moveTo(chartMargin.left, middleY);
    ctx.lineTo(width - chartMargin.right, middleY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(chartMargin.left, chartMargin.top);
    ctx.lineTo(chartMargin.left, height - chartMargin.bottom);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;

    // Format currency function
    const formatCurrency = (value: number): string => {
      return "$" + value.toLocaleString("es-CL", { maximumFractionDigits: 0 });
    };

    // Horizontal grid lines (above middle)
    for (let i = 1; i <= 5; i++) {
      const y = middleY - (i * chartHeight) / 10;
      ctx.beginPath();
      ctx.moveTo(chartMargin.left, y);
      ctx.lineTo(width - chartMargin.right, y);
      ctx.stroke();

      // Y-axis labels (positive scale)
      ctx.fillStyle = colors.text;
      ctx.textAlign = "right";
      ctx.font = "12px Arial";
      ctx.fillText(
        formatCurrency((maxScale * i) / 5),
        chartMargin.left - 10,
        y + 5
      );
    }

    // Horizontal grid lines (below middle)
    for (let i = 1; i <= 5; i++) {
      const y = middleY + (i * chartHeight) / 10;
      ctx.beginPath();
      ctx.moveTo(chartMargin.left, y);
      ctx.lineTo(width - chartMargin.right, y);
      ctx.stroke();

      // Y-axis labels (negative scale)
      ctx.fillStyle = colors.text;
      ctx.textAlign = "right";
      ctx.font = "12px Arial";
      ctx.fillText(
        formatCurrency((maxScale * i) / 5),
        chartMargin.left - 10,
        y + 5
      );
    }

    // Draw bars and line
    const barCenters: number[] = [];
    const netIncomePoints: { x: number; y: number }[] = [];

    allMonths.forEach((monthData, index) => {
      const { year, month } = monthData;
      const x = chartMargin.left + (barWidth + barSpacing) * index;
      barCenters.push(x + barWidth / 2);

      // Draw month labels
      ctx.fillStyle = colors.text;
      ctx.textAlign = "center";
      ctx.font = "12px Arial";
      ctx.save();
      ctx.translate(x + barWidth / 2, height - chartMargin.bottom + 10);
      ctx.rotate(-Math.PI / 4); // Rotate text for better fit
      ctx.fillText(monthData.label, 0, 0);
      ctx.restore();

      // Get data values
      const income = data.ingresos[year][month];
      const collection = data.cobranza[year][month];
      const savings = data.ahorro[year][month];
      const expense = data.egresos[year][month];

      // Calculate heights based on the scale
      const baseIncomeHeight = (income / maxScale) * (chartHeight / 2);
      const collectionHeight = (collection / maxScale) * (chartHeight / 2);
      const savingsHeight = (savings / maxScale) * (chartHeight / 2);

      // Draw the stacked bars for income components

      // 1. Base income (bottom of stack)
      ctx.fillStyle = colors.income;
      ctx.fillRect(x, middleY - baseIncomeHeight, barWidth, baseIncomeHeight);

      // 2. Collection (middle of stack)
      ctx.fillStyle = colors.collection;
      ctx.fillRect(
        x,
        middleY - baseIncomeHeight - collectionHeight,
        barWidth,
        collectionHeight
      );

      // 3. Savings (top of stack)
      ctx.fillStyle = colors.savings;
      ctx.fillRect(
        x,
        middleY - baseIncomeHeight - collectionHeight - savingsHeight,
        barWidth,
        savingsHeight
      );

      // Expense bar (downward)
      const expenseHeight = (expense / maxScale) * (chartHeight / 2);
      ctx.fillStyle = colors.expense;
      ctx.fillRect(x, middleY, barWidth, expenseHeight);

      // Net income point
      const netIncome = income - expense;
      const netIncomeY = middleY - (netIncome / maxScale) * (chartHeight / 2);
      netIncomePoints.push({ x: x + barWidth / 2, y: netIncomeY });

      // Hover effect
      if (hoveredBar === index) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(x, chartMargin.top, barWidth, chartHeight);
      }
    });

    // Draw net income line
    ctx.strokeStyle = colors.netIncome;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    netIncomePoints.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw net income points
    netIncomePoints.forEach((point) => {
      ctx.fillStyle = colors.netIncome;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw legend
    const legendX = width - chartMargin.right + 20;
    const legendY = chartMargin.top;

    ctx.font = "14px Arial";
    ctx.textAlign = "left";

    // Income
    ctx.fillStyle = colors.income;
    ctx.fillRect(legendX, legendY, 20, 20);
    ctx.fillStyle = colors.text;
    ctx.fillText("Ingresos", legendX + 30, legendY + 15);

    // Collection
    ctx.fillStyle = colors.collection;
    ctx.fillRect(legendX, legendY + 30, 20, 20);
    ctx.fillStyle = colors.text;
    ctx.fillText("Cobranza", legendX + 30, legendY + 45);

    // Savings
    ctx.fillStyle = colors.savings;
    ctx.fillRect(legendX, legendY + 60, 20, 20);
    ctx.fillStyle = colors.text;
    ctx.fillText("Ahorro", legendX + 30, legendY + 75);

    // Expense
    ctx.fillStyle = colors.expense;
    ctx.fillRect(legendX, legendY + 90, 20, 20);
    ctx.fillStyle = colors.text;
    ctx.fillText("Egresos", legendX + 30, legendY + 105);

    // Net Income
    ctx.fillStyle = colors.netIncome;
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY + 130, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.netIncome;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(legendX, legendY + 130);
    ctx.lineTo(legendX + 20, legendY + 130);
    ctx.stroke();
    ctx.fillStyle = colors.text;
    ctx.fillText("Ingresos-Egresos", legendX + 30, legendY + 135);

    // Event listener for hovering over bars
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      for (let i = 0; i < barCenters.length; i++) {
        const barCenter = barCenters[i];
        if (Math.abs(mouseX - barCenter) < barWidth / 2) {
          if (hoveredBar !== i) {
            setHoveredBar(i);
          }
          return;
        }
      }

      if (hoveredBar !== null) {
        setHoveredBar(null);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [data, hoveredBar]);

  // Show tooltip when hovering over a bar
  const renderTooltip = () => {
    if (hoveredBar === null || !data) return null;

    const allMonths: { year: string; month: string }[] = [];
    ["2023", "2024", "2025"].forEach((year) => {
      Object.keys(data.ingresos[year]).forEach((month) => {
        allMonths.push({ year, month });
      });
    });

    // Sort months chronologically
    allMonths.sort((a, b) => {
      if (a.year !== b.year)
        return Number.parseInt(a.year) - Number.parseInt(b.year);
      const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    const monthData = allMonths[hoveredBar];
    if (!monthData) return null;

    const { year, month } = monthData;
    const income = data.ingresos[year][month];
    const collection = data.cobranza[year][month];
    const expense = data.egresos[year][month];
    const savings = data.ahorro[year][month];
    const total = income + collection + savings;

    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    const formatCurrency = (value: number): string => {
      return "$" + value.toLocaleString("es-CL", { maximumFractionDigits: 0 });
    };

    // Use the same colors object from the chart for tooltip
    const colors = {
      income: "#34D399", // Green
      collection: "#F87171", // Red
      expense: "#60A5FA", // Blue
      savings: "#8B5CF6", // Purple
      netIncome: "#F59E0B", // Amber
    };

    return (
      <div className="absolute top-4 right-4 bg-core-light shadow-lg rounded-lg p-4 z-10 border border-core-gray/30">
        <h3 className="font-bold text-core-dark mb-2">
          {capitalize(month)} {year}
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="font-medium" style={{ color: colors.income }}>
            Ingresos:
          </div>
          <div className="text-right">{formatCurrency(income)}</div>

          <div className="font-medium" style={{ color: colors.collection }}>
            Cobranza:
          </div>
          <div className="text-right">{formatCurrency(collection)}</div>

          <div className="font-medium" style={{ color: colors.savings }}>
            Ahorro:
          </div>
          <div className="text-right">{formatCurrency(savings)}</div>

          <div className="font-medium" style={{ color: colors.expense }}>
            Egresos:
          </div>
          <div className="text-right">{formatCurrency(expense)}</div>

          <div className="font-medium" style={{ color: colors.netIncome }}>
            Ingresos-Egresos:
          </div>
          <div className="text-right">{formatCurrency(income - expense)}</div>

          <div className="font-medium text-core-dark border-t pt-1 mt-1">
            Total:
          </div>
          <div className="text-right font-bold border-t pt-1 mt-1">
            {formatCurrency(total)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-[600px] p-4 bg-core-light rounded-xl shadow-lg">
      {data ? renderTooltip() : null}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: "none" }}
      />
      {!data && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
