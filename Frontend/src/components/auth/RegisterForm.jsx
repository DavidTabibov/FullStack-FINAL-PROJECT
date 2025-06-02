import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useFormValidation } from '../../hooks/useFormValidation';
import { registerSchema } from '../../utils/validations';
import { useNotifications } from '../../hooks/useNotifications';

function RegisterForm({ onSubmit, isLoading }) {
    const {
        formData,
        errors,
        handleChange,
        handleSubmit
    } = useFormValidation({
        name: { first: '', last: '' },
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { showError } = useNotifications();

    const submitHandler = async (data) => {
        try {
            await onSubmit(data);
        } catch (error) {
            showError('שגיאה בהרשמה', error.message);
            throw error;
        }
    };

    return (
        <Form onSubmit={handleSubmit(submitHandler)} noValidate>
            {errors.submit && (
                <Alert variant="danger" className="mb-3">
                    {errors.submit}
                </Alert>
            )}

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>שם פרטי</Form.Label>
                        <Form.Control
                            type="text"
                            name="name.first"
                            value={formData.name.first}
                            onChange={handleChange}
                            isInvalid={!!errors['name.first']}
                            disabled={isLoading}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors['name.first']}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>שם משפחה</Form.Label>
                        <Form.Control
                            type="text"
                            name="name.last"
                            value={formData.name.last}
                            onChange={handleChange}
                            isInvalid={!!errors['name.last']}
                            disabled={isLoading}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors['name.last']}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

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
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                    לעולם לא נשתף את האימייל שלך עם גורם שלישי
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>סיסמה</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    disabled={isLoading}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    {errors.password}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                    הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, 4 מספרים וסימן מיוחד
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label>אימות סיסמה</Form.Label>
                <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    disabled={isLoading}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isLoading}
                >
                    {isLoading ? 'מבצע הרשמה...' : 'הרשמה'}
                </Button>
            </div>
        </Form>
    );
}

export default RegisterForm;