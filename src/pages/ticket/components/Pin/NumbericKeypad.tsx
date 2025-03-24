import { SkipBackIcon as Backspace } from "lucide-react"
import { Button } from "../../../../components/ui/button"

interface NumericKeypadProps {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  onSubmit: () => void
  disabled?: boolean
}

export function NumericKeypad({ onKeyPress, onBackspace, onSubmit, disabled }: NumericKeypadProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "backspace"]

  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.map((key, index) => {
        if (key === "") {
          return <div key={index} />
        }

        if (key === "backspace") {
          return (
            <Button
              key={index}
              type="button"
              variant="outline"
              className="aspect-square h-14 border-gray-700 text-black hover:bg-gray-700"
              onClick={onBackspace}
              disabled={disabled}
            >
              <Backspace className="h-5 w-5" />
            </Button>
          )
        }

        return (
          <Button
            key={index}
            type="button"
            variant="outline"
            className="aspect-square h-14 border-gray-700 text-xl font-medium text-black hover:bg-gray-700"
            onClick={() => onKeyPress(key)}
            disabled={disabled}
          >
            {key}
          </Button>
        )
      })}
    </div>
  )
}

