import React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import { 
  BookOpen, 
  Users, 
  Database, 
  Code, 
  Palette, 
  Server, 
  GraduationCap,
  Github,
  ExternalLink,
  Award,
  Calendar,
  MapPin,
  User,
  Heart,
  Zap,
  Globe
} from 'lucide-react';

const AboutPage = () => {
  const technologies = [
    {
      category: "Frontend",
      icon: <Palette className="w-6 h-6" />,
      items: ["ReactJS", "Vite", "TailwindCSS", "Lucide Icons"],
      color: "bg-blue-100 text-blue-600"
    },
    {
      category: "Backend", 
      icon: <Server className="w-6 h-6" />,
      items: ["Node.js", "Express.js", "RESTful APIs", "JWT Authentication"],
      color: "bg-green-100 text-green-600"
    },
    {
      category: "Database",
      icon: <Database className="w-6 h-6" />,
      items: ["MySQL", "Database Design", "SQL Queries", "Data Modeling"],
      color: "bg-orange-100 text-orange-600"
    },
    {
      category: "Tools & Others",
      icon: <Code className="w-6 h-6" />,
      items: ["Git", "VS Code", "Postman", "Responsive Design"],
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Book Management",
      description: "Comprehensive book catalog with search, filtering, and detailed book information",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User Management", 
      description: "User authentication, profiles, order history, and wishlist functionality",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "E-commerce Features",
      description: "Shopping cart, checkout process, discount codes, and order management",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Admin Dashboard",
      description: "Complete admin control panel for managing books, orders, users, and discounts",
      color: "bg-purple-50 border-purple-200"
    }
  ];

  const teamMembers = [
    {
      name: "Anindya Biswas",
      id: "2205107",
      role: "Frontend Developer",
      responsibilities: "UI/UX Design, React Components, State Management, Responsive Design",
      avatar: "AB",
      color: "bg-blue-500"
    },
    {
      name: "Protaya Das", 
      id: "2205099",
      role: "Backend Developer",
      responsibilities: "API Development, Database Design, Authentication, Server Architecture",
      avatar: "PD",
      color: "bg-green-500"
    }
  ];

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-6 transform hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-primary-600">BoiToi</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your Online Book Shop - A comprehensive e-commerce platform for book lovers, 
              built as a database sessional project at BUET.
            </p>
          </div>

          {/* Project Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Course</h3>
                <p className="text-sm text-gray-600">CSE 216 - Database Sessional</p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors duration-300">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Level</h3>
                <p className="text-sm text-gray-600">Level 2 Term 1</p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                  <MapPin className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Institution</h3>
                <p className="text-sm text-gray-600">BUET, CSE'22</p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Year</h3>
                <p className="text-sm text-gray-600">2025</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 mr-3 text-primary-600" />
                Development Team
              </h2>
              <p className="text-gray-600">Meet the developers behind BoiToi</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 ${member.color} rounded-full text-white text-2xl font-bold mb-4`}>
                      {member.avatar}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-primary-600 font-medium">ID: {member.id}</p>
                    <p className="text-gray-600 font-medium">{member.role}</p>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Responsibilities:</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {member.responsibilities}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Code className="w-8 h-8 mr-3 text-primary-600" />
                Technologies Used
              </h2>
              <p className="text-gray-600">Modern tech stack for a robust application</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${tech.color} rounded-lg mb-4`}>
                    {tech.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{tech.category}</h3>
                  <ul className="space-y-2">
                    {tech.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 mr-3 text-primary-600" />
                Key Features
              </h2>
              <p className="text-gray-600">What makes BoiToi special</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className={`bg-white rounded-xl shadow-lg p-8 border-2 ${feature.color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {React.cloneElement(feature.icon, { className: "w-8 h-8 text-primary-600" })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Goals */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 mb-16 text-white">
            <div className="text-center max-w-4xl mx-auto">
              <Heart className="w-12 h-12 mx-auto mb-6 text-pink-200" />
              <h2 className="text-3xl font-bold mb-4">Project Goals</h2>
              <p className="text-lg leading-relaxed opacity-90 mb-6">
                BoiToi was developed to demonstrate practical database design and implementation skills, 
                combining modern web development technologies with robust database management. 
                Our goal was to create a real-world e-commerce application that showcases 
                comprehensive CRUD operations, complex queries, and user-friendly interfaces.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <Database className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold">Database Mastery</h3>
                  <p className="text-sm opacity-80">Complex relational database design</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <Globe className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold">Full-Stack Development</h3>
                  <p className="text-sm opacity-80">End-to-end application development</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold">User Experience</h3>
                  <p className="text-sm opacity-80">Intuitive and responsive design</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <BookOpen className="w-16 h-16 mx-auto mb-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Experience BoiToi Today
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Explore our extensive book collection, enjoy seamless shopping experience, 
                and discover why BoiToi is the perfect destination for book lovers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => window.location.href = '/books'}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Books
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = '/'}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Visit Homepage
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AboutPage;
