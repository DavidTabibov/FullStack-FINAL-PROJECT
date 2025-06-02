import { Spinner } from 'react-bootstrap';

function LoadingOverlay({ text = 'טוען...' }) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999
            }}
        >
            <div className="bg-white p-4 rounded shadow text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 mb-0">{text}</p>
            </div>
        </div>
    );
}

export default LoadingOverlay;