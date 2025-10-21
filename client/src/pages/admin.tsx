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
import type { AdCode, AdminUser, Setting, Calculator } from "@shared/schema";

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="adcodes" data-testid="tab-adcodes">Ad Codes</TabsTrigger>
          <TabsTrigger value="community" data-testid="tab-community">Community Calculators</TabsTrigger>
          <TabsTrigger value="admins" data-testid="tab-admins">Administrators</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="adcodes">
          <AdCodesManagement />
        </TabsContent>

        <TabsContent value="community">
          <CommunityCalculatorsManagement />
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

const AD_PLACEMENTS = [
  {
    id: "header",
    name: "Header",
    description: "Top of every page, above main content",
    recommendedSize: "728x90 (Leaderboard) or 970x90 (Large Leaderboard)",
    position: "Full width, centered"
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Right side of calculator pages",
    recommendedSize: "300x250 (Medium Rectangle) or 300x600 (Half Page)",
    position: "Right column, visible while scrolling"
  },
  {
    id: "inline",
    name: "Inline",
    description: "Between content sections",
    recommendedSize: "728x90 (Leaderboard) or 336x280 (Large Rectangle)",
    position: "Centered within content flow"
  },
  {
    id: "footer",
    name: "Footer",
    description: "Bottom of every page",
    recommendedSize: "728x90 (Leaderboard) or 970x90 (Large Leaderboard)",
    position: "Full width, bottom of page"
  }
];

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

  const selectedPlacement = AD_PLACEMENTS.find(p => p.id === location);

  return (
    <div className="space-y-6">
      {/* Ad Placement Guide */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Ad Placement Guide</CardTitle>
          <CardDescription className="text-blue-700">
            Select a location below to see recommended ad sizes and placement details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {AD_PLACEMENTS.map((placement) => (
              <div key={placement.id} className="bg-white border-2 border-blue-100 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-blue-900">{placement.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {placement.id}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{placement.description}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-blue-700 min-w-[90px]">Size:</span>
                    <span className="text-gray-700">{placement.recommendedSize}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-blue-700 min-w-[90px]">Position:</span>
                    <span className="text-gray-700">{placement.position}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Ad Code</CardTitle>
          <CardDescription>
            Paste the code from your ad network (Google AdSense, Media.net, AdThrive, Ezoic, etc.)
          </CardDescription>
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
                placeholder="e.g., Google AdSense Header Leaderboard"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Ad Placement Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location" data-testid="select-location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AD_PLACEMENTS.map((placement) => (
                    <SelectItem key={placement.id} value={placement.id}>
                      {placement.name} - {placement.recommendedSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPlacement && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                  <p className="text-sm font-medium text-gray-700 mb-1">Selected: {selectedPlacement.name}</p>
                  <p className="text-xs text-gray-600 mb-2">{selectedPlacement.description}</p>
                  <p className="text-xs text-blue-600 font-medium">
                    Recommended: {selectedPlacement.recommendedSize}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Ad Code (from your ad network)</Label>
              <textarea
                id="code"
                data-testid="input-adcode"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full min-h-[140px] px-3 py-2 border rounded-md font-mono text-sm"
                placeholder="Paste your ad code here. Example:
<script async src='https://pagead2.googlesyndication.com/...'></script>
<ins class='adsbygoogle' style='display:inline-block;width:728px;height:90px'></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                data-testid="switch-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active">Active (show this ad immediately)</Label>
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
  const [email, setEmail] = useState("");

  const { data: admins, isLoading } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/admins'],
  });

  const addMutation = useMutation({
    mutationFn: (email: string) => apiRequest('POST', '/api/admin/admins', { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/admins'] });
      toast({ title: "Administrator added successfully" });
      setEmail("");
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to add administrator", 
        description: error.message || "User not found or already an admin",
        variant: "destructive" 
      });
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
    if (!email.trim()) {
      toast({ title: "Email is required", variant: "destructive" });
      return;
    }
    addMutation.mutate(email.trim());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Administrator</CardTitle>
          <CardDescription>Enter the user's email address to grant admin access</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                data-testid="input-admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
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
                    <div className="font-medium">{admin.email || admin.userId}</div>
                    {admin.firstName && admin.lastName && (
                      <div className="text-sm text-muted-foreground">
                        {admin.firstName} {admin.lastName}
                      </div>
                    )}
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

function CommunityCalculatorsManagement() {
  const { toast } = useToast();

  const { data: calculators, isLoading } = useQuery<Calculator[]>({
    queryKey: ['/api/calculators'],
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => apiRequest('PATCH', `/api/calculators/${id}/toggle-featured`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calculators'] });
      queryClient.invalidateQueries({ queryKey: ['/api/calculators/featured/list'] });
      toast({ title: "Calculator featured status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update calculator", variant: "destructive" });
    },
  });

  const communityCalculators = calculators?.filter(calc => calc.formula) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community-Built Calculators</CardTitle>
        <CardDescription>
          Manage AI-generated calculators created by users. Feature them to showcase on the homepage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : communityCalculators.length === 0 ? (
          <div className="text-muted-foreground">No community calculators yet</div>
        ) : (
          <div className="space-y-4">
            {communityCalculators.map((calculator) => (
              <div
                key={calculator.id}
                data-testid={`calculator-item-${calculator.id}`}
                className="border rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{calculator.name}</h3>
                      {calculator.featured === 1 && (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{calculator.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Category: {calculator.category}</span>
                      <span>Created: {calculator.createdAt ? new Date(calculator.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      data-testid={`switch-featured-${calculator.id}`}
                      checked={calculator.featured === 1}
                      onCheckedChange={() => toggleFeaturedMutation.mutate(calculator.id)}
                      disabled={toggleFeaturedMutation.isPending}
                    />
                    <Label className="text-sm">Featured</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SettingsManagement() {
  const { toast } = useToast();
  const [contactEmail, setContactEmail] = useState("");
  const [adsEnabled, setAdsEnabled] = useState(true);

  const { data: settings, isLoading } = useQuery<Setting[]>({
    queryKey: ['/api/admin/settings'],
  });

  useEffect(() => {
    if (settings) {
      const emailSetting = settings.find((s) => s.key === 'contact_email');
      if (emailSetting) {
        setContactEmail(emailSetting.value);
      }
      const adsSetting = settings.find((s) => s.key === 'ads_enabled');
      if (adsSetting) {
        setAdsEnabled(adsSetting.value === '1');
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

  const handleAdsToggle = (checked: boolean) => {
    setAdsEnabled(checked);
    saveMutation.mutate({ key: 'ads_enabled', value: checked ? '1' : '0' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advertising Settings</CardTitle>
          <CardDescription>Control whether ads are displayed across the site</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ads-toggle">Display Advertisements</Label>
                <div className="text-sm text-gray-500">
                  Toggle ads on/off globally to adjust spacing
                </div>
              </div>
              <Switch
                id="ads-toggle"
                data-testid="switch-ads-enabled"
                checked={adsEnabled}
                onCheckedChange={handleAdsToggle}
              />
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}
