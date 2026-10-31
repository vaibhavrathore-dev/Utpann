import React, { createContext, useContext, useMemo, useState } from 'react';
import type { SpaceCm, Material, ApprovedScene } from '../domain/scene';

type ProjectStore = {
  space: SpaceCm; setSpace: React.Dispatch<React.SetStateAction<SpaceCm>>;
  materials: Material[]; setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  plan: ApprovedScene | null; setPlan: React.Dispatch<React.SetStateAction<ApprovedScene | null>>;
  selectedStep: number; setSelectedStep: React.Dispatch<React.SetStateAction<number>>;
  saved: boolean; setSaved: React.Dispatch<React.SetStateAction<boolean>>;
};
const ProjectContext = createContext<ProjectStore | null>(null);
export function ProjectProvider({ children }: {children: React.ReactNode}) {
  const [space, setSpace] = useState<SpaceCm>({ width:75, height:55, depth:35, source:'user_confirmed' });
  const [materials, setMaterials] = useState<Material[]>([
    {id:'board_1',category:'wood',quantity:5,length_cm:80,width_cm:24,thickness_cm:1.8,condition:'good'}
  ]);
  const [plan, setPlan] = useState<ApprovedScene | null>(null);
  const [selectedStep,setSelectedStep] = useState(0);
  const [saved,setSaved] = useState(false);
  const value = useMemo(()=>({space,setSpace,materials,setMaterials,plan,setPlan,selectedStep,setSelectedStep,saved,setSaved}), [space,materials,plan,selectedStep,saved]);
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
export function useProject(): ProjectStore {
  const ctx=useContext(ProjectContext);if (!ctx) throw Error('Missing ProjectProvider');return ctx;
}
