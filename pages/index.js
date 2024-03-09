import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
	return (
		<div>
			<Head>
				<title>Quizzer - The Quiz Site</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className='my-5'>
				<section className="hero text-center d-flex align-items-center" style={{minHeight: '65vh', marginBottom: '20vh', marginTop: '10vh'}}>
					<div className="container">
						<Image className="mb-4" src='/logo.png' alt="Logo" width={200} height={200} />
						<h1>Welcome to Quizzer - The Quiz Site</h1>
						<p>Empowering students to explore, innovate, and excel in technology.</p>
						Follow us on <Link href="https://www.instagram.com/saikrishna7004" target="_blank" rel="noopener noreferrer" className='url'>
							Instagram
						</Link>
					</div>
				</section>

			</main>
		</div>
	);
}
