// const cors = require('cors');
 const crypto = require('crypto');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());


app.listen(port);
app.post('/mfunc', async (req, res) =>{

  const data = req.body;
  console.log('decrypting data'+ data );

  var nif = null;
  var erroMessage = "";
  try {
    const key_in_bytes = Buffer.from(data.symmetricKey, 'base64');
    const cipher = aes256gcm(key_in_bytes);
    nif = cipher.decrypt(data.cipherText);
    console.log(`Nif Decrypted ${nif}`);
  } catch (err) {
    console.log(`Error while decryption ${err}`)
    erroMessage = err;
  }


  if (nif == null) {
    console.log(`Error NIF is null`);
    await res.status(400).send(JSON.stringify({ message: `Failure while decryption ${erroMessage}` }));

  } else {
    console.log(`Nif is decrypted ${nif}`);
    await res.status(200).send(JSON.stringify({ nif: JSON.parse(nif), message: "Success" }));

  }

 //await res.status(200).send(JSON.stringify({ array: user.symmetricKey }));

});


const aes256gcm = (key) => {


  const decrypt = (enc) => {
    enc = Buffer.from(enc, "base64");
    const iv = enc.slice(0, 12);
    const tag = enc.slice(12);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    let str = decipher.update(tag, null, 'utf8');
    return str.slice(0, 11).toString();
  };

  return {
    decrypt,
  };
};
  //const functions = require("firebase-functions");
//const admin = require('firebase-admin');
//const express = require('express');

//admin.initializeApp();

// const app = express();

// app.use(cors({ origin: true }));

// app.post('/', async (req, res) => {
//   const user = req.body;
//   const data = JSON.parse(user);

//   var nif = null;
//   var erroMessage = "";
//   try {
//     const key_in_bytes = Buffer.from(data.symmetricKey, 'base64');
//     const cipher = aes256gcm(key_in_bytes);
//     nif = cipher.decrypt(data.cipherText);
//     console.log(`Nif Decrypted ${nif}`);
//   } catch (err) {
//     console.log(`Error while decryption ${err}`)
//     erroMessage = err;
//   }


//   if (nif == null) {
//     console.log(`Error NIF is null`);
//     await res.status(400).send(JSON.stringify({ message: `Failure while decryption ${erroMessage}` }));

//   } else {
//     console.log(`Nif is decrypted ${nif}`);
//     await res.status(200).send(JSON.stringify({ nif: JSON.parse(nif), message: "Success" }));

//   }
// });

// exports.getNif = functions.https.onRequest(app);

// const aes256gcm = (key) => {


//   const decrypt = (enc) => {
//     enc = Buffer.from(enc, "base64");
//     const iv = enc.slice(0, 12);
//     const tag = enc.slice(12);

//     const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
//     let str = decipher.update(tag, null, 'utf8');
//     return str.slice(0, 11).toString();
//   };

//   return {
//     decrypt,
//   };
// };

