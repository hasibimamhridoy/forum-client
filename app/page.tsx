import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Shield, Users, Zap } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthOptions } from "./lib/utils";

export default async function HomePage() {
  const session: any = await getServerSession(AuthOptions); // Pass authOptions to getServerSession

  console.log("session", session);
  if (session?.user?.accessToken) {
    redirect("/forum");
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Forum Hub</h1>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Connect, Discuss, Grow</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            An AI-powered forum platform for real-time discussions with
            intelligent content moderation and automatic summarization.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Real-Time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Instant message delivery with live updates across all users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Zap className="w-8 h-8 text-primary mb-2" />
              <CardTitle>AI Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Intelligent spam detection and content filtering
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Shield className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security with encrypted communications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build vibrant communities with collaborative features
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
