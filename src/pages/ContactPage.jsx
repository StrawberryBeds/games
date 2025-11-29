import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import "./NewsItem.css";

export default function ContactPage() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
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
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          ...formData,
        }).toString(),
      });

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
      <h2>{t('contact_page.title')}</h2>
      <p>{t('contact_page.invite')}</p>
      <form
        name="contact"
        method="POST"
        data-netlify="true"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="form-name" value="contact" />
        <div>
          <label htmlFor="name">{t('contact_page.name')}</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email">{t('contact_page.email')}</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="message">{t('contact_page.message')}</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('contact_page.sending') :  t("contact_page.send_button")}
       </button>
        {submitStatus === 'success' && <p>{t('contact_page.success')}</p>}
        {submitStatus === 'error' && <p>{t('contact_page.error')}</p>}
      </form>
    </>
  );
}
