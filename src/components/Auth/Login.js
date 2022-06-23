import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import { Button, TextField } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import generateString from "../../global/SecretCode";
import { Alert } from "antd";
import DoubleAuth from "./DoubleAuth";
import { directoryAPI } from "../../services/directory.service";

export default function LoginRender() {
  //UI
  const theme = createTheme();
  //USER HOOKS
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  // REQUEST
  const loginRequest = {
    username: userName,
    password: password,
  };
  const [requestStatus, setRequestStatus] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userIp, setUserIp] = useState();
  const secretCode = generateString(6);
  // REQUEST RESULT
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState();

  const submit = async (e) => {
    e.preventDefault();
    const request = await directoryAPI(loginRequest);

    if (request.status === 200 || request.status === 210) {
      setRedirect(true); // OK to continue
      setRequestStatus(request.status);
      setUserEmail(request.data.mail);
      setUserName(request.data.user);
      setUserIp(request.data.ip);
    }
    if (request.response.status === 429) {
      setError("Trop de tentatives, veuillez patienter");
    }
    if (request.response.status === 401) {
      setError("Identifiants invalides");
    }
    console.log(request.response.status);
  };

  //If OK to continue
  if (redirect) {
    return (
      <DoubleAuth
        status={requestStatus}
        email={userEmail}
        userName={userName}
        userIp={userIp}
        secretCode={secretCode}
      />
    );
  }
  return (
    <div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <ThemeProvider theme={theme}>
          <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />

            <Grid item xs={12} sm={12} md={12} elevation={6} square>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  component="form"
                  noValidate
                  onSubmit={submit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && (
                    <Alert
                      message={error}
                      type="error"
                      showIcon
                      style={{ width: "100%" }}
                    />
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={(e) => submit(e)}
                  >
                    Connexion
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </div>
  );
}
