"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    address: "",
    enableRag: false,
    enableValidators: false,
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success toast
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })

      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "There was an error saving your settings.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="settings-name">Name</Label>
            <Input
              id="settings-name"
              value={settings.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input
              id="settings-email"
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-address">Address</Label>
            <Input
              id="settings-address"
              value={settings.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Your address"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-rag"
              checked={settings.enableRag}
              onCheckedChange={(checked) => handleChange("enableRag", checked)}
            />
            <Label htmlFor="enable-rag">Enable RAG (Experimental)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-validators"
              checked={settings.enableValidators}
              onCheckedChange={(checked) => handleChange("enableValidators", checked)}
            />
            <Label htmlFor="enable-validators">Enable Validator Agents (Experimental)</Label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
