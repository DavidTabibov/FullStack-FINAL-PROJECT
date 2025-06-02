// src/pages/About/AboutPage.jsx
import React from 'react';
import OptimizedImage from '../../components/common/OptimizedImage';

const AboutPage = () => {
  const values = [
    {
      icon: 'bi-star-fill',
      iconBg: 'bg-warning',
      title: 'Premium Quality',
      description: 'We source only the finest materials and work with skilled artisans to create exceptional pieces.'
    },
    {
      icon: 'bi-recycle',
      iconBg: 'bg-success',
      title: 'Sustainability',
      description: 'Committed to ethical fashion practices and environmentally responsible production methods.'
    },
    {
      icon: 'bi-people-fill',
      iconBg: 'bg-primary',
      title: 'Community',
      description: 'Building a global community of fashion lovers who appreciate style, quality, and authenticity.'
    },
    {
      icon: 'bi-lightbulb-fill',
      iconBg: 'bg-info',
      title: 'Innovation',
      description: 'Constantly pushing boundaries in design while honoring timeless fashion principles.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      bio: '15+ years in luxury fashion, former designer at leading fashion houses.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Award-winning designer specializing in contemporary menswear and accessories.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Sustainability Officer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      bio: 'Environmental scientist dedicated to sustainable fashion practices.'
    }
  ];

  return (
    <div className="min-vh-100 bg-white">
      {/* Hero Section */}
      <section className="position-relative hero-gradient text-white py-5 py-lg-6 overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            alt="Luxurious fashion boutique interior"
            className="w-100 h-100 object-cover opacity-25"
            width={1920}
            height={1080}
            sizes="100vw"
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8))'}}></div>
        </div>
        
        <div className="position-relative container text-center py-5 py-lg-6" style={{zIndex: 10}}>
          <h1 className="display-2 display-lg-1 fw-bold mb-4 mb-lg-5 animate-fade-in">
            <span className="text-warning">
              Our Story
            </span>
          </h1>
          <p className="fs-5 fs-lg-4 mb-0 text-light px-3 px-lg-0 mx-auto" style={{maxWidth: '800px'}}>
            Founded in 2018, Luxe Boutique represents the pinnacle of contemporary fashion. 
            We believe that exceptional style should be accessible, sustainable, and timeless.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-5 py-lg-6 bg-light">
        <div className="container py-4 py-lg-5">
          <div className="row g-4 g-lg-5 align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="pe-lg-4">
                <h2 className="display-5 display-lg-4 fw-bold mb-4 mb-lg-5 text-primary text-center text-lg-start">
                  Where Fashion Meets Purpose
                </h2>
                <div className="text-muted text-center text-lg-start">
                  <p className="fs-6 fs-lg-5 mb-4 mb-lg-5 lh-lg">
                    What started as a small boutique in downtown has grown into a global destination 
                    for fashion enthusiasts who refuse to compromise on quality or ethics.
                  </p>
                  <p className="fs-6 fs-lg-5 mb-4 mb-lg-5 lh-lg">
                    Our journey began with a simple belief: fashion should tell a story. Every piece 
                    in our collection is carefully curated to represent not just style, but the values 
                    and craftsmanship of the artisans who create them.
                  </p>
                  <p className="fs-6 fs-lg-5 mb-0 lh-lg">
                    Today, we're proud to work with sustainable suppliers and emerging designers who 
                    share our vision of responsible luxury fashion.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2">
              <div className="position-relative text-center ps-lg-4">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43"
                  alt="Fashion designer at work"
                  className="w-100 rounded-4 shadow-lg"
                  style={{maxWidth: '500px'}}
                  width={600}
                  height={800}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 py-lg-6 bg-white">
        <div className="container py-4 py-lg-5">
          <div className="text-center mb-5 mb-lg-6">
            <h2 className="display-5 display-lg-4 fw-bold mb-4 text-primary">
              Our Core Values
            </h2>
            <p className="fs-6 fs-lg-5 text-muted px-3 px-lg-0 mx-auto" style={{maxWidth: '600px'}}>
              These principles guide everything we do, from design to delivery
            </p>
          </div>
          
          <div className="row g-4 g-lg-5">
            {values.map((value, index) => (
              <div
                key={index}
                className="col-sm-6 col-lg-3"
              >
                <div className="card border-0 shadow-sm h-100 card-hover text-center p-4 p-lg-5">
                  <div className="card-body p-0">
                    <div className={`rounded-circle ${value.iconBg} d-inline-flex align-items-center justify-content-center mb-4 mb-lg-5`} style={{width: '80px', height: '80px'}}>
                      <i className={`${value.icon} fs-2 text-white`}></i>
                    </div>
                    <h3 className="h4 fw-bold mb-3 mb-lg-4 text-dark">{value.title}</h3>
                    <p className="text-muted mb-0 lh-lg">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Fixed for Mobile */}
      <section className="py-5 py-lg-6 bg-light">
        <div className="container py-4 py-lg-5">
          <div className="text-center mb-5 mb-lg-6">
            <h2 className="display-5 display-lg-4 fw-bold mb-4 text-primary">
              Meet Our Team
            </h2>
            <p className="fs-6 fs-lg-5 text-muted px-3 px-lg-0 mx-auto" style={{maxWidth: '600px'}}>
              The creative minds behind Luxe Boutique's exceptional collections
            </p>
          </div>
          
          <div className="row g-4 g-lg-5 justify-content-center">
            {team.map((member, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-lg-4"
              >
                <div className="text-center px-2 px-lg-3">
                  <div className="mb-4 mb-lg-5 d-flex justify-content-center">
                    <OptimizedImage
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      className="rounded-circle shadow-lg border border-3 border-white"
                      width={200}
                      height={200}
                      sizes="200px"
                      style={{width: '200px', height: '200px', objectFit: 'cover'}}
                    />
                  </div>
                  <h3 className="h4 fw-bold mb-2 mb-lg-3 text-dark">{member.name}</h3>
                  <p className="text-primary fw-semibold mb-3 mb-lg-4">{member.role}</p>
                  <p className="text-muted px-2 lh-lg mb-0">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-5 py-lg-6 hero-gradient text-white">
        <div className="container py-4 py-lg-5 text-center">
          <h2 className="display-4 display-lg-3 fw-bold mb-4 mb-lg-5">
            <span className="text-warning">Fashion Forward,</span>
            <span className="d-block text-white">Values Driven</span>
          </h2>
          <p className="fs-6 fs-lg-4 mb-5 mb-lg-6 text-light px-3 px-lg-0 mx-auto lh-lg" style={{maxWidth: '800px'}}>
            Our mission is to democratize luxury fashion while maintaining the highest standards 
            of quality, sustainability, and ethical practices.
          </p>
          
          <div className="row g-4 g-lg-5 text-center">
            <div className="col-12 col-md-4">
              <div className="display-5 display-lg-4 fw-bold text-warning mb-3">10K+</div>
              <p className="fs-6 fs-lg-5 text-light mb-0">Happy Customers</p>
            </div>
            <div className="col-12 col-md-4">
              <div className="display-5 display-lg-4 fw-bold text-warning mb-3">500+</div>
              <p className="fs-6 fs-lg-5 text-light mb-0">Unique Designs</p>
            </div>
            <div className="col-12 col-md-4">
              <div className="display-5 display-lg-4 fw-bold text-warning mb-3">50+</div>
              <p className="fs-6 fs-lg-5 text-light mb-0">Partner Brands</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 py-lg-6 bg-white">
        <div className="container py-4 py-lg-5 text-center">
          <h2 className="display-6 display-lg-5 fw-bold mb-4 mb-lg-5 text-primary">
            Ready to Join Our Fashion Journey?
          </h2>
          <p className="fs-6 fs-lg-5 text-muted mb-4 mb-lg-5 px-3 px-lg-0 mx-auto lh-lg" style={{maxWidth: '600px'}}>
            Discover our latest collections and become part of the Luxe Boutique community
          </p>
          <div className="d-flex gap-3 gap-lg-4 justify-content-center flex-column flex-sm-row">
            <a href="/products" className="btn btn-primary btn-lg px-4 px-lg-5 py-3">
              <i className="bi bi-bag me-2"></i>
              Shop Now
            </a>
            <a href="/contact" className="btn btn-outline-primary btn-lg px-4 px-lg-5 py-3">
              <i className="bi bi-envelope me-2"></i>
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
