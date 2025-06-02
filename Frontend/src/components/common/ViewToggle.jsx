import { Button, ButtonGroup } from 'react-bootstrap';
import { FaList, FaThLarge } from 'react-icons/fa';

function ViewToggle({ currentView, onViewChange }) {
    return (
        <ButtonGroup className="mb-3">
            <Button
                variant={currentView === 'grid' ? 'primary' : 'outline-primary'}
                onClick={() => onViewChange('grid')}
                title="תצוגת רשת"
            >
                <FaThLarge />
            </Button>
            <Button
                variant={currentView === 'list' ? 'primary' : 'outline-primary'}
                onClick={() => onViewChange('list')}
                title="תצוגת רשימה"
            >
                <FaList />
            </Button>
        </ButtonGroup>
    );
}

export default ViewToggle;