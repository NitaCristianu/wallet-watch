import React, { useMemo } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import * as reactSpring from "@react-spring/three";

export default function Component() {
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
                urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.4&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%235a806d&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.03&uStrength=1.5&uTime=8&wireframe=false"
            />
        </ShaderGradientCanvas>
    );
}
