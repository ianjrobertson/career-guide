"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MajorSelector } from "./major-selector";
import { SkillSelector } from "./skill-selector";
import { saveOnboardingData, getSkillsByMajorId } from "@/lib/mock-data";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

type Step = "welcome" | "major" | "skills";

export function OnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [selectedMajorId, setSelectedMajorId] = useState<string>("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);

  const steps: Step[] = ["welcome", "major", "skills"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === "welcome") {
      setCurrentStep("major");
    } else if (currentStep === "major" && selectedMajorId) {
      setCurrentStep("skills");
    } else if (currentStep === "skills" && selectedSkillIds.length >= 3) {
      // Save onboarding data
      saveOnboardingData({
        majorId: selectedMajorId,
        skillIds: selectedSkillIds,
        completedAt: new Date().toISOString()
      });

      // Redirect to skills browser or dashboard
      router.push("/skills");
    }
  };

  const handleBack = () => {
    if (currentStep === "skills") {
      setCurrentStep("major");
    } else if (currentStep === "major") {
      setCurrentStep("welcome");
    }
  };

  const canProceed = () => {
    if (currentStep === "welcome") return true;
    if (currentStep === "major") return selectedMajorId !== "";
    if (currentStep === "skills") return selectedSkillIds.length >= 3;
    return false;
  };

  const availableSkills = selectedMajorId ? getSkillsByMajorId(selectedMajorId) : [];

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
              <CardTitle className="text-3xl">Welcome to Career Guide!</CardTitle>
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
              <SkillSelector
                skills={availableSkills}
                selectedSkillIds={selectedSkillIds}
                onSelect={setSelectedSkillIds}
                minRequired={3}
                maxAllowed={5}
              />
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
            disabled={!canProceed()}
          >
            {currentStep === "skills" ? "Start Exploring" : "Next"}
            {currentStep !== "skills" && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
