import { getSession, signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import LoadingBar from 'react-top-loading-bar';
import Swal from 'sweetalert2';

const Login = ({login}) => {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState('');
    const { data: session, status } = useSession()
    const router = useRouter()
    const next = router.query.next
    const [progress, setProgress] = useState(0);


    useEffect(() => {
        if(login) router.push('/')
    }, [login, router])
    
    if(login) return <></>


    const handleSubmit = async e => {
        e.preventDefault();
        console.log(router.query.next)
        setProgress(30)
        const res = await signIn('credentials', {
            redirect: false,
            username, password,
            callbackUrl: next
        })
        setProgress(70)
        if(!res.ok){
            console.log(res.error)
            if(res.error=='CredentialsSignin')
                Swal.fire("Invalid", "Invalid Username or Password", 'error')
        }
        else{
            router.push(next)
        }
        setProgress(100)
    };

    return <>
            <Head>
                <title>Login - Resurse</title>
            </Head>
        	<LoadingBar color="#0f0" progress={progress} waitingTime={400} onLoaderFinished={() => {setProgress(0);}}/>
            <div className="container my-4 h-100">
            <main className="form-signin text-center">
                <form onSubmit={handleSubmit}>
                    <Image className="mb-4" src='/logo.png' alt="Logo" width={150} height={150} />
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                    <div className="form-floating my-2">
                        <input type="text" name="username" className="form-control" id="username" placeholder="Username" value={username} onChange={e => setusername(e.target.value)} autoComplete="username" />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="form-floating my-2">
                        <input type="password" name="password" className="form-control" id="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                        <label htmlFor="password">Password</label>
                    </div>

                    <div className="checkbox mb-3">
                        <label>
                            <input type="checkbox" name="rememberme" value={remember} onChange={(e)=>setRemember(!remember)} /> Remember me
                        </label>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                    {error && <p>{error}</p>}
                    <p className="mt-3 mb-3 text-muted">&copy; 2023-2024</p>
                </form>
            </main>
        </div>
    </>
}

export default Login

export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
        props: {
            login: session ? true : false
        }
    }
}