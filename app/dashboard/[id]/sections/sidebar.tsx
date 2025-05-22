import { IonIosHome, MaterialSymbolsLightCreditCardOutline, MaterialSymbolsLightSettingsRounded, MaterialSymbolsLightSoundDetectionGlassBreakOutlineRounded, MaterialSymbolsMoneyBagRounded } from "@/constants/Icons";
import { projectType } from "@/constants/types";
import { Project } from "@/sanity/sanity/schemaTypes";
import Link from "next/link";

function Item({ displayname, ammount, icon }: { displayname: string, ammount: number, icon: any }) {
    return <div className="flex flex-col gap-1 pl-2 w-full cursor-pointerw">
        <div className="flex flex-row justify-between fill-accent-400 pr-2 items-center">
            <li className="flex flex-row items-center justify-between">
                <div className="p-1 w-9">
                    {icon}
                </div>
                <p className="text-text-secondary">
                    {displayname}
                </p>
            </li>
            {ammount >= 0 ?
                <p className={`${"text-state-success/60 h-max"}`}>{ammount} RON</p> :
                <p className={`${"text-state-error/60 h-max"}`}>{ammount} RON</p>
            }
        </div>

    </div>
}

function Sidebar({ project_data }: { project_data: projectType }) {
    return (<section className="pt-6 bg-grat-400/10 h-screen overflow-hidden p-6 w-80 absolute z-3 backdrop-blur-xl rounded-r-xl" id="taskbar">
        <div className="p-3 mb-5 gap-4 fill-surface-700 flex relative">
            <Link href={"/"} className="hover:fill-surface-900 cursor-pointer h-6 w-6 aspect-square transition">
                <IonIosHome className="h-full w-full" />
            </Link>
            <Link className="hover:fill-surface-900 hover:rotate-90 cursor-pointer h-6 w-6 transition" href={`/settings/${project_data._id}`}>
                <MaterialSymbolsLightSettingsRounded className="w-full h-full" />
            </Link>
        </div>
        <div className="font-poppins flex items-center gap-2 rounded-lg bg-accent-400 p-1 px-5 text-lg font-[400] text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 512 512">
                <path d="M434.8 137.6L285.4 69.5c-16.2-7.4-42.7-7.4-58.9 0L77.2 137.6c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.9 7.7 44.7 7.7 61.6 0l148-67.5c17.6-8 17.6-21.1 0-29.1z" fill="currentColor" />
                <path d="M225.2 375.2l-99.8-45.5c-4.2-1.9-9.1-1.9-13.3 0l-34.9 15.9c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.9 7.7 44.7 7.7 61.6 0l148-67.5c17.6-8 17.6-21.1 0-29.1l-34.9-15.9c-4.2-1.9-9.1-1.9-13.3 0l-99.8 45.5c-16.9 7.7-44.7 7.7-61.6 0z" fill="currentColor" />
                <path d="M434.8 241.6l-31.7-14.4c-4.2-1.9-9-1.9-13.2 0l-108 48.9c-15.3 5.2-36.6 5.2-51.9 0l-108-48.9c-4.2-1.9-9-1.9-13.2 0l-31.7 14.4c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.9 7.7 44.7 7.7 61.6 0l148-67.5c17.7-8 17.7-21.1.1-29.1z" fill="currentColor" />
            </svg>

            <h1>{project_data.title}</h1>
        </div>

        <ul className="flex h-full w-full flex-col p-1 pt-5">
            <h3
                className="my-2 ml-1 text-text-tertiary"
            >{"Group 1"}</h3>
            <div className="pb-5 flex flex-col gap-1">
                <Item displayname="Debt" ammount={-130} icon={<MaterialSymbolsLightCreditCardOutline />} />
                <Item displayname="Job" ammount={700} icon={<MaterialSymbolsLightSoundDetectionGlassBreakOutlineRounded />} />
            </div>
            <h3
                className="my-2 ml-1 text-text-tertiary "
            >{"Group 2"}</h3>
            <div className="pb-1 flex flex-col gap-1">
                <Item displayname="Debt" ammount={-130} icon={<MaterialSymbolsLightCreditCardOutline />} />
                <Item displayname="Job" ammount={700} icon={<MaterialSymbolsLightSoundDetectionGlassBreakOutlineRounded />} />
            </div>
        </ul>

    </section>);

}

export default Sidebar;