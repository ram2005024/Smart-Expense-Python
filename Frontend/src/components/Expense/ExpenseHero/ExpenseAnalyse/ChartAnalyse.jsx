import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Legend, Chart as ChartJS, Tooltip, ArcElement } from 'chart.js'
import { useSelector } from 'react-redux'
import { useAxios } from '../../../../hooks/useAxios'
import toast from 'react-hot-toast'
ChartJS.register(ArcElement, Legend, Tooltip)
const ChartAnalyse = () => {
    const { selectedMonth } = useSelector(state => state.expense)
    const [chartData, setChartData] = useState(null)
    const api = useAxios()

    useEffect(() => {
        (
            async () => {
                try {
                    const res = await api.get(`/expense/summarize_spend_categories?date=${selectedMonth}`)
                    if (res) setChartData(res.data)

                } catch (error) {
                    toast.error(error.message)
                    console.log(error)
                }

            }
        )();
    }, [selectedMonth])
    if (!chartData) return null
    const totalAmount = chartData.summary.reduce((a, i) => a += i["total"], 0)
    const data = {
        labels: chartData.summary.map((i) => i.expense_category),
        datasets: [
            {
                data: chartData.summary.map((i) => i.total),
                backgroundColor: ['Red', 'Yellow', 'Purple', 'Green', 'Pink', 'Violet', 'Brown', 'Orange'],

            }
        ],
        borderRadius: 10
    }
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart) => {
            const { ctx, chartArea: { left, right, top, bottom } } = chart;
            ctx.save();

            // Calculate center
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;

            // Calculate total
            const total = chartData.summary.reduce((acc, i) => acc + i.total, 0);

            // First line: "Total"
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Total', centerX, centerY - 10); // shift upward

            // Second line: amount
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = '#666';
            ctx.fillText(`${(total / 1000).toFixed(1)}K`, centerX, centerY + 10); // shift downward

            ctx.restore();
        }
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,

        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 15,
                    color: '#333',
                    font: {
                        size: 10,
                        weight: 'bold'
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const percent = ((value / totalAmount) * 100).toFixed(1);
                        return `${context.label}: Rs ${value} (${percent}%)`;
                    }
                }
            }
        }
    };



    return (
        <div className='border border-gray-50 bg-white rounded-lg shadow p-3 text-xs '>
            <h2 className='text-gray-400 font-semibold'>EXPENSE BY CATEGORY</h2>
            <div className='size-48 full'>
                <Doughnut key={selectedMonth} data={data} options={options} plugins={[centerTextPlugin]} />
            </div>
        </div>
    )
}

export default ChartAnalyse
