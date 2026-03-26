import React from "react";
import { BuilderComponent } from "@/types/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ElementStylePanelProps {
  component: BuilderComponent | null;
  onUpdate: (updates: Partial<BuilderComponent>) => void;
  onClose: () => void;
}

interface StyleState {
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  width: string;
  height: string;
  borderRadius: string;
  borderColor: string;
  borderWidth: string;
}

interface SpacingState {
  groupPadding: boolean;
  groupMargin: boolean;
}

export const ElementStylePanel: React.FC<ElementStylePanelProps> = ({
  component,
  onUpdate,
  onClose,
}) => {
  const [styles, setStyles] = React.useState<StyleState>({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontSize: "16",
    paddingTop: "0",
    paddingRight: "0",
    paddingBottom: "0",
    paddingLeft: "0",
    marginTop: "0",
    marginRight: "0",
    marginBottom: "0",
    marginLeft: "0",
    width: "100",
    height: "",
    borderRadius: "0",
    borderColor: "#000000",
    borderWidth: "0",
  });

  const [spacing, setSpacing] = React.useState<SpacingState>({
    groupPadding: true,
    groupMargin: true,
  });

  const [expandedSections, setExpandedSections] = React.useState({
    colors: true,
    sizing: true,
    spacing: true,
    borders: true,
  });

  React.useEffect(() => {
    if (component) {
      const props = component.props || {};
      setStyles({
        backgroundColor: props.backgroundColor || "#ffffff",
        textColor: props.textColor || "#000000",
        fontSize: props.fontSize ? String(props.fontSize) : "16",
        paddingTop: props.paddingTop ? String(props.paddingTop) : "0",
        paddingRight: props.paddingRight ? String(props.paddingRight) : "0",
        paddingBottom: props.paddingBottom ? String(props.paddingBottom) : "0",
        paddingLeft: props.paddingLeft ? String(props.paddingLeft) : "0",
        marginTop: props.marginTop ? String(props.marginTop) : "0",
        marginRight: props.marginRight ? String(props.marginRight) : "0",
        marginBottom: props.marginBottom ? String(props.marginBottom) : "0",
        marginLeft: props.marginLeft ? String(props.marginLeft) : "0",
        width: props.width ? String(props.width) : "100",
        height: props.height ? String(props.height) : "",
        borderRadius: props.borderRadius ? String(props.borderRadius) : "0",
        borderColor: props.borderColor || "#000000",
        borderWidth: props.borderWidth ? String(props.borderWidth) : "0",
      });
    }
  }, [component]);

  const handleStyleChange = (key: keyof StyleState, value: string) => {
    setStyles((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update the component with the new style
    const updates: any = {};
    if (
      key === "backgroundColor" ||
      key === "textColor" ||
      key === "borderColor"
    ) {
      updates[key] = value;
    } else {
      updates[key] = isNaN(Number(value)) ? value : Number(value);
    }
    onUpdate(updates);
  };

  const handleGroupPaddingToggle = () => {
    setSpacing((prev) => ({
      ...prev,
      groupPadding: !prev.groupPadding,
    }));
  };

  const handleGroupMarginToggle = () => {
    setSpacing((prev) => ({
      ...prev,
      groupMargin: !prev.groupMargin,
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: keyof typeof expandedSections;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors group"
    >
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
        {title}
      </span>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-gray-400 transition-transform",
          expandedSections[section] && "rotate-180"
        )}
      />
    </button>
  );

  const StyleInput = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    max = 999,
    isPercentage = false,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    max?: number;
    isPercentage?: boolean;
  }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const maxValue = isPercentage ? 100 : max;

    const clampValue = (val: number): number => {
      return Math.max(0, Math.min(val, maxValue));
    };

    const handleNumberChange = (newVal: string) => {
      // Allow empty string for clearing
      if (newVal === "") {
        onChange("");
        return;
      }

      const numVal = Number(newVal);
      if (!isNaN(numVal)) {
        const clamped = clampValue(numVal);
        onChange(String(clamped));
      }
    };

    const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type !== "number") return;

      // Prevent default for arrow keys to stop scrolling
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();

        const currentValue = Number(value) || 0;
        const increment = e.shiftKey ? 10 : 1;

        let newValue = currentValue;
        if (e.key === "ArrowUp") {
          newValue = clampValue(currentValue + increment);
        } else if (e.key === "ArrowDown") {
          newValue = clampValue(currentValue - increment);
        }

        onChange(String(newValue));
      }
    };

    const handleNumberFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (type !== "number") return;
      // Select all text when focused so you can start typing immediately
      setTimeout(() => {
        e.target.select();
      }, 0);
    };

    const decrementValue = () => {
      const current = Number(value) || 0;
      const newVal = clampValue(current - 1);
      onChange(String(newVal));
    };

    const incrementValue = () => {
      const current = Number(value) || 0;
      const newVal = clampValue(current + 1);
      onChange(String(newVal));
    };

    return (
      <div className={cn("space-y-2", label ? "px-4 py-3 border-b border-gray-100" : "flex items-center gap-2")}>
        {label && <label className="text-xs font-bold text-gray-700">{label}</label>}
        {type === "color" ? (
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
            />
          </div>
        ) : (
          <div className={cn("flex items-center gap-1", label ? "" : "flex-1")}>
            {type === "number" && <span className="text-xs text-gray-600">▧</span>}
            <Input
              ref={inputRef}
              type={type === "number" ? "text" : type}
              inputMode={type === "number" ? "numeric" : undefined}
              value={value}
              onChange={(e) => {
                if (type === "number") {
                  handleNumberChange(e.target.value);
                } else {
                  onChange(e.target.value);
                }
              }}
              onKeyDown={handleNumberKeyDown}
              onFocus={handleNumberFocus}
              placeholder={placeholder}
              className={cn("h-8 text-sm", label ? "" : "flex-1")}
            />
            {type === "number" && (
              <>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {isPercentage ? "%" : "px"}
                </span>
                <div className="flex items-center gap-0">
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      decrementValue();
                      inputRef.current?.focus();
                    }}
                    className="px-1.5 py-1 hover:bg-gray-200 active:bg-gray-300 rounded-l text-xs font-semibold transition-colors"
                    title="Decrease (or use Down arrow)"
                  >
                    ▼
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      incrementValue();
                      inputRef.current?.focus();
                    }}
                    className="px-1.5 py-1 hover:bg-gray-200 active:bg-gray-300 rounded-r text-xs font-semibold transition-colors"
                    title="Increase (or use Up arrow)"
                  >
                    ▲
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!component) {
    return (
      <aside className="w-80 flex-shrink-0 h-full border-l border-gray-200 bg-white flex flex-col min-h-0">
        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">Style Panel</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Select an element to edit
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 flex-shrink-0 h-full border-l border-gray-200 bg-white flex flex-col overflow-hidden min-h-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-700">
            {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Colors Section */}
        <div>
          <SectionHeader title="Colors" section="colors" />
          {expandedSections.colors && (
            <>
              <StyleInput
                label="Background Color"
                value={styles.backgroundColor}
                onChange={(value) =>
                  handleStyleChange("backgroundColor", value)
                }
                type="color"
              />
              <StyleInput
                label="Text Color"
                value={styles.textColor}
                onChange={(value) => handleStyleChange("textColor", value)}
                type="color"
              />
              <StyleInput
                label="Border Color"
                value={styles.borderColor}
                onChange={(value) => handleStyleChange("borderColor", value)}
                type="color"
              />
            </>
          )}
        </div>

        {/* Sizing Section */}
        <div>
          <SectionHeader title="Sizing" section="sizing" />
          {expandedSections.sizing && (
            <>
              <StyleInput
                label="Width (%)"
                value={styles.width}
                onChange={(value) => handleStyleChange("width", value)}
                type="number"
                placeholder="100"
                max={100}
                isPercentage={true}
              />
              <StyleInput
                label="Height (px)"
                value={styles.height}
                onChange={(value) => handleStyleChange("height", value)}
                type="number"
                placeholder="auto"
                max={999}
              />
              <StyleInput
                label="Font Size (px)"
                value={styles.fontSize}
                onChange={(value) => handleStyleChange("fontSize", value)}
                type="number"
                placeholder="16"
                max={999}
              />
            </>
          )}
        </div>

        {/* Spacing Section */}
        <div>
          <SectionHeader title="Spacing" section="spacing" />
          {expandedSections.spacing && (
            <div className="px-4 py-4 space-y-6 bg-gray-50">
              {/* Padding Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    Padding
                    <span className="text-gray-400 text-xs">ⓘ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={spacing.groupPadding}
                      onChange={handleGroupPaddingToggle}
                      className="w-4 h-4"
                    />
                    <span className="text-xs text-gray-600">Group sides</span>
                  </label>
                </div>

                {spacing.groupPadding ? (
                  <StyleInput
                    label=""
                    value={styles.paddingTop}
                    onChange={(value) => {
                      handleStyleChange("paddingTop", value);
                      handleStyleChange("paddingRight", value);
                      handleStyleChange("paddingBottom", value);
                      handleStyleChange("paddingLeft", value);
                    }}
                    type="number"
                    placeholder="0"
                    max={200}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <StyleInput
                      label="Top"
                      value={styles.paddingTop}
                      onChange={(value) => handleStyleChange("paddingTop", value)}
                      type="number"
                      placeholder="0"
                      max={200}
                    />
                    <StyleInput
                      label="Right"
                      value={styles.paddingRight}
                      onChange={(value) => handleStyleChange("paddingRight", value)}
                      type="number"
                      placeholder="0"
                      max={200}
                    />
                    <StyleInput
                      label="Bottom"
                      value={styles.paddingBottom}
                      onChange={(value) => handleStyleChange("paddingBottom", value)}
                      type="number"
                      placeholder="0"
                      max={200}
                    />
                    <StyleInput
                      label="Left"
                      value={styles.paddingLeft}
                      onChange={(value) => handleStyleChange("paddingLeft", value)}
                      type="number"
                      placeholder="0"
                      max={200}
                    />
                  </div>
                )}
              </div>

              {/* Margin Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    Margin
                    <span className="text-gray-400 text-xs">ⓘ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={spacing.groupMargin}
                      onChange={handleGroupMarginToggle}
                      className="w-4 h-4"
                    />
                    <span className="text-xs text-gray-600">Group sides</span>
                  </label>
                </div>

                {spacing.groupMargin ? (
                  <StyleInput
                    label=""
                    value={styles.marginTop}
                    onChange={(value) => {
                      handleStyleChange("marginTop", value);
                      handleStyleChange("marginRight", value);
                      handleStyleChange("marginBottom", value);
                      handleStyleChange("marginLeft", value);
                    }}
                    type="number"
                    placeholder="0"
                    max={200}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <StyleInput
                      label="Top"
                      value={styles.marginTop}
                      onChange={(value) => handleStyleChange("marginTop", value)}
                      type="number"
                      placeholder="0"
                      max={200}
                    />
                    <StyleInput
                      label="Right"
                      value={styles.marginRight}
                      onChange={(value) => handleStyleChange("marginRight", value)}
                      type="number"
                      placeholder="0"
                      max={200}
                    />
                    <StyleInput
                      label="Bottom"
                      value={styles.marginBottom}
                      onChange={(value) => handleStyleChange("marginBottom", value)}
                      type="number"
                      placeholder="0"
                      max={200}
                    />
                    <StyleInput
                      label="Left"
                      value={styles.marginLeft}
                      onChange={(value) => handleStyleChange("marginLeft", value)}
                      type="number"
                      placeholder="0"
                      max={200}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Borders Section */}
        <div>
          <SectionHeader title="Borders" section="borders" />
          {expandedSections.borders && (
            <>
              <StyleInput
                label="Border Width (px)"
                value={styles.borderWidth}
                onChange={(value) => handleStyleChange("borderWidth", value)}
                type="number"
                placeholder="0"
                max={50}
              />
              <StyleInput
                label="Border Radius (px)"
                value={styles.borderRadius}
                onChange={(value) => handleStyleChange("borderRadius", value)}
                type="number"
                placeholder="0"
                max={200}
              />
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
