"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  User,
  FileUp,
  Check,
  Link as LinkIcon,
  Copy,
  AlertCircle,
  X,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"; // Check if this import is correct based on project structure
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import CvTemplate, { CVData } from "@/app/components/ShowCV/CvTemplate"; // Import CvTemplate and type

export default function CVBuilderPage() {
  const router = useRouter();
  const [createStep, setCreateStep] = useState(1);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUserForCV, setSelectedUserForCV] = useState<any | null>(null);
  const [newCVFormData, setNewCVFormData] = useState({
    username: "",
    pin: "",
    files: [] as File[],
  });
  const [isCreatingCV, setIsCreatingCV] = useState(false);
  const [createCVError, setCreateCVError] = useState<string | null>(null);
  const [createdCVResult, setCreatedCVResult] = useState<{
    id: string;
    link: string;
  } | null>(null);
  const [previewData, setPreviewData] = useState<CVData | null>(null); // State for preview data
  const [retryDialogOpen, setRetryDialogOpen] = useState(false);
  const [isDeletingCV, setIsDeletingCV] = useState(false);

  // Fetch Users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        if (data.success) {
          setUsersList(data.users);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateCV = async () => {
    if (newCVFormData.files.length === 0) return;

    setIsCreatingCV(true);
    setCreateCVError(null);

    try {
      const formData = new FormData();
      formData.append("username", newCVFormData.username);
      formData.append("password", newCVFormData.pin);
      formData.append("userId", selectedUserForCV?.id || "");

      newCVFormData.files.forEach((file) => {
        formData.append("cvFiles", file);
      });

      const response = await fetch("/api/usercv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.userCV) {
        const link = `${window.location.origin}/showcv?id=${data.userCV.id}`;
        setCreatedCVResult({
          id: data.userCV.id,
          link: link,
        });

        // Fetch CV Data for Preview
        try {
          const previewRes = await fetch("/api/getCVWithId", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: data.userCV.id }),
          });
          const previewJson = await previewRes.json();
          if (previewJson.success) {
            setPreviewData(previewJson.data);
          }
        } catch (previewErr) {
          console.error("Error fetching preview:", previewErr);
        }

        setCreateStep(4);
      } else {
        setCreateCVError(data.error || "Failed to create CV");
      }
    } catch (err: any) {
      setCreateCVError(err.message || "Failed to create CV");
    } finally {
      setIsCreatingCV(false);
    }
  };

  const handleRetryDelete = async () => {
    if (!createdCVResult?.id) return;

    setIsDeletingCV(true);
    try {
      const delRes = await fetch("/api/usercv", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: createdCVResult.id }),
      });

      if (delRes.ok) {
        // Reset to Step 3 (Upload), keeping Step 1 & 2 data
        setCreatedCVResult(null);
        setPreviewData(null);
        setNewCVFormData((prev) => ({
          ...prev,
          files: [],
        })); // Clear files
        setCreateStep(3);
        setRetryDialogOpen(false);
      } else {
        alert("Failed to delete CV. Please try again.");
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("An error occurred.");
    } finally {
      setIsDeletingCV(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] pl-8 pr-8">
      <div className="w-full  mb-6 flex items-center">
        <h1 className="text-3xl font-bold text-gray-800">CV Builder</h1>
      </div>

      <div className="flex w-full  gap-8">
        {/* Steps Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
            {[
              { step: 1, title: "Select User", icon: User },
              { step: 2, title: "CV Details", icon: Check },
              { step: 3, title: "Upload Files", icon: FileUp },
              { step: 4, title: "Finish", icon: LinkIcon },
            ].map((item) => (
              <div
                key={item.step}
                className={`flex items-center gap-3 ${
                  createStep === item.step
                    ? "text-primary font-semibold"
                    : createStep > item.step
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    createStep === item.step
                      ? "border-primary bg-primary/10"
                      : createStep > item.step
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  {createStep > item.step ? (
                    <Check size={14} />
                  ) : (
                    <item.icon size={14} />
                  )}
                </div>
                <span className="text-sm">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <Card className="flex-1 shadow-md border-gray-200">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle>
              {createStep === 1
                ? "Select User"
                : createStep === 2
                ? "CV Details"
                : createStep === 3
                ? "Upload Files"
                : "Success"}
            </CardTitle>
            <CardDescription>
              {createStep === 1
                ? "Choose the user you want to create a CV for."
                : createStep === 2
                ? "Set a username and PIN for this CV."
                : createStep === 3
                ? "Upload the Resume/CV file to process."
                : "CV Created Successfully!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 min-h-[400px]">
            {createCVError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm flex items-center">
                <AlertCircle size={20} className="mr-3" /> {createCVError}
              </div>
            )}

            {/* STEP 1: SELECT USER */}
            {createStep === 1 && (
              <div className="space-y-6">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <Input
                    placeholder="Search users by name or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10 py-6 text-lg"
                  />
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-2">
                  {usersList
                    .filter(
                      (u) =>
                        u.name
                          .toLowerCase()
                          .includes(userSearchTerm.toLowerCase()) ||
                        u.email
                          .toLowerCase()
                          .includes(userSearchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition mb-2 ${
                          selectedUserForCV?.id === user.id
                            ? "bg-blue-50 border border-blue-200"
                            : "border border-transparent"
                        }`}
                        onClick={() => setSelectedUserForCV(user)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">
                              {user.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        {selectedUserForCV?.id === user.id && (
                          <Check size={24} className="text-blue-600" />
                        )}
                      </div>
                    ))}
                </ScrollArea>
              </div>
            )}

            {/* STEP 2: USERNAME AND PIN */}
            {createStep === 2 && (
              <div className="space-y-6 max-w-md mx-auto py-4">
                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Creating CV for:
                    </p>
                    <p className="text-lg font-bold text-blue-700">
                      {selectedUserForCV?.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">CV Username</Label>
                  <Input
                    value={newCVFormData.username}
                    onChange={(e) =>
                      setNewCVFormData({
                        ...newCVFormData,
                        username: e.target.value,
                      })
                    }
                    placeholder="Unique username for CV"
                    className="py-6"
                  />
                  <p className="text-sm text-muted-foreground">
                    This will be part of the CV URL.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">CV PIN</Label>
                  <Input
                    value={newCVFormData.pin}
                    onChange={(e) =>
                      setNewCVFormData({
                        ...newCVFormData,
                        pin: e.target.value,
                      })
                    }
                    placeholder="Secret PIN"
                    className="py-6"
                  />
                  <p className="text-sm text-muted-foreground">
                    Used to access the CV securely.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: UPLOAD FILES */}
            {createStep === 3 && (
              <div className="space-y-8 py-4">
                <div className="border-3 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition relative bg-gray-50/30">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setNewCVFormData((prev) => ({
                          ...prev,
                          files: [
                            ...prev.files,
                            ...Array.from(e.target.files || []),
                          ],
                        }));
                      }
                    }}
                  />
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                    <FileUp size={40} />
                  </div>
                  <p className="text-xl font-semibold text-gray-700">
                    Click or Drag & Drop to upload
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Support for PDF, DOCX, Images (Max 10MB)
                  </p>
                </div>

                {newCVFormData.files.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-lg">
                      Selected Files ({newCVFormData.files.length})
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {newCVFormData.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <FileText size={16} className="text-gray-500" />
                            </div>
                            <span className="truncate text-sm font-medium">
                              {file.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => {
                              const newFiles = [...newCVFormData.files];
                              newFiles.splice(idx, 1);
                              setNewCVFormData({
                                ...newCVFormData,
                                files: newFiles,
                              });
                            }}
                          >
                            <X size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {createStep === 4 && createdCVResult && (
              <div className="flex">
                <div>
                    {/* CV PREVIEW SECTION */}
                        {previewData && (
                            <div className="w-full mr-8 pr-8">
                                <h4 className="text-xl font-semibold mb-4 text-center">CV Preview</h4>
                                <ScrollArea className="h-[600px] w-full border-2 border-primary rounded-lg p-4 bg-white shadow-md mx-auto max-w-4xl">
                                    <CvTemplate data={previewData} />
                                </ScrollArea>
                            </div>
                        )}
                </div> 
                <div className="flex flex-col items-center justify-center space-y-8 py-10">
                  <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                    <Check size={48} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-bold text-gray-900">
                      CV Created Successfully!
                    </h3>
                    <p className="text-gray-500 text-lg">
                      The user's CV has been generated and is ready to view.
                    </p>
                  </div>

                  <div className="w-full max-w-lg bg-gray-50 p-6 rounded-xl border space-y-4">
                    <Label className="block text-center font-medium text-gray-700">
                      Shareable Link
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        value={createdCVResult.link}
                        readOnly
                        className="font-mono text-sm bg-white border-gray-300 py-6"
                      />
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          navigator.clipboard.writeText(createdCVResult.link);
                          // Use toast here if available
                          alert("Link copied to clipboard!");
                        }}
                      >
                        <Copy size={20} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 flex-wrap justify-center mt-6">
                    <a
                      href={createdCVResult.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="default" size="lg" className="px-8">
                        <LinkIcon size={18} className="mr-2" /> Open Link
                      </Button>
                    </a>

                    {/* Try Again Button */}
                    <AlertDialog open={retryDialogOpen} onOpenChange={setRetryDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="lg"
                        >
                          <ArrowLeft size={18} className="mr-2" /> Try Again (Delete
                          & Re-upload)
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this CV?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete the generated CV and let you upload new files. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeletingCV}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRetryDelete} disabled={isDeletingCV}>
                            {isDeletingCV ? "Deleting..." : "Delete & Re-upload"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => router.push("/admin/usercv")}
                    >
                      Return to User CV List
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {createStep < 4 && (
            <CardFooter className="flex justify-between border-t bg-gray-50/50 p-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                disabled={isCreatingCV}
              >
                Cancel
              </Button>
              <div className="flex gap-3">
                {createStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCreateStep(createStep - 1)}
                    disabled={isCreatingCV}
                  >
                    Back
                  </Button>
                )}

                {createStep === 1 && (
                  <Button
                    onClick={() => setCreateStep(2)}
                    disabled={!selectedUserForCV}
                  >
                    Next Step
                  </Button>
                )}

                {createStep === 2 && (
                  <Button
                    onClick={() => setCreateStep(3)}
                    disabled={!newCVFormData.username || !newCVFormData.pin}
                  >
                    Next Step
                  </Button>
                )}

                {createStep === 3 && (
                  <Button
                    onClick={handleCreateCV}
                    disabled={newCVFormData.files.length === 0 || isCreatingCV}
                    className="min-w-[120px]"
                  >
                    {isCreatingCV ? "Processing..." : "Create CV"}
                  </Button>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
