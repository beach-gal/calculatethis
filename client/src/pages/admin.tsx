import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import type { AdCode, AdminUser, Setting } from "@shared/schema";

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Check if user is admin
  const { data: adminCheck, isLoading: checkingAdmin } = useQuery<{ isAdmin: boolean }>({
    queryKey: ['/api/admin/check'],
    enabled: !!user,
  });

  // If not admin, redirect to home using useEffect
  useEffect(() => {
    // Only redirect if we're sure they're not an admin
    if (!authLoading && !checkingAdmin && user && (!adminCheck || !adminCheck.isAdmin)) {
      setLocation('/');
    }
  }, [authLoading, checkingAdmin, user, adminCheck, setLocation]);

  // Show loading state while checking
  if (authLoading || checkingAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Don't render if not logged in or not admin
  if (!user || !adminCheck || !adminCheck.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6" data-testid="title-admin">Admin Dashboard</h1>

      <Tabs defaultValue="adcodes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="adcodes" data-testid="tab-adcodes">Ad Codes</TabsTrigger>
          <TabsTrigger value="admins" data-testid="tab-admins">Administrators</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="adcodes">
          <AdCodesManagement />
        </TabsContent>

        <TabsContent value="admins">
          <AdminsManagement />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AdCodesManagement() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("header");
  const [isActive, setIsActive] = useState(true);

  const { data: adCodes, isLoading } = useQuery<AdCode[]>({
    queryKey: ['/api/admin/ad-codes'],
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; code: string; location: string; active: number }) =>
      apiRequest('POST', '/api/admin/ad-codes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ad-codes'] });
      toast({ title: "Ad code created successfully" });
      setName("");
      setCode("");
      setLocation("header");
      setIsActive(true);
    },
    onError: () => {
      toast({ title: "Failed to create ad code", variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: number }) =>
      apiRequest('PUT', `/api/admin/ad-codes/${id}`, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ad-codes'] });
      toast({ title: "Ad code updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update ad code", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/ad-codes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ad-codes'] });
      toast({ title: "Ad code deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete ad code", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast({ title: "Name and code are required", variant: "destructive" });
      return;
    }
    createMutation.mutate({ name: name.trim(), code: code.trim(), location, active: isActive ? 1 : 0 });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Ad Code</CardTitle>
          <CardDescription>Paste your ad network code (e.g., Google AdSense, AdThrive)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Name</Label>
              <Input
                id="name"
                data-testid="input-adname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Google AdSense Header"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Ad Code</Label>
              <textarea
                id="code"
                data-testid="input-adcode"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 border rounded-md"
                placeholder="<script>...</script>"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location" data-testid="select-location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                data-testid="switch-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <Button type="submit" data-testid="button-add-adcode" disabled={createMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ad Code
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Ad Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : !adCodes || adCodes.length === 0 ? (
            <div className="text-muted-foreground">No ad codes added yet</div>
          ) : (
            <div className="space-y-4">
              {adCodes.map((adCode) => (
                <div
                  key={adCode.id}
                  data-testid={`adcode-item-${adCode.id}`}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{adCode.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Location: {adCode.location} • Created: {adCode.createdAt ? new Date(adCode.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        data-testid={`switch-adcode-${adCode.id}`}
                        checked={adCode.active === 1}
                        onCheckedChange={(checked) =>
                          toggleActiveMutation.mutate({ id: adCode.id, active: checked ? 1 : 0 })
                        }
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        data-testid={`button-delete-adcode-${adCode.id}`}
                        onClick={() => deleteMutation.mutate(adCode.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                    {adCode.code.substring(0, 200)}
                    {adCode.code.length > 200 && '...'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminsManagement() {
  const { toast } = useToast();
  const [userId, setUserId] = useState("");

  const { data: admins, isLoading } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/admins'],
  });

  const addMutation = useMutation({
    mutationFn: (userId: string) => apiRequest('POST', '/api/admin/admins', { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/admins'] });
      toast({ title: "Administrator added successfully" });
      setUserId("");
    },
    onError: () => {
      toast({ title: "Failed to add administrator", variant: "destructive" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => apiRequest('DELETE', `/api/admin/admins/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/admins'] });
      toast({ title: "Administrator removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove administrator", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      toast({ title: "User ID is required", variant: "destructive" });
      return;
    }
    addMutation.mutate(userId.trim());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Administrator</CardTitle>
          <CardDescription>Enter the user ID from Replit Auth to grant admin access</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                data-testid="input-userid"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter Replit user ID"
              />
            </div>

            <Button type="submit" data-testid="button-add-admin" disabled={addMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Add Administrator
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Administrators</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : !admins || admins.length === 0 ? (
            <div className="text-muted-foreground">No administrators added yet</div>
          ) : (
            <div className="space-y-2">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  data-testid={`admin-item-${admin.userId}`}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <div className="font-medium">{admin.userId}</div>
                    <div className="text-sm text-muted-foreground">
                      Added: {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    data-testid={`button-remove-admin-${admin.userId}`}
                    onClick={() => removeMutation.mutate(admin.userId)}
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsManagement() {
  const { toast } = useToast();
  const [contactEmail, setContactEmail] = useState("");

  const { data: settings, isLoading } = useQuery<Setting[]>({
    queryKey: ['/api/admin/settings'],
  });

  useEffect(() => {
    if (settings) {
      const emailSetting = settings.find((s) => s.key === 'contact_email');
      if (emailSetting) {
        setContactEmail(emailSetting.value);
      }
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: { key: string; value: string }) =>
      apiRequest('POST', '/api/admin/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({ title: "Setting saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save setting", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim()) {
      toast({ title: "Email is required", variant: "destructive" });
      return;
    }
    saveMutation.mutate({ key: 'contact_email', value: contactEmail.trim() });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Settings</CardTitle>
        <CardDescription>Configure the contact email shown on the website</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                data-testid="input-contact-email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@calculatethis.org"
              />
            </div>

            <Button type="submit" data-testid="button-save-settings" disabled={saveMutation.isPending}>
              Save Settings
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
