import React, { useEffect, useState } from 'react'
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
            text: "Graphe de l'evolution de la vente de crypto",
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
    console.log("extracted data", obj)
    return obj;
};

function BuyChart({ operations }) {
    const [state, setState] = useState(extractOperationsData(operations));
    useEffect(() => {
        setState(extractOperationsData(operations))
    }, [operations])

    const data = {
        labels: state.months,
        datasets: [
            {
                fill: true,
                label: 'Vente de crypto',
                data: state.months.map(item => state.numbers[item]),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y',
            },
        ],
    };
    console.log("the operation", operations, state)
    return (
        <Line options={options} data={data} />
    )
}

export default BuyChart