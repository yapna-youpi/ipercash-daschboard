import React from 'react'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

Chart.register(ArcElement, Tooltip, Legend)

// export const data = {
//     labels: ['Cameroun', 'Cote D\'Ivoire', 'Senegal'],
//     datasets: [
//       {
//         // label: '# of Votes',
//         data: [60, 20, 20],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//           'rgba(54, 162, 235, 0.2)',
//           'rgba(255, 206, 86, 0.2)',
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

const setPercents = (count) => {
	const total = count.cm + count.ci + count.sn
	return [(Math.round(count.cm * 100 / total)), (count.ci * 100 / total), (count.sn * 100 / total)]
}

function PieChart({ count }) {
	// console.log("the count ", count)
	const data = {
		labels: ['Cameroun', 'Cote D\'Ivoire', 'Senegal'],
		datasets: [
			{
				// label: '# of Votes',
				// data: [60, 20, 20],
				data: setPercents(count),
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
				],
				borderWidth: 1,
			},
		],
	};
	return (
		<div className="circle">
			<Pie data={data} />
		</div>
	)
}

export default PieChart