import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, MessageSquare, Users, Headphones, FileText } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general"
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@ridecompare.com",
      description: "General inquiries and support"
    },
    {
      icon: Phone,
      title: "Phone Support",
      value: "+1 (555) 123-4567",
      description: "Monday - Friday, 9 AM - 6 PM EST"
    },
    {
      icon: MapPin,
      title: "Headquarters",
      value: "123 Innovation Drive, San Francisco, CA 94105",
      description: "Visit us at our main office"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "< 24 hours",
      description: "Average response time for all inquiries"
    }
  ];

  const supportCategories = [
    {
      icon: MessageSquare,
      title: "General Support",
      description: "Questions about features, account issues, or how to use RideCompare"
    },
    {
      icon: Users,
      title: "Business Partnerships",
      description: "Interested in partnering with us or integrating our API"
    },
    {
      icon: Headphones,
      title: "Technical Issues",
      description: "Bug reports, app crashes, or technical difficulties"
    },
    {
      icon: FileText,
      title: "Press & Media",
      description: "Media inquiries, press releases, and interview requests"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            We're Here to Help
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Have questions, suggestions, or need support? Our team is ready to assist you. 
            Reach out through any of the channels below and we'll get back to you quickly.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {contactInfo.map((info, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur text-center">
              <CardContent className="p-6">
                <info.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="font-medium text-primary mb-1">{info.value}</p>
                <p className="text-sm text-gray-600">{info.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form and Support Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@example.com"
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-white"
                    data-testid="select-contact-category"
                  >
                    <option value="general">General Support</option>
                    <option value="technical">Technical Issues</option>
                    <option value="business">Business Partnerships</option>
                    <option value="press">Press & Media</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Brief description of your inquiry"
                    data-testid="input-contact-subject"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    data-testid="textarea-contact-message"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  data-testid="button-send-message"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Support Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Can We Help?</h2>
            
            {supportCategories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* FAQ Link */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Need Quick Answers?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Check out our FAQ section for instant answers to common questions
                </p>
                <Button variant="secondary" size="sm">
                  View FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Other Ways to Reach Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get instant help through our in-app chat feature
              </p>
              <Badge variant="outline">Available 24/7</Badge>
            </div>

            <div className="p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-gray-600 text-sm mb-4">
                Join our user community for tips and discussions
              </p>
              <Badge variant="outline">Join Discord</Badge>
            </div>

            <div className="p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Help Center</h3>
              <p className="text-gray-600 text-sm mb-4">
                Browse our comprehensive help documentation
              </p>
              <Badge variant="outline">Self-Service</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}