import React from 'react';
import { Box, FormControl, Grid2 } from '@mui/material';
import CustomFormLabel from '../../app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../app/components/forms/theme-elements/CustomTextField';
import CustomLabelError from '@/components/theme-elements/CustomLabelError';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  startDateError?: string;
  endDateError?: string;
  startDateLabel?: string;
  endDateLabel?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateError,
  endDateError,
  startDateLabel = 'Fecha de inicio',
  endDateLabel = 'Fecha de fin',
}) => {
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = event.target.value;
    onStartDateChange(newStartDate);
    
    if (endDate && newStartDate > endDate) {
      onEndDateChange('');
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    if (!startDate || newEndDate >= startDate) {
      onEndDateChange(newEndDate);
    }
  };

  const getMinEndDate = () => {
    return startDate || '';
  };

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <CustomFormLabel sx={{ mt: 0 }}>{startDateLabel}</CustomFormLabel>
            <CustomTextField
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <CustomLabelError field={startDateError} />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <CustomFormLabel sx={{ mt: 0 }}>{endDateLabel}</CustomFormLabel>
            <CustomTextField
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={getMinEndDate()}
              disabled={!startDate}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <CustomLabelError field={endDateError} />
          </FormControl>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default DateRangePicker;
