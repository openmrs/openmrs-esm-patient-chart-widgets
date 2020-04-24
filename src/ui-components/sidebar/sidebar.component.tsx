import React from "react";
import styles from "./sidebar.component.css";
import AllergyForm from "../../widgets/allergies/allergy-form.component";
import Parcel from "single-spa-react/parcel";
import VitalsForm from "../../widgets/vitals/vitals-form.component";
import { openWorkspaceTab } from "../../widgets/shared-utils";

export default function Sidebar(props: any) {
  const formentryParcel = () => (
    <Parcel config={System.import("@ampath/esm-angular-form-entry")} />
  );
  const sidebarItems = [
    {
      name: "A",
      onclick: () => openWorkspaceTab(AllergyForm, "Allergy Form")
    },
    {
      name: "V",
      onclick: () => openWorkspaceTab(VitalsForm, "Vitals")
    },
    {
      name: "F",
      onclick: () => openWorkspaceTab(formentryParcel, "Forms")
    }
  ];
  return (
    <div className={styles.sidebar}>
      <ul className={styles.nav}>
        {sidebarItems.map((item, i) => (
          <li key={i} className={styles.navItem}>
            <button
              className="omrs-unstyled"
              onClick={item.onclick}
              style={{ padding: "1rem", width: "100%" }}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
