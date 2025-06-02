import { Card, Row, Col } from 'react-bootstrap';
import { FaUsers, FaUtensils, FaHeart } from 'react-icons/fa';
import { useAdminStats } from '../../hooks/useAdminStats';
import LoadingSpinner from '../common/LoadingSpinner';

function AdminStats() {
    const { stats, loading, error } = useAdminStats();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="alert alert-danger">{error}</div>
        );
    }

    const statCards = [
        {
            title: 'משתמשים רשומים',
            value: stats.usersCount,
            icon: <FaUsers className="text-primary" size={30} />,
            color: 'primary'
        },
        {
            title: 'מתכונים',
            value: stats.recipesCount,
            icon: <FaUtensils className="text-success" size={30} />,
            color: 'success'
        },
        {
            title: 'סה״כ מועדפים',
            value: stats.favoritesCount,
            icon: <FaHeart className="text-danger" size={30} />,
            color: 'danger'
        }
    ];

    return (
        <div>
            <h2 className="mb-4">סטטיסטיקות כלליות</h2>
            <Row>
                {statCards.map((stat, index) => (
                    <Col md={4} key={index} className="mb-4">
                        <Card className="h-100">
                            <Card.Body className="text-center">
                                <div className="mb-3">
                                    {stat.icon}
                                </div>
                                <Card.Title>{stat.title}</Card.Title>
                                <div className={`h2 mb-0 text-${stat.color}`}>
                                    {stat.value}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default AdminStats;