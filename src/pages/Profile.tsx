import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile } from '@/hooks/useProfile';
import { useInterviews } from '@/hooks/useInterviews';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { User, Mail, Phone, Calendar, Edit, Save, Loader2, Clock, FileText, Settings, Bell, Globe } from 'lucide-react';
import PageLoader from '@/components/loading/PageLoader';

const Profile = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const { interviews, loading: interviewsLoading } = useInterviews();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: ''
  });
  const [settingsFormData, setSettingsFormData] = useState({
    theme: 'dark',
    notifications_enabled: true,
    email_notifications: true,
    language: 'en',
    timezone: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (settings) {
      setSettingsFormData({
        theme: settings.theme,
        notifications_enabled: settings.notifications_enabled,
        email_notifications: settings.email_notifications,
        language: settings.language,
        timezone: settings.timezone
      });
    }
  }, [settings]);

  if (loading || settingsLoading) {
    return <PageLoader text="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-primary p-6 flex items-center justify-center">
        <Card className="bg-dark-secondary border-border-dark w-full max-w-lg">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Profile Not Found</h2>
            <p className="text-text-secondary">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = () => {
    const first = profile.first_name?.charAt(0) || '';
    const last = profile.last_name?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || profile.email.charAt(0).toUpperCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (name: string, value: any) => {
    setSettingsFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateProfile(formData);
      if (!error) {
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateSettings(settingsFormData);
      if (!error) {
        setIsEditingSettings(false);
        toast({
          title: "Success",
          description: "Settings updated successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter interviews for this user based on role
  const userInterviews = interviews.filter(interview => 
    (profile.role === 'candidate' && interview.candidate_id === profile.id) ||
    (profile.role === 'recruiter' && interview.recruiter_id === profile.id)
  );

  const upcomingInterviews = userInterviews.filter(interview => 
    interview.status === 'scheduled' && 
    interview.scheduled_at && 
    new Date(interview.scheduled_at) > new Date()
  );

  const pastInterviews = userInterviews.filter(interview => 
    (interview.status === 'completed' || interview.status === 'cancelled') || 
    (interview.scheduled_at && new Date(interview.scheduled_at) < new Date())
  );

  return (
    <div className="min-h-screen bg-dark-primary p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-6">My Profile</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-dark-secondary border-border-dark">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-tech-green data-[state=active]:text-dark-primary"
            >
              Profile Information
            </TabsTrigger>
            <TabsTrigger 
              value="interviews" 
              className="data-[state=active]:bg-tech-green data-[state=active]:text-dark-primary"
            >
              Interviews
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-tech-green data-[state=active]:text-dark-primary"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information */}
              <Card className="bg-dark-secondary border-border-dark lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-text-primary flex items-center justify-between">
                    Profile Information
                    {!isEditing ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                        className="text-text-secondary hover:text-text-primary"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditing(false)}
                        className="text-text-secondary hover:text-text-primary"
                      >
                        Cancel
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center mb-6">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={profile.avatar_url || undefined} />
                        <AvatarFallback className="bg-tech-green text-dark-primary text-xl">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {!isEditing ? (
                        <div className="text-center">
                          <h2 className="text-xl font-semibold text-text-primary">
                            {profile.first_name} {profile.last_name}
                          </h2>
                          <Badge className="mt-2 bg-tech-green text-dark-primary">
                            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                          </Badge>
                        </div>
                      ) : (
                        <div className="w-full">
                          <Label className="text-text-secondary mb-1 block">Avatar URL</Label>
                          <Input
                            name="avatar_url"
                            value={formData.avatar_url}
                            onChange={handleInputChange}
                            className="bg-dark-primary border-border-dark text-text-primary mb-4"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      {isEditing ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-text-secondary mb-1 block">First Name</Label>
                              <Input
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className="bg-dark-primary border-border-dark text-text-primary"
                              />
                            </div>
                            <div>
                              <Label className="text-text-secondary mb-1 block">Last Name</Label>
                              <Input
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                className="bg-dark-primary border-border-dark text-text-primary"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-text-secondary mb-1 block">Phone</Label>
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="bg-dark-primary border-border-dark text-text-primary"
                            />
                          </div>
                          <Button 
                            onClick={handleSave} 
                            className="bg-tech-green hover:bg-tech-green/90 text-dark-primary mt-4"
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={16} className="mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-tech-green" />
                            <div>
                              <p className="text-sm text-text-secondary">Full Name</p>
                              <p className="text-text-primary">
                                {profile.first_name} {profile.last_name || '(Not set)'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-tech-green" />
                            <div>
                              <p className="text-sm text-text-secondary">Email</p>
                              <p className="text-text-primary">{profile.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-tech-green" />
                            <div>
                              <p className="text-sm text-text-secondary">Phone</p>
                              <p className="text-text-primary">{profile.phone || '(Not set)'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-tech-green" />
                            <div>
                              <p className="text-sm text-text-secondary">Member Since</p>
                              <p className="text-text-primary">
                                {format(new Date(profile.created_at), 'PPP')}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interviews">
            <Card className="bg-dark-secondary border-border-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-text-primary">My Interviews</CardTitle>
                <CardDescription className="text-text-secondary">
                  View your upcoming and past interviews
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="bg-dark-primary mb-4">
                    <TabsTrigger value="upcoming" className="data-[state=active]:bg-tech-green data-[state=active]:text-dark-primary">
                      Upcoming
                    </TabsTrigger>
                    <TabsTrigger value="past" className="data-[state=active]:bg-tech-green data-[state=active]:text-dark-primary">
                      Past
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="space-y-4">
                    {interviewsLoading ? (
                      <div className="flex items-center justify-center p-6">
                        <Loader2 className="h-8 w-8 text-tech-green animate-spin" />
                      </div>
                    ) : upcomingInterviews.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-text-secondary mb-2" />
                        <h3 className="text-lg font-semibold text-text-primary">No Upcoming Interviews</h3>
                        <p className="text-text-secondary">
                          You don't have any interviews scheduled.
                        </p>
                      </div>
                    ) : (
                      upcomingInterviews.map(interview => (
                        <Card key={interview.id} className="bg-dark-primary border-border-dark">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-text-primary">{interview.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Calendar className="h-4 w-4 text-text-secondary" />
                                  <span className="text-sm text-text-secondary">
                                    {interview.scheduled_at ? format(new Date(interview.scheduled_at), 'PPP p') : 'Not scheduled'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="h-4 w-4 text-text-secondary" />
                                  <span className="text-sm text-text-secondary">
                                    {interview.duration_minutes} minutes
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                  {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                </Badge>
                                {interview.meeting_url && (
                                  <Button size="sm" className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
                                    Join
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="past" className="space-y-4">
                    {interviewsLoading ? (
                      <div className="flex items-center justify-center p-6">
                        <Loader2 className="h-8 w-8 text-tech-green animate-spin" />
                      </div>
                    ) : pastInterviews.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-text-secondary mb-2" />
                        <h3 className="text-lg font-semibold text-text-primary">No Past Interviews</h3>
                        <p className="text-text-secondary">
                          You haven't participated in any interviews yet.
                        </p>
                      </div>
                    ) : (
                      pastInterviews.map(interview => (
                        <Card key={interview.id} className="bg-dark-primary border-border-dark">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-text-primary">{interview.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Calendar className="h-4 w-4 text-text-secondary" />
                                  <span className="text-sm text-text-secondary">
                                    {interview.scheduled_at ? format(new Date(interview.scheduled_at), 'PPP p') : 'Not scheduled'}
                                  </span>
                                </div>
                                {interview.overall_score !== null && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-medium text-tech-green">
                                      Score: {interview.overall_score}/10
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Badge className={interview.status === 'completed' 
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                                }>
                                  {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                </Badge>
                                <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-dark-secondary border-border-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-text-primary flex items-center justify-between">
                  User Settings
                  {!isEditingSettings ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditingSettings(true)}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditingSettings(false)}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      Cancel
                    </Button>
                  )}
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Customize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {!settings ? (
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 mx-auto text-text-secondary mb-2" />
                    <h3 className="text-lg font-semibold text-text-primary">No Settings Found</h3>
                    <p className="text-text-secondary">
                      Your settings will appear here once they are created.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <Settings className="h-5 w-5 text-tech-green" />
                        Appearance
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">Theme</p>
                          <p className="text-sm text-text-secondary">Choose your preferred theme</p>
                        </div>
                        {isEditingSettings ? (
                          <Select 
                            value={settingsFormData.theme} 
                            onValueChange={(value) => handleSettingsChange('theme', value)}
                          >
                            <SelectTrigger className="w-32 bg-dark-primary border-border-dark">
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent className="bg-dark-primary border-border-dark">
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">
                            {settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <Bell className="h-5 w-5 text-tech-green" />
                        Notifications
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">In-app Notifications</p>
                          <p className="text-sm text-text-secondary">Receive notifications within the app</p>
                        </div>
                        {isEditingSettings ? (
                          <Switch
                            checked={settingsFormData.notifications_enabled}
                            onCheckedChange={(checked) => handleSettingsChange('notifications_enabled', checked)}
                          />
                        ) : (
                          <Badge className={settings.notifications_enabled 
                            ? "bg-tech-green/20 text-tech-green border-tech-green/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                          }>
                            {settings.notifications_enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">Email Notifications</p>
                          <p className="text-sm text-text-secondary">Receive notifications via email</p>
                        </div>
                        {isEditingSettings ? (
                          <Switch
                            checked={settingsFormData.email_notifications}
                            onCheckedChange={(checked) => handleSettingsChange('email_notifications', checked)}
                          />
                        ) : (
                          <Badge className={settings.email_notifications 
                            ? "bg-tech-green/20 text-tech-green border-tech-green/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                          }>
                            {settings.email_notifications ? 'Enabled' : 'Disabled'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <Globe className="h-5 w-5 text-tech-green" />
                        Regional
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">Language</p>
                          <p className="text-sm text-text-secondary">Select your preferred language</p>
                        </div>
                        {isEditingSettings ? (
                          <Select 
                            value={settingsFormData.language} 
                            onValueChange={(value) => handleSettingsChange('language', value)}
                          >
                            <SelectTrigger className="w-32 bg-dark-primary border-border-dark">
                              <SelectValue placeholder="Select language" className="text-white" />
                            </SelectTrigger>
                            <SelectContent className="bg-dark-primary border-border-dark">
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {settings.language === 'en' ? 'English' : 
                             settings.language === 'es' ? 'Spanish' : 
                             settings.language === 'fr' ? 'French' : 
                             settings.language === 'de' ? 'German' : settings.language}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">Timezone</p>
                          <p className="text-sm text-text-secondary">Set your timezone</p>
                        </div>
                        {isEditingSettings ? (
                          <Input
                            value={settingsFormData.timezone}
                            onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                            className="w-64 bg-dark-primary border-border-dark text-text-primary"
                          />
                        ) : (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {settings.timezone}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {isEditingSettings && (
                      <Button 
                        onClick={handleSaveSettings} 
                        className="w-full bg-tech-green hover:bg-tech-green/90 text-dark-primary mt-4"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="mr-2" />
                            Save Settings
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
