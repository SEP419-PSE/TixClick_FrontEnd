import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
import { useLanguage } from "../../../organizer/components/LanguageContext"


export default function Policy() {
  const { t } = useLanguage()

  return (
    <div className="p-6">
      <div className="bg-[#1E1E1E] rounded-lg p-4">
        <Accordion type="single" collapsible>
          {t.terms.items.map((term) => (
            <AccordionItem key={term.id} value={term.id}>
              <AccordionTrigger className="text-white hover:text-white">{term.title}</AccordionTrigger>
              <AccordionContent className="text-gray-400">{term.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

