import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';


const theme = createTheme();

export default function Register() {
  const navigate = useNavigate();

  const { register, setError, handleSubmit, formState: { isSubmitting, errors, isValid } } = useForm({
    mode: 'all', // when to do the validating
  })


  function handleApiErrors(errors: any) {
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes('Password')) {
          setError('password', { message: error });
          return
        }
        if (error.includes("Email")) {
          setError("email", { message: error });
          return
        }
        if (error.includes("Username")) {
          setError("username", { message: error });
          return
        }

      })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component={Paper} maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form"
          onSubmit={handleSubmit((data) => agent.Account.register(data)
            .then(() => {
              toast.success("Registration successful - you can now login");
              navigate("/login");

            })
            .catch(err => handleApiErrors(err)))}
          noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            autoComplete="username"
            autoFocus
            {...register('username', { required: 'Username is required' })}
            error={!!errors.username} // !! casts into a boolean - if exists will be true
            helperText={errors?.username?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            autoComplete="email"
            {...register('email',
              {
                required: 'Email is required',
                pattern: {
                  value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                  message: "Not a valid email address"
                }
              })}
            error={!!errors.email} // !! casts into a boolean - if exists will be true
            helperText={errors?.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password",
              {
                required: 'Password is required',
                pattern: {
                  value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                  message: "Password not strong enough"
                }
              }
            )}
            error={!!errors.password} // !! casts into a boolean - if exists will be true
            helperText={errors?.password?.message}
          />
          <LoadingButton
            disabled={!isValid}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
          <Grid container>
            <Grid item>
              <Link to="/login">
                {"Already have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}