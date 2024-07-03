import AOS from 'aos';
import { useContext, useEffect, useRef, useState } from 'react';
import { GameInfoContext } from '../helpers/context';
import { useGetGameInfoQuery } from '../services';
import { useGetUserByTgIdQuery } from '../services/phpService';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import MainContent from './MainContent/MainContent';
import DynamicScreen from './Screens/DynamicScreen/DynamicScreen';
import TelegramLinking from './Screens/QRcode/QRcode';
import Preloader from './Preloader/Preloader';

const MainComponent = () => {
	const tg = window.Telegram.WebApp;
	const userId = tg.initDataUnsafe?.user?.id;
	const [skip, setSkip] = useState(true);
	const { data: user } = useGetUserByTgIdQuery(userId, {
		skip: skip,
		pollingInterval: 10000,
	});

	const [preloaderLoaded, setPreloaderLoaded] = useState(false);
	const imagesRef = useRef([]);

	const { updateState } = useContext(GameInfoContext);
	const { data, isLoading, isError } = useGetGameInfoQuery();

	// Change the variant based on current state
	// 'error' | 'maintenance' | 'comingSoon'
	const [variant, setVariant] = useState('error');
	useEffect(() => {
		setVariant('error');
	}, []);

	// useEffect(() => {
	// 	if (!isLoading && data) {
	// 		updateState(data);
	// 	}
	// }, [isLoading, data, updateState]);

	useEffect(() => {
		const loadImage = (src) => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.src = src;
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
			});
		};

		const imageSources = [
			// images that loading with promise
		];

		const loadImages = async () => {
			const promises = imageSources.map((src) => loadImage(src));

			try {
				const loadedImages = await Promise.all(promises);
				imagesRef.current = loadedImages;
				checkAllLoaded();
			} catch (e) {
				console.log('problem loading images');
			}
		};

		const checkAllLoaded = () => {
			if (!isLoading && data && imagesRef.current.length === imageSources.length) {
				setTimeout(() => {
					setPreloaderLoaded(true);
					AOS.init({
						easing: 'custom',
					});
				}, 500);
			}
		};
		loadImages();
	}, [isLoading, data]);

	useEffect(() => {
		if (tg && userId) {
			setSkip(false);
		}
	}, [tg, userId]);

	// Detecting if the application is opened from a mobile device
	const isMobileDevice =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

	return (
		<>
			<>
				{!isMobileDevice ? (
					<TelegramLinking />
				) : (
					<>
						{/* <Preloader loaded={preloaderLoaded} /> */}
						{user ? (
							<>
								<Header user={user} />
								<main id='main' className='main'>
									<MainContent user={user} />
								</main>
								<Footer user={user} />
							</>
						) : (
							<Preloader />
							// <DynamicScreen variant={variant} />
						)}
					</>
				)}
			</>
		</>
	);
};

export default MainComponent;
