"use client";

import * as React from "react";
import { createContext, useContext } from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

// Types
type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

type StepState = "active" | "completed" | "inactive" | "loading";

// Contexts
const StepperContext = createContext<StepperContextValue | undefined>(
  undefined
);
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined
);

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem");
  }
  return context;
};

// Components
interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

function Stepper({
  defaultValue = 0,
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  ...props
}: StepperProps) {
  const [activeStep, setInternalStep] = React.useState(defaultValue);

  const setActiveStep = React.useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange]
  );

  const currentStep = value ?? activeStep;

  return (
    <StepperContext.Provider
      value={{
        activeStep: currentStep,
        setActiveStep,
        orientation,
      }}
    >
      <div
        data-slot="stepper"
        className={cn(
          "group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className
        )}
        data-orientation={orientation}
        {...props}
      />
    </StepperContext.Provider>
  );
}

// StepperItem
interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper();

  const state: StepState =
    completed || step < activeStep
      ? "completed"
      : activeStep === step
      ? "active"
      : "inactive";

  const isLoading = loading && step === activeStep;

  return (
    <StepItemContext.Provider
      value={{ step, state, isDisabled: disabled, isLoading }}
    >
      <div
        data-slot="stepper-item"
        className={cn(
          "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
          className
        )}
        data-state={state}
        {...(isLoading ? { "data-loading": true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}

// StepperTrigger
interface StepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function StepperTrigger({
  asChild = false,
  className,
  children,
  ...props
}: StepperTriggerProps) {
  const { setActiveStep } = useStepper();
  const { step, isDisabled } = useStepItem();

  if (asChild) {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp data-slot="stepper-trigger" className={className}>
        {children}
      </Comp>
    );
  }

  return (
    <button
      data-slot="stepper-trigger"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center gap-3 rounded-full outline-none focus-visible:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={() => setActiveStep(step)}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}

type StepperIndicatorProps = {
  stepNumber: number;
  hasError?: boolean;
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>;

function StepperIndicator({
  asChild = false,
  className,
  children,
  hasError = false,
  stepNumber,
  ...props
}: StepperIndicatorProps) {
  const { state } = useStepItem();

  return (
    <span
    data-slot="stepper-indicator"
    data-state={state}
    data-error={hasError ? "true" : undefined}
    className={cn(
      "relative flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium border", // ← نضمن وجود border دائمًا
      "bg-muted text-muted-foreground",
  
      // ✅ هذه تخلي الدائرة مفعلة (زرقاء) عند الحاجة
      "data-[state=active]:bg-blue-400 data-[state=active]:text-primary-foreground",
  
      // ✅ هذه تخليها خضراء عند الإكمال
      "data-[state=completed]:bg-green-400 data-[state=completed]:text-primary-foreground",
  
      // ✅ أهم سطرين: نجبر الـ border والـ text يصيروا أحمر حتى لو `state=active`
      "data-[error=true]:!bg-red-500 data-[error=true]:!text-white",
  
      className
    )}
    {...props}
  >
    {asChild ? children : <span>{stepNumber}</span>}
  </span>
  );
}

export default StepperIndicator;

// StepperTitle
function StepperTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="stepper-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

// StepperDescription
function StepperDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="stepper-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

// StepperSeparator
function StepperSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="stepper-separator"
      className={cn(
        "bg-muted group-data-[state=completed]/step:bg-primary m-0.5 group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=horizontal]/stepper:flex-1 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=vertical]/stepper:w-0.5",
        className
      )}
      {...props}
    />
  )
}


export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
};
