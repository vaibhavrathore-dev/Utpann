import React,{useRef} from 'react';
import {
 ViroScene,ViroARScene,ViroNode,ViroBox,ViroCamera,ViroAmbientLight,ViroDirectionalLight,
 ViroMaterials,ViroARPlaneSelector
} from '@reactvision/react-viro';
import {cmToMeters,type ApprovedScene} from '../domain/scene';

ViroMaterials.createMaterials({
 rayWood:{diffuseColor:'#D9B68D',lightingModel:'Lambert'},
 rayWoodMuted:{diffuseColor:'#967C68',lightingModel:'Lambert'},
 rayFocus:{diffuseColor:'#C4B2FF',lightingModel:'Lambert'},
 rayFloor:{diffuseColor:'#242632',lightingModel:'Constant'},
});
export function SceneParts({plan,step=3}:{plan:ApprovedScene,step?:number}){
 const active=plan.assembly_steps[step]?.highlight_component_ids??plan.scene.components.map(p=>p.id);
 return <ViroNode>
  {plan.scene.components.map((part,index)=>{
    const isActive=active.includes(part.id);
    return <ViroBox key={part.id}
      position={part.position_cm.map(cmToMeters) as [number,number,number]}
      rotation={part.rotation_deg}
      scale={part.size_cm.map(cmToMeters) as [number,number,number]}
      materials={[isActive?'rayFocus':(index%2?'rayWoodMuted':'rayWood')]}
      opacity={isActive?1:.38}
    />;
  })}
 </ViroNode>;
}
type SceneProps={sceneNavigator:{viroAppProps?:{plan?:ApprovedScene;step?:number;angle?:number;onPlaced?:()=>void}}};
export function PreviewScene({sceneNavigator}:SceneProps){
 const props=sceneNavigator?.viroAppProps;const plan=props?.plan;
 return <ViroScene><ViroAmbientLight color="#FFFFFF" intensity={380}/><ViroDirectionalLight color="#FFFFFF" direction={[-.4,-1,-.7]} intensity={600}/>
  <ViroCamera position={[0,0,0]} active/>
  {plan&&<ViroNode position={[0,-.27,-1.13]} rotation={[-9,props?.angle??-22,0]} scale={[1.45,1.45,1.45]}><SceneParts plan={plan} step={props?.step}/></ViroNode>}
 </ViroScene>;
}
export function ARPlacementScene({sceneNavigator}:SceneProps){
 const selectorRef=useRef<any>(null);const props=sceneNavigator?.viroAppProps;const plan=props?.plan;
 return <ViroARScene
   anchorDetectionTypes={['PlanesHorizontal']}
   onAnchorFound={(a:any)=>selectorRef.current?.handleAnchorFound(a)}
   onAnchorUpdated={(a:any)=>selectorRef.current?.handleAnchorUpdated(a)}
   onAnchorRemoved={(a:any)=>a&&selectorRef.current?.handleAnchorRemoved(a)}
 ><ViroAmbientLight color="#FFFFFF" intensity={380}/>
   <ViroARPlaneSelector ref={selectorRef} alignment="Horizontal" hideOverlayOnSelection={true} onPlaneSelected={()=>props?.onPlaced?.()}>
      {plan?<SceneParts plan={plan} step={props?.step}/>:<ViroBox position={[0,.05,0]} scale={[.1,.1,.1]} materials={['rayFocus']}/>}
   </ViroARPlaneSelector>
 </ViroARScene>;
}
