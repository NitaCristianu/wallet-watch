"use client";

import { action_type, projectType } from "@/constants/types";
import FloatingBar from "./FloatingBar";
import FloatingCreateButton from "./FloatingCreatebutton";
import { TriggerProvider } from "@/utils/open-modal-utils";
import { useState } from "react";
import FloatingModal from "./FloatingModal";
import {
  IonIosHome,
  MaterialSymbolsLightSettingsRounded,
} from "@/constants/Icons";
import Link from "next/link";
import { ProjectData } from "sanity";

function FloatingClient({
  servercallback,
  project,
}: {
  servercallback: (data: Object, type: action_type) => void;
  project: projectType;
}) {
  const [showModal, setShowModal] = useState<action_type | null>(null);

  return (
    <div className="w-full h-full relative">
      <TriggerProvider onTrigger={(d) => setShowModal(d)}>
        <FloatingCreateButton />
        <FloatingModal visible={showModal} servercallback={servercallback} />
      </TriggerProvider>
      <div className="fixed flex left-5 top-5 text-surface-800 transition gap-3 cursor-pointer">
        <Link href={"/"}>
          <IonIosHome className="w-7 h-7 fill-current transition hover:text-surface-900 " />
        </Link>
        <Link href={`/settings/${project._id}`}>
          <MaterialSymbolsLightSettingsRounded className="w-7 h-7 fill-current hover:rotate-20 transition cursor-pointer hover:text-surface-900" />
        </Link>
      </div>
      {/* <FloatingBar /> */}
    </div>
  );
}

export default FloatingClient;
