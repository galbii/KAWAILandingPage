'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Header scroll effect
    const header = document.querySelector('header');
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        // Header scroll state
        if (scrollY > 100) {
          header?.classList.add('header-scrolled');
        } else {
          header?.classList.remove('header-scrolled');
        }

        // Parallax effects
        const parallaxSlow = scrollY * 0.3;
        const parallaxMedium = scrollY * 0.5;
        const parallaxFast = scrollY * 0.7;

        document.documentElement.style.setProperty('--scroll-offset-slow', `${parallaxSlow}px`);
        document.documentElement.style.setProperty('--scroll-offset-medium', `${parallaxMedium}px`);
        document.documentElement.style.setProperty('--scroll-offset-fast', `${parallaxFast}px`);
      });
    };

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
        }
      });
    }, observerOptions);

    // Observe all scroll-animate elements
    const animateElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
    animateElements.forEach((el) => observer.observe(el));

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/30 shadow-lg header-enhanced">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
            {/* Brand Partnership Section */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              {/* KAWAI Logo - Prominent */}
              <div className="relative w-28 h-10 sm:w-36 sm:h-12 lg:w-44 lg:h-14 animate-slide-in-left">
                <Image
                  src="/images/kawai-logo-red-1x.png"
                  alt="KAWAI"
                  fill
                  className="object-contain filter drop-shadow-lg"
                  priority
                />
              </div>
              
              {/* Partnership Connector */}
              <div className="hidden sm:flex items-center animate-scale-in">
                <span className="text-4xl font-light text-black">×</span>
              </div>
              
              {/* TSU Logo */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-slide-in-right">
                <Image
                  src="/images/texas-southern-tigers-logo-936726837.png"
                  alt="Texas Southern University Tigers"
                  fill
                  className="object-contain filter drop-shadow-lg"
                  priority
                />
              </div>
              
              {/* Event Information */}
              <div className="hidden lg:block ml-4 animate-fade-in-up">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-foreground tracking-wide bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                    Exclusive Sale Event
                  </div>
                  <div className="text-xs text-muted-foreground font-medium tracking-wider">
                    April 3-6, 2025
                  </div>
                </div>
              </div>
              
              {/* Mobile Event Badge */}
              <div className="lg:hidden animate-fade-in-up">
                <Badge 
                  variant="outline" 
                  className="text-xs font-medium border-red-200 text-red-700 bg-red-50/50"
                >
                  Sale Event
                </Badge>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="flex items-center animate-slide-up">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-bold px-6 sm:px-8 lg:px-10 shadow-xl border border-red-500/20 transition-all duration-300"
              >
                <span className="hidden sm:inline">Book Consultation</span>
                <span className="sm:hidden">Book Now</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-red-700 min-h-screen flex items-center justify-center text-white pt-24 hero-parallax scroll-container">
        {/* Background Layer for Parallax */}
        <div className="hero-background parallax-element parallax-slow">
          <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-800 to-red-900"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 text-center hero-content">
          
          {/* Main Header with Overlaid TSU Seal */}
          <div className="relative mb-16 scroll-animate-scale">
            {/* Top Line */}
            <div className="w-full h-1 bg-white/60 mb-8 scroll-animate-left"></div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl text-white tracking-wider leading-tight scroll-animate">
              <span className="font-normal">TEXAS SOUTHERN UNIVERSITY</span>
              <br />
              <span className="font-black">PIANO SALE EVENT</span>
            </h1>
            
            {/* Bottom Line */}
            <div className="w-full h-1 bg-white/60 mt-8 scroll-animate-right"></div>
            
            {/* TSU Seal Overlay with Parallax */}
            <div className="absolute inset-0 flex items-center justify-center parallax-element parallax-medium">
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 opacity-20">
                <Image
                  src="/images/seal-tsu-4055528333.png"
                  alt="Texas Southern University"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          
          {/* Essential Info - Centered */}
          <div className="space-y-8 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white scroll-animate">
              Save up to $6,000 on Premium Kawai Pianos
            </h2>
            <p className="text-lg text-white/90 scroll-animate">April 3-6, 2025</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-animate">
              <Button className="bg-white text-red-700 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Find Your Piano
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-700 px-8 py-3 text-lg font-semibold">
                Book a Spot
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Event Section */}
      <section id="about-event" className="py-24 bg-muted/30 scroll-container">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight scroll-animate">
              About This <span className="text-kawai-red">Exclusive Event</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed scroll-animate">
              A rare opportunity to access premium Kawai pianos at exclusive pricing through our official partnership with Texas Southern University Music Department
            </p>
          </div>

          {/* Image Gallery */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="h-72 overflow-hidden group hover:shadow-lg transition-shadow scroll-animate">
              <CardContent className="p-0 h-full">
                <div className="h-2/3 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Piano Showroom Image</span>
                </div>
                <div className="p-4 h-1/3 flex flex-col justify-center">
                  <h4 className="font-semibold">Piano Showroom</h4>
                  <p className="text-sm text-muted-foreground">Premium collection display</p>
                </div>
              </CardContent>
            </Card>

            <Card className="h-72 overflow-hidden group hover:shadow-lg transition-shadow scroll-animate">
              <CardContent className="p-0 h-full">
                <div className="h-2/3 bg-amber-50 flex items-center justify-center">
                  <span className="text-amber-700 text-sm">TSU Partnership Image</span>
                </div>
                <div className="p-4 h-1/3 flex flex-col justify-center">
                  <h4 className="font-semibold">TSU Partnership</h4>
                  <p className="text-sm text-muted-foreground">Official university collaboration</p>
                </div>
              </CardContent>
            </Card>

            <Card className="h-72 overflow-hidden group hover:shadow-lg transition-shadow scroll-animate">
              <CardContent className="p-0 h-full">
                <div className="h-2/3 bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-700 text-sm">Happy Families Image</span>
                </div>
                <div className="p-4 h-1/3 flex flex-col justify-center">
                  <h4 className="font-semibold">Happy Families</h4>
                  <p className="text-sm text-muted-foreground">500+ satisfied customers</p>
                </div>
              </CardContent>
            </Card>

            <Card className="h-72 overflow-hidden group hover:shadow-lg transition-shadow scroll-animate">
              <CardContent className="p-0 h-full">
                <div className="h-2/3 bg-green-50 flex items-center justify-center">
                  <span className="text-green-700 text-sm">Quality Guarantee Image</span>
                </div>
                <div className="p-4 h-1/3 flex flex-col justify-center">
                  <h4 className="font-semibold">Quality Guarantee</h4>
                  <p className="text-sm text-muted-foreground">10-year comprehensive warranty</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Description */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 scroll-animate-left">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                A Partnership Built on <span className="text-kawai-red">Musical Excellence</span>
              </h3>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-base">
                  For over five years, our exclusive partnership with Texas Southern University&apos;s Music Department has brought Houston families access to premium Kawai pianos at specially negotiated pricing.
                </p>
                
                <p className="text-base">
                  This four-day exclusive event features carefully selected instruments that meet TSU&apos;s rigorous quality standards. Each piano has been chosen by the university&apos;s music faculty for its exceptional sound quality, build craftsmanship, and educational value.
                </p>
                
                <p className="text-base">
                  Whether you&apos;re a TSU student, Houston resident, or music enthusiast, this event offers a rare opportunity to acquire professional-grade instruments with the confidence that comes from institutional endorsement.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">Event Dates</h4>
                    <p className="text-sm text-muted-foreground">April 3-6, 2025<br />Limited appointment slots</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">Location</h4>
                    <p className="text-sm text-muted-foreground">Houston Showroom<br />3100 Cleburne Street</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative scroll-animate-right">
              <Card className="h-[440px] overflow-hidden">
                <CardContent className="p-0 h-full">
                  <div className="h-3/5 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Premium Piano Collection Image</span>
                  </div>
                  <div className="p-6 h-2/5">
                    <h4 className="text-xl font-bold mb-4">Premium Piano Collection</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted/50 rounded p-2">
                        <div className="font-medium text-kawai-red">Digital Pianos</div>
                        <div className="text-muted-foreground text-xs">ES Series</div>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <div className="font-medium text-kawai-red">Upright Pianos</div>
                        <div className="text-muted-foreground text-xs">K Series</div>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <div className="font-medium text-kawai-red">Grand Pianos</div>
                        <div className="text-muted-foreground text-xs">GL Series</div>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <div className="font-medium text-kawai-red">Professional</div>
                        <div className="text-muted-foreground text-xs">Concert Grade</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Piano Showcase */}
      <section id="featured-deals" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="mb-2">
              Limited Inventory: Only 48 Premium Pianos Available
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Featured <span className="text-kawai-red">Piano Deals</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Specially negotiated pricing through our TSU partnership &ndash; unavailable elsewhere
            </p>
          </div>

          {/* Piano Inventory */}
          <div className="grid gap-6">
            {[
              {
                name: "Kawai ES120 Digital Piano",
                model: "ES120",
                category: "Digital",
                price: "$949",
                originalPrice: "$1,099",
                savings: "$150",
                monthlyPayment: "$79",
                remaining: 12,
                features: ["88 Weighted Keys", "Premium Sound Engine", "Bluetooth Ready", "TSU Approved"],
                badge: "STUDENT FAVORITE"
              },
              {
                name: "Kawai ES520 Digital Piano",
                model: "ES520",
                category: "Digital Premium",
                price: "$999",
                originalPrice: "$1,399",
                savings: "$400",
                monthlyPayment: "$83",
                remaining: 8,
                features: ["88 Keys", "Bluetooth Ready", "App Compatible", "Faculty Choice"],
                badge: "BEST VALUE"
              },
              {
                name: "K200 Upright Acoustic Piano",
                model: "K200",
                category: "Upright",
                price: "$6,390",
                originalPrice: "$8,395",
                savings: "$2,005",
                monthlyPayment: "$532",
                remaining: 4,
                features: ["Perfect Home Size", "Rich Acoustic Tone", "TSU Standard", "Free Setup"],
                badge: "FAMILY FAVORITE"
              },
              {
                name: "GL10 Grand Piano",
                model: "GL10",
                category: "Grand",
                price: "$12,950",
                originalPrice: "$18,995",
                savings: "$6,045",
                monthlyPayment: "$1,079",
                remaining: 2,
                features: ["Performance Grade", "Concert Quality", "Faculty Approved", "White Glove Delivery"],
                badge: "PREMIUM SELECTION"
              }
            ].map((piano, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Piano Image and Info */}
                  <div className="lg:col-span-1">
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">{piano.name} Image</span>
                    </div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">{piano.badge}</Badge>
                        <Badge variant="secondary" className="text-xs">{piano.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{piano.name}</CardTitle>
                      <CardDescription className="text-sm">Model: {piano.model}</CardDescription>
                    </CardHeader>
                  </div>

                  {/* Pricing */}
                  <div className="lg:col-span-1">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground line-through">Was: {piano.originalPrice}</div>
                          <div className="text-3xl font-bold text-kawai-red">{piano.price}</div>
                          <div className="text-base font-semibold text-green-600">Save {piano.savings}</div>
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="text-sm text-muted-foreground">Or pay monthly:</div>
                          <div className="text-lg font-semibold">{piano.monthlyPayment}/month</div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {piano.remaining} remaining
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Features and CTAs */}
                  <div className="lg:col-span-1">
                    <CardContent className="pt-6">
                      <div className="space-y-3 mb-6">
                        {piano.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="text-sm text-muted-foreground">
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full bg-kawai-red hover:bg-kawai-red-dark" size="sm">
                          Add to Consultation
                        </Button>
                        <Button variant="outline" className="w-full" size="sm">
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="mt-12">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-xl">What's Included with Every Piano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div>
                    <h4 className="font-medium mb-1">10-Year Warranty</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive coverage</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Free Delivery</h4>
                    <p className="text-sm text-muted-foreground">Within 50 miles</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Professional Setup</h4>
                    <p className="text-sm text-muted-foreground">Expert installation</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">30-Day Guarantee</h4>
                    <p className="text-sm text-muted-foreground">Satisfaction promise</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Authority & Trust Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">TSU</span>
              </div>
              <span className="text-amber-800 font-medium text-sm">Official Partnership</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Trusted by <span className="text-kawai-red">Music Professionals</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our exclusive partnership with Texas Southern University Music Department brings you institutional credibility and expert-approved piano selections.
            </p>
          </div>

          {/* Testimonial & Credentials */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* TSU Endorsement */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TSU</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Music Department Chair</h3>
                    <p className="text-sm text-amber-600">Texas Southern University</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground italic mb-4">
                  &ldquo;Our partnership with Kawai ensures that our students and the Houston community have access to exceptional piano quality that meets our institutional performance standards.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div>
                    <div className="font-medium text-sm">Dr. Marcus Williams</div>
                    <div className="text-xs text-muted-foreground">Chair, Music Department</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Guarantees */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quality Guarantees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-kawai-red rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">10-Year Comprehensive Warranty</h4>
                    <p className="text-xs text-muted-foreground">Complete coverage including parts and service</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-kawai-red rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Authorized Dealer</h4>
                    <p className="text-xs text-muted-foreground">Official Kawai dealer with factory support</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-kawai-red rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">30-Day Satisfaction Guarantee</h4>
                    <p className="text-xs text-muted-foreground">Full return policy with confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Join the <span className="text-amber-300">Musical Community</span>
            </h2>
            <p className="text-amber-200 text-lg">
              April 3-6, 2025 • Limited Appointment Slots Available
            </p>
            <p className="text-slate-300 max-w-3xl mx-auto">
              Be part of Houston&apos;s exclusive piano community with TSU-endorsed expert guidance and premium instrument selection
            </p>
          </div>

          {/* Community Metrics Grid - Clean */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white/10 border-white/20 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-amber-300 mb-2">847</div>
                <div className="text-white text-sm font-medium mb-1">Happy Families</div>
                <div className="text-gray-300 text-xs">4.9/5 satisfaction</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-amber-300 mb-2">200+</div>
                <div className="text-white text-sm font-medium mb-1">TSU Students</div>
                <div className="text-gray-300 text-xs">Musical excellence</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-amber-300 mb-2">15+</div>
                <div className="text-white text-sm font-medium mb-1">Years Serving</div>
                <div className="text-gray-300 text-xs">Houston community</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-amber-300 mb-2">48</div>
                <div className="text-white text-sm font-medium mb-1">Pianos Remaining</div>
                <div className="text-gray-300 text-xs">Limited inventory</div>
              </CardContent>
            </Card>
          </div>

          {/* Live Activity Feed - Clean */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white font-semibold">Recent Activity</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-white/90 text-sm">
                    <div className="flex justify-between">
                      <span>Sarah from Katy booked consultation</span>
                      <span className="text-amber-300 text-xs">2 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Johnson family reserved K200 piano</span>
                      <span className="text-amber-300 text-xs">7 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New review from Michael R.</span>
                      <span className="text-amber-300 text-xs">12 min ago</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-white/90 text-sm">
                    <div className="flex justify-between">
                      <span>TSU student inquiry for ES520</span>
                      <span className="text-amber-300 text-xs">15 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone consultation completed</span>
                      <span className="text-amber-300 text-xs">18 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-300 font-medium">12 consultations booked today</span>
                      <Badge className="bg-green-500 text-white text-xs">LIVE</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Reviews - Clean */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">What Our Community Says</h3>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="text-2xl font-bold text-amber-300">4.9</span>
                <span className="text-white/80">/5 on Google</span>
                <span className="text-white/60">•</span>
                <span className="text-white/80">847 verified reviews</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Jennifer M.",
                  location: "Katy", 
                  text: "Outstanding service! The TSU partnership really shows in the quality and expertise. Our daughter loves her new Kawai piano.",
                  timeAgo: "1 week ago"
                },
                {
                  name: "David L.",
                  location: "Sugar Land",
                  text: "Professional, knowledgeable, and patient. They helped us choose the perfect piano for our family. Highly recommended!",
                  timeAgo: "2 weeks ago"
                },
                {
                  name: "Maria R.",
                  location: "Houston",
                  text: "The consultation was invaluable. Their expertise and the TSU connection gave us confidence in our investment.",
                  timeAgo: "3 weeks ago"
                }
              ].map((review, index) => (
                <Card key={index} className="bg-white/10 border-white/20">
                  <CardContent className="pt-6">
                    <div className="h-20 bg-gray-200 rounded mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Customer Photo</span>
                    </div>
                    <blockquote className="text-white/90 text-sm mb-4">"{review.text}"</blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">{review.name}</div>
                        <div className="text-white/60 text-xs">{review.location}</div>
                      </div>
                      <div className="text-white/50 text-xs">{review.timeAgo}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Final CTA Section - Clean */}
          <div className="text-center">
            <Card className="bg-white/10 border-white/20 max-w-3xl mx-auto">
              <CardContent className="pt-8">
                <h3 className="text-white text-2xl font-bold mb-4">Reserve Your Exclusive Access</h3>
                <p className="text-white/90 mb-6">Join hundreds of satisfied Houston families in the TSU piano community</p>
                
                <Button size="lg" className="bg-kawai-red hover:bg-kawai-red-dark text-white font-bold text-lg px-12 py-4 mb-6">
                  BOOK YOUR CONSULTATION NOW
                </Button>
                
                <div className="grid sm:grid-cols-3 gap-4 text-sm text-white/90">
                  <span>Free 30-min consultation</span>
                  <span>No pressure environment</span>
                  <span>30-day price guarantee</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section id="event" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6 tracking-tight">
              Event <span className="text-gradient-primary">Details</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-4 rounded-full"></div>
            <p className="text-xl text-gray-medium max-w-2xl mx-auto leading-relaxed">
              Join us for an exclusive four-day celebration of musical excellence
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Schedule Card */}
            <div className="card-premium rounded-3xl p-8 animate-slide-in-left">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-dark">Event Schedule</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { day: "Friday, Feb 16", time: "9:00 AM - 6:00 PM", highlight: false },
                  { day: "Saturday, Feb 17", time: "9:00 AM - 6:00 PM", highlight: true },
                  { day: "Sunday, Feb 18", time: "10:00 AM - 5:00 PM", highlight: false },
                  { day: "Monday, Feb 19", time: "9:00 AM - 4:00 PM", highlight: false }
                ].map((schedule, index) => (
                  <div key={index} className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 hover:bg-primary/5 ${
                    schedule.highlight ? 'bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary' : 'bg-gray-50'
                  }`}>
                    <span className="font-semibold text-gray-dark">{schedule.day}</span>
                    <span className="text-gray-medium font-medium">{schedule.time}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-gold/10 to-gold-light/10 rounded-xl border border-gold/20">
                <p className="text-sm text-gray-dark font-medium">
                  ✨ <span className="text-gradient-gold font-semibold">Peak Hours:</span> Saturday 11 AM - 3 PM for maximum selection
                </p>
              </div>
            </div>
            
            {/* Special Offers Card */}
            <div className="card-premium rounded-3xl p-8 animate-slide-in-right">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-gold to-gold-light rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-dark">Exclusive Offers</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: "💰", title: "Up to 40% off select models", desc: "Premium upright and grand pianos" },
                  { icon: "🚚", title: "Free delivery within 50 miles", desc: "Professional setup included" },
                  { icon: "🛡️", title: "Extended warranty available", desc: "Up to 10 years coverage" },
                  { icon: "🔄", title: "Trade-in program", desc: "Upgrade your current instrument" }
                ].map((offer, index) => (
                  <div key={index} className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 group">
                    <div className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">{offer.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-dark mb-1">{offer.title}</h4>
                      <p className="text-sm text-gray-medium">{offer.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <button className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg">
                  View All Benefits
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Gallery Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Experience the <span className="text-gradient-gold">Difference</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-gold-light mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Witness the artistry and passion that goes into every KAWAI piano
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: "Concert Halls", subtitle: "World-class venues", icon: "🎼", gradient: "from-purple-600 to-blue-600" },
              { title: "Master Craftsmen", subtitle: "90+ years expertise", icon: "🔨", gradient: "from-amber-600 to-orange-600" },
              { title: "Recording Studios", subtitle: "Professional sound", icon: "🎤", gradient: "from-green-600 to-emerald-600" },
              { title: "Family Homes", subtitle: "Cherished moments", icon: "🏠", gradient: "from-rose-600 to-pink-600" },
              { title: "Music Schools", subtitle: "Next generation", icon: "🎹", gradient: "from-blue-600 to-indigo-600" },
              { title: "Concert Artists", subtitle: "Global performers", icon: "⭐", gradient: "from-yellow-600 to-amber-600" }
            ].map((item, index) => (
              <div key={index} className={`gallery-item relative h-72 bg-gradient-to-br ${item.gradient} rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up animate-delay-${index * 100}`}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10">
                  <div className="text-5xl mb-4 transform hover:scale-125 transition-transform duration-300">{item.icon}</div>
                  <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/80 text-sm font-medium">{item.subtitle}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              </div>
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center animate-fade-in-up animate-delay-100">
              <div className="text-4xl font-bold text-gradient-gold mb-2">90+</div>
              <p className="text-gray-300 font-medium">Years of Excellence</p>
            </div>
            <div className="text-center animate-fade-in-up animate-delay-200">
              <div className="text-4xl font-bold text-gradient-gold mb-2">50k+</div>
              <p className="text-gray-300 font-medium">Satisfied Customers</p>
            </div>
            <div className="text-center animate-fade-in-up animate-delay-300">
              <div className="text-4xl font-bold text-gradient-gold mb-2">150+</div>
              <p className="text-gray-300 font-medium">Countries Worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-accent"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full translate-x-48"></div>
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6 tracking-tight">
              Visit Our <span className="text-gradient-primary">Showroom</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed">
              Experience our pianos in person at our state-of-the-art showroom
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info Card */}
            <div className="card-premium rounded-3xl p-8 animate-slide-in-left">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-dark">Location & Contact</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-dark mb-1">Showroom Address</h4>
                    <p className="text-gray-medium leading-relaxed">
                      3100 Cleburne Street<br />
                      Houston, TX 77004<br />
                      <span className="text-sm text-primary font-medium">Prime Arts District Location</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-dark mb-1">Phone & Email</h4>
                    <p className="text-gray-medium">
                      <a href="tel:7135550123" className="hover:text-primary transition-colors">(713) 555-0123</a><br />
                      <a href="mailto:info@kawaisale.com" className="hover:text-primary transition-colors">info@kawaisale.com</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-dark mb-1">Event Hours</h4>
                    <p className="text-gray-medium text-sm">
                      Feb 16-17: 9:00 AM - 6:00 PM<br />
                      Feb 18: 10:00 AM - 5:00 PM<br />
                      Feb 19: 9:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <button className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg">
                  Get Directions
                </button>
                <button className="w-full border-2 border-primary text-primary font-semibold py-3 px-6 rounded-xl hover:bg-primary hover:text-white transition-all duration-300">
                  Schedule Private Tour
                </button>
              </div>
            </div>
            
            {/* Map Card */}
            <div className="card-premium rounded-3xl p-8 animate-slide-in-right">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-dark">Find Us</h3>
              </div>
              
              <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-inner">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h4 className="text-xl font-bold text-gray-dark mb-2">Interactive Map</h4>
                    <p className="text-gray-medium mb-6">Click to view detailed directions<br />and parking information</p>
                    <button className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-colors">
                      Open Map
                    </button>
                  </div>
                </div>
                
                {/* Decorative map elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-primary rounded-full animate-ping"></div>
                <div className="absolute bottom-6 right-6 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 right-8 w-1 h-1 bg-gold rounded-full animate-bounce"></div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="font-semibold text-gray-dark">🏏 Parking</div>
                  <div className="text-gray-medium">Free valet available</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="font-semibold text-gray-dark">🚇 Transit</div>
                  <div className="text-gray-medium">Metro Rail nearby</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-accent"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-40 translate-x-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2 animate-fade-in-up">
              <div className="text-4xl font-bold text-gradient-primary mb-4 tracking-wide">KAWAI</div>
              <p className="text-xl text-gradient-gold mb-4 font-medium">Premium Pianos Since 1927</p>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Crafting exceptional musical instruments with unwavering dedication to quality, 
                innovation, and the art of piano making for nearly a century.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: "📘", label: "Facebook" },
                  { icon: "📷", label: "Instagram" },
                  { icon: "🐦", label: "Twitter" },
                  { icon: "📺", label: "YouTube" }
                ].map((social, index) => (
                  <a key={index} href="#" 
                     className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-xl hover:bg-primary hover:scale-110 transition-all duration-300 group"
                     title={social.label}>
                    <span className="group-hover:scale-110 transition-transform duration-300">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="animate-fade-in-up animate-delay-200">
              <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  "Event Details",
                  "Piano Collection",
                  "Financing Options",
                  "Service & Support",
                  "Trade-In Program",
                  "Warranty Info"
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-gold transition-colors duration-300 flex items-center group">
                      <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:bg-gold transition-colors duration-300"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div className="animate-fade-in-up animate-delay-300">
              <h4 className="text-lg font-bold mb-6 text-white">Get In Touch</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-primary mt-1">📍</div>
                  <div className="text-gray-300 text-sm">
                    3100 Cleburne Street<br />
                    Houston, TX 77004
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-primary">📞</div>
                  <a href="tel:7135550123" className="text-gray-300 hover:text-gold transition-colors duration-300 text-sm">
                    (713) 555-0123
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-primary">✉️</div>
                  <a href="mailto:info@kawaisale.com" className="text-gray-300 hover:text-gold transition-colors duration-300 text-sm">
                    info@kawaisale.com
                  </a>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-gradient-primary text-white font-semibold py-2 px-6 rounded-full text-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Newsletter Signup
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 KAWAI Musical Instruments. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Accessibility</a>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-gray-500 text-xs">
                🏆 Winner of multiple piano industry awards • 🌍 Trusted by musicians worldwide • 🔧 Expert craftsmanship since 1927
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
