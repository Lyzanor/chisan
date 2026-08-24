import Link from "next/link";

export default function ChangeRequestNotFound() {
  return (
    <div className="admin-content">
      <section className="admin-panel">
        <p className="catalog-kicker">Unknown request</p>
        <h2>Producer change not found</h2>
        <p>
          The identifier is invalid or no producer-change request exists with that durable UUID.
        </p>
        <Link href="/admin/cambios" className="account-button">
          Return to the change registry
        </Link>
      </section>
    </div>
  );
}
