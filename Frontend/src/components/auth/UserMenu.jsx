import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUser, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useAuthActions } from '../../hooks/useAuthActions';

function UserMenu() {
    const { user, isAdmin } = useAuth();
    const { handleLogout } = useAuthActions();

    return (
        <NavDropdown
            title={
                <span>
                    <FaUser className="me-1" />
                    {user.name.first}
                </span>
            }
            align="end"
        >
            <NavDropdown.Item as={Link} to="/profile">
                <FaUser className="me-2" />
                פרופיל
            </NavDropdown.Item>

            <NavDropdown.Item as={Link} to="/favorites">
                <FaHeart className="me-2" />
                מועדפים
            </NavDropdown.Item>

            {isAdmin && (
                <NavDropdown.Item as={Link} to="/admin">
                    <FaCog className="me-2" />
                    ניהול
                </NavDropdown.Item>
            )}

            <NavDropdown.Divider />

            <NavDropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                התנתק
            </NavDropdown.Item>
        </NavDropdown>
    );
}

export default UserMenu;