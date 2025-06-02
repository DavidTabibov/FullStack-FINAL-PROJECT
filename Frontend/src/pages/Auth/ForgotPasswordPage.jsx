import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaKey } from 'react-icons/fa';
import { passwordService } from '../../services/password';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const result = await passwordService.requestReset(email);
            setStatus({
                type: 'success',
                message: 'Password reset link has been sent to your email if the account exists'
            });
            setEmail(''); // Clear the form
        } catch (error) {
            setStatus({
                type: 'danger',
                message: error.message || 'An error occurred while sending the reset request. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center my-5">
                <Col md={6}>
                    <Card className="p-4 shadow">
                        <div className="text-center mb-4">
                            <FaKey size={50} className="text-primary mb-2" />
                            <h2>Forgot Password</h2>
                            <p className="text-muted">Enter your email address to reset your password</p>
                        </div>

                        {status.message && (
                            <Alert variant={status.type} className="mb-4">
                                {status.message}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email address"
                                    disabled={isSubmitting}
                                />
                                <Form.Text className="text-muted">
                                    We'll send you a password reset link to this email address
                                </Form.Text>
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ForgotPasswordPage;