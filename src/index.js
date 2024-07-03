import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GameInfoProvider } from './helpers/contextProvider';
import './index.scss';
// import TechBreak from './techBreak';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
		<GameInfoProvider>
			<App />
			{/* <TechBreak /> */}
		</GameInfoProvider>
);
