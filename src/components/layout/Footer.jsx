import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Headphones,
  Banknote,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* Newsletter / Join section */}
      <section className="border-b border-white/10">
        <div className="container-main py-12">
          <div className="flex flex-col justify-between gap-8 rounded-3xl bg-blue-600 p-7 sm:p-10 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
                Stay Updated
              </p>

              <h2 className="text-2xl font-black sm:text-3xl">
                Get the latest tech deals
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Stay informed about new products, special offers and
                technology updates from ComputerHub.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Join ComputerHub
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="container-main py-14">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <span className="text-lg font-black">C</span>
              </div>

              <div className="text-2xl font-black">
                Computer<span className="text-blue-500">Hub</span>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
              ComputerHub is a technology marketplace built for people
              who want better computers, smarter upgrades and reliable
              technology products in one place.
            </p>

            {/* Contact information */}
            <div className="mt-6 space-y-3 text-sm text-gray-400">
              <a
                href="mailto:support@computerhub.com"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Mail
                  size={17}
                  className="shrink-0 text-blue-400"
                />

                support@computerhub.com
              </a>

              <a
                href="tel:+10000000000"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Phone
                  size={17}
                  className="shrink-0 text-blue-400"
                />

                +1 000 000 0000
              </a>

              <div className="flex items-center gap-3">
                <MapPin
                  size={17}
                  className="shrink-0 text-blue-400"
                />

                Technology Marketplace
              </div>
            </div>

            {/* Social media */}
            <div className="mt-6 flex gap-2">
              <SocialButton
                href="https://facebook.com"
                label="Facebook"
                icon={<FacebookIcon />}
              />

              <SocialButton
                href="https://instagram.com"
                label="Instagram"
                icon={<InstagramIcon />}
              />

              <SocialButton
                href="https://twitter.com"
                label="Twitter / X"
                icon={<TwitterIcon />}
              />

              <SocialButton
                href="https://linkedin.com"
                label="LinkedIn"
                icon={<LinkedinIcon />}
              />
            </div>
          </div>

          {/* Shop */}
          <FooterColumn
            title="Shop"
            links={[
              ["All Products", "/products"],
              ["Laptops", "/category/laptops"],
              ["Desktop PCs", "/category/desktops"],
              ["PC Components", "/category/components"],
              ["Monitors", "/category/monitors"],
              ["Gaming", "/category/gaming"],
              ["Accessories", "/category/accessories"],
            ]}
          />

          {/* Customer Help */}
          <FooterColumn
            title="Customer Help"
            links={[
              ["My Account", "/account"],
              ["My Orders", "/orders"],
              ["Wishlist", "/wishlist"],
              ["Shopping Cart", "/cart"],
              ["Checkout", "/checkout"],
              ["Contact Us", "/contact"],
              ["FAQs", "/faq"],
            ]}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={[
              ["About ComputerHub", "/about"],
              ["Become a Seller", "/seller"],
              ["Seller Dashboard", "/seller"],
              ["Privacy Policy", "/privacy"],
              ["Terms & Conditions", "/terms"],
              ["Cookie Policy", "/cookies"],
            ]}
          />
        </div>

        {/* Trust features */}
        <div className="mt-14 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <TrustItem
            icon={ShieldCheck}
            title="Secure Shopping"
            text="Your shopping experience is protected."
          />

          <TrustItem
            icon={Truck}
            title="Reliable Delivery"
            text="Get your technology delivered with care."
          />

          <TrustItem
            icon={Banknote}
            title="Cash on Delivery"
            text="Pay in cash when your order arrives."
          />

          <TrustItem
            icon={Headphones}
            title="Customer Support"
            text="We're here to help when you need us."
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="container-main flex flex-col gap-3 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ComputerHub. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link
              href="/privacy"
              className="transition hover:text-gray-300"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-gray-300"
            >
              Terms
            </Link>

            <Link
              href="/cookies"
              className="transition hover:text-gray-300"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white">
        {title}
      </h3>

      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={`${label}-${href}`}>
            <Link
              href={href}
              className="text-sm text-gray-400 transition hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialButton({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:border-blue-500/30 hover:bg-blue-600 hover:text-white"
    >
      {icon}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.67.33-1 1-1Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.49 22H3.38l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.8h1.73L8.36 4.08H6.5L17.8 19.8Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.5 8.5A2.5 2.5 0 1 0 6.5 3a2.5 2.5 0 0 0 0 5.5ZM4 10h5v11H4V10Zm8 0h4.8v1.5h.07c.67-1.17 2.3-2.4 4.73-2.4 5.06 0 6 3.33 6 7.66V21h-5v-3.77c0-.9-.02-2.06-1.25-2.06-1.25 0-1.44.98-1.44 2V21h-5V10Z" />
    </svg>
  );
}

function TrustItem({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-blue-400">
        <Icon size={19} />
      </div>

      <div>
        <h4 className="text-sm font-bold text-white">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
}