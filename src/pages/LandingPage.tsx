import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Play, 
  Search, 
  BookOpen, 
  Award, 
  ArrowRight,
  Star
} from 'lucide-react';

export function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: <Play className="h-8 w-8 text-winbro-teal" />,
      title: "Short Videos",
      description: "20-30 second microlearning clips for quick knowledge transfer"
    },
    {
      icon: <Search className="h-8 w-8 text-winbro-teal" />,
      title: "Searchable Library",
      description: "Find exactly what you need with powerful search and filters"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-winbro-teal" />,
      title: "Course Builder",
      description: "Create structured training with quizzes and certificates"
    },
    {
      icon: <Award className="h-8 w-8 text-winbro-teal" />,
      title: "Certification",
      description: "Issue verified certificates for completed training"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Capture",
      description: "Record 20-30 second clips of machine operations and processes"
    },
    {
      number: "02", 
      title: "Curate",
      description: "Organize clips with metadata, transcripts, and searchable tags"
    },
    {
      number: "03",
      title: "Deliver",
      description: "Distribute through searchable libraries and structured courses"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Training Manager",
      company: "Manufacturing Corp",
      content: "Winbro has revolutionized how we train our operators. What used to take hours now takes minutes.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Operations Director", 
      company: "Industrial Solutions",
      content: "The searchable video library has eliminated our paper manuals completely. Everything is at our fingertips.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Safety Coordinator",
      company: "Precision Manufacturing",
      content: "Our compliance training completion rates have increased by 300% since implementing Winbro.",
      rating: 5
    }
  ];

  const stats = [
    { label: "Training Clips", value: "10,000+" },
    { label: "Active Users", value: "50,000+" },
    { label: "Organizations", value: "500+" },
    { label: "Time Saved", value: "2M+ hours" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-winbro-teal">Winbro</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/login" className="text-foreground hover:text-winbro-teal px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-winbro-gray to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Replace Paper Manuals with
                <span className="text-winbro-teal"> Smart Video Training</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Capture, curate, and deliver 20-30 second microlearning videos 
                for manufacturing operations. Searchable, structured, and certified.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-winbro-teal hover:bg-winbro-teal/90 text-lg px-8 py-4">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-winbro-teal text-winbro-teal hover:bg-winbro-teal hover:text-white"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            {/* Demo Video */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Card className="overflow-hidden shadow-elevation-300">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-winbro-teal/10 to-winbro-amber/10 flex items-center justify-center">
                    {isVideoPlaying ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <div className="text-white text-center">
                          <Play className="h-16 w-16 mx-auto mb-4" />
                          <p>Demo Video Playing</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-winbro-teal rounded-full flex items-center justify-center mx-auto mb-4">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-lg font-medium text-foreground">15 Second Demo</p>
                        <p className="text-sm text-muted-foreground">See Winbro in action</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-winbro-teal/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-winbro-teal mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Modern Training
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From quick video capture to comprehensive course delivery, 
              Winbro provides all the tools for effective manufacturing training.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-elevation-200 transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-0">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-winbro-gray/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to transform your training program
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-winbro-teal text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border transform translate-x-8" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers are saying
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-winbro-amber fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-winbro-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Training?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of manufacturers who have already made the switch 
            from paper manuals to smart video training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-winbro-teal hover:bg-white/90 text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-winbro-teal text-lg px-8 py-4">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Winbro</h3>
              <p className="text-muted-foreground">
                Smart video training for manufacturing operations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Winbro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
