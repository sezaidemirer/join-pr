'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  topic: '',
  message: '',
};

export function ContactView() {
  const { translations } = useLanguage();
  const form = translations.contact.form;
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const onChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setFormState(INITIAL_STATE);
    setFeedback(form.success);
  };

  return (
    <div className="flex flex-col gap-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-500/10 via-sky-900/50 to-slate-950 p-10 shadow-2xl shadow-sky-950/40 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_60%)]" />
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.38em] text-sky-200">{translations.common.menu.contact}</span>
          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{translations.contact.hero.title}</h1>
          <p className="max-w-2xl text-lg text-zinc-200">{translations.contact.hero.description}</p>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-lg shadow-black/30">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField label={form.name} value={formState.name} onChange={onChange('name')} required />
            <FormField label={form.company} value={formState.company} onChange={onChange('company')} />
            <FormField label={form.email} type="email" value={formState.email} onChange={onChange('email')} required />
            <FormField label={form.phone} value={formState.phone} onChange={onChange('phone')} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">{form.topic}</label>
              <select
                value={formState.topic}
                onChange={onChange('topic')}
                required
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="">{form.topicPlaceholder}</option>
                {translations.contact.topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">{form.message}</label>
              <textarea
                value={formState.message}
                onChange={onChange('message')}
                placeholder={form.messagePlaceholder}
                required
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 md:h-[180px]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-sky-500/30 transition-transform hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? '...' : form.submit}
            </button>
            {feedback && <p className="text-sm font-medium text-teal-300">{feedback}</p>}
          </div>
        </form>
        <aside className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8">
          <h3 className="text-2xl font-semibold text-white">{translations.common.footer.title}</h3>
          <p className="text-sm text-zinc-300">{translations.common.tagline}</p>
          <div className="space-y-3 text-sm text-zinc-300">
            <p>
              <span className="font-medium text-white">{translations.common.footer.addressLabel}:</span>{' '}
              {translations.common.footer.address}
            </p>
            <p>
              <span className="font-medium text-white">{translations.common.footer.emailLabel}:</span>{' '}
              <a href="mailto:hello@joinpr.co" className="text-sky-300 hover:underline">
                hello@joinpr.co
              </a>
            </p>
            <p>
              <span className="font-medium text-white">{translations.common.footer.phoneLabel}:</span>{' '}
              <a href="tel:+902125554433" className="text-sky-300 hover:underline">
                +90 212 555 44 33
              </a>
            </p>
          </div>
          <div className="mt-auto rounded-2xl border border-white/10 bg-black/40 p-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-200">{translations.common.cta.contactUs}</h4>
            <p className="mt-3 text-sm text-zinc-400">
              {translations.common.footer.newsletterDescription}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function FormField({ label, type = 'text', value, onChange, required }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=""
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
      />
    </div>
  );
}

