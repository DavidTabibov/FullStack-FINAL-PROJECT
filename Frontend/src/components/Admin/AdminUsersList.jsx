// src/pages/Admin/AdminUsersList.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

function AdminUsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        isAdmin: false
    });

    const { isAuthenticated, isAdmin } = useAuth();
    const { showSuccess, showError } = useNotifications();

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            showError('אין לך הרשאות גישה לדף זה');
            return;
        }

        fetchUsers();
    }, [isAuthenticated, isAdmin]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users');
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('שגיאה בטעינת המשתמשים');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditFormData({
            firstName: user.name?.first || '',
            lastName: user.name?.last || '',
            email: user.email || '',
            isAdmin: user.isAdmin || false
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditSubmit = async () => {
        try {
            const updatedUser = {
                name: {
                    first: editFormData.firstName,
                    last: editFormData.lastName
                },
                email: editFormData.email,
                isAdmin: editFormData.isAdmin
            };

            await axios.put(`/api/users/${selectedUser._id}`, updatedUser);
            showSuccess('המשתמש עודכן בהצלחה');
            setShowEditModal(false);
            fetchUsers(); // רענון רשימת המשתמשים
        } catch (error) {
            console.error('Error updating user:', error);
            showError('שגיאה בעדכון המשתמש');
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            await axios.delete(`/api/users/${selectedUser._id}`);
            showSuccess('המשתמש נמחק בהצלחה');
            setShowDeleteModal(false);
            fetchUsers(); // רענון רשימת המשתמשים
        } catch (error) {
            console.error('Error deleting user:', error);
            showError('שגיאה במחיקת המשתמש');
        }
    };

    if (loading) {
        return (
            <Container className="py-4 text-center">
                <h2 className="mb-4">ניהול משתמשים</h2>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">טוען...</span>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-4">
                <h2 className="mb-4">ניהול משתמשים</h2>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4">ניהול משתמשים</h2>
            {users.length === 0 ? (
                <Alert variant="info">לא נמצאו משתמשים במערכת</Alert>
            ) : (
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>שם מלא</th>
                            <th>אימייל</th>
                            <th>סוג משתמש</th>
                            <th>תאריך הרשמה</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{`${user.name?.first || ''} ${user.name?.last || ''}`}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.isAdmin ? (
                                        <Badge bg="danger">מנהל מערכת <FaUserShield /></Badge>
                                    ) : (
                                        <Badge bg="secondary">משתמש רגיל <FaUser /></Badge>
                                    )}
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString('he-IL')}</td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        <FaEdit /> עריכה
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteClick(user)}
                                    >
                                        <FaTrash /> מחיקה
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal לעריכת משתמש */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>עריכת משתמש</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>שם פרטי</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={editFormData.firstName}
                                onChange={handleEditFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>שם משפחה</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={editFormData.lastName}
                                onChange={handleEditFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>אימייל</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleEditFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="isAdmin"
                                label="הרשאות מנהל מערכת"
                                checked={editFormData.isAdmin}
                                onChange={handleEditFormChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        ביטול
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        שמור שינויים
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal לאישור מחיקה */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>אישור מחיקת משתמש</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    האם אתה בטוח שברצונך למחוק את המשתמש {selectedUser?.name?.first} {selectedUser?.name?.last}?
                    <Alert variant="warning" className="mt-3">
                        פעולה זו אינה ניתנת לביטול!
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        ביטול
                    </Button>
                    <Button variant="danger" onClick={handleDeleteSubmit}>
                        מחק משתמש
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminUsersList;