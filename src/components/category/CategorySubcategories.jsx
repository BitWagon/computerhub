import Link from "next/link";

import {
  Laptop,
  Monitor,
  Cpu,
  HardDrive,
  Keyboard,
  Mouse,
  Gamepad2,
  MemoryStick,
  CircuitBoard,
  Fan,
  Cable,
  Headphones,
  Webcam,
  Mic,
  Server,
} from "lucide-react";

const iconMap = {
  laptop: Laptop,
  monitor: Monitor,
  cpu: Cpu,
  hardDrive: HardDrive,
  keyboard: Keyboard,
  mouse: Mouse,
  gaming: Gamepad2,
  gamepad: Gamepad2,
  memory: MemoryStick,
  motherboard: CircuitBoard,
  fan: Fan,
  cable: Cable,
  headphones: Headphones,
  webcam: Webcam,
  microphone: Mic,
  server: Server,
};

export default function CategorySubcategories({
  items = [],
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-900">
          Shop by Subcategory
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Quickly narrow the catalog to the
          type of product you need.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const Icon =
            iconMap[item.icon] ||
            Laptop;

          return (
            <Link
              key={item.slug}
              href={`/category/${item.parent}?subcategory=${encodeURIComponent(
                item.slug
              )}`}
              className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={19} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-slate-900 transition group-hover:text-blue-600">
                  {item.name}
                </h3>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  Browse products
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}