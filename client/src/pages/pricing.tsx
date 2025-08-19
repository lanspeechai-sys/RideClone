import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Check, Star, Zap, Bot, Bell, Sparkles, Crown, Brain, ShoppingBag, TrendingUp, Shield, Headphones } from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (plan: string) => {
    toast({
      title: "Coming Soon!",
      description: `${plan} subscription will be available soon. Join our waitlist to get notified!`,
    });
  };

  const plans = [
    {
      name: "Free",
      description: "Perfect for occasional riders",
      price: { monthly: 0, annual: 0 },
      badge: null,
      features: [
        { text: "Compare rides across 3 major platforms", icon: Check },
        { text: "Basic price alerts (up to 3 active)", icon: Check },
        { text: "Search history (last 10 searches)", icon: Check },
        { text: "Standard customer support", icon: Check },
        { text: "Mobile app access", icon: Check },
      ],
      limitations: [
        "Limited to 5 searches per day",
        "Basic notifications only",
        "No advanced AI features"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Premium",
      description: "For smart travelers who want the best deals",
      price: { monthly: 5, annual: 50 },
      badge: "Recommended",
      features: [
        { text: "Everything in Free, plus:", icon: Star },
        { text: "Unlimited ride comparisons", icon: Check },
        { text: "AI Agent for automatic booking", icon: Bot },
        { text: "Real-time price monitoring & smart alerts", icon: Bell },
        { text: "Advanced surge prediction", icon: TrendingUp },
        { text: "Personalized route optimization", icon: Brain },
        { text: "AI Fashion Price Tracker (40K+ sites)", icon: ShoppingBag },
        { text: "Multi-city trip planning", icon: Sparkles },
        { text: "Priority customer support", icon: Headphones },
        { text: "Early access to new features", icon: Zap },
        { text: "Custom price thresholds", icon: Shield },
        { text: "Historical price analytics", icon: TrendingUp },
      ],
      premiumFeatures: [
        {
          title: "AI Booking Agent",
          description: "Your personal assistant that monitors prices and automatically books rides when they hit your target price",
          icon: Bot
        },
        {
          title: "Fashion Price Intelligence",
          description: "Instantly find the best prices on clothing and accessories across 40,000+ retail sites with AI-powered matching",
          icon: ShoppingBag
        },
        {
          title: "Smart Predictions",
          description: "AI analyzes traffic patterns, events, and demand to predict the best times to book rides",
          icon: Brain
        },
        {
          title: "Premium Notifications",
          description: "Get instant alerts via SMS, email, and push notifications for price drops and booking confirmations",
          icon: Bell
        }
      ],
      cta: "Start Premium Trial",
      popular: true
    },
    {
      name: "Annual Premium",
      description: "Best value with 2 months free",
      price: { monthly: 4.17, annual: 50 },
      badge: "Best Value",
      features: [
        { text: "Everything in Premium, plus:", icon: Crown },
        { text: "Save $10 per year (2 months free)", icon: Check },
        { text: "Exclusive annual user perks", icon: Sparkles },
        { text: "VIP customer support", icon: Crown },
        { text: "Beta access to experimental features", icon: Zap },
        { text: "Annual usage analytics report", icon: TrendingUp },
        { text: "Priority AI agent processing", icon: Bot },
      ],
      cta: "Get Annual Plan",
      popular: false
    }
  ];

  const additionalFeatures = [
    {
      title: "AI-Powered Automation",
      description: "Our advanced AI agent learns your preferences and can automatically book rides, monitor fashion deals, and optimize your travel routes based on your habits and budget.",
      icon: Bot
    },
    {
      title: "Cross-Platform Intelligence",
      description: "Beyond rides, access our AI fashion tracker that monitors 40K+ retail sites, finding the best deals on clothing, accessories, and lifestyle products in real-time.",
      icon: ShoppingBag
    },
    {
      title: "Predictive Analytics",
      description: "Advanced algorithms predict price trends, surge periods, and optimal booking times, helping you save money and time on every journey.",
      icon: Brain
    },
    {
      title: "Smart Notifications",
      description: "Receive intelligent alerts about price drops, surge warnings, new deals, and booking confirmations through your preferred channels.",
      icon: Bell
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            From basic ride comparisons to AI-powered automation and fashion deal tracking. 
            Upgrade your travel and shopping experience with intelligent features that save you time and money.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-primary' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              data-testid="switch-billing-toggle"
            />
            <span className={`text-sm font-medium ${isAnnual ? 'text-primary' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800 ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative border-0 shadow-xl bg-white/90 backdrop-blur transition-all hover:scale-105 ${
                plan.popular ? 'ring-2 ring-primary ring-offset-4' : ''
              }`}
              data-testid={`card-plan-${plan.name.toLowerCase().replace(' ', '-')}`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full ${
                  plan.badge === "Recommended" ? "bg-primary text-white" : 
                  plan.badge === "Best Value" ? "bg-green-600 text-white" : "bg-gray-600 text-white"
                }`}>
                  {plan.badge}
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                    {plan.price.monthly > 0 && (
                      <span className="text-lg text-gray-500 font-normal">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {plan.price.monthly > 0 && isAnnual && (
                    <p className="text-sm text-gray-500">
                      ${plan.price.monthly}/month billed annually
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <feature.icon className={`w-5 h-5 mt-0.5 ${
                        feature.icon === Star ? 'text-yellow-500' : 
                        feature.icon === Crown ? 'text-purple-500' : 'text-green-600'
                      }`} />
                      <span className="text-gray-700 text-sm">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="text-xs text-gray-400">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.premiumFeatures && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Premium Highlights:</p>
                    <div className="space-y-3">
                      {plan.premiumFeatures.map((feature, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <feature.icon className="w-4 h-4 text-primary" />
                            <h4 className="text-sm font-semibold text-gray-900">{feature.title}</h4>
                          </div>
                          <p className="text-xs text-gray-600">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full ${
                    plan.popular ? 'bg-primary hover:bg-primary/90' : 
                    plan.name === 'Free' ? 'bg-gray-600 hover:bg-gray-700' :
                    'bg-green-600 hover:bg-green-700'
                  }`}
                  data-testid={`button-subscribe-${plan.name.toLowerCase().replace(' ', '-')}`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Upgrade to Premium?
            </h2>
            <p className="text-xl text-gray-600">
              Unlock powerful AI-driven features that transform how you travel and shop
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: "How does the AI booking agent work?",
                answer: "Our AI agent learns your preferences and travel patterns. You can set target prices for routes, and the agent will automatically book rides when prices drop to your desired level. It works 24/7 and sends instant notifications."
              },
              {
                question: "What's included in the fashion price tracker?",
                answer: "Premium users get access to our AI-powered fashion intelligence that monitors over 40,000 retail sites. Find the best deals on clothing, accessories, shoes, and lifestyle products with real-time price comparisons and alerts."
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes! You can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period."
              },
              {
                question: "Is there a free trial for Premium?",
                answer: "Yes, we offer a 14-day free trial for Premium features. No credit card required to start - you can explore all premium features risk-free."
              },
              {
                question: "How accurate are the price predictions?",
                answer: "Our AI analyzes historical data, traffic patterns, events, and demand to predict price changes with 85%+ accuracy. We're constantly improving our algorithms to provide better predictions."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-primary to-blue-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of smart travelers saving money with AI-powered recommendations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => handleSubscribe("Premium")}
                  data-testid="button-cta-trial"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => handleSubscribe("Free")}
                  data-testid="button-cta-free"
                >
                  Try Free Version
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}