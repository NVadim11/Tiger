import React from 'react';
import preloaderBG from '../../img/background_mobile.webp';
import './Preloader.scss'; // Import the CSS file for styling

const Preloader = () => {
	return (
		<div
			className='preloader'
			style={{
				background: `url(${preloaderBG}) no-repeat center center/cover`,
			}}
		>
			<div className='preloaderText'>
				<h4>TIGER TRADE</h4>
			</div>
		</div>
	);
};

export default Preloader;
