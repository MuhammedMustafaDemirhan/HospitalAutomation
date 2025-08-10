import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Paging from "../../Components/Paging";

export default function Feedbacks() {
  const { currentUser } = useContext(AuthContext);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 5;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/mock-data/feedbacks.json");
        const data = await res.json();

        const userFeedbacks = data.filter(
          (fb) => fb.PatientID === currentUser?.UserID
        );

        userFeedbacks.sort(
          (a, b) =>
            new Date(b.SentDate).getTime() - new Date(a.SentDate).getTime()
        );

        setFeedbacks(userFeedbacks);
      } catch (error) {
        console.error("Feedback verisi çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchFeedbacks();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);
  const indexOfLast = currentPage * feedbacksPerPage;
  const indexOfFirst = indexOfLast - feedbacksPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleAddFeedback = () => {
    if (!newMessage.trim()) {
      alert("Lütfen bir mesaj yazınız.");
      return;
    }

    const newId =
      feedbacks.length > 0
        ? Math.max(...feedbacks.map((f) => f.FeedbackID)) + 1
        : 1;

    const newFeedback = {
      FeedbackID: newId,
      PatientID: currentUser.UserID,
      Message: newMessage.trim(),
      SentDate: new Date().toISOString(),
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
    setNewMessage("");
    setShowFeedbackForm(false);
    setCurrentPage(1);
    alert("Geri bildiriminiz başarıyla kaydedildi.");
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!currentUser) return <p>Lütfen giriş yapınız.</p>;

  return (
    <div>
      <h3>Geri Bildirimlerim</h3>

      <button
        className="btn btn-success mb-3"
        onClick={() => setShowFeedbackForm(!showFeedbackForm)}
      >
        {showFeedbackForm ? "İptal" : "Yeni Geri Bildirim Gönder"}
      </button>

      {showFeedbackForm && (
        <div className="card p-3 mb-4">
          <textarea
            className="form-control mb-2"
            rows={3}
            placeholder="Geri bildiriminizi yazınız..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddFeedback}>
            Gönder
          </button>
        </div>
      )}

      {feedbacks.length === 0 && <p>Henüz geri bildiriminiz yok.</p>}

      <ul className="list-group mb-3">
        {currentFeedbacks.map((fb) => (
          <li key={fb.FeedbackID} className="list-group-item">
            <p>{fb.Message}</p>
            <small className="text-muted">
              {new Date(fb.SentDate).toLocaleString("tr-TR")}
            </small>
          </li>
        ))}
      </ul>

      {feedbacks.length > feedbacksPerPage && (
        <Paging
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      )}
    </div>
  );
}
