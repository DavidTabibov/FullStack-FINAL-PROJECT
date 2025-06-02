import { useState } from 'react';
import { useChangePassword } from '../../hooks/useChangePassword';

function ChangePassword() {
    const { changePassword, loading, error } = useChangePassword();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return;
        }

        const success = await changePassword(formData);
        if (success) {
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    };

    return (
        <div className="card mt-4">
            <div className="card-header gradient-bg text-white">
                <h2 className="h5 mb-0">Change Password</h2>
            </div>

            <div className="card-body">
                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                currentPassword: e.target.value
                            }))}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={formData.newPassword}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                newPassword: e.target.value
                            }))}
                            required
                        />
                        <div className="form-text">
                            Password must contain at least 8 characters, uppercase letter, lowercase letter, 4 numbers and special character
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            className={`form-control ${formData.newPassword !== formData.confirmPassword && formData.confirmPassword ? 'is-invalid' : ''}`}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                confirmPassword: e.target.value
                            }))}
                            required
                        />
                        {formData.newPassword !== formData.confirmPassword && formData.confirmPassword && (
                            <div className="invalid-feedback">
                                Passwords do not match
                            </div>
                        )}
                    </div>

                    <div className="d-grid">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || formData.newPassword !== formData.confirmPassword}
                        >
                            {loading ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;