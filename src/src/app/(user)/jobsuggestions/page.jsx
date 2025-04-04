"use client";
import { jobSuggestion } from "@/app/model/jobSuggestion";
import CustomBtn from "@/components/CustomBtn";
import JobSuggestionsDisplay from "@/components/dashcomponents/JobSuggestionsDisplay";
import { getJobSuggestions, getResume } from "@/firebase/users/read";
import { insertJobSuggestions } from "@/firebase/users/write";
import { ShieldAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const JobSuggestions = () => {
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    (async () => {
      const rr = await getResume({ uid: user?.uid });
      console.log("rr", rr);
      if (rr) {
        setResumeData(rr);
      }
    })();
    (async () => {
      const rr = await getJobSuggestions({ uid: user?.uid });
      console.log("rr", rr);
      if (rr) {
        setSuggestions(rr);
      }
    })();
  }, [user]);

  const handleGenerateJobSuggestion = async () => {
    setIsLoading(true);
    try {
      // console.log(data);
      if (resumeData) {
        console.log("clicked");
        const res = await jobSuggestion(resumeData);
        console.log("res::", res);
        const aiSuggestion = JSON.parse(await res);
        console.log(aiSuggestion);
        if (user?.uid && aiSuggestion) {
          await insertJobSuggestions({ uid: user?.uid, data: aiSuggestion });
        }
        toast.success("Review & suggestion Generated");
        if (aiSuggestion) {
          setSuggestions(aiSuggestion);
        }
      }
    } catch (error) {
      toast.error("Error Generating Job Suggestions");
      console.log("Error ===>>>", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <main className="pt-20 p-4 text-gray-800 dark:text-white">
        {suggestions && <JobSuggestionsDisplay data={suggestions} />}
        {!suggestions && (
          <div className="w-full p-2 text-center justify-center border border-dashed border-red-500 text-red-500 dark:border-red-100 rounded-lg my-3 flex dark:text-red-200">
            <ShieldAlert /> No Job Suggestions Found , <br />
            Generate Job Suggestions with Ai 👇👇
          </div>
        )}
        <CustomBtn
          onClick={handleGenerateJobSuggestion}
          isLoading={isLoading}
          className={`my-2 py-1 px-2 rounded-full border bg-purple-200 dark:bg-transparent border-purple-400 mx-auto`}
        >
          ✨
          {suggestions
            ? "ReGenerate Ai Based Job Suggestions"
            : "Generate Ai Based Job Suggestions"}
        </CustomBtn>
      </main>
    </>
  );
};

export default JobSuggestions;
