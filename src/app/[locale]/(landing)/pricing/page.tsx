import {
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  CreditCardIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
              <span className="text-muted-foreground">Simple Pricing</span>
            </div>
            <h1 className="mt-6 font-medium text-4xl leading-tight tracking-tight md:text-5xl">
              <span className="block text-foreground">Invest in Your</span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Choose the plan that fits your learning goals. All plans include
              our core scientific learning methodology and personalized
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Pricing toggle */}
          <div className="mx-auto mb-12 flex max-w-xs items-center justify-center space-x-4">
            <span className='font-medium text-muted-foreground text-sm'>
              Monthly
            </span>
            <div className="relative inline-flex h-6 w-12 items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
              <div className="absolute left-1 h-4 w-4 rounded-full bg-primary transition-transform" />
            </div>
            <span className='font-medium text-sm'>
              Yearly
              <span className='ml-1.5 rounded-full bg-primary/20 px-2 py-0.5 text-primary text-xs'>
                Save 20%
              </span>
            </span>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Free plan */}
            <div className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
              <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="mb-5">
                <h3 className='font-medium text-lg'>Starter</h3>
                <div className="mt-2 flex items-baseline">
                  <span className='font-bold text-4xl'>$0</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className='mt-3 text-muted-foreground text-sm'>
                  Perfect for beginners exploring scientific learning methods.
                </p>
              </div>

              <div className="mt-6 mb-8 space-y-4">
                {[
                  'Basic spaced repetition system',
                  'Up to 3 learning modules',
                  'Progress tracking dashboard',
                  'Community forum access',
                  'Mobile app access',
                ].map((feature) => (
                  <div key={feature} className="flex items-center">
                    <CheckIcon className="mr-3 h-5 w-5 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Pro plan - highlighted */}
            <div className="group relative rounded-xl border border-primary/30 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-white/10">
              <div className='-inset-0.5 -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent blur-sm' />
              <div className='-z-10 absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5' />

              <div className='-top-5 absolute right-0 left-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 font-medium text-xs'>
                Most Popular
              </div>

              <div className="mb-5">
                <h3 className='font-medium text-lg'>Pro</h3>
                <div className="mt-2 flex items-baseline">
                  <span className='font-bold text-4xl'>$12</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className='mt-3 text-muted-foreground text-sm'>
                  Ideal for dedicated learners seeking optimal results.
                </p>
              </div>

              <div className="mt-6 mb-8 space-y-4">
                {[
                  'Advanced spaced repetition algorithm',
                  'Unlimited learning modules',
                  'AI-powered personalization',
                  'Detailed analytics and insights',
                  'Priority community support',
                  'Offline access',
                  'Advanced progress tracking',
                ].map((feature) => (
                  <div key={feature} className="flex items-center">
                    <CheckIcon className="mr-3 h-5 w-5 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className='group relative w-full overflow-hidden'>
                <span className="relative z-10">Get Pro</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Enterprise plan */}
            <div className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
              <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="mb-5">
                <h3 className='font-medium text-lg'>Enterprise</h3>
                <div className="mt-2 flex items-baseline">
                  <span className='font-bold text-4xl'>$49</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className='mt-3 text-muted-foreground text-sm'>
                  For organizations and teams seeking comprehensive solutions.
                </p>
              </div>

              <div className="mt-6 mb-8 space-y-4">
                {[
                  'Everything in Pro plan',
                  'Team management dashboard',
                  'Custom learning paths',
                  'API access',
                  'Dedicated account manager',
                  'Custom integrations',
                  'Advanced analytics and reporting',
                  'SSO and advanced security',
                ].map((feature) => (
                  <div key={feature} className="flex items-center">
                    <CheckIcon className="mr-3 h-5 w-5 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              >
                Contact Sales
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature comparison section */}
      <section className='relative bg-white/5 py-24'>
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Compare Plans
              </span>
            </h2>
            <p className="text-muted-foreground">
              Find the perfect plan for your learning journey
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className='border-white/10 border-b'>
                  <th className='px-6 py-4 text-left font-medium'>Features</th>
                  <th className='px-6 py-4 text-center font-medium'>Starter</th>
                  <th className='px-6 py-4 text-center font-medium'>
                    <span className="text-primary">Pro</span>
                  </th>
                  <th className='px-6 py-4 text-center font-medium'>
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: 'Learning Modules',
                    starter: 'Up to 3',
                    pro: 'Unlimited',
                    enterprise: 'Unlimited',
                  },
                  {
                    feature: 'Spaced Repetition',
                    starter: 'Basic',
                    pro: 'Advanced',
                    enterprise: 'Advanced + Custom',
                  },
                  {
                    feature: 'AI Personalization',
                    starter: '—',
                    pro: 'Included',
                    enterprise: 'Advanced',
                  },
                  {
                    feature: 'Analytics',
                    starter: 'Basic',
                    pro: 'Detailed',
                    enterprise: 'Enterprise-grade',
                  },
                  {
                    feature: 'Team Features',
                    starter: '—',
                    pro: '—',
                    enterprise: 'Included',
                  },
                  {
                    feature: 'API Access',
                    starter: '—',
                    pro: '—',
                    enterprise: 'Full Access',
                  },
                  {
                    feature: 'Support',
                    starter: 'Community',
                    pro: 'Priority',
                    enterprise: 'Dedicated',
                  },
                ].map((row) => (
                  <tr
                    key={row.feature}
                    className='border-white/5 border-b hover:bg-white/5'
                  >
                    <td className='px-6 py-4 font-medium text-sm'>
                      {row.feature}
                    </td>
                    <td className='px-6 py-4 text-center text-muted-foreground text-sm'>
                      {row.starter === '—' ? (
                        <span className="inline-block h-4 w-4 rounded-full bg-white/10" />
                      ) : (
                        row.starter
                      )}
                    </td>
                    <td className='px-6 py-4 text-center text-sm'>
                      {row.pro === '—' ? (
                        <span className="inline-block h-4 w-4 rounded-full bg-white/10" />
                      ) : (
                        <span className="text-primary">{row.pro}</span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-center text-muted-foreground text-sm'>
                      {row.enterprise === '—' ? (
                        <span className="inline-block h-4 w-4 rounded-full bg-white/10" />
                      ) : (
                        row.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
            <p className="text-muted-foreground">
              Join thousands of satisfied learners who have transformed their
              learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "The Pro plan has completely transformed how I study. I'm retaining information longer and learning more efficiently than ever before.",
                author: 'Sarah J.',
                role: 'Medical Student',
                stars: 5,
                id: 'testimonial-1',
              },
              {
                quote:
                  "Worth every penny. The advanced algorithms adapt perfectly to my learning style, and I've seen measurable improvements in my recall ability.",
                author: 'Michael T.',
                role: 'Software Engineer',
                stars: 5,
                id: 'testimonial-2',
              },
              {
                quote:
                  'Our team uses the Enterprise plan to standardize training. The analytics help us identify knowledge gaps and improve our onboarding process.',
                author: 'Lisa R.',
                role: 'HR Director',
                stars: 5,
                id: 'testimonial-3',
              },
            ].map((testimonial) => (
              <div
                key={testimonial.id}
                className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <StarIcon
                      key={`star-${testimonial.id}-${i}`}
                      className="h-4 w-4 text-amber-400"
                    />
                  ))}
                </div>

                <p className="mb-6 text-muted-foreground">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10" />
                  <div className="ml-3">
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-muted-foreground text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className='relative bg-white/5 py-24'>
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {[
              {
                question: 'Can I switch between plans?',
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the start of your next billing cycle.",
                id: 'faq-1',
              },
              {
                question: 'Is there a free trial for paid plans?',
                answer:
                  "Yes, we offer a 14-day free trial for our Pro plan. No credit card required to start. You'll get full access to all Pro features during the trial period.",
                id: 'faq-2',
              },
              {
                question: 'What payment methods do you accept?',
                answer:
                  'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. Enterprise customers can also pay via invoice.',
                id: 'faq-3',
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer:
                  "We offer a 30-day money-back guarantee for all paid plans. If you're not completely satisfied, contact our support team within 30 days of purchase for a full refund.",
                id: 'faq-4',
              },
              {
                question: 'Do you offer discounts for students or educators?',
                answer:
                  'Yes, we offer a 50% discount on our Pro plan for verified students and educators. Contact our support team with your academic credentials to apply.',
                id: 'faq-5',
              },
            ].map((faq) => (
              <div
                key={faq.id}
                className="rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <h3 className="font-medium text-lg">{faq.question}</h3>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12">
            <div className="relative z-10">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="mb-4 font-medium text-3xl">
                  Ready to Transform Your Learning Experience?
                </h2>
                <p className="mb-8 text-muted-foreground">
                  Join thousands of learners who have already discovered the
                  power of scientific learning with Gradual.
                </p>
                <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                  <Button size="lg" className="group relative overflow-hidden">
                    <span className="relative z-10">Get Started Now</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  >
                    <CreditCardIcon className="mr-2 h-4 w-4" />
                    View All Plans
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className='-z-10 absolute inset-0 overflow-hidden rounded-2xl'>
              <div className='-top-24 -right-24 absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
              <div className='-bottom-24 -left-24 absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
