import { SessionProvider } from 'next-auth/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'next/router'
import LoadingBar from 'react-top-loading-bar'
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps }) {
	const [progress, setProgress] = useState(0);
	const router = useRouter();

	useEffect(() => {
		router.events.on("routeChangeStart", () => {
			setProgress(40);
		});

		router.events.on("routeChangeComplete", () => {
			setProgress(100);
		});
	}, [router.events]);

	return (
		<SessionProvider session={pageProps.session}>
			<Navbar />
			<LoadingBar color="#0f0" progress={progress} waitingTime={400} onLoaderFinished={() => {setProgress(0);}}/>
			<Component {...pageProps} />
			<Footer />
		</SessionProvider>
	)
}

export default MyApp
