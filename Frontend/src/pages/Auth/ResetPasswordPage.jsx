import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { passwordService } from '../../services/password';

function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus({
                type: 'danger',
                message: 'Invalid reset token. Please request a new password reset.'
            });
        }
    }, [token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        // Validation
        if (formData.newPassword.length < 6) {
            setStatus({
                type: 'danger',
                message: 'Password must be at least 6 characters long'
            });
            setIsSubmitting(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({
                type: 'danger',
                message: 'Passwords do not match'
            });
            setIsSubmitting(false);
            return;
        }

        try {
            await passwordService.resetPassword(token, formData.newPassword);
            setStatus({
                type: 'success',
                message: 'Password has been reset successfully! Redirecting to login...'
            });
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setStatus({
                type: 'danger',
                message: error.message || 'Failed to reset password. The link may have expired.'
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
                            <FaLock size={50} className="text-primary mb-2" />
                            <h2>Reset Password</h2>
                            <p className="text-muted">Enter your new password below</p>
                        </div>

                        {status.message && (
                            <Alert variant={status.type} className="mb-4">
                                {status.message}
                            </Alert>
                        )}

                        {token && status.type !== 'success' && (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your new password"
                                            disabled={isSubmitting}
                                            minLength={6}
                                        />
                                        <Button
                                            variant="link"
                                            className="position-absolute end-0 top-0 border-0 bg-transparent"
                                            style={{ zIndex: 10 }}
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isSubmitting}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </div>
                                    <Form.Text className="text-muted">
                                        Password must be at least 6 characters long
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Confirm your new password"
                                            disabled={isSubmitting}
                                            minLength={6}
                                        />
                                        <Button
                                            variant="link"
                                            className="position-absolute end-0 top-0 border-0 bg-transparent"
                                            style={{ zIndex: 10 }}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={isSubmitting}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </div>
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                    </Button>
                                </div>
                            </Form>
                        )}

                        <div className="text-center mt-4">
                            <Link to="/login" className="text-decoration-none">
                                Back to Login
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ResetPasswordPage;