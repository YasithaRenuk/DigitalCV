"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Eye,
  Trash2,
  Loader2,
  FileText,
  Gem,
  IdCard,
  Pencil,
  Bug,
} from "lucide-react";
import CvTemplate from "@/app/components/ShowCV/CvTemplate";

interface UserCV {
  _id: string;
  username: string;
  states: "pending" | "active" | "deactive";
  start_date: string;
  end_date: string;
  createdAt: string;
  cv: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userCVs, setUserCVs] = useState<UserCV[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewCVDialogOpen, setViewCVDialogOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState<any>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ---------- Auth Redirect ---------- */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/loginpage");
    }
  }, [status, router]);

  /* ---------- Fetch CVs ---------- */
  useEffect(() => {
    const fetchUserCVs = async () => {
      if (status !== "authenticated") return;

      try {
        setLoading(true);
        const res = await fetch("/api/usercv/get-by-email");
        const data = await res.json();

        if (data.success) setUserCVs(data.userCVs);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCVs();
  }, [status]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  /* ---------- Actions ---------- */

  const handleViewCV = (cv: UserCV) => {
    try {
      const parsed = JSON.parse(cv.cv);
      setSelectedCV(parsed);
      setViewCVDialogOpen(true);
    } catch {
      alert("Invalid CV data");
    }
  };

  const handleDeleteClick = (id: string) => {
    setCvToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cvToDelete) return;

    try {
      setIsDeleting(true);

      const res = await fetch("/api/usercv/delete-own", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cvToDelete }),
      });

      const data = await res.json();

      if (data.success) {
        setUserCVs((prev) => prev.filter((c) => c._id !== cvToDelete));
      }
    } finally {
      setDeleteDialogOpen(false);
      setIsDeleting(false);
    }
  };

  const onClick = (topic: string) => {
    router.push("/contactus?reasonTopic=" + topic);
  };

  const stateClasses = {
    active: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    deactive: "bg-red-100 text-red-700",
  };

  if (status === "loading") {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  const name = session?.user?.name;
  const email = session?.user?.email;

  return (
    <div className="min-h-screen bg-[#F8F7F5] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <h1 className="md:text-2xl text-xl font-bold mb-6">
          Welcome back, {name}!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="md:flex items-center gap-5">
                <div className="w-24 h-24 rounded-full bg-orange-200 flex items-center justify-center text-3xl overflow-hidden">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={name ? name : " "}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "😺"
                  )}
                </div>

                <div className="md:mt-0 mt-5">
                  <h2 className="text-2xl font-semibold">{name}</h2>
                  <p className="text-gray-500">{email}</p>
                </div>
              </div>
            </div>

            {/* CV List */}
            <div className=" p-6 rounded-xl border">
              <div className="flex gap-5 mb-5">
                <div className="w-12 h-12 rounded-lg bg-[#D0D0D0] flex items-center justify-center">
                  <FileText className="text-black" size={20} />
                </div>
                <h2 className="text-xl font-semibold mt-2">My CVs</h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {userCVs.map((cv) => (
                    <Card key={cv._id} className="p-6 rounded-xl border">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                            <FileText className="text-orange-500" size={20} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">
                              {cv.username}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Last edited {formatDate(cv.createdAt)}
                            </p>

                            {/* Status badge (mobile under title) */}
                            <span
                              className={`inline-block mt-2 sm:hidden px-3 py-1 text-sm rounded-full ${stateClasses[cv.states] ?? "bg-gray-100 text-gray-700"}`}
                            >
                              {cv.states === "active"
                                ? "Ready to Apply"
                                : cv.states === "pending"
                                  ? "Pending"
                                  : "Deactivated"}
                            </span>
                          </div>
                        </div>

                        {/* Status badge (desktop right side) */}
                        <span
                          className={`hidden sm:inline-block ${stateClasses[cv.states] ?? "bg-gray-100 text-gray-700"} px-3 py-1 text-sm rounded-full`}
                        >
                          {cv.states === "active"
                            ? "Ready to Apply"
                            : cv.states === "pending"
                              ? "Pending"
                              : "Deactivated"}
                        </span>
                      </div>

                      {/* Actions + Features */}
                      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                        {/* Buttons */}
                        <div className="md:flex md:gap-3 w-full sm:w-auto">
                          <Button
                            onClick={() => handleViewCV(cv)}
                            className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto px-6"
                          >
                            <Eye size={16} className="mr-2" />
                            View DigitalCV
                          </Button>

                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteClick(cv._id)}
                            className="shrink-0 md:mt-0 mt-3 md:w-10 w-full"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>

                        {/* Features */}
                        <div className="text-sm text-gray-500 space-y-1 sm:text-right">
                          <p>✔ ATS Friendly Format</p>
                          <p>✔ Keywords Optimized</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex gap-2 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#F27F0D] flex items-center justify-center">
                  <Gem className="text-white" size={20} />
                </div>
                <h3 className="font-semibold mt-2">Extend Membership</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Extend your plan to keep DigitalCV for longer Available for 6
                months/1year
              </p>

              <Button
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={() => onClick("Extend membership")}
              >
                Upgrade Now
              </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex gap-2 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#F27F0D] flex items-center justify-center">
                  <IdCard className="text-white" size={20} />
                </div>
                <h3 className="font-semibold mt-2">Change Username & PIN</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Request to Change the Username and PIN
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 shadow-0 text-[#F27F0D]"
                  onClick={() => onClick("Change username and PIN")}
                >
                  <div className="flex gap-2 p-2">
                    <span className="">Edit Username</span>
                    <Pencil className="mt-1" />
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 shadow-0 text-[#F27F0D]"
                  onClick={() => onClick("Change username and PIN")}
                >
                  <div className="flex gap-2 p-2">
                    <span className="">Edit PIN</span>
                    <Pencil className="mt-1" />
                  </div>
                </Button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex gap-2 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                  <Bug className="text-[#DC2626]" size={20} />
                </div>
                <h3 className="font-semibold mt-2">Report an Issue</h3>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Issue with your CV or having trouble with ATS parsing? Let us
                know.
              </p>

              <Button
                variant="link"
                className="p-0 text-orange-600"
                onClick={() => onClick("Report an issue on Your CV")}
              >
                Open Support Ticket →
              </Button>
            </div>
          </div>
        </div>

        {/* Logout */}
        {/* <div className="flex justify-end mt-8">
          <Button
            onClick={() => signOut()}
            className="border border-red-400 text-red-600 bg-white hover:bg-red-50"
          >
            Logout
          </Button>
        </div> */}
      </div>

      {/* ===== CV Preview Dialog ===== */}
      <Dialog open={viewCVDialogOpen} onOpenChange={setViewCVDialogOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>CV Preview</DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full w-full bg-white rounded-lg">
              <div className="p-6">
                {selectedCV && <CvTemplate data={selectedCV} />}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button onClick={() => setViewCVDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Delete Dialog ===== */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete CV</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this CV?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
