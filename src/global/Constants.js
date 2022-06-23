// little change to deploy on the docker container
var apiUrl;
if (!process.env.ENV_MSPR){
    apiUrl = "https://localhost:8080/api/";
}else if (process.env.ENV_MSPR == 'dev'){
    apiUrl = "https://localhost:49160/api/";
}else if (process.env.ENV_MSPR == 'prod'){
    apiUrl = "https://monappli.ovh:49160/api/";
}

export const API_URL = apiUrl;
