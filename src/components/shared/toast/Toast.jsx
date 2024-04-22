import React from 'react'

import toast, { Toaster } from 'react-hot-toast'

const toastify = (type, text, duration) => {
	// console.log("hello toast")
	switch (type) {
		case "greet":
			toast.success(text,
				{
					icon: '👏',
					style: {
						borderRadius: '10px',
						background: '#333',
						color: '#fff',
					},
				})
			break
		case "error":
			toast.error(text, {
				style: {
					border: '1px solid #cc1616',
					padding: '16px',
					color: '#cc1616',
				},
				iconTheme: {
					primary: '#cc1616',
					secondary: '#FFFAEE',
				},
				duration: duration || 6000
			})
			break
		case "info":
			toast(text,
				{
					duration: duration || 6000,
				}
			);
			break
		case "success":
			toast.success(text,
				{
					style: {
						padding: '10px',
						border: '1px solid #00ff6acc',
						// background: '#00ff6acc',
						color: '#00ff6acc',
						fontSize: 20,
						// fontWeight: 600,
					},
				})
			break
		default:
			toast(text,
				{
					duration: duration || 6000,
				}
			);
			break
	}
}

function Toast() {
	return (
		<Toaster />
	)
}

export default Toast
export { toastify }
