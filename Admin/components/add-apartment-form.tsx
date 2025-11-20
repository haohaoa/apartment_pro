"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, ImagePlus, Home, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useBuilding } from "@/context/building-context"

export default function CreateApartmentForm() {
  const { toast } = useToast()
  const params = useParams()
  const buildingId = params?.id as string
  const { createApartment } = useBuilding()

  const [formValues, setFormValues] = useState({
    title: "",
    roomNumber: "", // Added room number field
    address: "",
    price: "",
    deposit: "",
    area: "",
    bedrooms: "",
    furnishing: "",
    parking: false,
  })

  const [amenities, setAmenities] = useState({
    inductionCooker: false,
    centralAC: false,
    security24: false,
    elevator: false,
    balcony: false,
    washingMachine: false,
    refrigerator: false,
    waterHeater: false,
  })

  const [generatedDescription, setGeneratedDescription] = useState("")

  useEffect(() => {
    const parts: string[] = []

    if (formValues.area) parts.push(`Diện tích ${formValues.area}m²`)
    if (formValues.bedrooms) parts.push(`${formValues.bedrooms} phòng ngủ`)
    if (formValues.furnishing) parts.push(formValues.furnishing)
    if (formValues.parking) parts.push("Chỗ đậu xe")

    const selectedAmenities: string[] = []
    if (amenities.inductionCooker) selectedAmenities.push("Bếp điện từ")
    if (amenities.centralAC) selectedAmenities.push("Điều hòa trung tâm")
    if (amenities.security24) selectedAmenities.push("An ninh 24/7")
    if (amenities.elevator) selectedAmenities.push("Thang máy")
    if (amenities.balcony) selectedAmenities.push("Ban công")
    if (amenities.washingMachine) selectedAmenities.push("Máy giặt")
    if (amenities.refrigerator) selectedAmenities.push("Tủ lạnh")
    if (amenities.waterHeater) selectedAmenities.push("Máy nước nóng")

    if (selectedAmenities.length > 0) {
      parts.push(...selectedAmenities)
    }

    setGeneratedDescription(parts.join(", "))
  }, [formValues, amenities])

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files)
    setImages((prev) => [...prev, ...newFiles])
    newFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }


  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const errors: string[] = []

    if (!formValues.title.trim()) errors.push("Tiêu đề")
    if (!formValues.roomNumber.trim()) errors.push("Số phòng")
    if (!formValues.address.trim()) errors.push("Địa chỉ")
    if (!formValues.price || Number(formValues.price) <= 0) errors.push("Giá thuê")
    if (!formValues.deposit || Number(formValues.deposit) <= 0) errors.push("Đặt cọc")
    if (images.length === 0) errors.push("Hình ảnh")

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Thiếu thông tin ❌",
        description: "Vui lòng điền đầy đủ các trường bắt buộc.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const fullAddress = `Phòng ${formValues.roomNumber} - ${formValues.address}`

      // Gửi dưới dạng FormData
      const formData = new FormData()
      formData.append("title", formValues.title)
      formData.append("address", fullAddress) // Using combined address
      formData.append("price", formValues.price)
      formData.append("deposit", formValues.deposit)
      formData.append("status", "available") // Default status to available
      formData.append("area", formValues.area)
      formData.append("bedrooms", formValues.bedrooms)
      formData.append("furnishing", formValues.furnishing)
      formData.append("parking", String(formValues.parking))
      formData.append("description", generatedDescription)
      formData.append("amenities", JSON.stringify(amenities))

      if (images && images.length > 0) {
        images.forEach((image: File) => {
          formData.append("images[]", image) // PHẢI có []
        })
      }
      console.log("📦 FormData trước khi gửi:")
      for (const [key, value] of formData.entries()) {
        console.log(key, value)
      }
      const success = await createApartment(Number(buildingId), formData as any)

      if (success) {
        toast({
          title: "Thành công 🎉",
          description: "Căn hộ đã được tạo thành công.",
        })
        // Reset form
        setFormValues({
          title: "",
          roomNumber: "",
          address: "",
          price: "",
          deposit: "",
          area: "",
          bedrooms: "",
          furnishing: "",
          parking: false,
        })
        setAmenities({
          inductionCooker: false,
          centralAC: false,
          security24: false,
          elevator: false,
          balcony: false,
          washingMachine: false,
          refrigerator: false,
          waterHeater: false,
        })
        setImages([])
        setImagePreviews([])
        setValidationErrors([])
      }
    } catch (error) {
      console.error("Lỗi khi tạo căn hộ:", error)
      toast({
        title: "Lỗi ❌",
        description: "Không thể tạo căn hộ. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto max-h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6 text-center flex-shrink-0">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
          <Home className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl md:4xl font-serif font-medium text-foreground mb-2 text-balance">Thêm căn hộ mới</h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto text-pretty">
          Điền thông tin chi tiết để tạo danh sách căn hộ mới của bạn
        </p>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive mb-1">Vui lòng điền đầy đủ thông tin:</p>
            <ul className="text-sm text-destructive/90 list-disc list-inside space-y-0.5">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Card className="border-border/50 shadow-lg shadow-primary/5 flex-1 overflow-hidden flex flex-col">
        <CardContent className="p-6 md:p-8 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cột trái: thông tin căn hộ */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-serif font-medium text-foreground mb-4 pb-2 border-b border-border/50">
                    Thông tin cơ bản
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-foreground">
                        Tiêu đề <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={formValues.title}
                        onChange={handleChange}
                        className={`h-10 bg-input border-border/50 focus:border-primary transition-colors ${validationErrors.includes("Tiêu đề") ? "border-destructive" : ""
                          }`}
                        placeholder="VD: Căn hộ 2 phòng ngủ view biển"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roomNumber" className="text-sm font-medium text-foreground">
                        Số phòng <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="roomNumber"
                        name="roomNumber"
                        value={formValues.roomNumber}
                        onChange={handleChange}
                        className={`h-10 bg-input border-border/50 focus:border-primary transition-colors ${validationErrors.includes("Số phòng") ? "border-destructive" : ""
                          }`}
                        placeholder="VD: 456, A101, B205"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-foreground">
                        Địa chỉ <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formValues.address}
                        onChange={handleChange}
                        className={`h-10 bg-input border-border/50 focus:border-primary transition-colors ${validationErrors.includes("Địa chỉ") ? "border-destructive" : ""
                          }`}
                        placeholder="VD: 130 Trưng Nữ Vương, Phường Bình Thuận, Quận Hải Châu"
                      />
                      {formValues.roomNumber && formValues.address && (
                        <p className="text-xs text-muted-foreground mt-1.5 p-2 rounded bg-muted/50 border border-border/30">
                          <span className="font-medium">Địa chỉ đầy đủ:</span> Phòng {formValues.roomNumber} -{" "}
                          {formValues.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium text-foreground">
                          Giá thuê <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formValues.price}
                            onChange={handleChange}
                            className={`h-10 bg-input border-border/50 focus:border-primary transition-colors pr-12 ${validationErrors.includes("Giá thuê") ? "border-destructive" : ""
                              }`}
                            placeholder="0"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            VNĐ
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deposit" className="text-sm font-medium text-foreground">
                          Đặt cọc <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="deposit"
                            name="deposit"
                            type="number"
                            value={formValues.deposit}
                            onChange={handleChange}
                            className={`h-10 bg-input border-border/50 focus:border-primary transition-colors pr-12 ${validationErrors.includes("Đặt cọc") ? "border-destructive" : ""
                              }`}
                            placeholder="0"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-serif font-medium text-foreground mb-4 pb-2 border-b border-border/50">
                    Chi tiết căn hộ
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="area" className="text-sm font-medium text-foreground">
                          Diện tích (m²)
                        </Label>
                        <Input
                          id="area"
                          name="area"
                          type="number"
                          value={formValues.area}
                          onChange={handleChange}
                          className="h-10 bg-input border-border/50 focus:border-primary transition-colors"
                          placeholder="VD: 85"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms" className="text-sm font-medium text-foreground">
                          Số phòng ngủ
                        </Label>
                        <Select
                          value={formValues.bedrooms}
                          onValueChange={(value) => setFormValues((prev) => ({ ...prev, bedrooms: value }))}
                        >
                          <SelectTrigger
                            id="bedrooms"
                            className="h-10 bg-input border-border/50 focus:border-primary transition-colors"
                          >
                            <SelectValue placeholder="Chọn số phòng" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Studio">Studio</SelectItem>
                            <SelectItem value="1">1 phòng ngủ</SelectItem>
                            <SelectItem value="2">2 phòng ngủ</SelectItem>
                            <SelectItem value="3">3 phòng ngủ</SelectItem>
                            <SelectItem value="4">4 phòng ngủ</SelectItem>
                            <SelectItem value="5+">5+ phòng ngủ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="furnishing" className="text-sm font-medium text-foreground">
                        Tình trạng nội thất
                      </Label>
                      <Select
                        value={formValues.furnishing}
                        onValueChange={(value) => setFormValues((prev) => ({ ...prev, furnishing: value }))}
                      >
                        <SelectTrigger
                          id="furnishing"
                          className="h-10 bg-input border-border/50 focus:border-primary transition-colors"
                        >
                          <SelectValue placeholder="Chọn tình trạng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Không nội thất">Không nội thất</SelectItem>
                          <SelectItem value="Nội thất cơ bản">Nội thất cơ bản</SelectItem>
                          <SelectItem value="Full nội thất">Full nội thất</SelectItem>
                          <SelectItem value="Nội thất cao cấp">Nội thất cao cấp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <Checkbox
                        id="parking"
                        checked={formValues.parking}
                        onCheckedChange={(checked) =>
                          setFormValues((prev) => ({ ...prev, parking: checked as boolean }))
                        }
                        className="border-border/50"
                      />
                      <Label htmlFor="parking" className="text-sm font-medium text-foreground cursor-pointer">
                        Có chỗ đậu xe
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-serif font-medium text-foreground mb-4 pb-2 border-b border-border/50">
                    Tiện nghi
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inductionCooker"
                        checked={amenities.inductionCooker}
                        onCheckedChange={(checked) =>
                          setAmenities((prev) => ({ ...prev, inductionCooker: checked as boolean }))
                        }
                        className="border-border/50"
                      />
                      <Label htmlFor="inductionCooker" className="text-sm font-medium text-foreground cursor-pointer">
                        Bếp điện từ
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="centralAC"
                        checked={amenities.centralAC}
                        onCheckedChange={(checked) =>
                          setAmenities((prev) => ({ ...prev, centralAC: checked as boolean }))
                        }
                        className="border-border/50"
                      />
                      <Label htmlFor="centralAC" className="text-sm font-medium text-foreground cursor-pointer">
                        Điều hòa trung tâm
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="security24"
                        checked={amenities.security24}
                        onCheckedChange={(checked) =>
                          setAmenities((prev) => ({ ...prev, security24: checked as boolean }))
                        }
                        className="border-border/50"
                      />
                      <Label htmlFor="security24" className="text-sm font-medium text-foreground cursor-pointer">
                        An ninh 24/7
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="elevator"
                        checked={amenities.elevator}
                        onCheckedChange={(checked) =>
                          setAmenities((prev) => ({ ...prev, elevator: checked as boolean }))
                        }
                        className="border-border/50"
                      />
                      <Label htmlFor="elevator" className="text-sm font-medium text-foreground cursor-pointer">
                        Thang máy
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="balcony"
                        checked={amenities.balcony}
                        onCheckedChange={(checked) =>
                          setAmenities((prev) => ({ ...prev, balcony: checked as boolean }))
                        }
                        className="border-border/50"
                      />
                      <Label htmlFor="balcony" className="text-sm font-medium text-foreground cursor-pointer">
                        Ban công
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="washingMachine"
                        checked={amenities.washingMachine}
                        onCheckedChange={(checked) =>
                          setAmenities((prev) => ({ ...prev, washingMachine: checked as boolean }))
                        }
                        className="border-border/50"
                      />
                      <Label htmlFor="washingMachine" className="text-sm font-medium text-foreground cursor-pointer">
                        Máy giặt
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="refrigerator"
                        checked={amenities.refrigerator}
                        onCheckedChange={(checked) =>
                          setAmenities((prev) => ({ ...prev, refrigerator: checked as boolean }))
                        }
                        className="border-border/50"
                      />
                      <Label htmlFor="refrigerator" className="text-sm font-medium text-foreground cursor-pointer">
                        Tủ lạnh
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="waterHeater"
                        checked={amenities.waterHeater}
                        onCheckedChange={(checked) =>
                          setAmenities((prev) => ({ ...prev, waterHeater: checked as boolean }))
                        }
                        className="border-border/50"
                      />
                      <Label htmlFor="waterHeater" className="text-sm font-medium text-foreground cursor-pointer">
                        Máy nước nóng
                      </Label>
                    </div>
                  </div>
                </div>

                {generatedDescription && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <Label className="text-sm font-medium text-foreground mb-1.5 block">Mô tả tự động tạo:</Label>
                    <p className="text-sm text-muted-foreground leading-relaxed">{generatedDescription}</p>
                  </div>
                )}
              </div>

              {/* Cột phải: hình ảnh */}
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-serif font-medium text-foreground mb-4 pb-2 border-b border-border/50">
                    Hình ảnh căn hộ <span className="text-destructive">*</span>
                  </h2>

                  <label
                    className={`group relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all duration-300 ${validationErrors.includes("Hình ảnh")
                      ? "border-destructive hover:border-destructive/70"
                      : "border-border/50 hover:border-primary/50"
                      }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2.5 text-center px-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <ImagePlus className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-0.5">Tải ảnh lên</p>
                        <p className="text-xs text-muted-foreground">Kéo thả hoặc nhấp để chọn ảnh</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (tối đa 10MB)</p>
                    </div>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>

                  {imagePreviews.length > 0 && (
                    <div className="mt-5 space-y-2.5">
                      <p className="text-sm font-medium text-foreground">Đã chọn {imagePreviews.length} ảnh</p>
                      <div className="grid grid-cols-2 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative group aspect-video rounded-lg overflow-hidden border border-border/50 bg-muted"
                          >
                            <img
                              src={preview || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:bg-destructive/90"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Ảnh {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Thêm căn hộ mới"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
