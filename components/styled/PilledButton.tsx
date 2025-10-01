
import type React from "react";

import { Button } from "@/components/ui/button";

import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

type PilledButtonRef = React.ElementRef<typeof Button>;
type PilledButtonProps = React.ComponentProps<typeof Button> & { loading?: boolean };

const PilledButton = forwardRef<PilledButtonRef, PilledButtonProps>((props, ref) => {
    return <Button 
        ref={ref} 
        size="lg"
        {...props} 
        disabled={props.disabled || props.loading}
        className={twMerge(
            "rounded-full group items-center justify-center", 
            (props.disabled || props.loading) && props.variant !== "outline" &&  "bg-gray-300",
            (props.disabled || props.loading) && props.variant === "outline" &&  "border-gray-300",
            props.className
        )}
    />
});  

export { PilledButton };