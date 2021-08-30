/* eslint-disable */

import { Button, FormControl, Grid, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import { Patient } from '@prisma/client';
import { useEffect, useState } from 'react';
import { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  availabilitiesSelectors,
  getAvailabilities,
} from 'store/availabilities';
import { Practitioner } from 'store/practitioners';

interface AppointmentForm {
  patient: string;
  practitioner: string;
  availability: string;
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
    const { patient, practitioner, availability } = appointmentForm;
    const isValid = (patient && practitioner && availability) !== undefined;
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

    if (event.target.name === 'practitioner') {
      checkAvailabilities(event.target.value);
    }
  };

  const handleSubmit = () => {};

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
              name="patient"
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
              id="practitioner"
              name="practitioner"
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
            <InputLabel id="demo-simple-select-label">
              Select Time
            </InputLabel>
            <Select
              labelId="availabilities"
              id="availabilities"
              name="availability"
              onChange={handleChange}
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
