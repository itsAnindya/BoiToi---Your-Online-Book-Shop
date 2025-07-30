import React, { useState } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  User, 
  MessageSquare, 
  Clock,
  Building,
  GraduationCap,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Globe,
  Heart
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      content: "Bangladesh University of Engineering and Technology",
      subtitle: "Palashi, Dhaka-1000, Bangladesh",
      color: "bg-blue-100 text-blue-600 border-blue-200",
      action: {
        label: "View on Maps",
        link: "https://maps.google.com/?q=BUET+Dhaka"
      }
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      content: "01234567890",
      subtitle: "Available during business hours",
      color: "bg-green-100 text-green-600 border-green-200",
      action: {
        label: "Call Now",
        link: "tel:+8801234567890"
      }
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "2205107@cse.buet.ac.bd",
      subtitle: "We'll respond within 24 hours",
      color: "bg-purple-100 text-purple-600 border-purple-200",
      action: {
        label: "Send Email",
        link: "mailto:2205107@cse.buet.ac.bd"
      }
    }
  ];

  const developerInfo = [
    {
      icon: <User className="w-5 h-5" />,
      label: "Frontend Developer",
      value: "Anindya Biswas (ID: 2205107)"
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Backend Developer",
      value: "Protaya Das (ID: 2205099)"
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      label: "Academic Level",
      value: "Level 2 Term 1"
    },
    {
      icon: <Building className="w-5 h-5" />,
      label: "Department",
      value: "CSE'22, BUET"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Project",
      value: "BoiToi - Online Book Shop"
    }
  ];

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-6 transform hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Get in <span className="text-primary-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about BoiToi? Want to provide feedback or suggestions? 
              We'd love to hear from you!
            </p>
          </div>

          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg p-8 border-2 ${info.color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                    {React.cloneElement(info.icon, { className: "w-8 h-8 text-primary-600" })}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-lg font-semibold text-gray-800 mb-1">{info.content}</p>
                  <p className="text-sm text-gray-600 mb-6">{info.subtitle}</p>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(info.action.link, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {info.action.label}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <Send className="w-6 h-6 mr-3 text-primary-600" />
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <p className="text-green-800">Thank you! Your message has been sent successfully.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Developer Info & Additional Details */}
            <div className="space-y-8">
              
              {/* Developer Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-3 text-primary-600" />
                  Developer Information
                </h2>
                
                <div className="space-y-4">
                  {developerInfo.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                      <div className="p-2 bg-primary-100 rounded-lg mr-4">
                        {React.cloneElement(item.icon, { className: "w-5 h-5 text-primary-600" })}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{item.label}</p>
                        <p className="font-semibold text-gray-900">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-primary-600" />
                  Response Times
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-900">Email Inquiries</span>
                    </div>
                    <span className="text-blue-600 font-semibold">Within 24 hours</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-green-600 mr-3" />
                      <span className="font-medium text-gray-900">Phone Calls</span>
                    </div>
                    <span className="text-green-600 font-semibold">9 AM - 6 PM</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-purple-600 mr-3" />
                      <span className="font-medium text-gray-900">Contact Form</span>
                    </div>
                    <span className="text-purple-600 font-semibold">Same day</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Globe className="w-6 h-6 mr-3" />
                  Quick Links
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/about'}
                    className="text-white border-white hover:bg-white/10 justify-start"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    About BoiToi
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/books'}
                    className="text-white border-white hover:bg-white/10 justify-start"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Books
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/'}
                    className="text-white border-white hover:bg-white/10 justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Homepage
                  </Button>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <Heart className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Thank you for your interest in BoiToi!
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Your feedback and suggestions help us improve and grow. 
                We're committed to providing the best online book shopping experience.
              </p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/books'}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ContactPage;
