'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SectionHeading from './SectionHeading';
import { api } from '../lib/api';
import type { ApiError } from '../lib/api';
import styles from './Contact.module.scss';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Минимум 2 символа')
    .max(80, 'Максимум 80 символов'),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s\-()]{6,20}$/, 'Введите корректный телефон'),
  email: z.string().trim().email('Введите корректный email'),
  comment: z.string().max(2000, 'Слишком длинный текст').optional(),
  website: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setStatus('loading');
    setServerError(null);
    try {
      await api.contact(data);
      setStatus('success');
      reset();
    } catch (e) {
      const err = e as ApiError;
      setServerError(err.message ?? 'Не удалось отправить. Попробуйте ещё раз.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <div className="container">
        <SectionHeading
          index="05 / Контакты"
          kicker="Get in touch"
          title={
            <>
              Расскажите о задаче.<br />
              <em>Отвечу в течение суток.</em>
            </>
          }
        />

        <div className={styles.grid}>
          <aside className={styles.side}>
            <p className={styles.lead}>
              Заполните форму — копия письма уйдёт вам сразу, я отвечу на ваш
              email в рабочее время. Или напишите напрямую в Telegram, если так
              удобнее.
            </p>

            <div className={styles.directs}>
              <a href="mailto:worknesterov@yandex.kz" className={styles.directLink}>
                <span className={styles.directKey}>Email</span>
                <span className={styles.directVal}>worknesterov@yandex.kz</span>
              </a>
              <a
                href="https://t.me/Defenseman25"
                target="_blank"
                rel="noreferrer"
                className={styles.directLink}
              >
                <span className={styles.directKey}>Telegram</span>
                <span className={styles.directVal}>@Defenseman25 ↗</span>
              </a>
              <a
                href="https://github.com/Defenseman"
                target="_blank"
                rel="noreferrer"
                className={styles.directLink}
              >
                <span className={styles.directKey}>GitHub</span>
                <span className={styles.directVal}>github.com/Defenseman ↗</span>
              </a>
            </div>
          </aside>

          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Honeypot — hidden from real users */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className={styles.honeypot}
              {...register('website')}
            />

            <Field
              label="Имя"
              error={errors.name?.message}
              required
            >
              <input
                type="text"
                placeholder="Как к вам обращаться"
                disabled={status === 'loading'}
                aria-invalid={!!errors.name}
                {...register('name')}
              />
            </Field>

            <div className={styles.row}>
              <Field
                label="Телефон"
                error={errors.phone?.message}
                required
              >
                <input
                  type="tel"
                  placeholder="+7 999 000-00-00"
                  disabled={status === 'loading'}
                  aria-invalid={!!errors.phone}
                  {...register('phone')}
                />
              </Field>

              <Field
                label="Email"
                error={errors.email?.message}
                required
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  disabled={status === 'loading'}
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
              </Field>
            </div>

            <Field label="Комментарий" error={errors.comment?.message}>
              <textarea
                rows={5}
                placeholder="Коротко о задаче, сроках, бюджете…"
                disabled={status === 'loading'}
                aria-invalid={!!errors.comment}
                {...register('comment')}
              />
            </Field>

            <button
              type="submit"
              className={styles.submit}
              disabled={status === 'loading'}
              data-state={status}
            >
              {status === 'loading' && (
                <>
                  <span className={styles.spinner} aria-hidden />
                  Отправляю…
                </>
              )}
              {status === 'idle' && <>Отправить заявку →</>}
              {status === 'success' && <>✓ Отправлено</>}
              {status === 'error' && <>Попробовать ещё раз →</>}
            </button>

            {status === 'success' && (
              <div className={styles.success} role="status">
                <strong>Спасибо!</strong> Заявка отправлена. Копия письма уйдёт
                на ваш email в течение минуты.
              </div>
            )}

            {status === 'error' && (
              <div className={styles.error} role="alert">
                <strong>Ошибка:</strong> {serverError}
              </div>
            )}

            <p className={styles.privacy}>
              Отправляя форму, вы соглашаетесь на обработку персональных данных
              для связи с вами.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label}
        {required && <span className={styles.req}>*</span>}
      </span>
      {children}
      <span className={styles.errorMsg} aria-live="polite">
        {error ?? ''}
      </span>
    </label>
  );
}
