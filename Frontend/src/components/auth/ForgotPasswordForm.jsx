import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useNotifications } from '../../hooks/useNotifications';
import { FaKey } from 'react-icons/fa';

function ForgotPasswordForm({ onSubmit, isLoading }) {
    const {
        formData,
        errors,
        handleChange,
        handleSubmit,
        resetForm
    } = useFormValidation({
        email: ''
    });

    const { showSuccess, showError } = useNotifications();

    const submitHandler = async (data) => {
        try {
            await onSubmit(data);
            showSuccess(
                'נשלח בהצלחה!',
                'אם האימייל קיים במערכת, ישלח אליך קישור לאיפוס סיסמה'
            );
            resetForm();
        } catch (error) {
            showError('שגיאה בשליחת הבקשה', error.message);
            throw error;
        }
    };

    return (
        <Card className="p-4 shadow-sm">
            <Form onSubmit={handleSubmit(submitHandler)} noValidate>
                <div className="text-center mb-4">
                    <FaKey size={50} className="text-primary mb-2" />
                    <h2>שחזור סיסמה</h2>
                    <p className="text-muted">
                        הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה
                    </p>
                </div>

                {errors.submit && (
                    <Alert variant="danger" className="mb-3">
                        {errors.submit}
                    </Alert>
                )}

                <Form.Group className="mb-4">
                    <Form.Label>אימייל</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        disabled={isLoading}
                        required
                        autoComplete="email"
                        placeholder="הכנס את כתובת האימייל שלך"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        נשלח לך קישור לאיפוס הסיסמה לכתובת זו
                    </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? 'שולח...' : 'שלח קישור לאיפוס סיסמה'}
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

export default ForgotPasswordForm;