import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import "antd/dist/antd.css";
import emailjs from "@emailjs/browser";
import Dashboard from "../Dashboard/Dashboard";
import getIpClient from "../../services/ipClient.service";
import { StopOutlined } from "@ant-design/icons";
export default function DoubleAuth_pop(props) {
  // Set Redirect to the Dasboard FULL ACCESS
  const [redirect, setRedirect] = useState(false);

  const [ipClient, setIpClient] = useState(null);
  // Input code for confirmation
  const [responseCode, setResponseCode] = useState();
  // Response Status of the email request
  const [responseStatus, setResponseStatus] = useState();
  // FORM HOOKS
  const [emailButtonOff, setEmailButtonOff] = useState(false);

  const email = props.email;
  const username = props.userName;
  const secretCode = props.secretCode;
  const IPDb = props.userIp;
  const statusCode = props.status;
  console.log(props);
  useEffect(async () => {
    const ipClientFetched = await getIpClient();
    setIpClient(ipClientFetched);
  }, []);

  // Request model for Double Auth confirmation
  const toSend = {
    from_name: "MSPR infra sécu",
    email: email,
    ip: ipClient !== null && ipClient.IPv4,
    origin: ipClient !== null && ipClient.city,
    username: username,
    message: secretCode,
  };
  const toSendDiffIp = {
    from_name: "MSPR infra sécu",
    email: email,
    ip: ipClient !== null && ipClient.IPv4,
    origin: ipClient !== null && ipClient.city,
    username: username,
    warning:
      "Attention ce n'est PAS votre adresse IP habituelle. Enregistrée : " +
      JSON.stringify(IPDb),
    message: secretCode,
  };
  const toSendDiffBrowser = {
    from_name: "MSPR infra sécu",
    email: email,
    ip: ipClient !== null && ipClient.IPv4,
    origin: ipClient !== null && ipClient.city,
    username: username,
    warning: "Attention ce n'est PAS votre navigateur Habituel",
    message: secretCode,
  };

  // Request model for Blocked IP connection
  const toSendBlocked = {
    from_name: "MSPR infra sécu",
    email: email,
    ip: ipClient !== null && ipClient.IPv4,
    origin: ipClient !== null && ipClient.city,
    username: username,
  };

  const sendEmail = (e, data) => {
    console.log(data);
    emailjs
      .send(
        "service_895d0tq",
        "template_7c12qyi",
        data,
        "user_zTPvleK5Y9AQxl6VHpubh"
      )
      .then(
        (result) => {
          setResponseStatus(result.text);
        },
        (error) => {
          setResponseStatus(error.text);
        }
      );
  };
  const sendEmailError = (e, data) => {
    emailjs
      .send(
        "service_895d0tq",
        "template_30r1uin",
        data,
        "user_zTPvleK5Y9AQxl6VHpubh"
      )
      .then(
        (result) => {
          setResponseStatus(result.text);
        },
        (error) => {
          setResponseStatus(error.text);
        }
      );
  };

  if (redirect) {
    return <Dashboard guardAccess={200} username={username} />;
  }

  // Compare input to Random secret sent
  const okToSubmit = (sentCode, inputCode) => {
    if (sentCode === inputCode) return false;
    return true;
  };
  // Show the correct modal
  const guardAccess = () => {
    if (ipClient !== null && ipClient.country_code !== "FR") {
      return false;
    }
    if (ipClient !== null && ipClient.country_code === "FR") {
      return true;
    }
  };

  if (ipClient !== null && ipClient.country_code !== "FR") {
    // Send
    sendEmailError("e", toSendBlocked);
    return (
      <Modal
        title="Connexion bloquée"
        centered
        visible={true}
        footer={false}
        closable={false}
        confirmLoading={true}
        maskStyle={{
          background: "linear-gradient(to top, #e6e9f0, #eef1f5)",
        }}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StopOutlined style={{ fontSize: "6rem" }} />
        <div style={{ marginTop: "10%" }}>
          Connexion bloquée depuis cette origine
        </div>
      </Modal>
    );
  }
  if (statusCode === 210) {
    return (
      <div>
        <Modal
          title="Double authentification requise BROWSER"
          centered
          visible={true}
          footer={false}
          closable={false}
          confirmLoading={true}
          maskStyle={{
            background: "linear-gradient(to top, #e6e9f0, #eef1f5)",
          }}
          bodyStyle={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}

          // onCancel={handleCancel}
        >
          <img
            alt=""
            src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-lock-22.png&r=74&g=164&b=255"
            height={70}
            width={70}
          />
          <h4
            style={{
              textAlign: "center",
              marginBottom: "2%",
              marginTop: "5%",
            }}
          >
            Afin de protéger votre compte,vous devez saisir le code reçu par
            email
          </h4>
          <Button
            type="primary"
            disabled={emailButtonOff}
            onClick={function (e) {
              sendEmail(e, toSendDiffBrowser);
              setEmailButtonOff(e);
            }}
          >
            Envoyer un e-mail
          </Button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "10%",
            }}
          >
            <Input
              onChange={(e) => setResponseCode(e.target.value)}
              style={{
                width: "100%",
                height: "100px",
                fontSize: "1.5rem",
                borderRadius: "10px",
              }}
              placeholder="Saisir ici le code reçu"
            />
          </div>{" "}
          <Button
            type="primary"
            disabled={okToSubmit(
              toSend.message.substring(toSend.message.length - 6),
              responseCode
            )}
            style={{ width: "80%" }}
            onClick={() => setRedirect(true)}
          >
            Envoyer
          </Button>
        </Modal>
      </div>
    );
  }

  if (ipClient !== null && IPDb !== ipClient.IPv4) {
    return (
      <div>
        <Modal
          title="Double authentification requise"
          centered
          visible={true}
          footer={false}
          closable={false}
          confirmLoading={true}
          maskStyle={{
            background: "linear-gradient(to top, #e6e9f0, #eef1f5)",
          }}
          bodyStyle={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}

          // onCancel={handleCancel}
        >
          <img
            alt=""
            src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-lock-22.png&r=74&g=164&b=255"
            height={70}
            width={70}
          />
          <h4
            style={{
              textAlign: "center",
              marginBottom: "2%",
              marginTop: "5%",
            }}
          >
            Afin de protéger votre compte,vous devez saisir le code reçu par
            email
          </h4>
          <Button
            type="primary"
            disabled={emailButtonOff}
            onClick={function (e) {
              sendEmail(e, toSendDiffIp);
              setEmailButtonOff(e);
            }}
          >
            Envoyer un e-mail
          </Button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "10%",
            }}
          >
            <Input
              onChange={(e) => setResponseCode(e.target.value)}
              style={{
                width: "100%",
                height: "100px",
                fontSize: "1.5rem",
                borderRadius: "10px",
              }}
              placeholder="Saisir ici le code reçu"
            />
          </div>{" "}
          <Button
            type="primary"
            disabled={okToSubmit(
              toSend.message.substring(toSend.message.length - 6),
              responseCode
            )}
            style={{ width: "80%" }}
            onClick={() => setRedirect(true)}
          >
            Envoyer
          </Button>
        </Modal>
      </div>
    );
  }
  if (ipClient !== null && ipClient.country_code !== "FR") {
    sendEmailError("e", toSendBlocked);
    return (
      <Modal
        title="Connexion bloquée"
        centered
        visible={true}
        footer={false}
        closable={false}
        confirmLoading={true}
        maskStyle={{
          background: "linear-gradient(to top, #e6e9f0, #eef1f5)",
        }}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StopOutlined style={{ fontSize: "6rem" }} />
        <div style={{ marginTop: "10%" }}>
          Connexion bloquée depuis cette origine
        </div>
      </Modal>
    );
  }
  return (
    <div>
      <Modal
        title="Double authentification requise"
        centered
        visible={guardAccess()}
        footer={false}
        closable={false}
        confirmLoading={true}
        maskStyle={{
          background: "linear-gradient(to top, #e6e9f0, #eef1f5)",
        }}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}

        // onCancel={handleCancel}
      >
        <img
          alt=""
          src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-lock-22.png&r=74&g=164&b=255"
          height={70}
          width={70}
        />
        <h4
          style={{ textAlign: "center", marginBottom: "2%", marginTop: "5%" }}
        >
          Afin de protéger votre compte,vous devez saisir le code reçu par email
        </h4>
        <Button
          type="primary"
          disabled={emailButtonOff}
          onClick={function (e) {
            sendEmail(e, toSend);
            setEmailButtonOff(e);
          }}
        >
          Envoyer un e-mail
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "10%",
          }}
        >
          <Input
            onChange={(e) => setResponseCode(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              fontSize: "1.5rem",
              borderRadius: "10px",
            }}
            placeholder="Saisir ici le code reçu"
          />
        </div>{" "}
        <Button
          type="primary"
          disabled={okToSubmit(
            toSend.message.substring(toSend.message.length - 6),
            responseCode
          )}
          style={{ width: "80%" }}
          onClick={() => setRedirect(true)}
        >
          Envoyer
        </Button>
      </Modal>
    </div>
  );
}
