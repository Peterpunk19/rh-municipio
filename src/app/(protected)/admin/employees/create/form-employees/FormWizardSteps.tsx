'use client'

import React, { useState } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material'

import ParentCard from '@/app/components/shared/ParentCard'
import { Stack } from '@mui/system'
import {useDispatch, useSelector} from "react-redux";
import {resetFormValues, updateErrors} from "@/store/employees/EmployeeSlice";
import {FormPersonalData} from "@/app/(protected)/admin/employees/create/form-employees/steps/FormPersonalData";
import {createEmployee} from "@/services/employees";
import {FormHiringData} from "@/app/(protected)/admin/employees/create/form-employees/steps/FormHiringData";

const steps = ['Datos Personales', 'Datos de Contratación', 'Finalizar']

const FormWizardSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formValues = useSelector((state: any) => state.employeesReducer.values);
  const isStepOptional = (step: any) => step === 1

  const isStepSkipped = (step: any) => skipped.has(step)

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleSubmit();
      return;

    }

    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)

      return newSkipped
    })
  }

  // eslint-disable-next-line consistent-return
  const handleSteps = (step: any) => {
    switch (step) {
      case 0:
        return (
          <FormPersonalData/>
        );
      case 1:
        return (
          <FormHiringData/>
        );
      default:
        break
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createEmployee(formValues);
      if (!response.success) {
        if (response && response.responseObject) {
          for (const key in response.responseObject) {
            dispatch(updateErrors({ [key]: response.responseObject[key].messages[0] }));
          }
          setError(response.message);
        } else {
          throw new Error("Failed to submit form. Please try again.");
        }
        return;
      }
      setSuccess(response.message);
      setActiveStep(activeStep + 1);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0)
    dispatch(resetFormValues());
  }

  return (
    <ParentCard title='LLena los siguientes datos:'>
      <Box width='100%'>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {}
            const labelProps: {
              optional?: React.ReactNode
            } = {}

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Stack spacing={2} mt={3}>
              {success && <Alert severity="success">{success}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}

              <Box textAlign='right'>
                <Button onClick={handleReset} variant='contained' color='error'>
                  Reset
                </Button>
              </Box>
            </Stack>
          </>
        ) : (
          <>
            <Box>{handleSteps(activeStep)}</Box>

            <Box display='flex' flexDirection='row' mt={3}>
              <Button
                color='inherit'
                variant='contained'
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}>
                Regresar
              </Button>
              <Box flex='1 1 auto' />
              {isStepOptional(activeStep) && (
                <Button color='inherit' onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}

              <Button
                onClick={handleNext}
                variant="contained"
                color={
                  activeStep === steps.length - 1 ? "success" : "secondary"
                }
                disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24}/> : activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </>
        )}
      </Box>
    </ParentCard>
  )
}

export default FormWizardSteps
