import { requireCurrentAccount } from "@/lib/accounts/auth";
import { communityService } from "@/lib/community/runtime";
import { TIMELINE_PATH, timelineFilterSchema } from "@/lib/community/policy";
import { Timeline } from "@/components/community/timeline";

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string;
    cursor?: string;
    messagePage?: string;
  }>;
}) {
  const account = await requireCurrentAccount(TIMELINE_PATH);
  const params = await searchParams;
  const filter = timelineFilterSchema.safeParse(params.filter).data ?? "all";
  const page = await communityService().timeline(account.id, {
    filter,
    cursor: typeof params.cursor === "string" ? params.cursor : undefined,
    messagePage:
      typeof params.messagePage === "string" &&
      /^\d{1,5}$/.test(params.messagePage)
        ? Number(params.messagePage)
        : 0,
  });
  return (
    <div className="account-content">
      <Timeline page={page} filter={filter} />
    </div>
  );
}
