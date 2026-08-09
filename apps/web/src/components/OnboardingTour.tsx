/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps, no-use-before-define */
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Step, STATUS } from "react-joyride";

const Joyride = dynamic(() => import("react-joyride").then((mod: any) => mod.default || mod), { ssr: false }) as any;

export default function OnboardingTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Jalankan tour setelah komponen dimount (dengan sedikit delay agar DOM siap)
    const timer = setTimeout(() => setRun(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const steps: Step[] = [
    {
      target: ".header-sticky",
      content: "Selamat datang di Dasbor StatsLab! Di sini Anda akan belajar literasi data.",
    },
    {
      target: ".progress-indicator",
      content: "Ini adalah indikator progres Anda. Selesaikan tugas untuk meningkatkan Level Watson-Callingham Anda.",
    },
    {
      target: ".session-control",
      content: "Identitas dan XP Anda tercatat di sini. Kumpulkan XP dan raih sertifikat di Level 6!",
    },
    {
      target: ".recharts-wrapper",
      content: "Ini adalah grafik interaktif. Anda dapat mengklik elemen tertentu pada grafik untuk menjawab tugas (PBL).",
    }
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      styles={{
        options: {
          primaryColor: 'var(--color-emerald-600)',
          zIndex: 10000,
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
}
