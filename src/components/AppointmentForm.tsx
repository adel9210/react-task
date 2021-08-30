/* eslint-disable */

import { Patient } from '@prisma/client';
import { useDispatch, useSelector } from 'react-redux';
import {
  availabilitiesSelectors,
  getAvailabilities,
} from 'store/availabilities';
import { Practitioner } from 'store/practitioners';

const AppointmentForm = (props: {
  practitioners: Practitioner[];
  patients: Patient[];
}) => {
  const dispatch = useDispatch();

  const availabilities = useSelector((state) =>
    availabilitiesSelectors.selectAll(state.availabilities),
  );

  const checkAvailabilities = (practitionerId: number | string) => {
    dispatch(getAvailabilities(practitionerId));
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="patient">Patient</label>
        <select id="patient">
          {props.patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.firstName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="practitioner">Practitioner</label>
        <select
          id="practitioner"
          onChange={(event) => checkAvailabilities(event.target.value)}
        >
          {props.practitioners.map((practitioner) => (
            <option key={practitioner.id} value={practitioner.id}>
              {practitioner.firstName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="patient">Availabilities</label>
        <select id="patient">
          {availabilities.map((availability) => (
            <option key={availability.id} value={availability.id}>
              {availability.startDate}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default AppointmentForm;
