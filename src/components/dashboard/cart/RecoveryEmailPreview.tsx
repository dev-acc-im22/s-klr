"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Eye,
  Edit3,
  DollarSign,
  Send,
  Sparkles,
} from "lucide-react"
import type { MockAbandonedCart } from "@/lib/mock-data/cart"

interface RecoveryEmailPreviewProps {
  abandonedCart: MockAbandonedCart | null
  onSendEmail: (discountCode?: string, customMessage?: string) => void
}

export function RecoveryEmailPreview({ abandonedCart, onSendEmail }: RecoveryEmailPreviewProps) {
  const [discountCode, setDiscountCode] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [discountPercent, setDiscountPercent] = useState("10")

  if (!abandonedCart) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Select an abandoned cart to preview recovery email
          </p>
        </CardContent>
      </Card>
    )
  }

  const cartItemsHtml = abandonedCart.cart.items
    .map(
      (item) => `
        <div style="display: flex; align-items: center; gap: 16px; padding: 12px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px;">
          <div style="flex: 1;">
            <p style="margin: 0; font-weight: 600; color: #1e3a5f;">${item.product.title}</p>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Quantity: ${item.quantity}</p>
          </div>
          <p style="margin: 0; font-weight: 600; color: #1e3a5f;">$${(item.product.price * item.quantity).toFixed(2)}</p>
        </div>
      `
    )
    .join("")

  const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { font-size: 24px; font-weight: 700; color: #1e40af; }
    .content { background: #f8fafc; border-radius: 12px; padding: 24px; }
    .discount-code { background: #1e40af; color: white; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0; }
    .discount-code p { margin: 0 0 8px 0; font-size: 14px; }
    .discount-code .code { font-size: 28px; font-weight: 700; letter-spacing: 2px; }
    .button { display: inline-block; background: #1e40af; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px; }
    .footer { text-align: center; margin-top: 32px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <p class="logo">CreatorHub</p>
  </div>

  <div class="content">
    <h1 style="color: #1e3a5f; margin-bottom: 16px;">You left something behind!</h1>

    <p style="color: #475569; line-height: 1.6;">
      Hi there! We noticed you left some items in your cart. Don&apos;t worry, we saved them for you!
    </p>

    ${customMessage ? `<p style="color: #475569; line-height: 1.6; font-style: italic;">${customMessage}</p>` : ""}

    <h3 style="color: #1e3a5f; margin: 24px 0 16px 0;">Your Cart Items</h3>
    ${cartItemsHtml}

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0;">
      <span style="font-weight: 600; color: #1e3a5f;">Total:</span>
      <span style="font-size: 20px; font-weight: 700; color: #1e3a5f;">$${abandonedCart.cartTotal?.toFixed(2) || "0.00"}</span>
    </div>

    ${discountCode ? `
    <div class="discount-code">
      <p>Complete your purchase now and get ${discountPercent}% off!</p>
      <p class="code">${discountCode}</p>
    </div>
    ` : ""}

    <div style="text-align: center; margin-top: 24px;">
      <a href="#" class="button">Complete Your Purchase</a>
    </div>

    <p style="color: #64748b; font-size: 14px; margin-top: 24px; text-align: center;">
      This offer expires in 24 hours.
    </p>
  </div>

  <div class="footer">
    <p>© 2024 CreatorHub. All rights reserved.</p>
    <p>You received this email because you started a purchase on CreatorHub.</p>
  </div>
</body>
</html>
  `

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Recovery Email Preview
          </CardTitle>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Customize Recovery Email</DialogTitle>
                  <DialogDescription>
                    Add a discount code or custom message to encourage the customer to complete their purchase.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="discount-percent">Discount Percentage</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Input
                        id="discount-percent"
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                        className="w-20"
                      />
                      <span className="text-muted-foreground">%</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const code = `SAVE${discountPercent}`;
                          setDiscountCode(code);
                        }}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Generate Code
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="discount-code">Discount Code</Label>
                    <Input
                      id="discount-code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="e.g., COMEBACK10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-message">Custom Message (Optional)</Label>
                    <Textarea
                      id="custom-message"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personal message to the customer..."
                      rows={3}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              onClick={() => onSendEmail(discountCode, customMessage)}
              disabled={abandonedCart.status === "recovered" || abandonedCart.status === "expired"}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Customer Info */}
        <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium">{abandonedCart.email}</p>
            <p className="text-sm text-muted-foreground">
              Cart Value: ${(abandonedCart.cartTotal || 0).toFixed(2)}
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            {abandonedCart.cart.items.length} items
          </Badge>
        </div>

        {/* Email Preview Tabs */}
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-lg overflow-hidden bg-white">
              <iframe
                srcDoc={emailBody}
                className="w-full h-96"
                title="Email Preview"
              />
            </div>
          </TabsContent>
          <TabsContent value="html" className="mt-4">
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96">
              {emailBody}
            </pre>
          </TabsContent>
        </Tabs>

        {/* Discount Info */}
        {discountCode && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                {discountPercent}% Discount Applied
              </p>
              <p className="text-sm text-green-600">Code: {discountCode}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
