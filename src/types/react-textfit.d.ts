declare module "react-textfit" {
    import * as React from "react";

    export interface TextfitProps {
        mode?: "single" | "multi";
        forceSingleModeWidth?: boolean;
        min?: number;
        max?: number;
        throttle?: number;
        onReady?: () => void;
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    }

    export const Textfit: React.FC<TextfitProps>;
}
