import React from "react";
import "../styles/services.css";

const services = [
  "Brand identity systems",
  "Website design",
  "Social media creatives",
  "Campaign landing pages",
];

function Services() {
  return (
    <main className="page services-page">
      <section className="content-section">
        <p className="eyebrow">Services provided</p>
        <h1>Design support for growing businesses.</h1>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service}>
              <h2>{service}</h2>
              <p>
                Thoughtful creative direction with clean visuals and practical delivery.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Services;
