import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

function BackButton() {
    const navigate = useNavigate();

    return (
        <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
            className="mb-3"
            aria-label="חזור לדף הקודם"
        >
            <FaArrowRight className="me-1" />
            חזרה
        </Button>
    );
}

export default BackButton;