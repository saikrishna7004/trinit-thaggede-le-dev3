import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer = () => {
    const router = useRouter()

    if (router.pathname.includes('/examInstructions')) {
        return null;
    }

    return (
        <footer>
            <div className="footer">
                <div className="my-4">
                    <Link className='mx-3' href="/" target='_blank'><FontAwesomeIcon style={{height: '2rem'}} icon={faFacebook} /></Link>
                    <Link className='mx-3' href="https://www.instagram.com/saikrishna7004" target='_blank'><FontAwesomeIcon style={{height: '2rem'}} icon={faInstagram} /></Link>
                    <Link className='mx-3' href="/" target='_blank'><FontAwesomeIcon style={{height: '2rem'}} icon={faYoutube} /></Link>
                </div>

                <div className="row mt-4">
                    <ul className='mt-4'>
                        <li><Link href="#">Contact us</Link></li>
                        <li><Link href="#">Our Services</Link></li>
                        <li><Link href="#">Privacy Policy</Link></li>
                        <li><Link href="#">Terms & Conditions</Link></li>
                        <li><Link href="#">Career</Link></li>
                    </ul>
                </div>

                <div className="row">
                    Copyright © 2023 Sai Krishna - All rights reserved || Designed By: Sai Krishna
                </div>
            </div>
        </footer>
    );
};

export default Footer;
