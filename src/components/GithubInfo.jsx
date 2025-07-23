import { useEffect, useState } from "react";

export default function GithubInfo() {
  const [repoInfo, setRepoInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepo = async () => {
      const res = await fetch("/repositories/1/github-info");
      const data = await res.json();
      setRepoInfo(data);
      setLoading(false);
    };
    fetchRepo();
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2>GitHub Repository Info</h2>
      <pre>{JSON.stringify(repoInfo, null, 2)}</pre>
    </div>
  );
}
