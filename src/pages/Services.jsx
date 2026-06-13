import React from "react";
import "../styles/services.css";

const services = [
  {
    num: "01",
    name: "Web design",
    tag: "Responsive layouts, landing pages, and conversion-focused websites.",
  },
  {
    num: "02",
    name: "Mobile-first design",
    tag: "Touch-ready interfaces that feel clean across phone and desktop.",
  },
  {
    num: "03",
    name: "UI / UX design",
    tag: "Research, wireframes, user journeys, and product interface systems.",
  },
  {
    num: "04",
    name: "Performance optimisation",
    tag: "Fast-loading pages with clean frontend structure and Core Web Vitals focus.",
  },
  {
    num: "05",
    name: "Brand identity",
    tag: "Visual language, art direction, and design systems for premium brands.",
  },
  {
    num: "06",
    name: "Frontend development",
    tag: "React builds, animation-ready components, and CMS-friendly handoff.",
  },
];

function Services() {
  return (
    <main className="page services-page">
      <section className="content-section">
        <p className="eyebrow">Services</p>
        <h1>Digital experiences built to perform.</h1>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.num}>
              <span className="service-number">{service.num}</span>
              <h2>{service.name}</h2>
              <p>{service.tag}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Services;
