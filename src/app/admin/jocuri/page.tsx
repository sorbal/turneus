import { prisma } from "@/lib/prisma";

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <h1>Jocuri</h1>
      <p>Administrare jocuri disponibile pe platforma Turneus.</p>

      <table style={{ width: "100%", marginTop: 30, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>
              Nume
            </th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>
              Slug
            </th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{game.name}</td>
              <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{game.slug}</td>
              <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                {game.isActive ? "Activ" : "Inactiv"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
