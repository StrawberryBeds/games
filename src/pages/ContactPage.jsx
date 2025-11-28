import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import "./NewsItem.css";

export default function ContactPage() {
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2>Prenons contact!</h2>
      <p>Tu voudrais que je t'aide à réaliser ton prochain projet, n'hésite pas à prendre contact!</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom</label>
          <input id="name" type="text" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea id="message" value={formData.message} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
        {submitStatus === 'success' && <p>Merci pour ton message ! Je te répondrai bientôt.</p>}
        {submitStatus === 'error' && <p>Une erreur est survenue. Veuillez réessayer.</p>}
      </form>
    </>
  );
}
