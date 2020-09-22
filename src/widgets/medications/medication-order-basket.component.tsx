import React, { useState, useEffect } from "react";
import { match } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isEmpty, debounce } from "lodash";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import { getDosage, OrderMedication } from "./medication-orders-utils";
import { DataCaptureComponentProps } from "../shared-utils";
import { toOmrsDateString } from "../../utils/omrs-dates";
import {
  getDrugByName,
  saveNewDrugOrder,
  getPatientDrugOrderDetails
} from "./medications.resource";
import MedicationOrder, { EditProperty } from "./medication-order.component";
import styles from "./medication-order-basket.css";

export default function MedicationOrderBasket({
  closeComponent,
  entryCancelled,
  entryStarted,
  entrySubmitted,
  match
}: MedicationOrderBasketProps) {
  let { params } = match;
  const searchTimeOut = 300;
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBasket, setOrderBasket] = useState([]);
  const [drugName, setDrugName] = useState<string>();
  const [showOrderMedication, setShowOrderMedication] = useState(false);
  const [enableButtons, setEnableButtons] = useState(false);
  const [editProperty, setEditProperty] = useState<EditProperty[]>([]);
  const [editOrderItem, setEditOrderItem] = useState<{
    orderEdit: boolean;
    order?: OrderMedication;
  }>({ orderEdit: false, order: null });
  const [hasChanged, setHasChanged] = useState(false);

  const handleDrugSelected = $event => {
    setDrugName(searchTerm);
    setShowOrderMedication(true);
    setSearchResults([]);
  };
  const handleChange = debounce(searchterm => {
    setSearchTerm(searchterm);
  }, searchTimeOut);

  useEffect(() => {
    const abortController = new AbortController();
    if (searchTerm && searchTerm.length >= 3) {
      getDrugByName(searchTerm, abortController).then(
        response => setSearchResults(response.data.results),
        createErrorHandler
      );
    } else {
      setSearchResults([]);
    }
    return () => abortController.abort();
  }, [searchTerm]);

  useEffect(() => {
    if (orderBasket.length > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [orderBasket]);

  useEffect(() => {
    if (params.drugName) {
      const { action, drugName, orderUuid } = params;
      setShowOrderMedication(true);
      setEditProperty([
        {
          action,
          drugName,
          orderUuid
        }
      ]);
      setDrugName(params.drugName);
    }
  }, [params]);

  useEffect(() => {
    if (
      params.action != undefined &&
      params.action === MedicationActions.DISCONTINUE_MEDICATION
    ) {
      const abortController = new AbortController();
      getPatientDrugOrderDetails(abortController, params.orderUuid).then(
        ({ data: drugOrderDetails }) => {
          let previousOrder: { previousOrder: string };
          if (drugOrderDetails.action === "REVISE") {
            previousOrder = null;
          } else {
            previousOrder = drugOrderDetails.previousOrder
              ? drugOrderDetails.previousOrder
              : drugOrderDetails.uuid;
          }
          setOrderBasket(orderBasket => {
            return [
              ...orderBasket,
              {
                orderUuid: drugOrderDetails.uuid,
                encounterUuid: drugOrderDetails.encounter.uuid,
                patientUuid: drugOrderDetails.patient.uuid,
                type: "drugorder",
                orderer: drugOrderDetails.orderer.uuid,
                careSetting: drugOrderDetails.careSetting.uuid,
                dose: drugOrderDetails.dose,
                drugStrength: drugOrderDetails.drug.strength,
                drugName: drugOrderDetails.drug.name,
                frequencyName: drugOrderDetails.frequency.display,
                dosageForm: drugOrderDetails.doseUnits.display,
                routeName: drugOrderDetails.route.display,
                action: MedicationActions.DISCONTINUE_MEDICATION,
                concept: drugOrderDetails.concept.uuid,
                doseUnitsConcept: drugOrderDetails.doseUnits.uuid,
                previousOrder,
                drugUuid: drugOrderDetails.drug.uuid,
                dateActivated: toOmrsDateString(drugOrderDetails.dateActivated)
              }
            ];
          });
        }
      );
      return () => abortController.abort();
    }
  }, [params]);

  const handleSaveOrders = () => {
    const abortController = new AbortController();
    orderBasket.forEach(order => {
      saveNewDrugOrder(abortController, order).then(response => {
        if (response.status === 201) {
          setOrderBasket([]);
          closeComponent();
        }
      }, createErrorHandler());
    });
    return () => abortController.abort();
  };

  const hideModal = () => {
    setShowOrderMedication(false);
    setEditProperty([]);
    setEditOrderItem({ orderEdit: false, order: null });
  };

  const resetParams = () => {
    params = {};
  };

  const handleRemoveOrderItem = (indexNum: any) => {
    setOrderBasket(
      orderBasket.filter((order: OrderMedication, index) => index !== indexNum)
    );
  };

  const handleOrderItemEdit = (orderItem: OrderMedication, indexNum: any) => {
    setEditOrderItem({ orderEdit: true, order: orderItem });
    setShowOrderMedication(true);
    setEditProperty([]);
    setOrderBasket(
      orderBasket.filter((order: OrderMedication, index) => index !== indexNum)
    );
  };

  const closeForm = () => {
    let userConfirmed = false;
    if (hasChanged) {
      userConfirmed = confirm(
        "There is ongoing work, are you sure you want to close this tab?"
      );
    }
    if (userConfirmed && hasChanged) {
      entryCancelled();
      closeComponent();
    } else if (!hasChanged) {
      entryCancelled();
      closeComponent();
    }
  };

  return (
    <div className={styles.medicationOrderBasketContainer}>
      <div
        className={`${styles.medicationHeader} ${
          !isEmpty(searchResults) ? styles.modal : ""
        }`}
      >
        <div
          className={`${styles.medicationHeader} ${
            !isEmpty(searchResults) ? styles.modalContent : ""
          }`}
        >
          <SummaryCard
            name={t("orderMedication", "Order Medication")}
            styles={{ width: "100%" }}
          >
            <div className={styles.medicationSearchTerm}>
              <input
                type="text"
                name="searchTerm"
                id="searchTerm"
                placeholder={t("medicationName", "medication name")}
                onChange={$event => {
                  handleChange($event.target.value);
                  setHasChanged(true);
                }}
              />
            </div>
          </SummaryCard>
          <div
            className={`${styles.searchResults} ${
              isEmpty(searchResults) ? styles.hide : ""
            }`}
          >
            <table>
              <thead>
                <tr>
                  <th>{t("numeroSign", "No.")}</th>
                  <th>{t("drugName", "Drug Name")}</th>
                  <th>{t("strength", "Strength")}</th>
                  <th>{t("dosageForm", "DosageForm")}</th>
                </tr>
              </thead>
              <tbody>
                {searchResults &&
                  searchResults.map((result, index) => {
                    return (
                      <tr
                        key={result}
                        role="button"
                        onClick={$event => handleDrugSelected(result.uuid)}
                      >
                        <td>{index + 1}</td>
                        <td>{result.name}</td>
                        <td>{result.strength}</td>
                        <td>{result.dosageForm.display}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style={{ width: "90%" }}>
        {orderBasket.length > 0 &&
          orderBasket.map((order, index) => {
            return (
              <div
                className={`${styles.basketStyles} ${styles.orderStyle}`}
                key={index}
              >
                <SummaryCardRow>
                  <SummaryCardRowContent justifyContent="space-between">
                    <span>
                      {order.action} <b>{order.drugName}</b>
                      {" \u2014 "}{" "}
                      {String(order.dosageForm).toLocaleLowerCase()}
                      {" \u2014 "} {String(order.routeName).toLocaleLowerCase()}
                      {" \u2014 "} {t("dose", "Dose")}{" "}
                      <b>{`${getDosage(order.drugStrength, order.dose)}`} </b>
                      <b>{String(order.frequencyName).toLocaleLowerCase()}</b>
                    </span>
                    <span>
                      <button
                        className="omrs-btn-icon-medium"
                        onClick={$event => handleRemoveOrderItem(index)}
                      >
                        <svg>
                          <use
                            fill={"var(--omrs-color-brand-black)"}
                            xlinkHref="#omrs-icon-close"
                          ></use>
                        </svg>
                      </button>
                      <button
                        className="omrs-btn-icon-medium"
                        onClick={$event => handleOrderItemEdit(order, index)}
                        disabled={
                          order.action ===
                          MedicationActions.DISCONTINUE_MEDICATION
                            ? true
                            : false
                        }
                      >
                        <svg>
                          <use
                            fill={"var(--omrs-color-brand-black)"}
                            xlinkHref="#omrs-icon-menu"
                          ></use>
                        </svg>
                      </button>
                    </span>
                  </SummaryCardRowContent>
                </SummaryCardRow>
              </div>
            );
          })}
      </div>

      {showOrderMedication && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <MedicationOrder
              drugName={drugName}
              setOrderBasket={setOrderBasket}
              orderBasket={orderBasket}
              hideModal={hideModal}
              editProperty={editProperty}
              resetParams={resetParams}
              orderEdit={editOrderItem}
            />
          </div>
        </div>
      )}

      <div className={styles.medicationOrderFooter}>
        <button
          className="omrs-btn omrs-outlined-neutral"
          style={{ width: "50%" }}
          onClick={closeForm}
        >
          {t("close", "Close")}
        </button>
        <button
          className={`${
            enableButtons
              ? "omrs-btn omrs-filled-action"
              : "omrs-btn omrs-outlined-neutral"
          }`}
          style={{ width: "50%" }}
          disabled={!enableButtons}
          onClick={handleSaveOrders}
        >
          {t("sign", "Sign")}
        </button>
      </div>
    </div>
  );
}

enum MedicationActions {
  NEW_MEDICATION = "NEW",
  DISCONTINUE_MEDICATION = "DISCONTINUE"
}

MedicationOrderBasket.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

export type MedicationOrderBasketProps = DataCaptureComponentProps & {
  match: match<TParams>;
};

type TParams = {
  action?: string;
  drugName?: string;
  orderUuid?: string;
};
