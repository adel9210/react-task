/* eslint-disable */

import { Button, FormControl, Grid, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import { Patient } from '@prisma/client';
import { useEffect, useState } from 'react';
import { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postAppointments } from 'store/appointments';
import {
  availabilitiesSelectors,
  getAvailabilities,
} from 'store/availabilities';
import { Practitioner } from 'store/practitioners';

interface AppointmentForm {
  patientId: string;
  practitionerId: string;
  availability: string;
  startDate: Date;
  endDate: Date;
  isValid: boolean;
}

const AppointmentForm = (props: {
  practitioners: Practitioner[];
  patients: Patient[];
}) => {
  const dispatch = useDispatch();
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const availabilities = useSelector((state) =>
    availabilitiesSelectors.selectAll(state.availabilities),
  );

  useEffect(() => {
    validateForm();
  }, [appointmentForm]);

  const checkAvailabilities = (practitionerId) => {
    dispatch(getAvailabilities(practitionerId));
  };

  const validateForm = () => {
    const { patientId, practitionerId, startDate } = appointmentForm;
    const isValid = (patientId && practitionerId && startDate) !== undefined;
    setIsFormValid(isValid);
  };

  const handleChange = (
    event: ChangeEvent<{
      name?: string;
      value: unknown;
    }>,
  ) => {
    setAppointmentForm({
      ...appointmentForm,
      [event.target.name]: event.target.value,
    });

    if (event.target.name === 'practitionerId') {
      checkAvailabilities(event.target.value);
    }
  };

  const handleAvailabilityChange = (
    event: ChangeEvent<{
      name?: string;
      value: unknown;
    }>,
  ) => {
    const selectedDate = availabilities.filter(
      (date) => date.id == event.target.value,
    )[0];
    setAppointmentForm({
      ...appointmentForm,
      startDate: selectedDate.startDate,
      endDate: selectedDate.endDate,
    });
  };

  const handleSubmit = () => {
    const body = {
      patientId: appointmentForm.patientId,
      practitionerId: appointmentForm.practitionerId,
      startDate: appointmentForm.startDate,
      endDate: appointmentForm.endDate,
    };
    dispatch(postAppointments(body));
  };

  return (
    <>
      {/* <div className="form-group">
        <label htmlFor="patient">Patient</label>
        <select id="patient">
          {props.patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.firstName}
            </option>
          ))}
        </select>
      </div> */}
      <Grid container spacing={3}>
        <Grid item lg={3} xs={12}>
          <FormControl>
            <InputLabel id="patients">Select Patient</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="patientId"
              onChange={handleChange}
            >
              {props.patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.firstName + ' ' + patient.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={3} xs={12}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">
              Select Practitioner
            </InputLabel>
            <Select
              labelId="practitioner"
              id="practitionerId"
              name="practitionerId"
              onChange={handleChange}
            >
              {props.practitioners.map((practitioner) => (
                <MenuItem key={practitioner.id} value={practitioner.id}>
                  {practitioner.firstName + ' ' + practitioner.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={3} xs={12}>
          <FormControl disabled={!availabilities.length}>
            <InputLabel id="demo-simple-select-label">Select Time</InputLabel>
            <Select
              labelId="availabilities"
              id="availabilities"
              name="availability"
              onChange={handleAvailabilityChange}
            >
              {availabilities.map((availability) => (
                <MenuItem key={availability.id} value={availability.id}>
                  {availability.startDate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={3} xs={12}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      {/* <div className="form-group">
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
      </div> */}
    </>
  );
};

export default AppointmentForm;
