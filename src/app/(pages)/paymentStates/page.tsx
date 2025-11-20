"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Copy,
  XCircle,
  Ban,
  Loader2,
  AlertTriangle,
} from "lucide-react"

type StatusType = "success" | "failed" | "cancelled" | "pending" | "unknown"

const getStatusUI = (state: string | null) => {
  const normalized = (state || "").toLowerCase()

  switch (normalized) {
    case "success":
    case "completed":
      return {
        title: "Payment Successful",
        message: "Your transaction has been completed",
        type: "success" as StatusType,
      }

    case "failed":
    case "error":
    case "declined":
      return {
        title: "Payment Failed",
        message: "The payment could not be completed",
        type: "failed" as StatusType,
      }

    case "cancelled":
    case "canceled":
      return {
        title: "Payment Cancelled",
        message: "You cancelled the payment",
        type: "cancelled" as StatusType,
      }

    case "pending":
    case "processing":
      return {
        title: "Payment Pending",
        message: "Your payment is still processing",
        type: "pending" as StatusType,
      }

    default:
      return {
        title: "Unknown Status",
        message: "We could not verify this transaction",
        type: "unknown" as StatusType,
      }
  }
}

function PaymentStatus() {
  const searchParams = useSearchParams()

  const transactionId = searchParams.get("transactionId")
  const state = searchParams.get("state")
  const signature = searchParams.get("signature")

  const stateUI = getStatusUI(state)

  const badgeColor =
    {
      success:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      failed:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      cancelled:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      pending:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      unknown:
        "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    }[stateUI.type] || "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"

  const prettyState = state
    ? state.charAt(0).toUpperCase() + state.slice(1).toLowerCase()
    : "Unknown"

  const handleCopy = (text: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
  }

  const shortSignature =
    signature && signature.length > 20
      ? `${signature.substring(0, 20)}...`
      : signature || "Not available"

  const renderIcon = () => {
    switch (stateUI.type) {
      case "success":
        return <CheckCircle2 className="w-12 h-12" />
      case "failed":
        return <XCircle className="w-12 h-12" />
      case "cancelled":
        return <Ban className="w-12 h-12" />
      case "pending":
        return <Loader2 className="w-12 h-12 animate-spin" />
      case "unknown":
      default:
        return <AlertTriangle className="w-12 h-12" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Header with status indicator */}
          <div className="bg-primary text-primary-foreground p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary-foreground/20 p-3">
                {renderIcon()}
              </div>
            </div>
            <h1 className="text-2xl font-bold">{stateUI.title}</h1>
            <p className="text-primary-foreground/80 text-sm mt-2">
              {stateUI.message}
            </p>
          </div>

          {/* Details section */}
          <div className="p-8 space-y-6">
            {/* Transaction ID */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Transaction ID
              </label>
              <div
                className="mt-2 flex items-center gap-2 bg-secondary/50 rounded-lg p-3 group cursor-pointer hover:bg-secondary/70 transition-colors"
                onClick={() => handleCopy(transactionId || "")}
              >
                <code className="text-sm font-mono text-foreground flex-1 break-all">
                  {transactionId || "Not available"}
                </code>
                <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </label>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
                >
                  {prettyState}
                </span>
              </div>
            </div>

            {/* Signature */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Signature
              </label>
              <div
                className="mt-2 flex items-center gap-2 bg-secondary/50 rounded-lg p-3 group cursor-pointer hover:bg-secondary/70 transition-colors"
                onClick={() => handleCopy(signature || "")}
              >
                <code className="text-sm font-mono text-foreground flex-1 break-all">
                  {shortSignature}
                </code>
                <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Actions footer */}
          <div className="bg-secondary/30 border-t border-border px-8 py-4 flex gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 py-2 px-4 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-sm font-medium"
            >
              Go Back
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Home
            </button>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-4">
          Keep this confirmation for your records
        </p>
      </div>
    </div>
  )
}

export default function SearchCV() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
            <p className="text-muted-foreground">Loading payment status...</p>
          </div>
        </div>
      }
    >
      <PaymentStatus />
    </Suspense>
  )
}
