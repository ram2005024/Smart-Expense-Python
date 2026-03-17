import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import React, { useEffect, useState } from "react";

import { axiosInstance } from "../../../utils/axios/axiosInstance";
import { Loader } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const MonthlySpendGraph = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    useEffect(() => {
        (
            async () => {
                try {
                    setLoading(true)
                    const res = await axiosInstance.get("budget/budgets/monthly_spend_analytics")
                    setData(res.data)
                } catch (error) {
                    console.log(error)
                }
                finally {
                    setLoading(false)
                }
            }
        )()

    }, [])
    const labels = data ? Object.keys(data) : []
    const expenses = data ? Object.values(data) : []

    const chartData = {
        labels,
        datasets: [
            {
                data: expenses,
                backgroundColor: labels.map((m, i) =>
                    i === labels.length - 1 ? "#2563EB" : "#9CA3AF"
                ),
                borderRadius: 12,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 12 } },
            },
            y: {
                grid: { display: false },
                ticks: {
                    display: true, // show Y-axis labels
                    callback: (value) => `${value}k`, // format as "1k", "2k"
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };
    if (loading && !data) {
        return (
            <div className="w-full p-2 flex items-center justify-center">
                <Loader className="size-5 text-gray-400 animate-spin" />
            </div>
        )
    }
    if (!loading && !data) {
        return null
    }
    return <Bar data={chartData} options={options} />;
};

export default MonthlySpendGraph;