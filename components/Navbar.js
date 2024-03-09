import 'bootstrap/dist/css/bootstrap.min.css'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react';
import NavLink from './navlink';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {

    useEffect(() => {
        require("bootstrap/js/dist/collapse");
    }, []);

    const router = useRouter()
    const { data: session, status } = useSession()
    const [searchText, setSearchText] = useState('')
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const suggestionListRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault()
        setSearchText('')
        setAutocompleteResults([])
        setShowSuggestions(true)
        router.push(`/blog/search?q=${searchText}`)
    }

    const handleKeyDown = (e) => {
        if (e.key == 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (e.key == 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion((prevIndex) => Math.min(prevIndex + 1, autocompleteResults.length - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeSuggestion == -1) {
                handleSearch(e)
                setSearchText('')
                setShowSuggestions(false)
                setAutocompleteResults([])
                return
            }
            handleSuggession(e, autocompleteResults[activeSuggestion]);
        }
    };

    const handleSearchTermChange = (event) => {
        const { value } = event.target;
        setSearchText(value);
        setActiveSuggestion(-1)
        if (!value || (value == '')) {
            setAutocompleteResults([])
            setShowSuggestions(false)
            return
        }
        fetch(`/api/blog/autocomplete?term=${value}`)
            .then((response) => response.json())
            .then((data) => {
                setAutocompleteResults(data);
                setShowSuggestions(data.length > 0);
            })
            .catch((error) => console.error('Error fetching autocomplete results:', error));
    };

    const handleSuggession = (e, result) => {
        if (!result) return
        router.push(`/blog/${result.slug}`)
        setSearchText('')
        setShowSuggestions(false)
        setAutocompleteResults([])
    }

    useEffect(() => {
        if (suggestionListRef.current) {
            const suggestionItem = suggestionListRef.current.querySelector(`.autocomplete-suggestion:nth-child(${activeSuggestion + 1})`);
            if (suggestionItem) {
                suggestionItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [activeSuggestion]);

    if (router.pathname.includes('/examInstructions')) {
        return null;
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg text-white bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/">Quizzer</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" href="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" href="/quiz">Quizzes</NavLink>
                            </li>
                            {session && session.user && <>
                            {<li className="nav-item">
                                <NavLink className="nav-link" href="/your-quiz">Your Quizzes</NavLink>
                            </li>}
                            <li className="nav-item">
                                <NavLink className="nav-link" href="/results">Results</NavLink>
                            </li>
                            </>}
                            {session && session.user && session.user.type == "admin" && <li className="nav-item">
                                <NavLink className="nav-link" href="/upload">Upload QP</NavLink>
                            </li>}
                            {status != "loading" && !session && <li className="nav-item">
                                <NavLink className="nav-link" href={(router.asPath.indexOf('/login') > -1) ? router.asPath : ("/login?next=" + router.asPath)}>Login</NavLink>
                            </li>}
                            {session && <li className="nav-item">
                                <NavLink className="nav-link" href="/api/auth/signout" onClick={(e) => {
                                    e.preventDefault()
                                    signOut({ redirect: false })
                                }}>Logout</NavLink>
                            </li>}
                        </ul>
                        <div className='me-4' onClick={() => router.push('/u/' + session?.user.username)} style={{ cursor: 'pointer' }}>
                            {session?.user.firstName} {session?.user.lastName}
                        </div>
                    </div>
                    {/* <form className="d-flex me-2" onSubmit={handleSearch}>
                        <input className="form-control search-input me-1" type="search" value={searchText} onChange={handleSearchTermChange} placeholder="Search" aria-label="Search" onKeyDown={handleKeyDown} />
                        <button className="btn btn-primary" type='submit'><FontAwesomeIcon icon={faSearch} className="search-icon" style={{verticalAlign: '-0.125em', height: '16px'}} /></button>
                        {showSuggestions && (
                            <ul className="autocomplete-suggestions" ref={suggestionListRef}>
                                {autocompleteResults.map((result, index) => (
                                    <li className={`autocomplete-suggestion${index === activeSuggestion ? ' active' : ''}`} key={result._id} onClick={(e) => handleSuggession(e, result)}>
                                        {result.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form> */}
                </div>
            </nav>
        </>
    )
}

export default Navbar