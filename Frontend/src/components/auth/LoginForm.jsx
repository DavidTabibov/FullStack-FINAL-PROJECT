import { Form, Button, Alert } from 'react-bootstrap';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useNotifications } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';

function LoginForm({ onSubmit, isLoading }) {
    const {
        formData,
        errors,
        handleChange,
        handleSubmit
    } = useFormValidation({
        email: '',
        password: ''
    });

    const { showError } = useNotifications();

    const submitHandler = async (data) => {
        try {
            await onSubmit(data);
        } catch (error) {
            showError('שגיאה בהתחברות', error.message);
            throw error;
        }
    };

    return (
        <Form onSubmit={handleSubmit(submitHandler)} noValidate className="card p-4 shadow-sm">
            <h2 className="text-center mb-4">התחברות</h2>

            {errors.submit && (
                <Alert variant="danger" className="mb-3">
                    {errors.submit}
                </Alert>
            )}

            <Form.Group className="mb-3">
                <Form.Label>אימייל</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    disabled={isLoading}
                    required
                    autoComplete="username"
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <Form.Label>סיסמה</Form.Label>
                    <Link
                        to="/forgot-password"
                        className="text-decoration-none small"
                        tabIndex={-1}
                    >
                        שכחת סיסמה?
                    </Link>
                </div>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    disabled={isLoading}
                    required
                    autoComplete="current-password"
                />
                <Form.Control.Feedback type="invalid">
                    {errors.password}
                </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isLoading}
                >
                    {isLoading ? 'מתחבר...' : 'התחברות'}
                </Button>

                <div className="text-center mt-3">
                    <span className="text-muted">עדיין אין לך חשבון? </span>
                    <Link to="/register" className="text-decoration-none">
                        הירשם עכשיו
                    </Link>
                </div>
            </div>
        </Form>
    );
}

export default LoginForm;