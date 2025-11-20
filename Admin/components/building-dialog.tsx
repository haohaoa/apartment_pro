"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Building2, MapPin, Hash, FileText, Loader2 } from "lucide-react"
import { useBuilding } from "@/context/building-context"
import type { Building } from "@/lib/types"

interface BuildingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  building?: Building
}

export function BuildingDialog({ open, onOpenChange, building }: BuildingDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    totalUnits: "",
    lat: "",
    lng: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { getCoordinates, createBuilding, updateBuilding } = useBuilding()

  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name || "",
        address: building.address || "",
        description: building.description || "",
        totalUnits: building.totalUnits?.toString() || "",
        lat: building.lat?.toString() || "",
        lng: building.lng?.toString() || "",
      })
    } else {
      setFormData({
        name: "",
        address: "",
        description: "",
        totalUnits: "",
        lat: "",
        lng: "",
      })
    }
  }, [building, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const coords = await getCoordinates(formData.address)
      if (!coords) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy tọa độ cho địa chỉ này",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const payload: Building = {
        id: building?.id ?? 0,
        name: formData.name,
        address: formData.address,
        description: formData.description,
        floors: Number(formData.totalUnits),
        lat: coords.lat,
        lng: coords.lng,
        owner_id: building?.owner_id ?? 1,
        status: "active",
      }

      let ok = false
      if (building) {
        ok = await updateBuilding(payload, building.id)
      } else {
        ok = await createBuilding(payload)
      }

      if (ok) {
        toast({
          title: building ? "Đã cập nhật tòa nhà" : "Đã tạo tòa nhà",
          description: building ? "Tòa nhà đã được cập nhật thành công." : "Tòa nhà mới đã được tạo thành công.",
        })
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] gap-0 p-0">
        <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 px-6 pt-6 pb-4 border-b border-border/50">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl font-semibold text-foreground">
                {building ? "Chỉnh sửa tòa nhà" : "Thêm tòa nhà mới"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
              {building
                ? "Cập nhật thông tin chi tiết của tòa nhà trong hệ thống."
                : "Thêm tòa nhà mới vào danh mục quản lý của bạn."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Tên tòa nhà
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên tòa nhà..."
                className="h-11 bg-background border-border/60 focus:border-primary/50 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Địa chỉ
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Nhập địa chỉ đầy đủ..."
                className="h-11 bg-background border-border/60 focus:border-primary/50 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="totalUnits" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Tổng số tầng
              </Label>
              <Input
                id="totalUnits"
                type="number"
                value={formData.totalUnits}
                onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
                placeholder="Nhập số lượng căn hộ..."
                className="h-11 bg-background border-border/60 focus:border-primary/50 focus:ring-primary/20"
                required
                min="1"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="description" className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả về tòa nhà..."
                className="min-h-[100px] bg-background border-border/60 focus:border-primary/50 focus:ring-primary/20 resize-none"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-11 px-6 border-border/60 hover:bg-muted/50"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>{building ? "Cập nhật" : "Tạo mới"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
