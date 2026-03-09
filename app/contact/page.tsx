"use client";

import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import FeaturesSection from "@/components/FeaturesSection";
import SectionReveal from "@/components/SectionReveal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", data }),
      });

      if (res.ok) {
        toast.success("Message Sent", {
          description: "We'll get back to you as soon as possible.",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-14 sm:pt-16 lg:pt-[73px]">
      {/* Page Header */}
      <section className="bg-gray-50 py-20 px-4 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#C6A15B] mb-3">
          Get In Touch
        </p>
        <h1 className="text-4xl md:text-6xl font-fancy text-gray-900 mb-4 tracking-wider">
          Contact Us
        </h1>
        <div className="w-16 h-px bg-[#C6A15B] mx-auto" />
      </section>

      <section className="py-24 px-4 sm:px-8 lg:px-16 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <SectionReveal>
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 uppercase tracking-tight">
                  Visit Our Showroom
                </h2>
                <p className="text-gray-500 max-w-md leading-relaxed">
                  Step into a world of elegance. Our flagship store displays our
                  most exclusive collections and provides bespoke jewelry
                  services.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">
                      Location
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      7072, Airport Road, Mississauga
                      <br />
                      on L4T 2G8, Canada
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justifycenter shrink-0">
                    <Phone className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">
                      Call/WhatsApp
                    </h3>
                    <p className="text-gray-600 text-sm">+1 905 904 0067</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">
                      Email
                    </h3>
                    <p className="text-gray-600 text-sm">
                      newalnoorjewel@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">
                      Hours
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Mon - Sat: 11:00 AM - 9:00 PM
                      <br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Contact Form */}
          <SectionReveal>
            <div className="bg-[#fcfaf7] p-8 md:p-12 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-wider">
                Send A Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      required
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[var(--brand-gold)] outline-none transition-colors rounded-none"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      required
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[var(--brand-gold)] outline-none transition-colors rounded-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[var(--brand-gold)] outline-none transition-colors rounded-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Subject
                  </label>
                  <select
                    name="subject"
                    required
                    className="w-full h-11 bg-white border border-gray-200 px-4 py-2 text-sm focus:border-[var(--brand-gold)] outline-none transition-colors"
                  >
                    <option>General Inquiry</option>
                    <option>Bespoke Design</option>
                    <option>Bridal Consultation</option>
                    <option>After Sale Service</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:border-[var(--brand-gold)] outline-none transition-colors"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-6 text-xs font-semibold tracking-widest uppercase hover:bg-[var(--brand-gold)] transition-colors shadow-lg rounded-none"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {loading ? "Sending..." : "Submit Inquiry"}
                </Button>
              </form>
            </div>
          </SectionReveal>
        </div>
      </section>

      <SectionReveal>
        <FeaturesSection />
      </SectionReveal>

      {/* Map Section Placeholder */}
      <SectionReveal>
        <section className="h-[400px] bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 font-light italic">
              Interactive Map Integration
            </p>
          </div>
        </section>
      </SectionReveal>
    </main>
  );
}
