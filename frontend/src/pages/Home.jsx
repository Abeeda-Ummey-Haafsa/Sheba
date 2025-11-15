import React from "react";
import SectionHeading from "../components/SectionHeading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Hero = () => (
  <section className="min-h-[70vh] flex items-center bg-gradient-to-r from-primary/20 to-accent/10">
    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Seba — Trusted Eldercare
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          বৃদ্ধাঙ্গনের যত্নে দিয়েছে স্বতন্ত্র, বিশ্বাসযোগ্য সহায়তা।
        </p>
        <div className="mt-6 flex gap-3">
          <a href="#" className="px-5 py-3 bg-primary text-white rounded">
            Get Started
          </a>
          <a href="#" className="px-5 py-3 border rounded">
            Learn More
          </a>
        </div>
      </div>
      <div className="relative">
        <div className="w-full h-80 bg-white rounded shadow flex items-center justify-center">
          Image Placeholder
        </div>
      </div>
    </div>
  </section>
);

const Problem = () => (
  <section id="problem" className="py-12">
    <div className="max-w-6xl mx-auto px-6">
      <SectionHeading
        title="The Problem"
        subtitle="বৃদ্ধাঙ্গণের যত্নে সাধারণ সমস্যা"
      />
      <div className="grid md:grid-cols-3 gap-4">
        {[{ k: "Care gaps" }, { k: "Trust" }, { k: "Access" }].map((s) => (
          <div key={s.k} className="p-4 border rounded">
            <h3 className="font-semibold">{s.k}</h3>
            <p className="text-gray-600 mt-2">
              Short description of the problem in English and Bangla.
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const What = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <section id="what" className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading title="What is Seba?" subtitle="Seba কি?" />
        <Slider {...settings}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 bg-white rounded shadow">
              Slide {i} content about Seba features and benefits.
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div>
      <Hero />
      <Problem />
      <What />
      <section id="how" className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            title="How It Works"
            subtitle="3 steps to book care"
          />
          <div className="grid md:grid-cols-3 gap-4">
            {["Choose", "Book", "Care"].map((s) => (
              <div key={s} className="p-6 bg-white rounded shadow">
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading title="Pricing" subtitle="Simple, transparent" />
          <div className="grid md:grid-cols-3 gap-4">
            {["Basic", "Standard", "Premium"].map((p, i) => (
              <div
                key={p}
                className={`p-6 rounded shadow ${
                  p === "Premium" ? "border-2 border-primary" : "bg-white"
                }`}
              >
                <h3 className="font-semibold">{p}</h3>
                <p className="mt-2">Features...</p>
                <div className="mt-4">
                  <a
                    className="px-4 py-2 rounded text-white cursor-pointer"
                    style={{
                      background: p === "Premium" ? "#14B8A6" : "#3B82F6",
                    }}
                  >
                    Choose
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div>
            <SectionHeading title="About Us" subtitle="Our mission and team" />
            <p>Seba is built for trustworthy eldercare in Bangladesh.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">Team and partners</div>
        </div>
      </section>

      <section id="contact" className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div>
            <SectionHeading title="Contact Us" />
            <form className="space-y-3">
              <input className="w-full p-3 border rounded" placeholder="Name" />
              <input
                className="w-full p-3 border rounded"
                placeholder="Email"
              />
              <textarea
                className="w-full p-3 border rounded"
                placeholder="Message"
              />
              <button className="px-4 py-2 bg-primary text-white rounded">
                Send
              </button>
            </form>
          </div>
          <div>
            <SectionHeading title="Headquarters" />
            <p>Dhaka, Bangladesh</p>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-4">
          <div>
            <div className="font-bold">Seba</div>
            <div className="text-sm text-gray-600">
              সেবা — Trusted eldercare
            </div>
          </div>
          <div>Quick Links</div>
          <div>Support</div>
          <div>Newsletter</div>
        </div>
      </footer>
    </div>
  );
}
