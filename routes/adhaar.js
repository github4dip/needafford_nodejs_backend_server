import https from 'https';
import { getAccessToken } from '../routes/tokenmanager.js';

import express from 'express';
const router = express.Router();
import 'dotenv/config'



///generate otp
router.post('/generate-otp', async (request, res) => {
  try {
    const { aadhaar_number, consent, reason } = request.body;

    // Get a valid (cached or freshly fetched) access token.
    const accessToken = await getAccessToken();

    const options = {
      method: 'POST',
      hostname: 'api.sandbox.co.in',
      port: null,
      path: '/kyc/aadhaar/okyc/otp',
      headers: {
        accept: 'application/json',
        authorization: accessToken,
        'x-api-key': 'key_live_ZkDJygEbcsYvScyBAgvwdpH9BBohQYTM',
        'x-api-version': '2.0',
        'content-type': 'application/json'
      }
    };

    const req = https.request(options, (apiRes) => {
      const chunks = [];

      apiRes.on('data', (chunk) => {
        chunks.push(chunk);
      });

      apiRes.on('end', () => {
        try {
          const body = Buffer.concat(chunks).toString();
          const jsonResponse = JSON.parse(body);
          
          if (jsonResponse.code === 200) {
            // Extract and send only the reference_id
            const referenceId = jsonResponse.data.reference_id;
            res.status(200).json({ reference_id: referenceId });
          } else {
            // Handle other response codes or errors
            res.status(jsonResponse.code || 500).json({ error: jsonResponse.message || 'Unexpected error' });
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          res.status(500).send('Error processing response');
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err);
      res.status(500).send('Error generating OTP');
    });

    req.write(JSON.stringify({
      '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
      aadhaar_number: aadhaar_number,
      consent: consent,
      reason: reason
    }));
    req.end();

  } catch (err) {
    console.error('Error in generate-otp endpoint:', err);
    res.status(500).send('Error generating OTP');
  }
});


/// verify otp
router.post('/verify-otp', async (req, res) => {
  const { reference_id, otp } = req.body;

  // if (!reference_id || !otp) {
  //   return res.status(400).json({ error: 'Reference ID and OTP are required' });
  // }

   // Get a valid (cached or freshly fetched) access token.
   const accessedToken = await getAccessToken();
  console.log(accessedToken);

  const options = {
    method: 'POST',
    hostname: 'api.sandbox.co.in',
    port: null,
    path: '/kyc/aadhaar/okyc/otp/verify',
    headers: {
      accept: 'application/json',
      authorization: accessedToken,
      'x-api-key': 'key_live_ZkDJygEbcsYvScyBAgvwdpH9BBohQYTM',
      'x-api-version': '2.0',
      'content-type': 'application/json'
    }
  };

  const requestBody = JSON.stringify({
    '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.request',
    reference_id: reference_id,
    otp: otp
  });

  const request = https.request(options, (apiRes) => {
    const chunks = [];

    apiRes.on('data', (chunk) => {
      chunks.push(chunk);
    });

    apiRes.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString();
        const jsonResponse = JSON.parse(body);

        if (apiRes.statusCode === 200) {
          res.status(200).json(jsonResponse);
        } else {
          res.status(apiRes.statusCode).json({ error: jsonResponse.message || 'An error occurred' });
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        res.status(500).json({ error: 'Error processing response' });
      }
    });
  });

  request.on('error', (err) => {
    console.error('Request error:', err);
    res.status(500).json({ error: 'Error verifying OTP' });
  });

  request.write(requestBody);
  request.end();
});



  export default router;






