'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'


const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
]

export function Footer() {

  const socialVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  }

  return (
    <footer className="backdrop-blur-md bg-kawai-black/95 text-kawai-pearl border-t border-kawai-neutral/20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <Image
                src="/images/kawai-logo-red-1x.png"
                alt="Kawai Piano"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-kawai-neutral mb-6 leading-relaxed">
              Crafting exceptional pianos for over 95 years. Experience the harmony of 
              traditional Japanese craftsmanship and innovative technology.
            </p>
            <div className="text-sm text-kawai-neutral/80">
              <div className="mb-2">Est. 1927 • Hamamatsu, Japan</div>
              <div>&ldquo;Making beautiful music accessible to all&rdquo;</div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-kawai-pearl">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-kawai-red" />
                <span>(713) 904-0001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-kawai-red" />
                <span>info@kawaipianoshouston.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-kawai-red" />
                <span>5800 Richmond Ave, Houston, TX 77057</span>
              </div>
            </div>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-kawai-pearl">Stay Connected</h3>
            <p className="text-kawai-neutral mb-4">
              Join our community for piano insights, artist stories, and exclusive events.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-kawai-black/60 border border-kawai-neutral/30 rounded-md text-kawai-pearl placeholder-kawai-neutral/60 focus:outline-none focus:ring-2 focus:ring-kawai-red backdrop-blur-sm"
              />
              <Button
                type="submit"
                className="px-6 py-2 bg-kawai-red hover:bg-kawai-red/90 text-white shadow-md hover:shadow-lg transition-all"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-kawai-neutral/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-kawai-neutral/80 text-sm mb-4 md:mb-0">
              © 2024 Kawai Musical Instruments Mfg. Co., Ltd. All rights reserved.
              <div className="mt-1">Crafted with precision in Hamamatsu, Japan since 1927.</div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.div key={social.label} variants={socialVariants} initial="initial" whileHover="hover">
                    <Link
                      href={social.href}
                      className="text-kawai-neutral/80 hover:text-kawai-red transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}