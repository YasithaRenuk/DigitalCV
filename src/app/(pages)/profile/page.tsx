"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Trash2, Link as LinkIcon, Loader2 } from "lucide-react";
import CvTemplate from "@/app/components/ShowCV/CvTemplate";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserCV {
  _id: string;
  username: string;
  password: string;
  states: "pending" | "active" | "deactive";
  start_date: string;
  end_date: string;
  createdAt: string;
  cv: string;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [userCVs, setUserCVs] = useState<UserCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // View CV Dialog
  const [viewCVDialogOpen, setViewCVDialogOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState<any>(null);
  
  // Delete CV Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/loginpage");
    }
  }, [status, router]);

  // Fetch user's CVs
  useEffect(() => {
    const fetchUserCVs = async () => {
      if (status !== "authenticated") return;
      
      try {
        setLoading(true);
        const response = await fetch("/api/usercv/get-by-email");
        const data = await response.json();

        if (data.success) {
          setUserCVs(data.userCVs);
        } else {
          setError(data.error || "Failed to fetch CVs");
        }
      } catch (err) {
        setError("Failed to fetch CVs");
        console.error("Error fetching CVs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCVs();
  }, [status]);

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const email = session?.user?.email || "gimhanpabasara4@gmail.com";
  const profilePic = session?.user?.image || null;
  const name = session?.user?.name;

  const onClick = (topic: string) => {
    router.push("/contactus?reasonTopic=" + topic);
  };

  // Get state color
  const getStateColor = (state: string) => {
    switch (state) {
      case "active":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "deactive":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle View CV
  const handleViewCV = (cv: UserCV) => {
    try {
      const parsed = JSON.parse(cv.cv);
      setSelectedCV(parsed);
      setViewCVDialogOpen(true);
    } catch (e) {
      console.error("Error parsing CV:", e);
      alert("Failed to parse CV data");
    }
  };

  // Handle Delete Click
  const handleDeleteClick = (id: string) => {
    setCvToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!cvToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch("/api/usercv/delete-own", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: cvToDelete }),
      });

      const data = await response.json();

      if (data.success) {
        setUserCVs((prev) => prev.filter((cv) => cv._id !== cvToDelete));
        setDeleteDialogOpen(false);
        setCvToDelete(null);
      } else {
        alert(`Error: ${data.error || "Failed to delete CV"}`);
      }
    } catch (err) {
      console.error("Error deleting CV:", err);
      alert("Failed to delete CV");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Copy Link
  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/showcv?id=${id}`;
    router.push(link);
  };

  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col items-center py-6 px-4 md:px-10">
      {/* User Info Card */}
      <div className="p-6 flex flex-col md:flex-row w-full md:w-[70%] justify-between items-start bg-white shadow rounded-lg">
        {/* Left Side: Avatar + User Details */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5 w-full md:w-auto">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-orange-200 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt="Profile Pic" className="w-full h-full object-cover" />
            ) : (
              "😺"
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 flex flex-col gap-1 md:gap-2 mt-2 md:mt-0 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:gap-2 justify-center md:justify-start">
              <h2 className="text-xl md:text-2xl font-semibold">{name}</h2>
            </div>
            <p className="text-gray-500">{email}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 w-full md:w-[70%]">
        <Button variant="outline" className="flex-1 border border-primary bg-white hover:bg-primary hover:text-white h-56 md:h-72" onClick={() => onClick("Change username and PIN")}>
          Change username &amp; PIN
        </Button>
        <Button className="flex-1 border border-primary bg-white hover:bg-primary hover:text-white h-56 md:h-72" onClick={() => onClick("Report an issue on Your CV")}>
          Report an issue on Your CV
        </Button>
        <Button className="flex-1 border border-primary bg-white hover:bg-primary hover:text-white h-56 md:h-72" onClick={() => onClick("Extend membership")}>
          Extend membership
        </Button>
      </div>

      {/* My CVs Section */}
      <div className="mt-8 w-full md:w-[70%]">
        <h2 className="text-2xl font-semibold mb-4">My CVs</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : userCVs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No CVs found. Create your first CV to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userCVs.map((cv) => (
              <Card key={cv._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{cv.username}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {formatDate(cv.createdAt)}
                      </p>
                    </div>
                    <Badge className={getStateColor(cv.states)}>
                      {cv.states}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Start:</span> {formatDate(cv.start_date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">End:</span> {formatDate(cv.end_date)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* View CV Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCV(cv)}
                      className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye size={14} className="mr-2" />
                      View CV
                    </Button>
                    
                    {/* Copy Link Button - Only for inactive CVs */}
                    {cv.states !== "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(cv._id)}
                        className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <LinkIcon size={14} className="mr-2" />
                        Make Payment
                      </Button>
                    )}
                    
                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(cv._id)}
                      className="flex-1 max-w-10"
                    >
                      <Trash2 size={14} className="" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="mt-6 w-full md:w-[70%] flex justify-end">
        <Button
          onClick={() => signOut()}
          className="border border-red-400 text-red-600 bg-white hover:bg-red-50 px-6 py-2"
        >
          Logout
        </Button>
      </div>

      {/* View CV Dialog */}
     <Dialog open={viewCVDialogOpen} onOpenChange={setViewCVDialogOpen}>
        <DialogContent
          className="
            w-[96vw] max-w-5xl
            h-[96dvh] max-h-[90vh]
            p-3 sm:p-6
            overflow-hidden
            flex flex-col
          "
        >
          {/* Header */}
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-base sm:text-lg">CV Preview</DialogTitle>
          </DialogHeader>

          {/* Body (scrollable) */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full w-full sm:w-[90%] md:w-[80%] mx-auto rounded-lg bg-white">
              <div className="p-3 sm:p-6">
                {selectedCV && <CvTemplate data={selectedCV} />}
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <DialogFooter className="shrink-0 pt-3 sm:pt-4">
            <Button className="w-full sm:w-auto" onClick={() => setViewCVDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete CV</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this CV? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;

