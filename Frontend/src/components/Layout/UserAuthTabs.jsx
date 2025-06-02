import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaHeart, FaCog } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

function UserAuthTabs() {
    const { user } = useAuth();
    const location = useLocation();

    return (
        <Nav className="me-auto" variant="pills">
            {user && (
                <>
                    <Nav.Item>
                        <Nav.Link
                            as={Link}
                            to="/profile"
                            active={location.pathname === '/profile'}
                        >
                            <FaUser className="me-1" />
                            {user.name.first}
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            as={Link}
                            to="/favorites"
                            active={location.pathname === '/favorites'}
                        >
                            <FaHeart className="me-1" />
                            מועדפים
                        </Nav.Link>
                    </Nav.Item>
                    {user.isAdmin && (
                        <Nav.Item>
                            <Nav.Link
                                as={Link}
                                to="/admin"
                                active={location.pathname === '/admin'}
                            >
                                <FaCog className="me-1" />
                                ניהול
                            </Nav.Link>
                        </Nav.Item>
                    )}
                </>
            )}
        </Nav>
    );
}

export default UserAuthTabs;