import { RegisterForm } from "../_components/register-form";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-4">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground">Join us today and get started</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
