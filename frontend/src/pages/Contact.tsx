import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContactForm } from "@/components/shared/ContactForm";
import { Phone, Mail, MapPin, Clock, MessageCircle, ChevronRight, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: "(774) 487-6389",
    description: "Mon-Fri from 9am to 6pm",
    href: "tel:+17744876389",
    cta: "Call Now",
  },
  {
    icon: Mail,
    title: "Email",
    details: "travelwith@themasjesticvacations.com",
    description: "We reply within 24 hours",
    href: "mailto:travelwith@themasjesticvacations.com",
    cta: "Send Email",
  },
  {
    icon: MapPin,
    title: "Office",
    details: "123 Travel Street, Suite 100",
    description: "New York, NY 10001",
    href: "#map",
    cta: "View Map",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon - Fri: 9am - 6pm",
    description: "Sat: 10am - 4pm",
    href: "#",
    cta: "Schedule Call",
  },
];

const backgroundUrl = 'https://static.vecteezy.com/system/resources/thumbnails/021/698/967/small/man-pointing-at-a-wooden-block-communication-concept-with-email-message-box-and-contacts-icons-website-page-contact-connection-with-modern-network-technology-borderless-communication-contact-us-free-photo.jpg';

export default function Contact() {
  return (
    <Layout>
      {/* Hero Section with Background Image */}
      <section
        className="relative py-44 md:py-40 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${backgroundUrl})`,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-white/90 leading-relaxed">
              Ready to start planning your dream vacation? Our travel experts are here to help you create something amazing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 px-8 py-6 text-lg rounded-full">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Conversation
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-6 text-lg rounded-full">
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 bg-gradient-to-b from-secondary to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Multiple Ways to Connect
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred method to reach our travel experts
            </p>
          </div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {contactInfo.map((item, index) => (
    <a
      key={index}
      href={item.href}
      className="group bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 transform text-center block"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 text-accent mb-6 group-hover:scale-110 transition-transform duration-500">
        <item.icon className="h-8 w-8" />
      </div>

      <h3 className="font-semibold text-xl mb-2">
        {item.title}
      </h3>

      {/* FIXED EMAIL OVERFLOW */}
      <p className="text-foreground font-medium text-lg mb-2 break-all text-center px-2">
        {item.details}
      </p>

      <p className="text-sm text-muted-foreground mb-4">
        {item.description}
      </p>

      <span className="inline-flex items-center justify-center text-accent text-sm font-medium group-hover:gap-2 transition-all duration-300">
        {item.cta}
        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </span>
    </a>
  ))}
</div>

        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-background" id="contact-form">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="sticky top-24">
                <SectionHeading
                  title="Send Us a Message"
                  subtitle="Fill out the form below and our travel experts will get back to you within 24 hours."
                  centered={false}
                />
                <div className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-2xl">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Information Sidebar */}
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-3xl border border-border">
                  <h3 className="font-serif text-2xl font-bold mb-6">Why Choose Us</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">24/7 Support</h4>
                        <p className="text-muted-foreground text-sm">Round-the-clock assistance for your travel needs</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Expert Consultation</h4>
                        <p className="text-muted-foreground text-sm">Personalized travel planning with industry experts</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold">Fast Response</h4>
                        <p className="text-muted-foreground text-sm">Guaranteed response within 24 hours</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-card p-8 rounded-3xl border border-border">
                  <h3 className="font-serif text-2xl font-bold mb-6">Need Immediate Help?</h3>
                  <div className="space-y-4">
                    <Button className="w-full justify-start py-6 text-lg" size="lg">
                      <Phone className="mr-3 h-5 w-5" />
                      Emergency Travel Support
                    </Button>
                    {/* <Button variant="outline" className="w-full justify-start py-6 text-lg" size="lg">
                      <MessageCircle className="mr-3 h-5 w-5" />
                      Live Chat Support
                    </Button> */}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-accent/10 to-transparent p-8 rounded-3xl border border-accent/20">
                  <h3 className="font-serif text-2xl font-bold mb-4">Average Response Time</h3>
                  <div className="text-5xl font-bold text-accent mb-2">2-4 hours</div>
                  <p className="text-muted-foreground">During business hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section with Background Image Effect */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundUrl})`,
        }}
        id="map"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25280949902!2d-74.11976389828745!3d40.69766374851773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1703000000000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Majestic Vacations Office Location"
          className="z-0"
        />

        <div className="absolute inset-0 flex items-center justify-end p-4 md:p-8">
          <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-serif font-bold mb-4 text-gray-800">
              Visit Our Headquarters
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Location</h4>
                <p className="text-gray-600">
                  123 Travel Street, Suite 100<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Parking Available</h4>
                <p className="text-gray-600 text-sm">Underground parking accessible 24/7</p>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 py-6 text-lg">
                <Navigation className="mr-2 h-5 w-5" />
                Get Directions
              </Button>
              <p className="text-sm text-gray-500 text-center mt-4">
                Free consultation available on-site
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}