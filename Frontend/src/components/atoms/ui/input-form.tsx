import * as React from "react"
import { Button } from "@/components/atoms/ui/button"
import { cn } from "@/lib/utils"
import {
  Mail,
  Lock,
  Phone,
  User,
  MapPin,
  Search as SearchIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  BookLock
} from "lucide-react"
import { type InputType } from "@/types/formTypes"
import { checkSpellingWithLT, LTMatch } from "@/lib/api/languageApi"

export function getConfigForType(type: InputType) {
  switch (type) {
    case "email":
      return {
        maxLength: 50,
        icon: <Mail className="w-5 h-5 text-gray-400" />,
      }
    case "password":
      return {
        maxLength: 200,
        icon: <Lock className="w-5 h-5 text-gray-400" />,
      }
    case "phone":
      return {
        maxLength: 10,
        icon: <Phone className="w-5 h-5 text-gray-400" />,
      }
    case "extension-phone":
      return {
        maxLength: 2,
        icon: <Phone className="w-5 h-5 text-gray-400" />,
      }
    case "document":
      return {
        maxLength: 50,
        icon: <BookLock className="w-5 h-5 text-gray-400" />,
      }
    case "user":
      return {
        maxLength: 40,
        icon: <User className="w-5 h-5 text-gray-400" />,
      }
    case "address":
      return {
        maxLength: 100,
        icon: <MapPin className="w-5 h-5 text-gray-400" />,
      }
    case "search":
      return {
        maxLength: 100,
        icon: <SearchIcon className="w-5 h-5 text-gray-400" />,
      }
    case "number":
      return {
        maxLength: 12,
        icon: undefined,
      }

    default:
      return {
        maxLength: 100,
        icon: undefined,
      }
  }
}

const containerClass = `
  relative flex items-center h-9
  rounded-md bg-primary-grey-50
  px-4 py-2 text-sm border border-primary-grey-300
  focus-visible:outline-none 
`

const inputStyle = `
  flex-1 bg-transparent outline-none
  placeholder:text-gray-400 
`

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  inputType?: InputType
  icon?: React.ReactNode
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSpellCheck?: (matches: LTMatch[]) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputType, icon, value = "", onChange, maxLength, onSpellCheck, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const { maxLength: defaultMaxLength, icon: defaultIcon, } = getConfigForType(inputType)

    let nativeType: React.HTMLInputTypeAttribute = "text"
    if (inputType === "password") {
      nativeType = showPassword ? "text" : "password"
    } else if (inputType === "email") {
      nativeType = "email"
    } else if (inputType === "search") {
      nativeType = "search"
    } else if (inputType === "number") {
      nativeType = "number"
    } else if (
      inputType === "phone" ||
      inputType === "extension-phone" ||
      inputType === "document"
    ) {
      nativeType = "tel"
    }

    const finalIcon = icon ?? defaultIcon
    const finalMaxLength = maxLength ?? defaultMaxLength

    return (
      <div className={cn(containerClass, className)}>
        {finalIcon && (
          <div className="absolute left-4 flex items-center justify-center w-5 h-5">
            {finalIcon}
          </div>
        )}
        <input
          ref={ref}
          type={nativeType}
          maxLength={finalMaxLength}
          value={value}
          onChange={onChange}
          className={cn(inputStyle, finalIcon ? "pl-8" : "pl-2")}
          onBlur={async (e) => {
            if (onSpellCheck) {
              const matches = await checkSpellingWithLT(e.currentTarget.value);
              onSpellCheck(matches);
            }
          }}
          spellCheck={true}
          {...props}
        />
        {inputType === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-400" />
            )}
          </Button>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
