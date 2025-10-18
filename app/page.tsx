import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Lightbulb, Sparkles, Target, TrendingUp, FlaskConical } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is authenticated, link to the app; otherwise link to auth pages
  const primaryLink = user ? "/protected" : "/auth/sign-up";
  const secondaryLink = user ? "/protected/skills" : "/auth/login";
  const primaryText = user ? "Go to Dashboard" : "Start Exploring";
  const secondaryText = user ? "Browse Skills" : "Sign In";
  const ctaLink = user ? "/protected/skills" : "/auth/sign-up";
  const ctaText = user ? "Explore Skills" : "Get Started Free";
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full border-b border-b-foreground/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="flex items-center gap-2">
            {/* Consistent flask logo */}
            <span className="font-bold text-xl flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-primary" />
              Major Labs
            </span>
          </div>
          <AuthButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="mb-4">
            For First-Year College Students
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Stop Taking Quizzes.
            <br />
            <span className="text-primary">Start Doing.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Discover your ideal career path through hands-on practice problems.
            Get personalized major recommendations based on what you actually enjoy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-lg">
              <Link href={primaryLink}>{primaryText}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg">
              <Link href={secondaryLink}>{secondaryText}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Choose Skills to Explore</CardTitle>
                <CardDescription>
                  Browse skills from data analysis to creative writing.
                  Pick what sounds interesting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Try Real Practice Problems</CardTitle>
                <CardDescription>
                  Get AI-generated, hands-on problems that give you a
                  realistic taste of each skill.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Get Personalized Matches</CardTitle>
                <CardDescription>
                  Rate what you enjoyed. We recommend majors that
                  align with your actual interests.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Major Labs?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Experience-Based Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No more abstract personality tests. Work through realistic problems
                  and discover what you actually enjoy doing, not just what a quiz says
                  about you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Practice Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get unique, relevant practice problems generated specifically for each
                  skill. Every challenge gives you real insight into potential career paths.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our system maps your enjoyment ratings to majors that require those
                  skills. The more you explore, the better your recommendations become.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Track Your Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualize your exploration progress. See which skill categories
                  resonate with you and watch your major matches evolve over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Find Your Path?
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            Join students exploring careers through real experience.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg">
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            <span className="font-semibold">Major Labs</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <ThemeSwitcher />
          </div>
        </div>
      </footer>
    </main>
  );
}
