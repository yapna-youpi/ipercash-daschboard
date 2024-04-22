import React, { useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MONTHS } from '../../functions/consts';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: "Graphe de l'evolution de l'activité",
        },
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
        },
    },
};



const extractOperationsData = (operations) => {
    let transactions = operations.map(item => {
        let month = new Date(item.created_at).getMonth();
        month = MONTHS[month].month;
        let year = new Date(item.created_at).getFullYear();
        return month + ' ' + year;
    })
    const months = [];
    transactions.map(item => { if (!months.includes(item)) months.push(item) });
    const numbers = transactions.reduce(function (occur, i) {
        return occur[i] ? ++occur[i] : occur[i] = 1, occur;
    }, {});
    let obj = { months: months, numbers: numbers };
    return obj;
};

function StatementGraph({ operations }) {
    const [state, setState] = useState({ buy: extractOperationsData(operations.buy), sell: extractOperationsData(operations.sell) });
    const data = {
        labels: state.buy.months,
        datasets: [
            {
                label: 'Vente de crypto',
                data: state.buy.months.map(item => state.buy.numbers[item]),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Rachat de crypto',
                data: state.sell.months.map(item => state.sell.numbers[item]),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y',
            },
        ],
    };
    return (
        <Line options={options} data={data} />
    )
}

export default StatementGraph