import React,{useRef} from 'react';
import {ViroARScene,ViroARPlaneSelector,ViroAmbientLight,ViroBox} from '@reactvision/react-viro';
import {ViroMaterials} from '@reactvision/react-viro';
ViroMaterials.createMaterials({rayTestCube:{diffuseColor:'#C4B2FF',lightingModel:'Lambert'}});
/** Milestone M0: minimal native ARCore test — no backend, AI, or 3D assets. */
export default function ARCube(){
 const ref=useRef<any>(null);
 return <ViroARScene anchorDetectionTypes={['PlanesHorizontal']}
   onAnchorFound={(a:any)=>ref.current?.handleAnchorFound(a)}
   onAnchorUpdated={(a:any)=>ref.current?.handleAnchorUpdated(a)}
   onAnchorRemoved={(a:any)=>a&&ref.current?.handleAnchorRemoved(a)}
 ><ViroAmbientLight color="#FFFFFF" intensity={380}/>
   <ViroARPlaneSelector ref={ref} alignment="Horizontal" hideOverlayOnSelection={true}>
     <ViroBox position={[0,.05,0]} scale={[.10,.10,.10]} materials={['rayTestCube']}/>
   </ViroARPlaneSelector>
 </ViroARScene>;
}
