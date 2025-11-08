"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMeQuery } from "@/redux/profile/api";
import { format } from "date-fns";
import { Calendar, Mail, Shield, User } from "lucide-react";
import { useState } from "react";
import { EditProfileDialog } from "./_components/edit-profile-dialog";

export default function ProfilePage() {
  const { data: userData, isLoading, isError } = useGetMeQuery("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !userData?.data) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Failed to load profile information
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = userData.data;
  const initials =
    user.username
      ?.split(" ")
      .map((n: any) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user.avatar || undefined}
                  alt={user.username}
                />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge
                    variant={
                      user.role === "admin"
                        ? "destructive"
                        : user.role === "moderator"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                  {!user.isActive && <Badge variant="outline">Inactive</Badge>}
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsEditDialogOpen(true)}>
              Edit Profile
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Bio Section */}
          {user.bio && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Bio
              </h3>
              <p className="text-sm">{user.bio}</p>
            </div>
          )}

          {/* Information Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="text-sm font-medium truncate">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium capitalize">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="text-sm font-medium">
                  {format(new Date(user.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentData={{
          username: user.username,
          email: user.email,
          bio: user.bio || "",
          avatar: user.avatar || "",
        }}
      />
    </div>
  );
}
