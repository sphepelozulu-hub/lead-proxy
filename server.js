  /*
  =======================================================
  CARTRACK CAMERAS
  OFFER 3046
  =======================================================
  */

  if (
    req.url === '/submit-cartrack' &&
    req.method === 'POST'
  ) {

    readBody(req, body => {

      try {

        const data = JSON.parse(body);

        const incoming = getIncoming(data);

        const p = new URLSearchParams();

        p.append(
          'campid',
          'DASHCAMS'
        );

        p.append(
          'sid',
          '25393'
        );

        p.append(
          'returnjson',
          'yes'
        );

        const firstName =
          String(
            incoming.firstname ||
            incoming.First_Name ||
            ''
          ).trim();

        const lastName =
          String(
            incoming.lastname ||
            incoming.Last_Name ||
            ''
          ).trim();

        const phone =
          String(
            incoming.phone1 ||
            incoming.phone ||
            incoming.CellNumber ||
            ''
          ).trim();

        p.append(
          'First_Name',
          firstName
        );

        p.append(
          'Last_Name',
          lastName
        );

        p.append(
          'CellNumber',
          phone
        );

        p.append(
          'email',
          incoming.email || ''
        );

        p.append(
          'optinurl',
          incoming.optinurl ||
          'http://url.com'
        );

        p.append(
          'optindate',
          incoming.optindate ||
          getOptinDate()
        );

        /*
         * IMPORTANT:
         * CarTrack must always send the approved
         * LeadByte value "true".
         * Do not pass the dashboard value through.
         */

        p.append(
          'acceptterms',
          'true'
        );

        p.append(
          'offer_id',
          '3046'
        );

        console.log(
          'CarTrack submission:',
          Object.fromEntries(p)
        );

        postToLeadbyte(
          p.toString(),
          res
        );

      } catch (error) {

        console.error(
          'CarTrack error:',
          error.message
        );

        sendJson(res, 400, {

          code: -100,

          response: error.message

        });

      }

    });

    return;
  }
