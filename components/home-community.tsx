import Image from "next/image";
import Link from "next/link";
import { UserAvatar } from "./account/user-avatar";
import { listHomeCommunity } from "@/lib/accounts/home-community";
import styles from "./home.module.css";

export async function HomeCommunity() {
  // Account-service availability must not take the public catalog offline.
  const members = await listHomeCommunity().catch(() => {
    console.warn("Home community is temporarily unavailable.");
    return [];
  });
  return (
    <section className={styles.section} aria-labelledby="home-community-title">
      <p className="catalog-kicker">Una comunidad que va creciendo</p>
      <h2 id="home-community-title">Confían en nosotros</h2>
      <p>
        Productores que han reclamado su ficha y personas que comparten su
        perfil en Chisan.
      </p>
      {members.length ? (
        <div className={styles.community}>
          {members.map((member) => (
            <Link key={`${member.kind}:${member.key}`} href={member.href}>
              {member.kind === "user" ? (
                <UserAvatar name={member.name} src={member.image} size={64} />
              ) : member.image ? (
                <Image
                  src={member.image}
                  alt=""
                  width={320}
                  height={240}
                  sizes="(max-width: 700px) 45vw, 240px"
                />
              ) : null}
              <strong>{member.name}</strong>
              <span>{member.place}</span>
            </Link>
          ))}
        </div>
      ) : (
        <Link className={styles.textLink} href="/registro">
          Forma parte de Chisan <span aria-hidden="true">↗</span>
        </Link>
      )}
    </section>
  );
}
