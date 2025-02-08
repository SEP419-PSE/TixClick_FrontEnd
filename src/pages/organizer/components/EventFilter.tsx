import { Tab } from '@headlessui/react'
import { useState } from 'react'
import { useLanguage } from './LanguageContext'

export function EventFilter() {
  const { t } = useLanguage()
  const [categories] = useState([
    t.filters.all,
    t.filters.upcoming,
    t.filters.past,
    t.filters.pending,
  ])

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-white p-1">
          {categories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700
                ring-white ring-opacity-60 ring-offset-2 ring-offset-pse-green focus:outline-none focus:ring-2
                ${
                  selected
                    ? 'bg-pse-green text-white shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-700'
                }`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  )
}

