import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Award, Zap, Shield, Heart } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Cities Covered", value: "150+", icon: MapPin },
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Rides Compared", value: "2M+", icon: Award },
    { label: "Average Savings", value: "25%", icon: Zap },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former Uber engineer with 8 years in ride-sharing technology. Passionate about making transportation accessible.",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      bio: "AI and machine learning expert. Previously led engineering teams at Google and Lyft.",
    },
    {
      name: "Elena Popova",
      role: "Head of Product",
      bio: "Product strategist with experience at Airbnb and Booking.com. Focuses on user experience design.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            About RideCompare
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            Revolutionizing Transportation Choices
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're on a mission to make transportation more affordable, accessible, and intelligent. 
            Our platform empowers millions of users to make smarter ride choices while saving money 
            and time through advanced AI technology.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <Shield className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-xl">Trust & Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We partner only with verified, licensed ride-sharing services to ensure 
                  your safety and security on every journey.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle className="text-xl">Smart Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI-powered platform analyzes millions of data points in real-time 
                  to find you the best deals and predict price changes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <Heart className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-xl">User-Centric</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every feature we build starts with understanding your needs and 
                  making your transportation experience seamless and enjoyable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white backdrop-blur">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Transparency</h3>
              <p className="text-gray-600">
                We believe in complete price transparency. No hidden fees, no surprises - 
                just honest, upfront pricing so you can make informed decisions.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Innovation</h3>
              <p className="text-gray-600">
                We're constantly pushing the boundaries of what's possible in transportation 
                technology, from AI predictions to seamless booking experiences.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Accessibility</h3>
              <p className="text-gray-600">
                Transportation should be accessible to everyone. We work to break down 
                barriers and make ride-sharing more affordable and available.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Sustainability</h3>
              <p className="text-gray-600">
                We promote eco-friendly transportation options and support the transition 
                to electric and sustainable mobility solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}