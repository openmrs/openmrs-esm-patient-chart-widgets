import React from "react";
import MedicationOrderBasket, {
  MedicationOrderBasketProps
} from "./medication-order-basket.component";
import { openWorkspaceTab } from "../shared-utils";
import { useTranslation } from "react-i18next";

interface MedicationButtonProps {
  action: string;
  btnClass?: string;
  component: React.FC<MedicationOrderBasketProps>;
  drugName: string;
  inProgress: boolean;
  label: string;
  name: string;
  orderUuid: string;
}

export function MedicationButton({
  btnClass,
  orderUuid,
  drugName,
  action,
  label
}: MedicationButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      className={btnClass ? btnClass : "omrs-btn omrs-text-neutral"}
      onClick={() => {
        const params = {
          orderUuid: orderUuid,
          drugName: drugName,
          action: action
        };
        openWorkspaceTab(
          MedicationOrderBasket,
          `${t("medicationOrderBasket", "Medication Order Basket")}`,
          params
        );
      }}
    >
      {label}
    </button>
  );
}
