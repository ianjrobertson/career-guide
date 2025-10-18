"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MajorSelector } from "./major-selector";
import { SkillSelector } from "./skill-selector";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Step = "welcome" | "major" | "skills";

interface Skill {
  skill_id: number;
  skill_name: string;
}

export function OnboardingForm() {
  const supabase = createClient();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [selectedMajorId, setSelectedMajorId] = useState<number>(0);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [loading, setIsLoading ] = useState(false);
  const [error, setError] = useState<string | null>('');

  const steps: Step[] = ["welcome", "major", "skills"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === "welcome") {
      setCurrentStep("major");
    } else if (currentStep === "major" && selectedMajorId) {
      setCurrentStep("skills");
    } else if (currentStep === "skills" && selectedSkillIds.length >= 3) {
      // Save onboarding data
      setIsLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Update profile to mark onboarding as complete
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ onboarded: true })
            .eq('id', user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
            setError('Failed to save onboarding data');
            setIsLoading(false);
            return;
          }

          console.log('Onboarding completed:', { selectedMajorId, selectedSkillIds });

          // Redirect to dashboard
          router.push("/protected");
        }
      } catch (err) {
        console.error('Error during onboarding completion:', err);
        setError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getSkillsByMajor = useCallback(async (majorId: number)  => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: skillMappings, error } = await supabase
        .from('major_skills_mapping')
        .select('skills!inner(skill_id, skill_name)')
        .eq('major_id', majorId);

      if (error) throw error;

      console.log('Raw data:', skillMappings);

      // Transform the nested data structure to flat array of skills
      const transformedSkills = skillMappings?.map((mapping: any) => ({
        skill_id: mapping.skills.skill_id,
        skill_name: mapping.skills.skill_name
      })) || [];

      console.log('Transformed skills:', transformedSkills);

      setAvailableSkills(transformedSkills);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills');
      console.error('Error fetching skills:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (selectedMajorId) {
      getSkillsByMajor(selectedMajorId);
    } else {
      setAvailableSkills([]);
    }
  }, [selectedMajorId, getSkillsByMajor]);

  const handleBack = () => {
    if (currentStep === "skills") {
      setCurrentStep("major");
    } else if (currentStep === "major") {
      setCurrentStep("welcome");
    }
  };

  const canProceed = () => {
    if (currentStep === "welcome") return true;
    if (currentStep === "major") return selectedMajorId !== 0;
    if (currentStep === "skills") return selectedSkillIds.length >= 3;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content Card */}
      <Card>
        {currentStep === "welcome" && (
          <>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">Welcome to Major Labs!</CardTitle>
              <CardDescription className="text-base">
                Let&apos;s find the perfect career path for you through hands-on exploration.
                This will only take 2 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Pick a major you&apos;re considering</h3>
                    <p className="text-sm text-muted-foreground">
                      Don&apos;t worry, you can change your mind later!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Select skills that interest you</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose 3-5 skills you&apos;d like to try out
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Start exploring!</h3>
                    <p className="text-sm text-muted-foreground">
                      Get hands-on practice problems and discover what you love
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === "major" && (
          <>
            <CardHeader>
              <CardTitle>What major are you considering?</CardTitle>
              <CardDescription>
                Select one major to start with. We&apos;ll show you relevant skills to explore.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MajorSelector
                selectedMajorId={selectedMajorId}
                onSelect={setSelectedMajorId}
              />
            </CardContent>
          </>
        )}

        {currentStep === "skills" && (
          <>
            <CardHeader>
              <CardTitle>Pick skills you want to try</CardTitle>
              <CardDescription>
                Select 3-5 skills that sound interesting. You&apos;ll get practice problems for each.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Loading skills...</p>
                  </div>
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => getSkillsByMajor(selectedMajorId)}
                  >
                    Try again
                  </Button>
                </div>
              )}

              {!loading && !error && (
                <SkillSelector
                  skills={availableSkills}
                  selectedSkillIds={selectedSkillIds}
                  onSelect={setSelectedSkillIds}
                  minRequired={3}
                  maxAllowed={5}
                />
              )}
            </CardContent>
          </>
        )}

        {/* Navigation Buttons */}
        <CardContent className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === "welcome"}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || loading}
          >
            {loading && currentStep === "skills" ? "Saving..." : currentStep === "skills" ? "Start Exploring" : "Next"}
            {currentStep !== "skills" && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
