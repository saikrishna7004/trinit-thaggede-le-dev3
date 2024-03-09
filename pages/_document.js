import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<meta name="description" content="Official Website for Quizzer - The Quiz Site" />
					<link rel="manifest" href="/manifest.json" />
					<link rel="apple-touch-icon" href="/logo.png"></link>
					<meta name="theme-color" content="#333" />
					<script dangerouslySetInnerHTML={{
						__html: "\
							if ('serviceWorker' in navigator) {\
								window.addEventListener('load', () => {\
								navigator.serviceWorker.register(location.origin+'/service-worker.js');\
								});\
							}\
						"}} 
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;