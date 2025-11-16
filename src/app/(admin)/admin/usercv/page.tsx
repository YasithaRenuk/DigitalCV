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
import { Search, Trash2, Edit } from "lucide-react";
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

  const allSelected =
    filteredUserCVs.length > 0 &&
    filteredUserCVs.every((ucv) => selectedUserCVs.includes(ucv.id));

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
        prev.filter((id) => !filteredUserCVs.map((ucv) => ucv.id).includes(id))
      );
    } else {
      const newSelected = [
        ...new Set([...selectedUserCVs, ...filteredUserCVs.map((ucv) => ucv.id)]),
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

  return (
    <div className="flex justify-center p-8 min-h-[90%]">
      <Card className="w-full max-w-7xl shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader className="text-left border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-2xl font-semibold text-gray-800 ml-10">
            User CV Management
          </CardTitle>

          <div className="flex items-center gap-3 mr-10">
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
                {filteredUserCVs.length > 0 ? (
                  filteredUserCVs.map((userCV, index) => (
                    <TableRow
                      key={userCV.id}
                      className={`hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <TableCell
                        className="font-medium text-gray-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedUserCVs.includes(userCV.id)}
                          onCheckedChange={() => toggleSelect(userCV.id)}
                        />
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {userCV.user?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-800">{userCV.username}</TableCell>
                      <TableCell className="text-gray-600">
                        {userCV.user?.email ? maskEmail(userCV.user.email) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStateColor(userCV.states)}>
                          {userCV.states}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {formatDate(userCV.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No matching UserCVs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit UserCV</DialogTitle>
            <DialogDescription>
              Update the UserCV information below.
            </DialogDescription>
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
    </div>
  );
}



