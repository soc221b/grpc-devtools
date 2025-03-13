import { useEffect } from "react";

export const useObjectVisualizerStyle = () => {
  useEffect(() => {
    let style = `
.object-visualizer {
  height: 100%;
}
.object-visualizer [role="treeitem"] > div > :first-child {
  padding-left: 2px;
}
.object-visualizer [role="treeitem"] > div > :nth-child(2) > :first-child {
  font-weight: bold;
}

.sticky-scroll .object-visualizer [role="treeitem"] {
  display: unset;
}
.sticky-scroll .object-visualizer.light [role="treeitem"] > div {
  background-color: #FFFFFF !important;
}
.sticky-scroll .object-visualizer.dark [role="treeitem"] > div {
  background-color: #282828 !important;
}
`;

    for (let i = 0; i < 20; ++i) {
      const nested = '[role="group"] > [role="treeitem"] > '.repeat(i);
      style += `
.sticky-scroll .object-visualizer [role="tree"] > [role="treeitem"] > ${nested}div {
  position: sticky;
  z-index: ${20 - i};
  top: ${i * 16.5}px;
}
  `;
    }

    const stylesheet = document.createElement("style");
    stylesheet.textContent = style;
    document.head.appendChild(stylesheet);
  }, []);
};
