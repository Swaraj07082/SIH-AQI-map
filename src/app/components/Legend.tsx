import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L, { Control } from "leaflet";

const Legend = () => {
  const map = useMap();

  useEffect(() => {
    // Create the legend control
    const legendControl = new Control({ position: "bottomright" });

    // Define how the legend control will be added to the map
    legendControl.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 50, 100, 150, 200, 300];
      const colors = ["green", "yellow", "orange", "red", "purple", "maroon"];

      // Add custom CSS to the div
      div.style.backgroundColor = "white";
      div.style.padding = "10px";
      div.style.border = "2px solid #ccc";
      div.style.borderRadius = "5px";
      div.style.lineHeight = "18px";
      div.style.fontSize = "12px";

      // Create a title for the legend
      div.innerHTML = '<h4 style="margin: 0;">AQI Legend</h4>';

      // Add legend items with respective background colors
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          `<i style="background:${colors[i]}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i>` +
          `${grades[i]}${grades[i + 1] ? `&ndash;${grades[i + 1]}<br>` : '+'}`;
      }

      return div;
    };

    // Add the legend to the map
    legendControl.addTo(map);

    // Clean up the control when the component unmounts
    return () => {
      map.removeControl(legendControl);
    };
  }, [map]);

  return null;
};

export default Legend;
