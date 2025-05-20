import React, { useState, useEffect } from "react";

const categories = ["Health", "Environment", "Community"];

export default function UpliftingNewsPage() {
  const [submission, setSubmission] = useState("");
  const [activeTab, setActiveTab] = useState("Health");
  const [newsByCategory, setNewsByCategory] = useState({});

  useEffect(() => {
    const fetchNews = async () => {
      const newNews = {};
      for (let category of categories) {
        try {
          const res = await fetch(`https://uplifting-news-backend.onrender.com/news/${category}`);
          const data = await res.json();
          newNews[category] = data;
        } catch (err) {
          console.error(`Failed to fetch ${category} news`, err);
          newNews[category] = [];
        }
      }
      setNewsByCategory(newNews);
    };
    fetchNews();
  }, []);

  const handleSubmission = async () => {
    if (!submission) return;

    try {
      await fetch("https://YOUR_PROJECT_ID.supabase.co/rest/v1/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: "YOUR_SUPABASE_ANON_KEY",
          Authorization: "Bearer YOUR_SUPABASE_ANON_KEY",
        },
        body: JSON.stringify({ text: submission }),
      });
      alert("Thank you for your submission! We'll review it soon.");
      setSubmission("");
    } catch (err) {
      console.error("Error submitting tip:", err);
      alert("There was a problem submitting your tip.");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>The Bright Report</h1>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>Daily curated uplifting news from around the world.</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === category ? '#333' : '#ccc',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {(newsByCategory[activeTab] || []).map((news, index) => (
        <div key={index} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', marginBottom: '10px' }}>
          <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2rem', color: '#0066cc', textDecoration: 'none' }}>
            {news.title}
          </a>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Source: {news.source}</p>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <input
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder="Submit a positive news tip"
          style={{ padding: '10px', width: '70%', marginBottom: '10px' }}
        />
        <br />
        <button onClick={handleSubmission} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Submit
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Subscribe to Our Newsletter</h2>
        <form
          action="https://buttondown.email/api/emails/embed-subscribe/YOUR_NEWSLETTER"
          method="post"
          target="_blank"
          style={{ marginTop: '10px' }}
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            style={{ padding: '10px', width: '70%' }}
          />
          <br />
          <button type="submit" style={{ padding: '10px 20px', marginTop: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}