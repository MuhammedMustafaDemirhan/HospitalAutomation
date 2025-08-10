import React, { useEffect, useState } from "react";
import Paging from "../../Components/Paging";

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const res = await fetch("/mock-data/feedbacks.json");
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error("Geri bildirimler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeedbacks();
  }, []);

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const getPaginatedFeedbacks = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return feedbacks.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) return <p>Geri bildirimler yükleniyor...</p>;

  if (feedbacks.length === 0) return <p>Geri bildirim bulunmamaktadır.</p>;

  return (
    <div>
      <h3>Hasta Geri Bildirimleri</h3>

      <ul className="list-group">
        {getPaginatedFeedbacks().map((fb) => (
          <li key={fb.FeedbackID} className="list-group-item">
            <p>{fb.Message}</p>
            <small>
              {new Date(fb.SentDate).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Paging
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      )}
    </div>
  );
}
