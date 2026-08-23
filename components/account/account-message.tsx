export type AccountMessageParams = {
  error?: string | string[];
  notice?: string | string[];
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function AccountMessage({ params }: { params: AccountMessageParams }) {
  const error = first(params.error).trim();
  const notice = first(params.notice).trim();
  if (!error && !notice) return null;

  return (
    <p
      className={`account-message ${error ? "account-message--error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {error || notice}
    </p>
  );
}
