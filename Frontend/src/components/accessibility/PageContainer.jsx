function PageContainer({ title, children }) {
    // עדכון כותרת הדף
    document.title = `${title} | Fashion Store`;

    return (
        <div role="main" aria-label={title}>
            <h1 className="visually-hidden">{title}</h1>
            {children}
        </div>
    );
}

export default PageContainer;