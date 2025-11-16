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
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  image?: string;
  createdAt: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch Users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user");
        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.error || "Failed to fetch users");
        }
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const allSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((user) => selectedUsers.includes(user.id));

  // Handle single checkbox
  const toggleSelect = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedUsers((prev) =>
        prev.filter((id) => !paginatedUsers.map((user) => user.id).includes(id))
      );
    } else {
      const newSelected = [
        ...new Set([...selectedUsers, ...paginatedUsers.map((user) => user.id)]),
      ];
      setSelectedUsers(newSelected);
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

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500 text-white";
      case "user":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the user in the list
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, role: newRole }
              : user
          )
        );
      } else {
        alert(`Error: ${data.error || "Failed to update user role"}`);
      }
    } catch (err) {
      console.error("Error updating user role:", err);
      alert("Failed to update user role");
    }
  };

  // Handle delete button click
  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userToDelete }),
      });

      const data = await response.json();

      if (data.success) {
        setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
        setSelectedUsers((prev) => prev.filter((id) => id !== userToDelete));
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } else {
        alert(`Error: ${data.error || "Failed to delete user"}`);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="flex justify-center p-8 min-h-[90%]">
      <Card className="w-full max-w-7xl shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader className="text-left border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-2xl font-semibold text-gray-800 ml-10">
            Users Management
          </CardTitle>

          <div className="flex items-center gap-3 mr-10">
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search users..."
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
              Loading users...
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
                  <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Role</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className={`hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <TableCell
                        className="font-medium text-gray-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleSelect(user.id)}
                        />
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {user.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {user.email ? maskEmail(user.email) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value: "user" | "admin") =>
                            handleRoleChange(user.id, value)
                          }
                        >
                          <SelectTrigger className={`w-28 h-8 ${getRoleColor(user.role)} border-0 text-white`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">
                              <span className="flex items-center gap-2">
                                <Badge className="bg-blue-500 text-white">user</Badge>
                              </span>
                            </SelectItem>
                            <SelectItem value="admin">
                              <span className="flex items-center gap-2">
                                <Badge className="bg-purple-500 text-white">admin</Badge>
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(user.id);
                          }}
                          className="h-8 w-8"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No matching users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        
        {!loading && !error && filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
          />
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This will also delete all related UserCV records. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setUserToDelete(null);
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
    </div>
  );
}