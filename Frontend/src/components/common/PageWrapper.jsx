import { Container } from 'react-bootstrap';
import BackButton from './BackButton';

function PageWrapper({ title, showBackButton = true, children }) {
    return (
        <Container className="py-4">
            <div className="d-flex align-items-center mb-4">
                {showBackButton && <BackButton />}
                <h1 className={`${showBackButton ? 'ms-3 mb-0' : 'mb-0'}`}>{title}</h1>
            </div>
            {children}
        </Container>
    );
}

export default PageWrapper;