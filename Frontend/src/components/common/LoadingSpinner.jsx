import { Spinner } from 'react-bootstrap';

function LoadingSpinner({ size = 'md', variant = 'primary', text = 'טוען...' }) {
    return (
        <div className="text-center p-3">
            <Spinner
                animation="border"
                variant={variant}
                size={size}
                role="status"
            >
                <span className="visually-hidden">{text}</span>
            </Spinner>
        </div>
    );
}

export default LoadingSpinner;