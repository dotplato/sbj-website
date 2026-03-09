"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const shipping = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
    };

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "checkout",
          data: {
            shipping,
            items,
            totalPrice,
          },
        }),
      });

      if (res.ok) {
        toast.success("Order Placed Successfully!", {
          description: "We've received your order and will contact you soon.",
        });
        clearCart();
        // Redirect or show success state
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500">
          Add some luxury to your cart before checking out.
        </p>
        <Link href="/collections">
          <Button style={{ backgroundColor: "#C6A15B" }}>
            Go to Collections
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 lg:pt-[85px]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-fancy text-gray-900 mb-8 border-b border-gray-200 pb-4">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Shipping Form */}
          <div className="space-y-8">
            <SectionReveal>
              <section className="bg-white p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 uppercase tracking-wider">
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        First Name
                      </label>
                      <Input
                        name="firstName"
                        required
                        placeholder="John"
                        className="rounded-none border-gray-200 focus:ring-[#C6A15B]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Last Name
                      </label>
                      <Input
                        name="lastName"
                        required
                        placeholder="Doe"
                        className="rounded-none border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="rounded-none border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      required
                      placeholder="+1 905 904 0067"
                      className="rounded-none border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Shipping Address
                    </label>
                    <Input
                      name="address"
                      required
                      placeholder="Street address, Apartment, etc."
                      className="rounded-none border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        City
                      </label>
                      <Input
                        name="city"
                        required
                        placeholder="Mississauga"
                        className="rounded-none border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Postal Code
                      </label>
                      <Input
                        name="postalCode"
                        required
                        placeholder="L4T 2G8"
                        className="rounded-none border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </SectionReveal>

            <SectionReveal>
              <section className="bg-white p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 uppercase tracking-wider">
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border border-[#C6A15B] bg-amber-50">
                    <div className="w-4 h-4 rounded-full bg-[#C6A15B] border-4 border-white ring-1 ring-[#C6A15B]" />
                    <span className="text-sm font-medium text-gray-900">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 opacity-50 cursor-not-allowed">
                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="text-sm font-medium text-gray-500">
                      Credit / Debit Card (Coming Soon)
                    </span>
                  </div>
                </div>
              </section>
            </SectionReveal>
          </div>

          {/* Order Summary */}
          <div className="relative">
            <div className="sticky top-32 space-y-6">
              <SectionReveal>
                <Card className="rounded-none border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gray-900 text-white p-4 text-center text-xs font-bold uppercase tracking-[0.2em]">
                    Order Summary
                  </div>
                  <CardContent className="p-0">
                    <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 items-center"
                        >
                          <div className="relative w-16 h-16 bg-gray-50 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate uppercase mt-1.5">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-[#C6A15B] font-bold tracking-widest mb-1">
                              {item.option}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.qty} x {item.price}
                            </p>
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            Rs.{(item.priceNum * item.qty).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-gray-50 space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>Rs.{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium uppercase tracking-widest text-[10px]">
                          Free
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <span className="text-base font-bold text-gray-900">
                          Total Price
                        </span>
                        <span
                          className="text-xl font-bold"
                          style={{ color: "#C6A15B" }}
                        >
                          Rs.{totalPrice.toLocaleString()}
                        </span>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl mt-6 rounded-none"
                        style={{ backgroundColor: "#C6A15B" }}
                      >
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {loading ? "Processing..." : "Complete Purchase"}
                      </Button>

                      <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest pt-4">
                        100% Secure Checkout &middot; Heritage Craftsmanship
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </SectionReveal>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
