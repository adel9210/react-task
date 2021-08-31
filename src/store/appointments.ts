/* eslint-disable */
import { Timeslot } from '@prisma/client';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import config from 'config';
import { parseIds } from 'store/utils';

export type Appointments = {
  id: number;
  practitionerId: number;
  startDate: Date;
  endDate: Date;
};

const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOING', '/api');

export const getAppointments = createAsyncThunk('getAppointments', async () => {
  const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`);
  const parsedResponse = await response.json();
  return parsedResponse;
});

export const postAppointments = createAsyncThunk(
  'postAppointments',
  async (body: any) => {
    const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`, {
      body: JSON.stringify(body),
      method: 'post',
    });
    const parsedResponse = await response.json();
    return parsedResponse;
  },
);

const appointmentsAdapter = createEntityAdapter<Appointments>({
  sortComparer: (a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
});

export const appointmentsSelectors = appointmentsAdapter.getSelectors();

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: appointmentsAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAppointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAppointments.fulfilled, (state, action) => {
      appointmentsAdapter.setAll(state, action.payload);
      state.error = null;
      state.loading = false;
    });
    builder.addCase(getAppointments.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(postAppointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(postAppointments.fulfilled, (state, action) => {
      appointmentsAdapter.setAll(state, { result: action.payload });
      state.error = null;
      state.loading = false;
    });
    builder.addCase(postAppointments.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default appointmentsSlice;
