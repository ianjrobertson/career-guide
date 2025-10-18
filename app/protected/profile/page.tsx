'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { User, School, X, Plus, Save } from 'lucide-react';
import { getUserProfile, saveUserProfile, type UserProfile } from '@/lib/mock-data';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load profile on mount
  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
    setFullName(userProfile.full_name);
    setUniversity(userProfile.university);
    setInterests(userProfile.interests);
  }, []);

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('');

    // Save profile updates
    saveUserProfile({
      full_name: fullName,
      university: university,
      interests: interests
    });

    // Show success message
    setSaveMessage('Profile updated successfully!');
    setIsSaving(false);

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  const hasChanges = profile && (
    fullName !== profile.full_name ||
    university !== profile.university ||
    JSON.stringify(interests) !== JSON.stringify(profile.interests)
  );

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your personal information and interests
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name and university</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* University */}
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <div className="flex items-center gap-2">
              <School size={18} className="text-muted-foreground" />
              <Input
                id="university"
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Enter your university"
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Interests</CardTitle>
          <CardDescription>
            Manage your areas of interest - these help personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Interests */}
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-2 px-3 flex items-center gap-2"
                >
                  {interest}
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${interest}`}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No interests added yet. Add some below!
            </p>
          )}

          {/* Add New Interest */}
          <div className="flex gap-2">
            <Input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddInterest();
                }
              }}
              placeholder="Add a new interest"
              className="flex-1"
            />
            <Button
              onClick={handleAddInterest}
              variant="outline"
              size="icon"
              disabled={!newInterest.trim()}
            >
              <Plus size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div>
          {saveMessage && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {saveMessage}
            </p>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          size="lg"
          className="gap-2"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
