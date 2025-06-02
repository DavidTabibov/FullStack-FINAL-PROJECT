function SkipLink() {
    return (
        <a
            href="#main-content"
            className="visually-hidden-focusable"
            style={{
                position: 'absolute',
                padding: '0.5rem',
                backgroundColor: '#fff',
                zIndex: 1050
            }}
        >
            דלג לתוכן הראשי
        </a>
    );
}

export default SkipLink;