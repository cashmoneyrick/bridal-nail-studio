import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Hand, Check, Plus, Trash2, Edit2, X, Loader2, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNailProfilesStore, NailSizes, NailProfile } from "@/stores/nailProfilesStore";
import { useNailProfileSync } from "@/hooks/useNailProfileSync";

// Finger names for each hand
const LEFT_HAND_FINGERS = ['Pinky', 'Ring', 'Middle', 'Index', 'Thumb'];
const RIGHT_HAND_FINGERS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];

// Size options 00-10
const SIZE_OPTIONS = ['00', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const DEFAULT_SIZES: NailSizes = {
  leftPinky: '',
  leftRing: '',
  leftMiddle: '',
  leftIndex: '',
  leftThumb: '',
  rightThumb: '',
  rightIndex: '',
  rightMiddle: '',
  rightRing: '',
  rightPinky: '',
};

const PerfectFitProfile = () => {
  const { profiles, addProfile, updateProfile, deleteProfile, selectProfile, selectedProfileId, isLoading: storeLoading } = useNailProfilesStore();
  const { isSynced, isAuthenticated, isLoading: syncLoading } = useNailProfileSync();
  
  const [editingProfile, setEditingProfile] = useState<NailProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [sizes, setSizes] = useState<NailSizes>(DEFAULT_SIZES);
  
  const isLoading = storeLoading || syncLoading;

  const startNewProfile = () => {
    setIsCreating(true);
    setEditingProfile(null);
    setProfileName('');
    setSizes(DEFAULT_SIZES);
  };

  const startEditProfile = (profile: NailProfile) => {
    setEditingProfile(profile);
    setIsCreating(false);
    setProfileName(profile.name);
    setSizes(profile.sizes);
  };

  const cancelEditing = () => {
    setEditingProfile(null);
    setIsCreating(false);
    setProfileName('');
    setSizes(DEFAULT_SIZES);
  };

  const handleSizeChange = (finger: keyof NailSizes, value: string) => {
    setSizes(prev => ({ ...prev, [finger]: value }));
  };

  const handleSave = async () => {
    if (!profileName.trim()) {
      toast.error("Please enter a profile name", { position: "top-center" });
      return;
    }

    setIsSaving(true);
    try {
      if (isCreating) {
        const id = await addProfile(profileName.trim(), sizes);
        await selectProfile(id);
        toast.success(`"${profileName}" profile created!`, { position: "top-center" });
      } else if (editingProfile) {
        await updateProfile(editingProfile.id, profileName.trim(), sizes);
        toast.success(`"${profileName}" profile updated!`, { position: "top-center" });
      }
      cancelEditing();
    } catch (error) {
      toast.error("Failed to save profile. Please try again.", { position: "top-center" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (profile: NailProfile) => {
    try {
      await deleteProfile(profile.id);
      toast.success(`"${profile.name}" profile deleted`, { position: "top-center" });
      if (editingProfile?.id === profile.id) {
        cancelEditing();
      }
    } catch (error) {
      toast.error("Failed to delete profile. Please try again.", { position: "top-center" });
    }
  };

  const filledCount = Object.values(sizes).filter(size => size !== '').length;
  const isEditing = isCreating || editingProfile !== null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back link */}
          <Link to="/account" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-secondary/50 to-primary/30 flex items-center justify-center mb-4">
              <Hand className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium mb-3">
              My Perfect Fit Profiles
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Save nail sizes for yourself and others. Perfect for ordering sets as gifts!
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card className="mb-8">
              <CardContent className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Syncing your profiles...</p>
              </CardContent>
            </Card>
          )}

          {/* Profile List */}
          {!isEditing && !isLoading && (
            <div className="space-y-4 mb-8">
              {profiles.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                      <Hand className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-medium mb-2">No profiles yet</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      Create your first profile to save your nail sizes and make ordering faster.
                    </p>
                    <Button onClick={startNewProfile} className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Profile
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {profiles.map(profile => (
                    <Card 
                      key={profile.id} 
                      className={`transition-colors ${selectedProfileId === profile.id ? 'border-primary bg-primary/5' : ''}`}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div 
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                            onClick={() => selectProfile(profile.id)}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedProfileId === profile.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}>
                              {selectedProfileId === profile.id ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <Hand className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{profile.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {Object.values(profile.sizes).filter(s => s).length}/10 sizes saved
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditProfile(profile)}
                              className="h-8 w-8"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(profile)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button 
                    onClick={startNewProfile} 
                    variant="outline" 
                    className="w-full rounded-xl border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Profile
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Edit/Create Form */}
          {isEditing && (
            <div className="space-y-6">
              {/* Cancel button */}
              <button 
                onClick={cancelEditing}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>

              {/* Profile Name */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-xl">
                    {isCreating ? 'Create New Profile' : 'Edit Profile'}
                  </CardTitle>
                  <CardDescription>
                    Give this profile a name so you can easily identify it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="profileName">Profile Name</Label>
                    <Input
                      id="profileName"
                      placeholder="e.g., My Sizes, Mom, Sister, Best Friend..."
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sizing Info Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 shrink-0">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">How to find your sizes</h3>
                      <p className="text-sm text-muted-foreground">
                        Use our sizing kit to measure each nail. Match your natural nail width to the numbered tips 
                        and record each size below. If you're between sizes, choose the larger size for the most comfortable fit.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress indicator */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Profile completion</span>
                  <span className="font-medium">{filledCount}/10 sizes entered</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${(filledCount / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Hand Size Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Hand */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      <span className="text-2xl">🤚</span>
                      Left Hand
                    </CardTitle>
                    <CardDescription>Enter sizes from pinky to thumb</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {LEFT_HAND_FINGERS.map((finger) => {
                      const key = `left${finger}` as keyof NailSizes;
                      return (
                        <div key={key} className="flex items-center justify-between gap-4">
                          <Label className="text-sm font-medium min-w-[80px]">
                            {finger}
                          </Label>
                          <Select
                            value={sizes[key]}
                            onValueChange={(value) => handleSizeChange(key, value)}
                          >
                            <SelectTrigger className="w-[120px] rounded-full">
                              <SelectValue placeholder="Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {SIZE_OPTIONS.map(size => (
                                <SelectItem key={size} value={size}>
                                  Size {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Right Hand */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      <span className="text-2xl transform scale-x-[-1]">🤚</span>
                      Right Hand
                    </CardTitle>
                    <CardDescription>Enter sizes from thumb to pinky</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {RIGHT_HAND_FINGERS.map((finger) => {
                      const key = `right${finger}` as keyof NailSizes;
                      return (
                        <div key={key} className="flex items-center justify-between gap-4">
                          <Label className="text-sm font-medium min-w-[80px]">
                            {finger}
                          </Label>
                          <Select
                            value={sizes[key]}
                            onValueChange={(value) => handleSizeChange(key, value)}
                          >
                            <SelectTrigger className="w-[120px] rounded-full">
                              <SelectValue placeholder="Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {SIZE_OPTIONS.map(size => (
                                <SelectItem key={size} value={size}>
                                  Size {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Save Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/50 rounded-2xl">
                <div>
                  {filledCount === 10 ? (
                    <div className="flex items-center gap-2 text-primary">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">All sizes entered!</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Enter all 10 sizes for a complete profile
                    </p>
                  )}
                </div>
                <Button 
                  onClick={handleSave}
                  disabled={!profileName.trim() || isSaving}
                  className="btn-primary min-w-[160px]"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isCreating ? 'Create Profile' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground mt-8">
            {isAuthenticated && isSynced ? (
              <span className="inline-flex items-center gap-1">
                <Cloud className="h-3 w-3" />
                Your profiles are synced to your account and available on all your devices.
              </span>
            ) : (
              "Your profiles are saved locally. Sign in to sync them across all your devices!"
            )}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PerfectFitProfile;
