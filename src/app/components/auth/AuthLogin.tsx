"use client";
import { useState, useTransition } from "react";
import { Box, Typography, FormGroup, FormControlLabel, Button, Stack, Divider } from "@mui/material";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { LoginSchema } from "@/schemas/authentication";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { login } from "@/actions/login";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [isPending, startTransition] = useTransition();
  const [errror, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (credentials: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await login(credentials);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setSuccess("Login exitoso!");
    } catch (error) {
      console.error("Error durante el login:", error);
      setError(error instanceof Error ? error.message : "Error inesperado durante el login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6 items-center justify-center">
          {hasErrors && (
            <div className="col-span-3 bg-white border-l-4 border-red-500 p-4 my-2">
              <p className="font-bold text-red-500">Error en el formulario</p>
              <p>Por favor revisa los campos.</p>
            </div>
          )}

          {title ? (
            <Typography fontWeight="700" variant="h3" mb={1}>
              {title}
            </Typography>
          ) : null}

          {subtext}

          <Box mt={3}>
            <Divider>
              <Typography
                component="span"
                color="textSecondary"
                variant="h6"
                fontWeight="400"
                position="relative"
                px={2}
              >
                Ingresa tus credenciales
              </Typography>
            </Divider>
          </Box>

          <Stack>
            <Box>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel htmlFor="username">Usuario</CustomFormLabel>
                    <FormControl>
                      <CustomTextField
                        disabled={isPending}
                        {...field}
                        placeholder="********"
                        type="text"
                        id="username"
                        fullWidth
                      />
                    </FormControl>
                    <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </Box>
            <Box>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
                    <FormControl>
                      <CustomTextField
                        disabled={isPending}
                        {...field}
                        placeholder="********"
                        type="password"
                        id="password"
                        variant="outlined"
                        fullWidth
                      />
                    </FormControl>
                    <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormError message={errror} />
              <FormSuccess message={success} />
            </Box>
            <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
              <FormGroup>
                <FormControlLabel control={<CustomCheckbox defaultChecked />} label="Recordar contraseña" />
              </FormGroup>
            </Stack>
          </Stack>
          <Box>
            <Button disabled={isPending} color="primary" variant="contained" size="large" fullWidth type="submit">
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </Box>
          {subtitle}
        </form>
      </Form>
    </>
  );
};

export default AuthLogin;
