exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const data = JSON.parse(event.body);

    console.log("📩 Nueva información recibida:");
    console.log(data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Formulario recibido correctamente",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error procesando el formulario",
      }),
    };
  }
};
