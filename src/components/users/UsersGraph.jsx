import React, { useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
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
    Filler,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Graphe Des Inscriptions',
            padding: 20,
            font: {
                size: 30
            },
            color: '#0f394d'
        },
        zoom: {
            pan: {
                enabled: true
            },
            limits: {
                // axis limits
            },
            zoom: {
                wheel: {
                    enabled: true,
                    modifierKey: 'shift'
                }
            }
        }
    },
};

const extractUserData = (users) => {
    let inscriptions = users.map(item => {
        let month = new Date(item.created_at).getMonth();
        month = MONTHS[month].month;
        let year = new Date(item.created_at).getFullYear();
        return month + ' ' + year;
    })
    const months = [];
    inscriptions.map(item => { if (!months.includes(item)) months.push(item) });
    const numbers = inscriptions.reduce(function (occur, i) {
        return occur[i] ? ++occur[i] : occur[i] = 1, occur;
    }, {});
    let obj = { months: months, numbers: numbers };
    console.log("the inscriptions", obj)
    return obj;
};

function UsersGraph({ users }) {
    const [state, setState] = useState(extractUserData(users));
    console.log("the state", state)
    const data = {
        labels: state.months,
        datasets: [
            {
                fill: true,
                label: "Inscription depuis le debut de l'activité",
                data: state.months.map(item => state.numbers[item]),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    return (
        <Line options={options} data={data} />
    );
}

export default UsersGraph