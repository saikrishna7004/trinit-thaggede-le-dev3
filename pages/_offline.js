import Head from 'next/head';

const OfflinePage = () => {
    return (
        <div className="container">
            <Head>
                <title>Offline - Quizzer</title>
            </Head>
            <div className="jumbotron text-center">
                <h1 className="display-4">Offline</h1>
                <p className="lead">You are currently offline.</p>
                <p>Please check your internet connection and try again.</p>
            </div>
        </div>
    );
};

export default OfflinePage;
