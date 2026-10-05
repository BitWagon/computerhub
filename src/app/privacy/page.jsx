import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Cookie,
  Eye,
  Lock,
  Mail,
  Shield,
  ShoppingBag,
  User,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | ComputerHub",
  description:
    "Learn how ComputerHub collects, uses and protects your personal information.",
};

const sections = [
  {
    icon: User,
    title: "Information We Collect",
    content:
      "We collect the information you provide when creating an account, placing an order, contacting support, or becoming a seller. This may include your name, email address, phone number, shipping address, and order details.",
  },
  {
    icon: ShoppingBag,
    title: "How We Use Your Information",
    content:
      "Your information is used to process orders, provide customer support, improve our marketplace, communicate important updates, and maintain account security.",
  },
  {
    icon: Lock,
    title: "How We Protect Your Data",
    content:
      "We use secure authentication, encrypted connections (HTTPS), and restricted access to protect your personal information from unauthorized access or misuse.",
  },
  {
    icon: Eye,
    title: "Information Sharing",
    content:
      "We do not sell your personal information. Information is only shared when necessary to complete your order, comply with legal requirements, or support essential marketplace services.",
  },
  {
    icon: Cookie,
    title: "Cookies",
    content:
      "ComputerHub uses cookies to remember your preferences, keep you signed in, and improve website performance. You can manage cookies through your browser settings.",
  },
  {
    icon: Mail,
    title: "Your Rights",
    content:
      "You can update your account information, request support regarding your personal data, and contact us with privacy-related questions.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="container-main py-14 sm:py-18 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              <Shield size={15} />
              Privacy & Security
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Your privacy matters.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This policy explains what information ComputerHub collects,
              how it is used, and the measures used to help protect it.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300">
                <Clock size={15} />
                Updated September 2026
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300">
                <Lock size={15} />
                Secure Marketplace
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container-main -mt-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Highlight
            icon={Shield}
            title="Secure Shopping"
            text="Account and order information is handled using secure technologies."
          />

          <Highlight
            icon={Eye}
            title="No Data Selling"
            text="We do not sell your personal information to third parties."
          />

          <Highlight
            icon={Lock}
            title="Protected Information"
            text="Secure connections help protect information exchanged with the website."
          />
        </div>
      </section>

      {/* Policy */}
      <section className="container-main py-12 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      {section.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {section.content}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Good practices */}
      <section className="container-main pb-12 sm:pb-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Account Security
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Keep your account information protected
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <SecurityTip text="Use a strong, unique password." />
            <SecurityTip text="Keep your contact information up to date." />
            <SecurityTip text="Do not share your account credentials." />
            <SecurityTip text="Contact support if you notice unusual activity." />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container-main pb-14 sm:pb-20">
        <div className="rounded-3xl bg-blue-600 p-8 text-white sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                Privacy Support
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Questions about your privacy?
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                Contact ComputerHub if you have questions about your
                information or this Privacy Policy.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-blue-700 hover:bg-slate-100"
              >
                Contact Support
                <ArrowRight size={16} />
              </Link>

              <a
                href="mailto:support@computerhub.com?subject=ComputerHub%20Privacy%20Question"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3.5 text-sm font-bold text-white hover:bg-white/10"
              >
                <Mail size={16} />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Highlight({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={21} />
      </div>

      <h3 className="mt-4 text-base font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function SecurityTip({ text }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
      <CheckCircle2
        size={18}
        className="mt-0.5 shrink-0 text-blue-600"
      />

      <span className="text-sm font-semibold text-slate-700">
        {text}
      </span>
    </div>
  );
}