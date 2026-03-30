import React, { useState, useCallback } from "react";
import { BuilderComponent, ComponentType } from "@/types/builder";

export const useLayout = (initialData: BuilderComponent[] = []) => {
  const [layout, setLayout] = useState<BuilderComponent[]>(initialData);

  const addComponent = useCallback(
    (type: ComponentType, parentId: string | null = null, index?: number, onAdded?: (id: string) => void) => {
      const newComponent: BuilderComponent = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        props: {},
        children: type === "section" || type === "row" || type === "column" ? [] : undefined,
        width: type === "column" ? 6 : undefined,
        height: ["section", "image", "card", "hero", "feature-grid", "pricing", "testimonials", "faq", "video"].includes(type) ? 200 : undefined,
        ...(type === "image" && { imageUrl: "" }),
        ...(type === "video" && { videoUrl: "" }),
        ...(type === "hero" && {
          heroHeadingText: "Build your vision faster than ever.",
          heroDescriptionText: "The world's most advanced landing page builder. Drag, drop, and launch in minutes, not days.",
          heroBadgeText: "✨ New Release",
          heroPrimaryButtonText: "Start Free Trial",
          heroSecondaryButtonText: "Watch Demo",
        }),
      };

      // Call the onAdded callback with the new component ID
      if (onAdded) {
        onAdded(newComponent.id);
      }

      const addToChildren = (
        components: BuilderComponent[],
        id: string,
      ): BuilderComponent[] => {
        return components.map((comp) => {
          if (comp.id === id) {
            const children = comp.children || [];
            const newChildren = [...children];
            if (typeof index === "number") {
              newChildren.splice(index, 0, newComponent);
            } else {
              newChildren.push(newComponent);
            }
            return { ...comp, children: newChildren };
          }
          if (comp.children) {
            return { ...comp, children: addToChildren(comp.children, id) };
          }
          return comp;
        });
      };

      if (!parentId) {
        setLayout((prev) => {
          const next = [...prev];
          if (typeof index === "number") {
            next.splice(index, 0, newComponent);
          } else {
            next.push(newComponent);
          }
          return next;
        });
      } else {
        setLayout((prev) => addToChildren(prev, parentId));
      }
    },
    [],
  );

  const moveComponent = useCallback(
    (id: string, targetParentId: string | null, targetIndex: number) => {
      // Logic to move component in the tree
      // This is more complex than adding.
      // 1. Find and remove the component
      // 2. Add it to the target location
      setLayout((prev) => {
        let movedComp: BuilderComponent | null = null;

        const removeComp = (components: BuilderComponent[]): BuilderComponent[] => {
          return components
            .filter((comp) => {
              if (comp.id === id) {
                movedComp = comp;
                return false;
              }
              return true;
            })
            .map((comp) => {
              if (comp.children) {
                return { ...comp, children: removeComp(comp.children) };
              }
              return comp;
            });
        };

        const cleanedLayout = removeComp(prev);

        if (!movedComp) return prev;

        const insertComp = (
          components: BuilderComponent[],
          parentId: string | null,
        ): BuilderComponent[] => {
          if (parentId === null) {
            const next = [...components];
            next.splice(targetIndex, 0, movedComp!);
            return next;
          }

          return components.map((comp) => {
            if (comp.id === parentId) {
              const children = comp.children || [];
              const nextChildren = [...children];
              nextChildren.splice(targetIndex, 0, movedComp!);
              return { ...comp, children: nextChildren };
            }
            if (comp.children) {
              return { ...comp, children: insertComp(comp.children, parentId) };
            }
            return comp;
          });
        };

        return insertComp(cleanedLayout, targetParentId);
      });
    },
    [],
  );

  const updateComponent = useCallback((id: string, updates: Partial<BuilderComponent>) => {
    const updateInTree = (components: BuilderComponent[]): BuilderComponent[] => {
      return components.map((comp) => {
        if (comp.id === id) {
          return { ...comp, ...updates };
        }
        if (comp.children) {
          return { ...comp, children: updateInTree(comp.children) };
        }
        return comp;
      });
    };
    setLayout((prev) => updateInTree(prev));
  }, []);

  const removeComponent = useCallback((id: string) => {
    const removeFromTree = (components: BuilderComponent[]): BuilderComponent[] => {
      return components
        .filter((comp) => {
          if (comp.id === id) {
            console.log("[useLayout] Removing component:", id);
            return false;
          }
          return true;
        })
        .map((comp) => {
          if (comp.children) {
            return { ...comp, children: removeFromTree(comp.children) };
          }
          return comp;
        });
    };
    setLayout((prev) => {
      const updated = removeFromTree(prev);
      console.log("[useLayout] After remove, layout length:", updated.length);
      return updated;
    });
  }, []);

  const duplicateComponent = useCallback((id: string) => {
    const deepCloneComponent = (comp: BuilderComponent): BuilderComponent => {
      return {
        ...comp,
        id: Math.random().toString(36).substr(2, 9),
        children: comp.children ? comp.children.map(deepCloneComponent) : comp.children,
      };
    };

    const findAndDuplicate = (
      components: BuilderComponent[],
    ): { components: BuilderComponent[]; duplicated: boolean } => {
      const result: BuilderComponent[] = [];
      let duplicated = false;

      for (const comp of components) {
        // First add the current component
        if (comp.id === id) {
          // This is the component to duplicate - add it and a copy
          result.push(comp);
          result.push(deepCloneComponent(comp));
          duplicated = true;
          console.log("[useLayout] Duplicated component:", id);
        } else {
          // Process children if they exist
          if (comp.children && comp.children.length > 0) {
            const { components: processedChildren, duplicated: childDuplicated } =
              findAndDuplicate(comp.children);

            if (childDuplicated) {
              // Child was duplicated, create new component reference
              result.push({
                ...comp,
                children: processedChildren,
              });
              duplicated = true;
            } else {
              // No duplication in children, use original
              result.push(comp);
            }
          } else {
            // No children, just add component
            result.push(comp);
          }
        }
      }

      return { components: result, duplicated };
    };

    setLayout((prev) => {
      const { components: updated, duplicated } = findAndDuplicate(prev);
      if (!duplicated) {
        console.warn("[useLayout] Component not found for duplication:", id);
      }
      return updated;
    });
  }, []);

  return { layout, addComponent, moveComponent, updateComponent, removeComponent, duplicateComponent };
};
