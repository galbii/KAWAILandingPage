'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 11,
    minutes: 31,
    seconds: 13
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else if (prevTime.days > 0) {
          return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-3xl font-bold text-gradient-primary tracking-wide animate-scale-in">
              KAWAI
              <div className="text-xs font-normal text-gray-medium mt-1 tracking-widest">PREMIUM PIANOS</div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#event" className="relative text-gray-700 hover:text-primary transition-all duration-300 font-medium tracking-wide group">
                Event Details
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#products" className="relative text-gray-700 hover:text-primary transition-all duration-300 font-medium tracking-wide group">
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="relative text-gray-700 hover:text-primary transition-all duration-300 font-medium tracking-wide group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <button className="btn-primary text-white font-semibold py-2 px-6 rounded-full text-sm tracking-wide">
                Register Now
              </button>
            </nav>
            <button className="md:hidden text-gray-700 hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-20">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-gold rounded-full animate-bounce animate-delay-100 opacity-60"></div>
        <div className="absolute top-1/3 right-16 w-3 h-3 bg-white rounded-full animate-pulse animate-delay-300 opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-gold-light rounded-full animate-ping animate-delay-500 opacity-80"></div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div className="mb-12 animate-scale-in">
            <div className="w-40 h-40 mx-auto mb-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
              <div className="text-5xl font-bold text-gradient-gold animate-pulse">🎹</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight animate-fade-in-up">
              EXCLUSIVE PREMIUM
              <br />
              <span className="text-gradient-gold animate-fade-in-up animate-delay-200">SALE EVENT</span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-light opacity-90 animate-fade-in-up animate-delay-300 tracking-wide">
              FEBRUARY 16TH - FEBRUARY 19TH, 2024
            </p>
            
            <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto animate-fade-in-up animate-delay-400 leading-relaxed">
              Experience the artistry of world-class piano craftsmanship with exclusive deals on our premium collection
            </p>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-500">
            <button className="btn-primary text-white font-bold py-4 px-10 rounded-full text-lg tracking-wide shadow-2xl">
              DISCOVER PIANOS
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold py-4 px-10 rounded-full text-lg tracking-wide hover:bg-white/20 transition-all duration-300">
              Watch Video
            </button>
          </div>
          
          <div className="mt-16 animate-bounce animate-delay-700">
            <svg className="w-8 h-8 mx-auto text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <section className="relative bg-gradient-to-r from-primary via-primary-dark to-secondary py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold-light to-gold animate-pulse"></div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up tracking-wide">
            Limited Time Offer Ends In:
          </h2>
          <p className="text-white/80 text-lg mb-12 animate-fade-in-up animate-delay-200">
            Don't miss this exclusive opportunity to own a premium KAWAI piano
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
            <div className="text-center animate-fade-in-up animate-delay-100">
              <div className="countdown-card text-primary text-4xl md:text-5xl font-bold py-6 px-4 rounded-2xl min-w-[100px] shadow-2xl">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-white text-sm mt-3 font-semibold tracking-widest uppercase opacity-90">Days</div>
            </div>
            <div className="text-center animate-fade-in-up animate-delay-200">
              <div className="countdown-card text-primary text-4xl md:text-5xl font-bold py-6 px-4 rounded-2xl min-w-[100px] shadow-2xl">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-white text-sm mt-3 font-semibold tracking-widest uppercase opacity-90">Hours</div>
            </div>
            <div className="text-center animate-fade-in-up animate-delay-300">
              <div className="countdown-card text-primary text-4xl md:text-5xl font-bold py-6 px-4 rounded-2xl min-w-[100px] shadow-2xl">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-white text-sm mt-3 font-semibold tracking-widest uppercase opacity-90">Minutes</div>
            </div>
            <div className="text-center animate-fade-in-up animate-delay-400">
              <div className="countdown-card text-primary text-4xl md:text-5xl font-bold py-6 px-4 rounded-2xl min-w-[100px] shadow-2xl">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-white text-sm mt-3 font-semibold tracking-widest uppercase opacity-90">Seconds</div>
            </div>
          </div>
          
          <div className="animate-fade-in-up animate-delay-500">
            <button className="bg-white text-primary hover:bg-gray-50 font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 tracking-wide">
              SECURE YOUR SPOT
            </button>
            <p className="text-white/70 text-sm mt-4">✨ Free registration • No commitment required</p>
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

      {/* Featured Products Section */}
      <section id="products" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-1/2 -translate-x-48"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-bl from-accent/5 to-transparent rounded-full translate-x-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6 tracking-tight">
              Featured <span className="text-gradient-primary">Deals</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed">
              Discover exceptional savings on our most celebrated piano collections
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Digital Piano ES110", price: "$599", originalPrice: "$799", savings: "25%", image: "🎹", category: "Digital", featured: false },
              { name: "Upright Piano K-200", price: "$4,999", originalPrice: "$6,499", savings: "23%", image: "🎼", category: "Upright", featured: true },
              { name: "Grand Piano GX-2", price: "$39,999", originalPrice: "$49,999", savings: "20%", image: "🎵", category: "Grand", featured: true },
              { name: "Portable Piano MP7SE", price: "$1,299", originalPrice: "$1,599", savings: "19%", image: "🎶", category: "Portable", featured: false }
            ].map((product, index) => (
              <div key={index} className={`product-card rounded-3xl overflow-hidden shadow-xl animate-fade-in-up animate-delay-${(index + 1) * 100} ${
                product.featured ? 'ring-2 ring-primary/20' : ''
              }`}>
                {product.featured && (
                  <div className="bg-gradient-primary text-white text-xs font-bold px-3 py-1 absolute top-4 right-4 rounded-full z-10">
                    BEST SELLER
                  </div>
                )}
                
                <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-8xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  <div className="relative z-10 transform hover:scale-110 transition-transform duration-500">
                    {product.image}
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2 py-1 rounded-full">
                    {product.category}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{product.savings} OFF
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-dark mb-3 leading-tight">{product.name}</h3>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-gradient-primary">{product.price}</span>
                      <span className="text-gray-medium line-through text-lg">{product.originalPrice}</span>
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      You save ${parseInt(product.originalPrice.replace('$', '').replace(',', '')) - parseInt(product.price.replace('$', '').replace(',', ''))}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full btn-primary text-white font-semibold py-3 px-4 rounded-xl shadow-lg">
                      Learn More
                    </button>
                    <button className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-300">
                      Quick Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16 animate-fade-in-up animate-delay-500">
            <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-4 px-12 rounded-full hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-xl">
              View Complete Collection
            </button>
            <p className="text-gray-medium mt-4">🏆 Award-winning instruments • 🏠 Showroom available • 📞 Expert consultation</p>
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
