"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Copy,
  XCircle,
  Ban,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Home,
  RotateCcw,
  Check,
} from "lucide-react"

type StatusType = "success" | "failed" | "cancelled" | "pending" | "unknown"

const getStatusUI = (state: string | null) => {
  const normalized = (state || "").toLowerCase()

  switch (normalized) {
    case "success":
    case "completed":
    case "confirmed":
      return {
        title: "Payment Successful",
        message: "Thank you! Your transaction has been completed successfully.",
        type: "success" as StatusType,
        color: "green",
        gradient: "from-emerald-500 to-green-600",
        bg: "bg-emerald-50 dark:bg-emerald-950/20",
        border: "border-emerald-200 dark:border-emerald-800",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      }

    case "failed":
    case "error":
    case "declined":
      return {
        title: "Payment Failed",
        message: "We couldn't process your payment. Please try again.",
        type: "failed" as StatusType,
        color: "red",
        gradient: "from-red-500 to-rose-600",
        bg: "bg-red-50 dark:bg-red-950/20",
        border: "border-red-200 dark:border-red-800",
        iconColor: "text-red-600 dark:text-red-400",
      }

    case "cancelled":
    case "canceled":
      return {
        title: "Payment Cancelled",
        message: "You have cancelled the transaction.",
        type: "cancelled" as StatusType,
        color: "amber",
        gradient: "from-amber-500 to-orange-600",
        bg: "bg-amber-50 dark:bg-amber-950/20",
        border: "border-amber-200 dark:border-amber-800",
        iconColor: "text-amber-600 dark:text-amber-400",
      }

    case "pending":
    case "processing":
      return {
        title: "Payment Pending",
        message: "Your payment is currently being processed. Please wait.",
        type: "pending" as StatusType,
        color: "blue",
        gradient: "from-blue-500 to-indigo-600",
        bg: "bg-blue-50 dark:bg-blue-950/20",
        border: "border-blue-200 dark:border-blue-800",
        iconColor: "text-blue-600 dark:text-blue-400",
      }

    default:
      return {
        title: "Unknown Status",
        message: "We could not verify the status of this transaction.",
        type: "unknown" as StatusType,
        color: "gray",
        gradient: "from-gray-500 to-slate-600",
        bg: "bg-gray-50 dark:bg-gray-950/20",
        border: "border-gray-200 dark:border-gray-800",
        iconColor: "text-gray-600 dark:text-gray-400",
      }
  }
}

function PaymentStatus() {
  const searchParams = useSearchParams()

  const transactionId = searchParams.get("transactionId")
  const state = searchParams.get("state")
  const signature = searchParams.get("signature")

  const [username, setUsername] = useState<string | null>(null)
  const [pin, setPin] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const stateUI = getStatusUI(state)

  // Fetch username and PIN based on transaction ID
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!transactionId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `/api/payment-details?transactionId=${transactionId}`
        )
        const data = await response.json()

        if (data.success) {
          setUsername(data.username)
          setPin(data.pin)
        }
      } catch (error) {
        console.error("Error fetching payment details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentDetails()
  }, [transactionId])

  const handleCopy = (text: string, id: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const renderIcon = () => {
    const iconClass = "w-16 h-16 text-white drop-shadow-md"
    switch (stateUI.type) {
      case "success":
        return <CheckCircle2 className={iconClass} />
      case "failed":
        return <XCircle className={iconClass} />
      case "cancelled":
        return <Ban className={iconClass} />
      case "pending":
        return <Loader2 className={`${iconClass} animate-spin`} />
      default:
        return <AlertTriangle className={iconClass} />
    }
  }

  const DetailRow = ({
    label,
    value,
    id,
    allowCopy = false,
  }: {
    label: string
    value: string | null
    id: string
    allowCopy?: boolean
  }) => {
    if (!value) return null

    return (
      <div className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 font-mono break-all selection:bg-primary/20">
              {value}
            </p>
          </div>
          {allowCopy && (
            <button
              onClick={() => handleCopy(value, id)}
              className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              title="Copy to clipboard"
            >
              {copiedId === id ? (
                <Check className="w-4 h-4 text-green-500 animate-in zoom-in" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -right-[10%] w-[70vh] h-[70vh] rounded-full bg-gradient-to-br ${stateUI.gradient} opacity-[0.03] blur-3xl`} />
        <div className={`absolute -bottom-[20%] -left-[10%] w-[60vh] h-[60vh] rounded-full bg-gradient-to-tr ${stateUI.gradient} opacity-[0.03] blur-3xl`} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          
          {/* Header Status Card */}
          <div className={`relative overflow-hidden p-8 text-center bg-gradient-to-br ${stateUI.gradient}`}>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-full ring-4 ring-white/20 shadow-lg animate-in zoom-in duration-500">
                {renderIcon()}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {stateUI.title}
              </h1>
              <p className="text-white/90 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                {stateUI.message}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-4">
            <DetailRow 
              label="Transaction ID" 
              value={transactionId} 
              id="tid" 
              allowCopy 
            />

            {!loading && (
              <>
                <DetailRow 
                  label="Username" 
                  value={username} 
                  id="username" 
                  allowCopy 
                />
                <DetailRow 
                  label="PIN" 
                  value={pin} 
                  id="pin" 
                  allowCopy 
                />
              </>
            )}

            {signature && (
               <DetailRow 
               label="Signature Reference" 
               value={signature.length > 25 ? `${signature.substring(0, 25)}...` : signature}
               id="sig" 
               allowCopy 
             />
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 pt-2 bg-gray-50/50 dark:bg-gray-900/50 grid grid-cols-2 gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${stateUI.gradient} text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              <Home className="w-4 h-4" />
              Return Home
            </button>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
          <span>Need help?</span>
          <a href="/contactus" className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors cursor-pointer">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SearchCV() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
            Verifying payment details...
          </p>
        </div>
      }
    >
      <PaymentStatus />
    </Suspense>
  )
}
