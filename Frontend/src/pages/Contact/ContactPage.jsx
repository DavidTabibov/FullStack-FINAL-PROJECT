import React, { useState } from 'react';
import OptimizedImage from '../../components/common/OptimizedImage';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: 'bi-geo-alt-fill',
      iconBg: 'bg-primary',
      title: 'Visit Our Store',
      details: ['123 Fashion Avenue', 'New York, NY 10001', 'United States']
    },
    {
      icon: 'bi-telephone-fill',
      iconBg: 'bg-success',
      title: 'Call Us',
      details: ['+1 (555) 123-4567', 'Mon-Fri: 9AM-8PM', 'Sat-Sun: 10AM-6PM']
    },
    {
      icon: 'bi-envelope-fill',
      iconBg: 'bg-warning',
      title: 'Email Us',
      details: ['hello@luxeboutique.com', 'support@luxeboutique.com', 'We reply within 24 hours']
    },
    {
      icon: 'bi-chat-dots-fill',
      iconBg: 'bg-info',
      title: 'Live Chat',
      details: ['Available on our website', 'Mon-Fri: 9AM-6PM', 'Instant support']
    }
  ];

  return (
    <div className="min-vh-100 bg-white">
      {/* Hero Section */}
      <section className="position-relative hero-gradient text-white py-5 py-lg-6 overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
            alt="Elegant customer service representative"
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
              Get in Touch
            </span>
          </h1>
          <p className="fs-5 fs-lg-4 mb-0 text-light px-3 px-lg-0 mx-auto lh-lg" style={{maxWidth: '800px'}}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-5 py-lg-6 bg-light">
        <div className="container py-4 py-lg-5">
          <div className="text-center mb-5 mb-lg-6">
            <h2 className="display-5 display-lg-4 fw-bold mb-4 text-primary">
              How to Reach Us
            </h2>
            <p className="fs-6 fs-lg-5 text-muted mx-auto" style={{maxWidth: '600px'}}>
              Multiple ways to connect with our team
            </p>
          </div>
          
          <div className="row g-4 g-lg-5">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="col-sm-6 col-lg-3"
              >
                <div className="card border-0 shadow-sm h-100 card-hover text-center p-4 p-lg-5">
                  <div className="card-body p-0">
                    <div className={`rounded-circle ${info.iconBg} d-inline-flex align-items-center justify-content-center mb-4 mb-lg-5`} style={{width: '80px', height: '80px'}}>
                      <i className={`${info.icon} fs-2 text-white`}></i>
                    </div>
                    <h3 className="h4 fw-bold mb-3 mb-lg-4 text-dark">{info.title}</h3>
                    <div>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted mb-2 lh-lg">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-5 py-lg-6 bg-white">
        <div className="container py-4 py-lg-5">
          <div className="row g-5 g-lg-6 align-items-start">
            {/* Form */}
            <div className="col-lg-6">
              <div className="pe-lg-4">
                <h2 className="display-6 display-lg-5 fw-bold mb-4 mb-lg-5 text-primary">
                  Send us a Message
                </h2>
                
                {submitted ? (
                  <div className="card border-success shadow-sm">
                    <div className="card-body text-center p-4 p-lg-5">
                      <div className="display-3 mb-4 text-success">✅</div>
                      <h3 className="h4 fw-bold text-success mb-3 mb-lg-4">Message Sent!</h3>
                      <p className="text-success mb-4 mb-lg-5 lh-lg">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="btn btn-success btn-lg px-4 py-3"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 g-lg-4 mb-4">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label fw-semibold mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="form-control form-control-lg py-3"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label fw-semibold mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="form-control form-control-lg py-3"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="subject" className="form-label fw-semibold mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="form-control form-control-lg py-3"
                        placeholder="What's this about?"
                      />
                    </div>
                    
                    <div className="mb-4 mb-lg-5">
                      <label htmlFor="message" className="form-label fw-semibold mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="form-control py-3"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg w-100 py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Map/Additional Info */}
            <div className="col-lg-6">
              <div className="ps-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-0">
                    <OptimizedImage
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
                      alt="Luxe Boutique Store Location"
                      className="w-100 rounded-top"
                      width={600}
                      height={400}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      style={{height: '300px', objectFit: 'cover'}}
                    />
                    <div className="p-4 p-lg-5">
                      <h3 className="h4 fw-bold mb-3 mb-lg-4">Visit Our Flagship Store</h3>
                      <p className="text-muted mb-4 mb-lg-5 lh-lg">
                        Experience luxury fashion in person at our beautiful flagship store 
                        in the heart of New York's fashion district.
                      </p>
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-clock text-primary me-3"></i>
                        <span className="lh-lg">Open 7 days a week</span>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-car-front text-primary me-3"></i>
                        <span className="lh-lg">Free parking available</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-wifi text-primary me-3"></i>
                        <span className="lh-lg">Personal styling sessions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 py-lg-6 bg-light">
        <div className="container py-4 py-lg-5">
          <div className="text-center mb-5 mb-lg-6">
            <h2 className="display-6 display-lg-5 fw-bold mb-4 text-primary">
              Frequently Asked Questions
            </h2>
            <p className="fs-6 fs-lg-5 text-muted mx-auto" style={{maxWidth: '600px'}}>
              Quick answers to common questions
            </p>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item border-0 mb-3 mb-lg-4 shadow-sm">
                  <h2 className="accordion-header">
                    <button className="accordion-button py-3 py-lg-4" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" aria-expanded="true" aria-controls="faq1">
                      What are your shipping options?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body py-3 py-lg-4 lh-lg">
                      We offer free standard shipping on orders over $100, with express and overnight options available for an additional fee.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item border-0 mb-3 mb-lg-4 shadow-sm">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed py-3 py-lg-4" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" aria-expanded="false" aria-controls="faq2">
                      What is your return policy?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body py-3 py-lg-4 lh-lg">
                      We accept returns within 30 days of purchase for unworn items with original tags. Return shipping is free for exchanges.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item border-0 mb-3 mb-lg-4 shadow-sm">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed py-3 py-lg-4" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" aria-expanded="false" aria-controls="faq3">
                      Do you offer personal styling services?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body py-3 py-lg-4 lh-lg">
                      Yes! Book a complimentary styling session with our fashion experts either in-store or virtually.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;