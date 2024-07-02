import React from 'react';
import errorBG from '../../../img/back1.webp';
import maintenanceBG from '../../../img/back2.webp';
import comingSoonBG from '../../../img/back3.webp';
import './DynamicScreen.scss'; // Import the CSS file for styling

const DynamicScreen = ({ variant }) => {
	// Define the different backgrounds and texts
	const variants = {
		error: {
			background: errorBG,
			text: 'Something went wrong',
		},
		maintenance: {
			background: maintenanceBG,
			text: 'Repairs and upgrades are underway',
		},
		comingSoon: {
			background: comingSoonBG,
			text: 'Coming Soon',
		},
	};

	// Default to variant1 if an unknown variant is passed
	const { background, text } = variants[variant] || variants.error;

	return (
		<div className={`component-container ${background}`}>
			<h4>{text}</h4>
		</div>
	);
};

export default DynamicScreen;
