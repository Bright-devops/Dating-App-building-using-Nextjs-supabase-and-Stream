"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      {/* Hero / Banner Section */}
      <section
        className="relative h-screen flex flex-col justify-center items-center text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-pink-500">Lovistry</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Meet people who share your story. Find love, connection, and community — your way.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="http://localhost:3000/auth"
              className="bg-pink-600 hover:bg-pink-700 transition-colors px-6 py-3 rounded-full font-semibold text-lg shadow-lg"
            >
              Get Started
            </a>
            <a
              href="#learnmore"
              className="border border-white hover:bg-white hover:text-pink-600 transition-colors px-6 py-3 rounded-full font-semibold text-lg"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Tinder Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-[120px] animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white text-gray-800 dark:bg-black dark:text-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">Why Choose Lovistry?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-3xl mb-4">
                ❤️
              </div>
              <h3 className="text-2xl font-semibold mb-2">Real Connections</h3>
              <p>We focus on meaningful relationships, not just swipes. Meet real people who understand you.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-3xl mb-4">
                🔥
              </div>
              <h3 className="text-2xl font-semibold mb-2">Smart Matching</h3>
              <p>Our algorithm helps you meet people who share your interests and life goals.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-3xl mb-4">
                💬
              </div>
              <h3 className="text-2xl font-semibold mb-2">Easy Conversations</h3>
              <p>Break the ice with smart prompts and authentic ways to start chatting instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-red-500 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Find Your Match Today</h2>
        <p className="mb-8 text-lg">Join thousands who’ve already found love on Lovistry.</p>
        <a
          href="http://localhost:3000/auth"
          className="bg-white text-pink-600 hover:bg-gray-100 transition-colors px-8 py-3 rounded-full font-semibold text-lg shadow-lg"
        >
          Join Lovistry Free
        </a>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center text-center md:text-left gap-6">
  {/* Image on left column */}
  <div className="flex-shrink-0 w-36 h-36 relative rounded-full overflow-hidden">
    <Image
      src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&q=80"
      alt="Sarah & Michael"
      fill
      className="object-cover"
      priority
    />
  </div>
  {/* Text on right column */}
  <div className="flex flex-col justify-center">
    <h3 className="text-xl font-semibold mb-2">Sarah & Michael</h3>
    <p>
      "We matched on our first day using Lovistry. Six months later, we're planning our future together. This app changed everything."
    </p>
  </div>
</div>


            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
              <Image
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&q=80"
                alt="Emma & James"
                width={150}
                height={150}
                className="rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Emma & James</h3>
              <p>
                "Long distance seemed impossible until Lovistry. Now we're living in the same city and couldn't be happier."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
              <Image
                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=200&q=80"
                alt="Olivia & David"
                width={150}
                height={150}
                className="rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Olivia & David</h3>
              <p>
                "After trying countless apps, Lovistry finally connected me with someone who truly understands me. We're engaged now!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">&copy; 2024 Lovistry. All rights reserved.</p>
          <div className="space-x-6">
            <a href="#" className="hover:text-pink-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
