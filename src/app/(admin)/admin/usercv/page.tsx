"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Edit, Eye, Save, X, Plus, FileText, Code, ArrowUp, ArrowDown, Layout, User, Users, FileUp, Check, Link as LinkIcon, Copy } from "lucide-react";
import CvTemplate from "@/app/components/ShowCV/CvTemplate";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Default schemas for adding new items
const CV_SCHEMAS: any = {
  experiences: {
    job_title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    responsibilities: [],
    achievements: []
  },
  education: {
    degree: "",
    field_of_study: "",
    institution: "",
    location: "",
    start_date: "",
    end_date: "",
    grade: ""
  },
  certifications: {
    name: "",
    organization: "",
    issue_date: "",
    expiration_date: "",
    credential_id: "",
    credential_url: ""
  },
  projects: {
    title: "",
    description: "",
    technologies: [],
    link: ""
  },
  extracurricular_activities: {
    title: "",
    organization: "",
    description: "",
    start_date: "",
    end_date: ""
  },
  references: {
    name: "",
    company: "",
    email: "",
    phone: ""
  },
  skills: [], // Array of strings
  achievements: [] // Array of strings
};

interface UserCV {
  id: string;
  username: string;
  password: string;
  states: "pending" | "active" | "deactive";
  start_date: string;
  end_date: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  } | null;
}

export default function UserCVPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserCVs, setSelectedUserCVs] = useState<string[]>([]);
  const [userCVs, setUserCVs] = useState<UserCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userCVToDelete, setUserCVToDelete] = useState<string | null>(null);
  const [userCVToEdit, setUserCVToEdit] = useState<UserCV | null>(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    password: "",
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // New state for viewing/editing CV
  const [viewCVDialogOpen, setViewCVDialogOpen] = useState(false);
  const [cvContent, setCvContent] = useState("");
  const [cvData, setCvData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<"form" | "json" | "view">("form");
  const [isSavingCV, setIsSavingCV] = useState(false);
  const [viewingUserCVId, setViewingUserCVId] = useState<string | null>(null);

  // Fetch UserCVs from API
  useEffect(() => {
    const fetchUserCVs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/usercv");
        const data = await response.json();

        if (data.success) {
          setUserCVs(data.userCVs);
        } else {
          setError(data.error || "Failed to fetch UserCVs");
        }
      } catch (err) {
        setError("Failed to fetch UserCVs");
        console.error("Error fetching UserCVs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCVs();
  }, []);



  const filteredUserCVs = userCVs.filter((userCV) =>
    Object.values(userCV)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredUserCVs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUserCVs = filteredUserCVs.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const allSelected =
    paginatedUserCVs.length > 0 &&
    paginatedUserCVs.every((ucv) => selectedUserCVs.includes(ucv.id));

  // Handle single checkbox
  const toggleSelect = (id: string) => {
    setSelectedUserCVs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedUserCVs((prev) =>
        prev.filter((id) => !paginatedUserCVs.map((ucv) => ucv.id).includes(id))
      );
    } else {
      const newSelected = [
        ...new Set([...selectedUserCVs, ...paginatedUserCVs.map((ucv) => ucv.id)]),
      ];
      setSelectedUserCVs(newSelected);
    }
  };

  // Mask email
  const maskEmail = (email: string) => {
    if (!email) return "N/A";
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return `${localPart[0]}*****@${domain}`;
    }
    return `${localPart.substring(0, 2)}*****@${domain}`;
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

  // Handle delete button click
  const handleDeleteClick = (id: string) => {
    setUserCVToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!userCVToDelete) return;

    try {
      const response = await fetch("/api/usercv", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userCVToDelete }),
      });

      const data = await response.json();

      if (data.success) {
        setUserCVs((prev) => prev.filter((ucv) => ucv.id !== userCVToDelete));
        setSelectedUserCVs((prev) => prev.filter((id) => id !== userCVToDelete));
        setDeleteDialogOpen(false);
        setUserCVToDelete(null);
      } else {
        alert(`Error: ${data.error || "Failed to delete UserCV"}`);
      }
    } catch (err) {
      console.error("Error deleting UserCV:", err);
      alert("Failed to delete UserCV");
    }
  };

  // Handle edit button click
  const handleEditClick = (userCV: UserCV) => {
    setUserCVToEdit(userCV);
    setEditFormData({
      username: userCV.username,
      password: userCV.password,
      start_date: userCV.start_date ? new Date(userCV.start_date).toISOString().split("T")[0] : "",
      end_date: userCV.end_date ? new Date(userCV.end_date).toISOString().split("T")[0] : "",
    });
    setEditDialogOpen(true);
  };

  // Handle edit form submit
  const handleEditSubmit = async () => {
    if (!userCVToEdit) return;

    try {
      const response = await fetch("/api/usercv", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userCVToEdit.id,
          username: editFormData.username,
          password: editFormData.password,
          start_date: editFormData.start_date,
          end_date: editFormData.end_date,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the userCV in the list
        setUserCVs((prev) =>
          prev.map((ucv) =>
            ucv.id === userCVToEdit.id
              ? {
                  ...ucv,
                  username: data.userCV.username,
                  password: data.userCV.password,
                  start_date: data.userCV.start_date,
                  end_date: data.userCV.end_date,
                }
              : ucv
          )
        );
        setEditDialogOpen(false);
        setUserCVToEdit(null);
      } else {
        alert(`Error: ${data.error || "Failed to update UserCV"}`);
      }
    } catch (err) {
      console.error("Error updating UserCV:", err);
      alert("Failed to update UserCV");
    }
  };

  // Handle View/Edit CV
  const handleViewClick = async (id: string) => {
    setViewingUserCVId(id);
    setCvContent("Loading...");
    setViewCVDialogOpen(true);

    try {
      const response = await fetch("/api/usercv/get-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.success) {
        // Try to format JSON if it's a JSON string
        try {
          const parsed = JSON.parse(data.cv);
          setCvContent(JSON.stringify(parsed, null, 2));
          setCvData(parsed);
        } catch (e) {
          // If not valid JSON or already an object (though expected string), just show as is
          const raw = typeof data.cv === 'object' ? JSON.stringify(data.cv, null, 2) : data.cv || "{}";
          setCvContent(raw);
          try {
             setCvData(JSON.parse(raw));
          } catch(e) {
             setCvData({});
          }
        }
      } else {
        alert(`Error: ${data.error || "Failed to fetch CV"}`);
        setViewCVDialogOpen(false);
      }
    } catch (err) {
      console.error("Error fetching CV:", err);
      alert("Failed to fetch CV");
      setViewCVDialogOpen(false);
    }
  };

  const handleSaveCV = async () => {
    if (!viewingUserCVId) return;

    // Validation
    if (!cvData.contact_info?.full_name?.trim()) {
        alert("Full Name is required in Contact Info.");
        return;
    }
    if (!cvData.contact_info?.email?.trim()) {
        alert("Email is required in Contact Info.");
        return;
    }

    try {
      // Validate JSON
      try {
        JSON.parse(cvContent);
      } catch (e) {
        alert("Invalid JSON format. Please correct it before saving.");
        return;
      }

      setIsSavingCV(true);
      const response = await fetch("/api/usercv", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: viewingUserCVId,
          cv: cvContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setViewCVDialogOpen(false);
        setViewingUserCVId(null);
        // Optional: Show success toast/alert
      } else {
        alert(`Error: ${data.error || "Failed to save CV"}`);
      }
    } catch (err) {
      console.error("Error saving CV:", err);
      alert("Failed to save CV");
    } finally {
      setIsSavingCV(false);
    }
  };

  // Copy Link to Clipboard
  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/showcv?id=${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const updateCVField = (section: string, value: any) => {
    const newData = { ...cvData, [section]: value };
    setCvData(newData);
    setCvContent(JSON.stringify(newData, null, 2));
  };

  const addItemToSection = (section: string) => {
    const currentList = Array.isArray(cvData[section]) ? cvData[section] : [];
    // If schema is an array (like skills: []), it means it's a list of strings
    // If schema is an object, it's a list of objects
    let newItem;
    if (Array.isArray(CV_SCHEMAS[section])) {
        newItem = "";
    } else {
        newItem = CV_SCHEMAS[section] ? { ...CV_SCHEMAS[section] } : {};
    }
    updateCVField(section, [...currentList, newItem]);
  };

  const removeItemFromSection = (section: string, index: number) => {
    const currentList = Array.isArray(cvData[section]) ? cvData[section] : [];
    const newList = [...currentList];
    newList.splice(index, 1);
    updateCVField(section, newList);
  };

  const moveItem = (section: string, index: number, direction: 'up' | 'down') => {
    const currentList = Array.isArray(cvData[section]) ? cvData[section] : [];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentList.length - 1) return;

    const newList = [...currentList];
    const temp = newList[index];
    if (direction === 'up') {
        newList[index] = newList[index - 1];
        newList[index - 1] = temp;
    } else {
        newList[index] = newList[index + 1];
        newList[index + 1] = temp;
    }
    updateCVField(section, newList);
  };

  const updateItemField = (section: string, index: number, field: string, value: string) => {
    const currentList = Array.isArray(cvData[section]) ? cvData[section] : [];
    const newList = [...currentList];
    if (newList[index]) {
      newList[index] = { ...newList[index], [field]: value };
    }
    updateCVField(section, newList);
  };

  const updateArrayItem = (section: string, index: number, value: any) => {
    const currentList = Array.isArray(cvData[section]) ? cvData[section] : [];
    const newList = [...currentList];
    newList[index] = value;
    updateCVField(section, newList);
  };

  const renderArraySection = (sectionName: string, title: string) => {
    const items = Array.isArray(cvData[sectionName]) ? cvData[sectionName] : [];

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-lg font-semibold capitalize">{title}</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addItemToSection(sectionName)}
          >
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {items.map((item: any, idx: number) => (
            <Card key={idx} className="p-4 relative">
              <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700"
                    disabled={idx === 0}
                    onClick={() => moveItem(sectionName, idx, 'up')}
                  >
                    <ArrowUp size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(sectionName, idx, 'down')}
                  >
                    <ArrowDown size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeItemFromSection(sectionName, idx)}
                  >
                    <Trash2 size={16} />
                  </Button>
              </div>
              
              {/* Primitive List Item (String/Number) */}
              {typeof item === 'string' || typeof item === 'number' ? (
                 <div className="pr-8">
                    <Input
                      value={item}
                      placeholder={`Enter ${title} item`}
                      onChange={(e) => updateArrayItem(sectionName, idx, e.target.value)}
                    />
                 </div>
              ) : (
                /* Object List Item */
                <div className="grid grid-cols-1 gap-3 pr-8">
                  {Object.keys(item).map((key) => {
                    const val = item[key];

                    // 1. Boolean (Checkbox)
                    if (typeof val === 'boolean') {
                       return (
                         <div key={key} className="flex items-center space-x-2 mt-2">
                            <Checkbox 
                              checked={val} 
                              onCheckedChange={(checked) => updateItemField(sectionName, idx, key, !!checked as any)}
                            />
                            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer">
                              {key.replace(/_/g, " ")}
                            </Label>
                         </div>
                       );
                    }

                    // 2. Array of Strings (Nested List like Technologies/Responsibilities)
                    if (Array.isArray(val)) {
                      return (
                         <div key={key} className="space-y-2 mt-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs text-gray-500 uppercase">{key.replace(/_/g, " ")}</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-xs"
                                  onClick={() => {
                                      const newArray = [...val, ""];
                                      updateItemField(sectionName, idx, key, newArray as any);
                                  }}
                                >
                                  <Plus size={12} className="mr-1" /> Add
                                </Button>
                            </div>
                            
                            {val.length === 0 && (
                                <p className="text-xs text-gray-400 italic">No items added.</p>
                            )}

                            {val.map((subItem: string, subIdx: number) => (
                                <div key={subIdx} className="flex items-center gap-2">
                                    <Input 
                                      value={subItem} 
                                      onChange={(e) => {
                                          const newArray = [...val];
                                          newArray[subIdx] = e.target.value;
                                          updateItemField(sectionName, idx, key, newArray as any);
                                      }}
                                      className="h-8"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-500 hover:text-red-700"
                                      onClick={() => {
                                          const newArray = [...val];
                                          newArray.splice(subIdx, 1);
                                          updateItemField(sectionName, idx, key, newArray as any);
                                      }}
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                </div>
                            ))}
                         </div>
                      );
                    }

                    // 3. String/Number (Input)
                    if (typeof val === 'string' || typeof val === 'number') {
                        return (
                          <div key={key} className="space-y-1">
                            <Label className="text-xs text-gray-500 uppercase">{key.replace(/_/g, " ")}</Label>
                            <Input
                              value={val}
                              onChange={(e) => updateItemField(sectionName, idx, key, e.target.value)}
                              className="h-8"
                            />
                          </div>
                        );
                    }
                    
                    return null; // Ignore complex nested objects for now
                  })}
                </div>
              )}
            </Card>
          ))}
          {items.length === 0 && (
             <div className="text-center py-4 border-2 border-dashed rounded-md text-gray-400 text-sm">
               No items in {title}
             </div>
          )}
        </div>
        <Separator className="my-4" />
      </div>
    );
  };

  return (
    <div className="flex justify-center p-8 min-h-[90%]">
      {/* ... (Previous Card/Table Code) ... */}
      <Card className="w-full max-w-7xl shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader className="text-left border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-2xl font-semibold text-gray-800 ml-10">
            User CV Management
          </CardTitle>

          <div className="flex items-center gap-3 mr-10">
            <Button 
                onClick={() => window.location.href = '/admin/cv-builder'}
                className="bg-primary text-white hover:bg-primary/90"
            >
                <Plus size={16} className="mr-2" /> Create New CV
            </Button>
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search UserCVs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto p-0 ml-10">
          {/* ... (Table Rendering Logic - same as before) ... */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading UserCVs...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                   {/* ... Headers ... */}
                  <TableHead className="text-gray-700 font-semibold w-12">
                    <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">Full Name</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Username</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                  <TableHead className="text-gray-700 font-semibold">State</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Joined Date</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUserCVs.length > 0 ? (
                  paginatedUserCVs.map((userCV, index) => (
                    <TableRow
                      key={userCV.id}
                      className={`hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                       {/* ... Cells ... */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedUserCVs.includes(userCV.id)}
                          onCheckedChange={() => toggleSelect(userCV.id)}
                        />
                      </TableCell>
                      <TableCell>{userCV.user?.name || "N/A"}</TableCell>
                      <TableCell>{userCV.username}</TableCell>
                      <TableCell>{userCV.user?.email ? maskEmail(userCV.user.email) : "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getStateColor(userCV.states)}>{userCV.states}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(userCV.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                           {/* Eye Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewClick(userCV.id);
                            }}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="View/Edit CV"
                          >
                            <Eye size={14} />
                          </Button>
                           {/* Edit Metadata Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                            handleEditClick(userCV);
                            }}
                            className="h-8 w-8"
                          >
                            <Edit size={14} />
                          </Button>
                           {/* Copy Link Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLink(userCV.id);
                            }}
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Copy Link"
                          >
                            <LinkIcon size={14} />
                          </Button>
                           {/* Delete Button */}
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(userCV.id);
                            }}
                            className="h-8 w-8"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                     <TableCell colSpan={7} className="text-center py-6 text-gray-500">No matching UserCVs found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {/* ... Pagination ... */}
         {!loading && !error && filteredUserCVs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUserCVs.length}
          />
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this UserCV record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setUserCVToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Metadata Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit UserCV</DialogTitle>
             {/* ... Edit Form ... */}
             <DialogDescription>Update UserCV info.</DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editFormData.username}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, username: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">PIN (Password)</Label>
              <Input
                id="password"
                value={editFormData.password}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, password: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={editFormData.start_date}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, start_date: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={editFormData.end_date}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, end_date: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setUserCVToEdit(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit CV Dialog (Main Form) */}
      <Dialog open={viewCVDialogOpen} onOpenChange={setViewCVDialogOpen}>
        <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>Edit CV Content</DialogTitle>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                <Button
                  variant={activeTab === "form" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("form")}
                  className={activeTab === "form" ? "shadow-sm bg-white text-primary" : ""}
                >
                  <FileText size={14} className="mr-2" /> Form
                </Button>
                <Button
                   variant={activeTab === "json" ? "secondary" : "ghost"}
                   size="sm"
                   onClick={() => setActiveTab("json")}
                   className={activeTab === "json" ? "shadow-sm bg-white text-primary" : ""}
                >
                  <Code size={14} className="mr-2" /> JSON
                </Button>
                <Button
                   variant={activeTab === "view" ? "secondary" : "ghost"}
                   size="sm"
                   onClick={() => setActiveTab("view")}
                   className={activeTab === "view" ? "shadow-sm bg-white text-primary" : ""}
                >
                  <Layout size={14} className="mr-2" /> View
                </Button>
              </div>
            </div>
            <DialogDescription className="hidden">Content Editor</DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 relative">
             {activeTab === "json" ? (
                 <textarea
                   className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-slate-50"
                   value={cvContent}
                   onChange={(e) => {
                     setCvContent(e.target.value);
                     try { setCvData(JSON.parse(e.target.value)); } catch(e) {}
                   }}
                   spellCheck={false}
                 />
             ) : activeTab === "view" ? (
                 <ScrollArea className="h-full bg-gray-50/50">
                    <div className="p-8">
                        <CvTemplate data={cvData} />
                    </div>
                 </ScrollArea>
             ) : (
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-6">
                    {/* PERSONAL INFO (contact_info + summary) */}
                    <div className="mb-6">
                       <Label className="text-lg font-semibold mb-4 block">Personal Details</Label>
                       
                       {/* SUMMARY */}
                       <div className="mb-4 space-y-1">
                          <Label className="text-xs uppercase text-gray-500">Professional Summary</Label>
                          <textarea
                             className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                             value={cvData.summary || ""}
                             onChange={(e) => updateCVField("summary", e.target.value)}
                             placeholder="Write a professional summary..."
                          />
                       </div>

                       {/* CONTACT INFO */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {["full_name", "email", "phone", "address", "linkedin", "portfolio", "github"].map(field => (
                           <div key={field} className="space-y-1">
                             <Label className="text-xs uppercase text-gray-500">{field.replace(/_/g, " ")}</Label>
                             <Input
                               value={cvData.contact_info?.[field] || ""}
                               onChange={(e) => {
                                  const newVal = e.target.value;
                                  updateCVField("contact_info", { ...cvData.contact_info, [field]: newVal });
                               }}
                               placeholder={field}
                             />
                           </div>
                         ))}
                       </div>
                    </div>
                    
                    <Separator />

                    {/* SECTIONS */}
                    {renderArraySection("experiences", "Work Experiences")}
                    {renderArraySection("education", "Education")}
                    {renderArraySection("projects", "Projects")}
                    {renderArraySection("certifications", "Certifications")}
                    {renderArraySection("extracurricular_activities", "Extracurricular Activities")}
                    {renderArraySection("references", "References")}
                    
                    {/* Simple Lists */}
                    {renderArraySection("skills", "Skills")}
                    {renderArraySection("achievements", "Achievements")}

                  </div>
                </ScrollArea>
             )}
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button
              variant="outline"
              onClick={() => setViewCVDialogOpen(false)}
              disabled={isSavingCV}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCV} disabled={isSavingCV}>
              {isSavingCV ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}




