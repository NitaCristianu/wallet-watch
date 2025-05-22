import React, { useMemo } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import * as reactSpring from "@react-spring/three";

export default () => {
    return (
        <ShaderGradientCanvas
            style={{
                position: "absolute",
                top: 0,
                pointerEvents: "none",
                userSelect: "none",
                width: "100vw",
                height: "100vh",
            }}
        >
            <ShaderGradient
                control="props"
                urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=2.9&cPolarAngle=120&cameraZoom=1&color1=%23deffe7&color2=%23c9f8c4&color3=%23dbf8ff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=1.8&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=-90&shader=defaults&toggleAxis=true&type=waterPlane&uDensity=1&uFrequency=5.5&uSpeed=0.05&uStrength=3&uTime=0.2&wireframe=false&zoomOut=false"
            />
        </ShaderGradientCanvas>
    );
};
