import React from "react";
import useVisitTypes from "./use-visit-types";
import { VisitType } from "./visit-type.resource";

export default function VisitTypeSelect(props: VisitTypeSelectProps) {
  const [visitTypes] = useVisitTypes();
  const onVisitTypesChanged = event => {
    props.onVisitTypeChanged(
      visitTypes.find(loc => loc.uuid == event.target.value)
    );
  };

  return (
    <>
      <select
        name="visitType"
        id={props.id || "visitType"}
        className="omrs-type-body-regular"
        style={{ height: "40px" }}
        onChange={onVisitTypesChanged}
        value={props.visitTypeUuid}
      >
        <option value="" className="omrs-padding-8" />
        {visitTypes.map(visitType => {
          return (
            <option
              key={visitType.uuid}
              value={visitType.uuid}
              className="omrs-padding-8"
            >
              {visitType.display}
            </option>
          );
        })}
      </select>
    </>
  );
}

export type VisitTypeSelectProps = {
  onVisitTypeChanged: (selected: VisitType) => any;
  defaultSelectedUuid?: string;
  id?: string;
  visitTypeUuid: string;
};
