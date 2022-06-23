import React from "react";
import { Result, Button } from "antd";
import { BrowserRouter as Redirect } from "react-router-dom";

export default function DashboardRender(props) {
  if (props.guardAccess === 200) {
    return (
      <div>
        <Result
          icon={
            <img
              width={100}
              src="https://directory.s3.eu-west-3.amazonaws.com/001-stethoscope.png"
            ></img>
          }
          subTitle="Clinique LE CHATELET"
          extra={[<div>Bienvenue {props.username}</div>]}
        />
      </div>
    );
  }
  return (
    <div>
      <Result
        status="403"
        title="403"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          height: "100%",
          marginTop: "20px",
          flexDirection: "column",
        }}
        subTitle="Désolé, vous n'êtes pas autorisé a consulter cette page"
        extra={
          <Button primary onClick={(e) => <Redirect to="/login" />}>
            Retour
          </Button>
        }
      />
    </div>
  );
}
