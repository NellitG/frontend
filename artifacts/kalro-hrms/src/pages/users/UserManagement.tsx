import { Link } from "react-router-dom";
import { useState, useMemo, useSyncExternalStore } from "react";
import { Plus, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import * as usersStore from "@/utils/usersStore";

const ROLE_COLORS: Record<string, string> = {
  system_admin: "bg-red-100 text-red-800",
  national_me: "bg-blue-100 text-blue-800",
  high_level: "bg-purple-100 text-purple-800",
  business_logic: "bg-amber-100 text-amber-800",
  project_manager: "bg-green-100 text-green-800",
  department_head: "bg-teal-100 text-teal-800",
  staff_user: "bg-slate-100 text-slate-700",
};

const ROLE_LABELS: Record<string, string> = {
  system_admin: "System Admin",
  national_me: "National M&E",
  high_level: "High Level",
  business_logic: "Business Logic",
  project_manager: "Project Manager",
  department_head: "Dept Head",
  staff_user: "Staff User",
};

export default function UserManagement() {
  const users = useSyncExternalStore(usersStore.subscribe, usersStore.getUsers, usersStore.getUsers);
  const [q, setQ] = useState("");

  const filtered = useMemo(() =>
    users.filter((u) =>
      !q ||
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
    ), [q, users]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage system users, roles and access permissions."
        actions={
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/user-management/new"><Plus className="h-4 w-4" /> Add User</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>All Users ({filtered.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10">
                        <span className="text-xs font-bold text-primary">
                          {u.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{u.dept}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[u.role] ?? "bg-slate-100 text-slate-700"}`}>
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === "Active" ? "default" : "secondary"} className="text-xs">
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Shield className="h-3 w-3" /> Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
