// Modal.js

import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div
			onClick={onClose}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
                zIndex:"99"
			}}
		>
			<div
				style={{
                    background:" linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)",
					// background: "white",
					height: 280,
					width: 280,
					margin: "auto",
					padding: "4%",
					// border: "2px solid #000",
					borderRadius: "8px",
					boxShadow: "2px solid black",
                    display: "flex",
                    flexDirection:"column",
				alignItems: "center",
				justifyContent: "center"
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default Modal;
