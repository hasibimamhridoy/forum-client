import { CreateThreadForm } from "../_components/create-thread-form";

export default function NewThreadPage() {
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-3xl font-bold">Create Threads</h1>

      <main className="container py-8 max-w-4xl">
        <CreateThreadForm />
      </main>
    </div>
  );
}
