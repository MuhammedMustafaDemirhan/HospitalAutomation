import React, { useEffect, useState } from "react";
import Paging from "./Paging";

export default function Announcements({ roleID }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/mock-data/announcements.json");
        const data = await res.json();
        const filtered = data.filter((a) => a.TargetRoleID === roleID);
        setAnnouncements(filtered);
      } catch (err) {
        console.error("Duyurular yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [roleID]);

  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirst, indexOfLast);

  if (loading) return <p>Duyurular yükleniyor...</p>;
  if (announcements.length === 0)
    return <p>Bu role özel bir duyuru bulunmamaktadır.</p>;

  return (
    <div className="mt-3">
      <h5>Duyurular</h5>
      <ul className="list-group">
        {currentAnnouncements.map((a) => (
          <li key={a.AnnouncementID} className="list-group-item">
            <strong>{a.Title}</strong>
            <p className="mb-1">{a.Content}</p>
            <small>{new Date(a.CreatedDate).toLocaleDateString("tr-TR")}</small>
          </li>
        ))}
      </ul>

      <Paging
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      />
    </div>
  );
}
