import { ThreadView } from "../_components/thread-view";

export default async function ThreadPage({
  params,
}: {
  params: { id: string };
}) {
  const x = await params;
  console.log("threadId", x);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="">
          <ThreadView threadId={x.id} />
        </div>
      </main>
    </div>
  );
}
