/* eslint-disable */

import appointments from 'api/appointments';
import practitioners from 'api/practitioners';
import { useState } from 'react';
import { useEffect } from 'react';
import { Practitioner } from 'store/practitioners';
import EditorLink from './EditorLink';

interface Appointment {
  endDate: string;
  startDate: string;
  id: number;
  patientId: number;
  practitionerId: number;
}

interface FullAppointment extends Appointment {
  practitioner: Practitioner;
}

const AppointmentList = (props: {
  appointments: Appointment[];
  practitioners: Practitioner[];
}) => {
  const [newList, setNewList] = useState<FullAppointment[]>([]);

  useEffect(() => {
    if (props.appointments.length && props.practitioners.length) {
      // map appointment with practitionerId
      const combine = props.appointments.map((appointment) => {
        return {
          ...appointment,
          practitioner: props.practitioners.filter(
            (practitioner) => practitioner.id === appointment.practitionerId,
          )[0],
        };
      });

      setNewList(combine);
    }
  }, [props.appointments, props.practitioners]);

  return (
    <div className="appointments">
      {newList.map((appointment, i) => (
        <div
          key={appointment.practitioner?.lastName}
          className="appointments__item"
        >
          <h3 className="appointments__item__avatar">
            {appointment.practitioner?.firstName}
          </h3>
          <div className="appointments__item__info">
            <h2 className="appointments__item__info__name">
             #{i} Doctor {appointment.practitioner?.firstName} {appointment.practitioner?.lastName}
            </h2>
            <h3 className="appointments__item__major">
              {appointment.practitioner?.speciality}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
