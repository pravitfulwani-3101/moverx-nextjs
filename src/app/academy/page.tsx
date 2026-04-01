"use client";

import { useState } from "react";
import { AcademySidebar } from "@/components/academy/AcademySidebar";
import { OverviewSection } from "@/components/academy/sections/OverviewSection";
import { SquadSection } from "@/components/academy/sections/SquadSection";
import { ScreeningSection } from "@/components/academy/sections/ScreeningSection";
import { AcadProtocolsSection } from "@/components/academy/sections/AcadProtocolsSection";
import { Toast, useToast } from "@/components/ui/Toast";
import { ACADEMY_ATHLETES } from "@/data/demo";
import type { Athlete } from "@/types";

type AcTab = "overview" | "squad" | "screening" | "protocols";

export default function AcademyPage() {
  const { toast, flash } = useToast();
  const [tab, setTab] = useState<AcTab>("overview");
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  const redCount = ACADEMY_ATHLETES.filter((a) => a.status === "red").length;

  const handleSelectAthlete = (a: Athlete) => {
    setSelectedAthlete(a);
    setTab("squad");
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: "linear-gradient(160deg,#060810 0%,#0b0f19 50%,#080c14 100%)",
        color: "#b0b8c4",
      }}
    >
      <Toast show={toast.show} message={toast.message} />

      <AcademySidebar tab={tab} onTab={setTab} redCount={redCount} />

      <div className="flex-1 overflow-auto" style={{ maxHeight: "100vh" }}>
        <div className="p-[22px_28px] max-w-[1100px]">

          {tab === "overview" && (
            <OverviewSection onSelectAthlete={handleSelectAthlete} onFlash={flash} />
          )}

          {tab === "squad" && (
            <SquadSection
              selectedId={selectedAthlete?.id ?? null}
              onSelect={(a) => setSelectedAthlete(a)}
              onFlash={flash}
            />
          )}

          {tab === "screening" && <ScreeningSection />}

          {tab === "protocols" && <AcadProtocolsSection onFlash={flash} />}
        </div>
      </div>
    </div>
  );
}
