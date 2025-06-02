import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useNotifications } from '../../hooks/useNotifications';
import { FaLock } from 'react-icons/fa';

function ResetPasswordForm({ onSubmit, isLoading, token }) {
    const {
        formData,
        errors,
        handleChange,
        handleSubmit
    } = useFormValidation({
        password: '',
        confirmPassword: ''
    });

    const { showSuccess, showError } = useNotifications();

    const submitHandler = async (data) => {
        try {
            await onSubmit({ ...data, token });
            showSuccess('הסיסמה שונתה בהצלחה!', 'מעביר אותך לדף ההתחברות...');
        } catch (error) {
            showError('שגיאה בשינוי הסיסמה', error.message);
            throw error;
        }
    };

    return (
        <Card className="p-4 shadow-sm">
            <Form onSubmit={handleSubmit(submitHandler)} noValidate>
                <div className="text-center mb-4">
                    <FaLock size={50} className="text-primary mb-2" />
                    <h2>איפוס סיסמה</h2>
                    <p className="text-muted">הזן את הסיסמה החדשה שלך</p>
                </div>

                {errors.submit && (
                    <Alert variant="danger" className="mb-3">
                        {errors.submit}
                    </Alert>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>סיסמה חדשה</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        disabled={isLoading}
                        required
                        autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, 4 מספרים וסימן מיוחד
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>אימות סיסמה חדשה</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        disabled={isLoading}
                        required
                        autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? 'מעדכן סיסמה...' : 'עדכן סיסמה'}
                    </Button>

                    <div className="text-center mt-3">
                        <Link to="/login" className="text-decoration-none">
                            חזרה להתחברות
                        </Link>
                    </div>
                </div>
            </Form>
        </Card>
    );
}

export default ResetPasswordForm;