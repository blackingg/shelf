"use client";
import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ReaderLayout } from "@/app/components/Reader/ReaderLayout";
import {
  useGetBookBySlugQuery,
  useGetBooksQuery,
} from "@/app/store/api/booksApi";

export default function ReaderPage() {
  const params = useParams();
  const { slug } = params;

  const [totalPages] = useState(42);
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isSuccess } = useGetBookBySlugQuery(String(slug));
  console.log(data);

  const title = String(slug) || "Untitled";
  const chapterTitle = "Chapter 1: No One's Crazy";

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <ReaderLayout
      title={title}
      subtitle="Author Name"
      currentPage={currentPage}
      totalPages={totalPages}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="font-serif"
        style={{ lineHeight: "1.8" }}
      >
        <div className="text-center mb-12">
          <span className="text-sm font-sans uppercase tracking-widest opacity-60">
            {chapterTitle}
          </span>
          <h2 className="text-4xl font-bold mt-4 mb-8">No One&apos;s Crazy</h2>
        </div>

        <p className="mb-6">
          Let me tell you about a problem. It might make you feel better about
          what you do with your money, and less judgmental about what other
          people do with theirs.
        </p>
        <p className="mb-6">
          People do some crazy things with money. But no one is crazy.
        </p>
        <p className="mb-6">
          Here&apos;s the thing: People from different generations, raised by
          different parents who earned different incomes and held different
          values, in different parts of the world, born into different
          economies, experiencing different job markets with different
          incentives and different degrees of luck, learn very different
          lessons.
        </p>
        <p className="mb-6">
          Everyone has their own unique experience with how the world works. And
          what you&apos;ve experienced is more compelling than what you learn
          second-hand. So all of us—you, me, everyone—go through life anchored
          to a set of views about how money works that vary wildly from person
          to person. What seems crazy to you might make sense to me.
        </p>
        <p className="mb-6">
          The person who grew up in poverty thinks about risk and reward in ways
          the child of a wealthy banker cannot fathom if he tried. The person
          who grew up when inflation was high experienced something the person
          who grew up with stable prices never had to. The stock broker who lost
          everything during the Great Depression experienced something the tech
          worker basking in the glory of the late 1990s can&apos;t imagine. The
          Australian who hasn&apos;t seen a recession in 30 years has
          experienced something the Greek worker hasn&apos;t.
        </p>
        <p className="mb-6">
          On and on. The list of experiences is endless. You know stuff about
          money that I don&apos;t, and vice versa. You go through life with
          different beliefs, goals, and forecasts, than I do. That&apos;s not
          because one of us is smarter than the other, or has better
          information. It&apos;s because we&apos;ve had different lives.
        </p>
      </motion.div>
    </ReaderLayout>
  );
}
