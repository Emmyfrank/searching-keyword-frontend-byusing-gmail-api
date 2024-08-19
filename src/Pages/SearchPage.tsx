import React, { useEffect, useState } from "react";
import ApplicantCard from "../Cards/ApplicantCard";
import { generateCode, searchApplicants } from "../api";
import { Applicant } from "../Data/dummyData";
import image from "../assets/xjir_logo.png.pagespeed.ic.mfOyfr98d4.webp";
import banna from "../assets/banna.gif";
import { AxiosError } from "axios";

const SearchPage: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && code.length > 0) {
      handleCode(code);
    }
  }, []);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await searchApplicants(keyword);
      setResults(data);

      const updatedHistory = [keyword, ...searchHistory.filter(k => k !== keyword)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 401) {
        const { authUrl } = (err as AxiosError)?.response?.data as {
          authUrl: string;
        };

        if (authUrl) {
          window.location.href = authUrl;
          return;
        }
      }

      setError("Not Found.");
      console.error({ err });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCode = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await generateCode(code);
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 401) {
        const { authUrl } = (err as AxiosError)?.response?.data as {
          authUrl: string;
        };

        if (authUrl) {
          window.location.href = authUrl;
          return;
        }
      }

      setError("An error occurred while fetching results.");
      console.error({ err });
    } finally {
      setIsLoading(false);
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setKeyword(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="ainermainCont">
      <div className="topLogon">
        <img src={image} alt="jobrwanda-logon" className="logon" />
        <img src={banna} alt="SIC Web Banner" className="Banner" />
      </div>
      <div className="search-page">
        <h1 className="head1">Search for Applicants</h1>
        <div className="search-input-container">
        
          <input
            type="text"
            value={keyword}
            onChange={handleKeywordChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Enter keyword"
            
          />
          <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
          
          {showSuggestions && searchHistory.length > 0 && (
            <ul className="search-suggestions">
              {searchHistory.map((item, index) => (
                <li key={index} onClick={() => handleSuggestionClick(item)}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="results">
        {results.map((applicant) => (
          <ApplicantCard key={applicant.id} applicant={applicant} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
