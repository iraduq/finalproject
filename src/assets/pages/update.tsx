import { useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaCodeBranch } from "react-icons/fa";
import "../styles/update.css";
import ScaleLoader from "react-spinners/ScaleLoader";

interface Commit {
  sha: string;
  commit: {
    author: {
      name?: string;
      email?: string;
      date?: string;
    } | null;
    message: string;
  };
}

const CommitsList = () => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommits = async () => {
      const octokit = new Octokit({
        auth: "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",
      });

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { data } = await octokit.request(
          "GET /repos/{owner}/{repo}/commits",
          {
            owner: "iraduq",
            repo: "finalproject",
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        setCommits(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, []);

  if (loading) {
    return (
      <div className="waiting-message">
        <ScaleLoader loading={loading} color="#999" />
        <p>Fetching data...</p>
      </div>
    );
  }

  return (
    <div
      className="wrapper-commits"
      style={{
        height: "100vh",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "4vh",
        }}
        className="commit-history"
      >
        Commit History
      </h1>
      <div className="commits-list">
        <VerticalTimeline>
          {commits.map((commit) => {
            const commitDate = commit.commit.author?.date
              ? new Date(commit.commit.author.date).toLocaleString()
              : "Unknown";

            const commitUrl = `https://github.com/iraduq/finalproject/commit/${commit.sha}`;

            return (
              <VerticalTimelineElement
                key={commit.sha}
                date=""
                iconStyle={{
                  display: "none",
                }}
                contentStyle={{
                  background: "#222",
                  color: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                  padding: "10px",
                  transition: "transform 0.3s",
                }}
                contentArrowStyle={{ borderRight: "7px solid  #34495e" }}
              >
                <h3
                  className="vertical-timeline-element-title"
                  style={{
                    fontSize: "18px",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  {commit.commit.author?.name ?? "Unknown"}
                </h3>
                <h4
                  className="vertical-timeline-element-subtitle"
                  style={{
                    fontSize: "14px",
                    color: "#ccc",
                    marginBottom: "5px",
                  }}
                >
                  {commit.commit.message}
                </h4>

                <p
                  style={{
                    fontSize: "12px",
                    color: "#aaa",
                    marginTop: "10px",
                  }}
                >
                  {commitDate}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <FaCodeBranch
                    style={{ marginRight: "5px", color: "#e74c3c" }}
                  />

                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#fff" }}
                  >
                    <span style={{ fontSize: "12px", color: "#e74c3c" }}>
                      Commit
                    </span>
                  </a>
                </div>
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
    </div>
  );
};

export default CommitsList;
