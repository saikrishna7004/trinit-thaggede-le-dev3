import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const NavLink = ({ className, children, href, ...props }) => {
	const router = useRouter();
	const currentPath = router.pathname;
	const isActive = currentPath === href || (href === '/' ? currentPath === '' : currentPath.startsWith(href));

	return (
		<Link href={href} className={`${className} ${isActive ? 'active' : ''}`} {...props}>
			{children}
		</Link>
	);
};

export default NavLink;
