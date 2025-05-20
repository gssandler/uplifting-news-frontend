import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">The Bright Report</h1>
      <p className="text-center mb-6 text-lg">Daily curated uplifting news from around the world.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex justify-center mb-6 space-x-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {(newsByCategory[category] || []).map((news, index) => (
              <Card key={index} className="hover:shadow-lg transition">
                <CardContent className="p-4">
                  <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-blue-600 hover:underline"
                  >
                    {news.title}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Source: {news.source}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-10 text-center">
        <Input
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder="Submit a positive news tip"
          className="mb-2"
        />
        <Button onClick={handleSubmission}>Submit</Button>
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Subscribe to Our Newsletter</h2>
        <form action="https://buttondown.email/api/emails/embed-subscribe/YOUR_NEWSLETTER" method="post" target="_blank" className="space-y-2">
          <Input type="email" name="email" placeholder="Enter your email" required className="w-full max-w-md mx-auto" />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </div>
  );
}