import { Tab } from "@headlessui/react";

import { useLanguage } from "./LanguageContext";
import { Key } from "lucide-react";

export function EventFilter({ onFilterChange }: any) {
  const { t } = useLanguage();
  const categories = [
    { key: "ALL", label: t.filters.all },
    { key: "SCHEDULED", label: t.filters.upcoming },
    { key: "COMPLETED", label: t.filters.past },
    { key: "DRAFT", label: t.filters.pending },
    { key: "REJECTED", label: t.filters.reject },
  ];

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <Tab.Group onChange={(index) => onFilterChange(categories[index].key)}>
        <Tab.List className="flex space-x-1 rounded-xl bg-white p-1">
          {categories.map((category) => (
            <Tab
              key={category.key}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700
                ring-white ring-opacity-60 ring-offset-2 ring-offset-pse-green focus:outline-none focus:ring-2
                ${
                  selected
                    ? "bg-pse-green text-white shadow"
                    : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-700"
                }`
              }
            >
              {category.label}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}
