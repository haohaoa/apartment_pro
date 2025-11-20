"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  CreditCard,
  Lock,
  Loader2,
  Landmark,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { bankList } from "@/lib/bank-list" // danh sách ngân hàng VietQR
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface RegisterFormProps {
  onSuccess?: (user: User) => void
}

type User = {
  emailVerified: boolean
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    idCard: "",
    password: "",
    confirmPassword: "",
    bankName: "",
    bankAccount: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const { register } = useAuth()

  // Khi người dùng nhập / chọn
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  // Validate dữ liệu
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = "Vui lòng nhập họ và tên"
    else if (formData.name.length < 2) newErrors.name = "Họ và tên phải có ít nhất 2 ký tự"

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại"
    else if (!/^[0-9]{10,11}$/.test(formData.phone)) newErrors.phone = "Số điện thoại không hợp lệ"

    if (!formData.email) newErrors.email = "Vui lòng nhập email"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ"

    if (!formData.idCard) newErrors.idCard = "Vui lòng nhập số CCCD"
    else if (!/^[0-9]{12}$/.test(formData.idCard)) newErrors.idCard = "Số CCCD phải có 12 số"

    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu"
    else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"

    if (!formData.confirmPassword) newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"

    if (!formData.bankName) newErrors.bankName = "Vui lòng chọn ngân hàng"
    if (!formData.bankAccount) newErrors.bankAccount = "Vui lòng nhập số tài khoản"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xử lý submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
      const res = await register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        idCard: formData.idCard,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        bank_name: formData.bankName,
        bank_account: formData.bankAccount,
      })
      if (res) onSuccess?.({ emailVerified: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Họ và tên + SĐT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Họ và tên</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập họ và tên"
              className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
            />
          </div>
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div>
          <Label>Số điện thoại</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại"
              className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
            />
          </div>
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Nhập email của bạn"
            className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      {/* CCCD */}
      <div>
        <Label>Số CCCD</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={formData.idCard}
            onChange={(e) => handleChange("idCard", e.target.value)}
            placeholder="Nhập số căn cước công dân"
            className={`pl-10 ${errors.idCard ? "border-destructive" : ""}`}
          />
        </div>
        {errors.idCard && <p className="text-sm text-destructive">{errors.idCard}</p>}
      </div>

      {/* Ngân hàng + STK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Ngân hàng</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full flex justify-between items-center px-3 py-2 border rounded-md text-left bg-background",
                  errors.bankName ? "border-destructive" : "border-input"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Landmark className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {formData.bankName
                      ? bankList.find((b) => b.shortName === formData.bankName)?.name
                      : "Chọn ngân hàng"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-[300px] max-h-[300px] overflow-y-auto">
              <Command>
                <CommandInput placeholder="Tìm ngân hàng..." />
                <CommandEmpty>Không tìm thấy ngân hàng</CommandEmpty>
                <CommandGroup>
                  {bankList.map((bank) => (
                    <CommandItem
                      key={bank.bin}
                      value={bank.shortName}
                      onSelect={() => handleChange("bankName", bank.shortName)}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate">{bank.name}</span>
                      {formData.bankName === bank.shortName && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.bankName && (
            <p className="text-sm text-destructive">{errors.bankName}</p>
          )}
        </div>

        <div>
          <Label>Số tài khoản</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={formData.bankAccount}
              onChange={(e) => handleChange("bankAccount", e.target.value)}
              // onBlur={handleBankAccountLookup}
              placeholder="Nhập số tài khoản ngân hàng"
              className={`pl-10 ${errors.bankAccount ? "border-destructive" : ""}`}
            />
            <button
              type="button"
              // onClick={handleBankAccountLookup}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              title="Tra cứu tên chủ tài khoản"
            >
              {/* {lookupLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )} */}
            </button>
          </div>
          {errors.bankAccount && (
            <p className="text-sm text-destructive">{errors.bankAccount}</p>
          )}
        </div>
      </div>


      {/* Mật khẩu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Nhập mật khẩu"
              className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
        </div>

        <div>
          <Label>Xác nhận mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang xử lý...
          </div>
        ) : (
          "Tạo tài khoản"
        )}
      </Button>
    </form>
  )
}
