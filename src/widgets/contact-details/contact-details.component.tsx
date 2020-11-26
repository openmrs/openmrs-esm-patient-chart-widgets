import React from "react";

import { InlineLoading } from "carbon-components-react";
import { createErrorHandler } from "@openmrs/esm-error-handling";

import {
  fetchPatientRelationships,
  Relationship
} from "./relationships.resource";
import styles from "./contact-details.scss";

const Address = ({ address }) => {
  const { city, country, state, region, postalCode } = address;
  return (
    <div>
      <p className={styles.heading}>Address</p>
      <ul>
        <li>{postalCode}</li>
        <li>{city}</li>
        <li>{region}</li>
        <li>{state}</li>
        <li>{country}</li>
      </ul>
    </div>
  );
};

const Contact = ({ telecom }) => {
  const value = telecom ? telecom[0].value : "-";

  return (
    <div>
      <p className={styles.heading}>Contact Details</p>
      <ul>
        <li>{value}</li>
      </ul>
    </div>
  );
};

const Relationships = ({ patientId }) => {
  const [relationships, setRelationships] = React.useState<Relationship[]>(
    null
  );

  React.useEffect(() => {
    fetchPatientRelationships(patientId)
      .then(({ data: { results } }) => {
        setRelationships(results);
      })
      .catch(createErrorHandler());
  }, [patientId]);

  const RenderRelationships = () => {
    if (relationships.length) {
      return (
        <div>
          <p className={styles.heading}>Relationships</p>
          <ul>
            {relationships.map(r => (
              <li key={r.uuid}>{r.display}</li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <div>
        <p className={styles.heading}>Relationships</p>
        <p>-</p>
      </div>
    );
  };

  return (
    <div className={styles.relationshipsRow}>
      {relationships ? (
        <RenderRelationships />
      ) : (
        <InlineLoading description="Loading..." />
      )}
    </div>
  );
};

const ContactDetails = ({ address, telecom, patientId }) => {
  const currentAddress = address.find(a => a.use === "home");

  return (
    <div className={styles.contactDetails}>
      <div className={styles.address}>
        <div className={styles.row}>
          <Address address={currentAddress} />
          <Contact telecom={telecom} />
        </div>
        <div className={styles.row}>
          <Relationships patientId={patientId} />
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;

type ContactDetails = {
  patient: fhir.Patient;
};
