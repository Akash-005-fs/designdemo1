import React from "react";
import { Mail } from "lucide-react";
import "../styles/contact.css";

function Contact() {
  return (
    <main className="page contact-page">
      <section className="content-section narrow">
        <p className="eyebrow">Contact</p>
        <h1>Let us talk about your next project.</h1>
        <p>
          Send your project details and timeline. We will help shape the right design
          direction.
        </p>
        <a className="primary-link" href="mailto:hello@designagency.com">
          <Mail size={18} /> hello@designagency.com
        </a>
      </section>
    </main>
  );
}

export default Contact;
