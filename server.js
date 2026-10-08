<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lead Operations Master Dashboard</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #f3f4f6;
    color: #17212b;
}

header {
    background: #111827;
    color: white;
    padding: 22px 26px;
}

header h1 {
    margin: 0;
    font-size: 24px;
}

header p {
    margin: 7px 0 0;
    color: #cbd5e1;
    font-size: 13px;
}

.container {
    max-width: 1500px;
    margin: 20px auto;
    padding: 0 16px;
}

.tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    background: white;
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,.06);
    margin-bottom: 16px;
}

.tab {
    border: 0;
    background: #e5e7eb;
    color: #111827;
    padding: 11px 16px;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
}

.tab.active {
    background: #111827;
    color: white;
}

.panel {
    display: none;
}

.panel.active {
    display: block;
}

.cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin-bottom: 16px;
}

.card,
.section {
    background: white;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 2px 8px rgba(0,0,0,.06);
}

.card small {
    display: block;
    color: #6b7280;
    margin-bottom: 7px;
}

.big {
    font-size: 25px;
    font-weight: 800;
}

.section {
    margin-bottom: 16px;
}

.section h2 {
    margin: 0 0 14px;
    font-size: 18px;
}

.config {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.box {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
}

.box small {
    display: block;
    color: #6b7280;
    margin-bottom: 4px;
}

.controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: end;
}

button,
.file {
    border: 0;
    border-radius: 7px;
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
    font-size: 13px;
}

button.primary,
.file {
    background: #111827;
    color: white;
}

button.green {
    background: #166534;
    color: white;
}

button.orange {
    background: #92400e;
    color: white;
}

button.red {
    background: #991b1b;
    color: white;
}

button.gray {
    background: #e5e7eb;
    color: #111827;
}

button:disabled {
    opacity: .5;
    cursor: not-allowed;
}

.file {
    display: inline-block;
}

.file input {
    display: none;
}

.settings {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 14px;
}

label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 5px;
}

input,
select {
    width: 100%;
    padding: 9px;
    border: 1px solid #d1d5db;
    border-radius: 7px;
}

.notice {
    background: #fff7ed;
    border: 1px solid #fed7aa;
    color: #9a3412;
    border-radius: 8px;
    padding: 11px;
    font-size: 12px;
    margin-top: 12px;
}

.success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    border-radius: 8px;
    padding: 11px;
    font-size: 12px;
}

.error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    border-radius: 8px;
    padding: 11px;
    font-size: 12px;
}

.tablewrap {
    overflow: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}

th,
td {
    padding: 9px;
    border-bottom: 1px solid #eee;
    text-align: left;
    white-space: nowrap;
}

th {
    background: #f8fafc;
}

.badge {
    padding: 4px 8px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 10px;
}

.pending {
    background: #fef3c7;
    color: #92400e;
}

.accepted {
    background: #dcfce7;
    color: #166534;
}

.rejected {
    background: #fee2e2;
    color: #991b1b;
}

.duplicate {
    background: #e0e7ff;
    color: #3730a3;
}

.invalid {
    background: #f3f4f6;
    color: #374151;
}

.progress {
    height: 9px;
    background: #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 8px;
}

.bar {
    height: 100%;
    width: 0;
    background: #2563eb;
}

pre {
    background: #111827;
    color: #d1fae5;
    padding: 12px;
    border-radius: 8px;
    overflow: auto;
    font-size: 11px;
    min-height: 60px;
}

.log {
    background: #111827;
    color: #d1d5db;
    padding: 10px;
    border-radius: 8px;
    max-height: 220px;
    overflow: auto;
    font: 11px monospace;
}

.log div {
    padding: 3px 0;
    border-bottom: 1px solid #374151;
}

.drop {
    border: 2px dashed #cbd5e1;
    padding: 20px;
    text-align: center;
    border-radius: 10px;
    color: #64748b;
    margin-top: 12px;
}

@media(max-width:1100px) {

    .cards {
        grid-template-columns: repeat(3, 1fr);
    }

    .config,
    .settings {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media(max-width:650px) {

    .cards,
    .config,
    .settings {
        grid-template-columns: 1fr;
    }

    .container {
        padding: 0 9px;
    }
}
</style>
</head>

<body>

<header>

    <h1>Lead Operations Master Dashboard</h1>

    <p>
        Flexicare • Dashcams • 1Life • Loans • Car Insurance • Zolos Debt
    </p>

</header>


<div class="container">

    <div class="tabs" id="tabs"></div>

    <div id="panels"></div>

</div>


<script>

/* =========================================================
   MASTER CONFIGURATION
========================================================= */

const RAILWAY =
    'https://nodejs-production-891f.up.railway.app';

const STORAGE =
    'leadOperationsMasterDashboardV2';


const CPL = {

    zolos: 25

};


/* =========================================================
   PRODUCT CONFIGURATION
========================================================= */

const PRODUCTS = {

    flexicare: {

        key: 'flexicare',

        name: 'Flexicare',

        route: '/submit',

        offer: '2514',

        campaign: 'MEDICAL-WHITE-LABEL'

    },


    cartrack: {

        key: 'cartrack',

        name: 'Dashcams',

        route: '/submit-cartrack',

        offer: '3046',

        campaign: 'DASHCAMS'

    },


    life: {

        key: 'life',

        name: '1Life',

        route: '/submit-1life',

        offer: '2807',

        campaign: 'LIFE-COVER'

    },


    loans: {

        key: 'loans',

        name: 'Loans',

        route: '/submit-loans',

        offer: '397',

        campaign: 'KONGA'

    },


    carinsurance: {

        key: 'carinsurance',

        name: 'Car Insurance',

        route: '/submit-carinsurance',

        offer: '377',

        campaign: 'CAR-INSURANCE'

    },


    zolos: {

        key: 'zolos',

        name: 'Zolos Debt',

        route: '/submit-zolos-debt',

        offer: '2858',

        campaign: 'DEBT-WHITE-LABEL'

    }

};


/* =========================================================
   STATE
========================================================= */

let state =
    JSON.parse(
        localStorage.getItem(STORAGE) || '{}'
    );


let current =
    'zolos';


function saveState() {

    localStorage.setItem(
        STORAGE,
        JSON.stringify(state)
    );

}


function getState(product) {

    if (!state[product]) {

        state[product] = {

            leads: [],

            index: 0,

            running: false,

            logs: [],

            last: {}

        };

    }

    return state[product];

}


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {

    return String(value ?? '')

        .replace(/&/g, '&amp;')

        .replace(/</g, '&lt;')

        .replace(/>/g, '&gt;')

        .replace(/"/g, '&quot;')

        .replace(/'/g, '&#039;');

}


function normal(value) {

    return String(value ?? '').trim();

}


function booleanTrue(value) {

    return [

        'true',

        'yes',

        'y',

        '1'

    ].includes(

        String(value ?? '')

            .trim()

            .toLowerCase()

    );

}


function booleanFalse(value) {

    return [

        'false',

        'no',

        'n',

        '0'

    ].includes(

        String(value ?? '')

            .trim()

            .toLowerCase()

    );

}


function sleep(milliseconds) {

    return new Promise(

        resolve =>

            setTimeout(
                resolve,
                milliseconds
            )

    );

}


function getField(object, names) {

    for (const name of names) {

        const key =

            name

                .toLowerCase()

                .replace(/\s+/g, '');


        if (

            Object.prototype.hasOwnProperty.call(
                object,
                key
            )

        ) {

            return normal(
                object[key]
            );

        }

    }

    return '';

}


function normalisePhone(value) {

    let phone =
        normal(value).replace(
            /[^\d+]/g,
            ''
        );


    if (
        phone.startsWith('0') &&
        phone.length >= 9
    ) {

        phone =
            '+27' +
            phone.substring(1);

    }


    return phone;

}


/* =========================================================
   SOUTH AFRICAN OPT-IN DATE
   dd/mm/yyyy hh:mm:ss
========================================================= */

function getOptinDate() {

    const now =
        new Date();


    const day =
        String(
            now.getDate()
        ).padStart(2, '0');


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, '0');


    const year =
        now.getFullYear();


    const hours =
        String(
            now.getHours()
        ).padStart(2, '0');


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, '0');


    const seconds =
        String(
            now.getSeconds()
        ).padStart(2, '0');


    return (

        day +
        '/' +
        month +
        '/' +
        year +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds

    );

}


/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {

    const rows = [];

    let row = [];

    let cell = '';

    let insideQuotes = false;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        const char =
            text[i];

        const next =
            text[i + 1];


        if (
            char === '"' &&
            insideQuotes &&
            next === '"'
        ) {

            cell += '"';

            i++;

            continue;

        }


        if (char === '"') {

            insideQuotes =
                !insideQuotes;

            continue;

        }


        if (
            char === ',' &&
            !insideQuotes
        ) {

            row.push(
                cell.trim()
            );

            cell = '';

            continue;

        }


        if (
            (
                char === '\n' ||
                char === '\r'
            ) &&
            !insideQuotes
        ) {

            if (
                char === '\r' &&
                next === '\n'
            ) {

                i++;

            }


            row.push(
                cell.trim()
            );

            cell = '';


            if (
                row.some(
                    value =>
                        value !== ''
                )
            ) {

                rows.push(row);

            }


            row = [];

            continue;

        }


        cell += char;

    }


    if (
        cell !== '' ||
        row.length > 0
    ) {

        row.push(
            cell.trim()
        );


        if (
            row.some(
                value =>
                    value !== ''
            )
        ) {

            rows.push(row);

        }

    }


    if (!rows.length) {

        return [];

    }


    const headers =

        rows[0].map(

            header =>

                header

                    .trim()

                    .toLowerCase()

                    .replace(/\s+/g, '')

        );


    return rows.slice(1).map(

        values => {

            const object = {};


            headers.forEach(

                (header, index) => {

                    object[header] =
                        values[index] || '';

                }

            );


            return object;

        }

    );

}


/* =========================================================
   NORMALISE LEAD
========================================================= */

function normaliseLead(
    product,
    row
) {

    const lead = {

        id:
            crypto.randomUUID(),

        firstname:
            getField(
                row,
                [
                    'firstname',
                    'first_name',
                    'firstname',
                    'name'
                ]
            ),

        lastname:
            getField(
                row,
                [
                    'lastname',
                    'last_name',
                    'surname'
                ]
            ),

        phone:
            normalisePhone(
                getField(
                    row,
                    [
                        'phone',
                        'phone1',
                        'cell',
                        'cellnumber',
                        'mobile'
                    ]
                )
            ),

        email:
            getField(
                row,
                [
                    'email',
                    'emailaddress'
                ]
            ),

        status:
            'pending',

        code:
            '',

        response:
            '',

        leadId:
            '',

        raw:
            null,

        submittedAt:
            null

    };


    /* ZOLOS */

    if (
        product === 'zolos'
    ) {

        lead.debt_greater_than_35_000 =

            getField(
                row,
                [
                    'debt_greater_than_35_000',
                    'debtgreaterthan35000',
                    'debt35k',
                    'debt'
                ]
            );


        lead.income_greater_than_10_000 =

            getField(
                row,
                [
                    'income_greater_than_10_000',
                    'incomegreaterthan10000',
                    'income10k',
                    'income'
                ]
            );


        lead.underdebtreview =

            getField(
                row,
                [
                    'underdebtreview',
                    'under_debt_review',
                    'debtreview'
                ]
            );


        lead.employment =

            getField(
                row,
                [
                    'employment',
                    'employed'
                ]
            );


        lead.age =

            getField(
                row,
                [
                    'age'
                ]
            );

    }


    /* FLEXICARE */

    if (
        product === 'flexicare'
    ) {

        lead.age_range =

            getField(
                row,
                [
                    'age_range',
                    'age'
                ]
            );


        lead.income_range =

            getField(
                row,
                [
                    'income_range',
                    'income'
                ]
            );

    }


    /* CAR INSURANCE */

    if (
        product === 'carinsurance'
    ) {

        lead.age_range =

            getField(
                row,
                [
                    'age_range',
                    'age'
                ]
            );


        lead.income_range =

            getField(
                row,
                [
                    'income_range',
                    'income'
                ]
            );

    }


    /* 1LIFE */

    if (
        product === 'life'
    ) {

        lead.incomebracket =

            getField(
                row,
                [
                    'incomebracket',
                    'income_bracket',
                    'income'
                ]
            );


        lead.hiv_life_insurance =

            getField(
                row,
                [
                    'hiv_life_insurance',
                    'hiv'
                ]
            );


        lead.diabetes_life_insurance =

            getField(
                row,
                [
                    'diabetes_life_insurance',
                    'diabetes'
                ]
            );


        lead.employed =

            getField(
                row,
                [
                    'employed',
                    'employment'
                ]
            );


        lead.citizen =

            getField(
                row,
                [
                    'citizen'
                ]
            );


        lead.sa_citizen =

            getField(
                row,
                [
                    'sa_citizen',
                    'sacitizen'
                ]
            );

    }


    /* LOANS */

    if (
        product === 'loans'
    ) {

        lead.netincome =

            getField(
                row,
                [
                    'netincome',
                    'net_income',
                    'income'
                ]
            );


        lead.idnumber =

            getField(
                row,
                [
                    'idnumber',
                    'id_number',
                    'sa_id'
                ]
            );

    }


    return lead;

}


/* =========================================================
   CSV LOAD
========================================================= */

function loadCSV(
    product,
    text
) {

    const rows =
        parseCSV(text);


    if (!rows.length) {

        alert(
            'No rows found in CSV.'
        );

        return;

    }


    const s =
        getState(product);


    const imported =
        rows.map(
            row =>
                normaliseLead(
                    product,
                    row
                )
        );


    s.leads =
        s.leads.concat(
            imported
        );


    saveState();

    renderPanel(product);


    log(
        product,
        imported.length +
        ' leads imported.'
    );

}


/* =========================================================
   VALIDATION
========================================================= */

function validateLead(
    product,
    lead
) {

    const errors = [];


    if (!lead.firstname) {

        errors.push(
            'First name missing'
        );

    }


    if (!lead.lastname) {

        errors.push(
            'Surname missing'
        );

    }


    if (!lead.phone) {

        errors.push(
            'Phone missing'
        );

    }


    if (!lead.email) {

        errors.push(
            'Email missing'
        );

    }


    /*
       ZOLOS
    */

    if (
        product === 'zolos'
    ) {

        if (
            !booleanTrue(
                lead.debt_greater_than_35_000
            )
        ) {

            errors.push(
                'Debt must be R35,000+'
            );

        }


        if (
            !booleanTrue(
                lead.income_greater_than_10_000
            )
        ) {

            errors.push(
                'Income must be R10,000+'
            );

        }


        if (
            !booleanTrue(
                lead.employment
            )
        ) {

            errors.push(
                'Lead must be employed'
            );

        }


        if (
            lead.age &&
            (
                Number(lead.age) < 18 ||
                Number(lead.age) > 60
            )
        ) {

            errors.push(
                'Age must be between 18 and 60'
            );

        }


        if (
            !booleanTrue(
                lead.underdebtreview
            ) &&
            !booleanFalse(
                lead.underdebtreview
            )
        ) {

            errors.push(
                'Under debt review must be true or false'
            );

        }

    }


    return errors;

}


/* =========================================================
   PAYLOAD BUILDING
========================================================= */

function buildPayload(
    product,
    lead
) {

    const optinurlElement =
        document.getElementById(
            'url_' + product
        );


    const optinurl =
        optinurlElement
            ? optinurlElement.value.trim()
            : '';


    const common = {

        firstname:
            lead.firstname,

        lastname:
            lead.lastname,

        optinurl:
            optinurl,

        optindate:
            getOptinDate()

    };


    /*
       FLEXICARE
    */

    if (
        product === 'flexicare'
    ) {

        return {

            ...common,

            phone1:
                lead.phone,

            email:
                lead.email,

            offer_id:
                '2514',

            age_range:
                lead.age_range ||
                '25 - 34',

            income_range:
                lead.income_range ||
                'R10 000 - R15 000',

            doi:
                'true',

            acceptterms:
                'true'

        };

    }


    /*
       DASCHAMS
    */

    if (
        product === 'cartrack'
    ) {

        return {

            ...common,

            phone:
                lead.phone,

            email:
                lead.email,

            acceptterms:
                'true'

        };

    }


    /*
       1LIFE
    */

    if (
        product === 'life'
    ) {

        return {

            ...common,

            phone1:
                lead.phone,

            email:
                lead.email,

            offer_id:
                '2807',

            incomebracket:
                lead.incomebracket,

            hiv_life_insurance:
                lead.hiv_life_insurance,

            diabetes_life_insurance:
                lead.diabetes_life_insurance,

            employed:
                lead.employed,

            citizen:
                lead.citizen,

            sa_citizen:
                lead.sa_citizen,

            doi:
                'true',

            acceptterms:
                'true'

        };

    }


    /*
       LOANS
    */

    if (
        product === 'loans'
    ) {

        return {

            ...common,

            phone1:
                lead.phone,

            email:
                lead.email,

            offer_id:
                '397',

            netincome:
                lead.netincome ||
                '15000',

            idnumber:
                lead.idnumber || '',

            underdebtreview:
                'false',

            acceptterms:
                'true'

        };

    }


    /*
       CAR INSURANCE
    */

    if (
        product === 'carinsurance'
    ) {

        return {

            ...common,

            phone1:
                lead.phone,

            email:
                lead.email,

            offer_id:
                '377',

            channel:
                'JMAff',

            product:
                'JMCar',

            leadsource:
                'JMAFFSite26748',

            affiliateshortcode:
                'JMAFFSite26748',

            doi:
                'true',

            acceptterms:
                'true',

            car_ownership:
                'yes',

            age_range:
                lead.age_range ||
                '25 - 34',

            income_range:
                lead.income_range ||
                'R10 000 - R15 000'

        };

    }


    /*
       ZOLOS DEBT

       IMPORTANT:
       This now matches the supplied API documentation.

       Campaign:
       DEBT-WHITE-LABEL

       SID:
       25393

       Offer:
       2858

       No undocumented "income" field is sent.
    */

    if (
        product === 'zolos'
    ) {

        return {

            ...common,

            phone1:
                lead.phone,

            email:
                lead.email,

            offer_id:
                '2858',

            debt_greater_than_35_000:
                'true',

            income_greater_than_10_000:
                'true',

            underdebtreview:

                booleanTrue(
                    lead.underdebtreview
                )

                    ? 'true'
                    : 'false',

            employment:
                'true'

        };

    }


    return {};

}


/* =========================================================
   SUBMIT LEAD
========================================================= */

async function submitLead(
    product,
    lead
) {

    const errors =
        validateLead(
            product,
            lead
        );


    if (errors.length) {

        lead.status =
            'invalid';

        lead.response =
            errors.join('; ');


        log(
            product,
            'INVALID: ' +
            errors.join(', ')
        );


        saveState();

        return;

    }


    const payload =
        buildPayload(
            product,
            lead
        );


    log(
        product,
        'Submitting ' +
        lead.firstname +
        ' ' +
        lead.lastname
    );


    try {

        const response =
            await fetch(

                RAILWAY +
                PRODUCTS[product].route,

                {

                    method:
                        'POST',

                    headers: {

                        'Content-Type':
                            'application/json'

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }

            );


        let data;


        try {

            data =
                await response.json();

        }

        catch (error) {

            data = {

                code:
                    -100,

                response:
                    'Invalid JSON response from Railway proxy'

            };

        }


        lead.raw =
            data;


        lead.code =
            data.code !== undefined
                ? data.code
                : '';


        lead.response =
            data.response || '';


        lead.leadId =
            data.leadId || '';


        lead.submittedAt =
            new Date().toISOString();


        /*
           ONLY CODE 1 IS SUCCESS
        */

        if (
            Number(data.code) === 1
        ) {

            lead.status =
                'accepted';


            log(
                product,
                'ACCEPTED: ' +
                lead.firstname +
                ' ' +
                lead.lastname +
                ' | Lead ID: ' +
                (data.leadId || 'N/A')
            );

        }


        /*
           -2 = DUPLICATE
        */

        else if (
            Number(data.code) === -2
        ) {

            lead.status =
                'duplicate';


            log(
                product,
                'DUPLICATE: ' +
                lead.firstname +
                ' ' +
                lead.lastname
            );

        }


        /*
           EVERYTHING ELSE = REJECTED
        */

        else {

            lead.status =
                'rejected';


            log(
                product,
                'REJECTED: ' +
                lead.firstname +
                ' ' +
                lead.lastname +
                ' | Code: ' +
                data.code
            );

        }


        const s =
            getState(product);


        s.last =
            data;


        saveState();

        renderPanel(product);


    }

    catch (error) {

        /*
           Network error is left pending
           rather than falsely marking the
           lead as a LeadByte rejection.
        */

        lead.status =
            'pending';

        lead.response =
            error.message;


        lead.code =
            '-100';


        const s =
            getState(product);


        s.last = {

            code:
                -100,

            response:
                error.message

        };


        saveState();


        log(
            product,
            'NETWORK ERROR — lead left pending: ' +
            error.message
        );


        renderPanel(product);

    }

}


/* =========================================================
   LAST 24 HOURS
========================================================= */

function submissionsLast24Hours(
    product
) {

    const cutoff =
        Date.now() -
        86400000;


    const s =
        getState(product);


    return s.leads.filter(

        lead =>

            lead.submittedAt &&

            new Date(
                lead.submittedAt
            ).getTime() >= cutoff &&

            [
                'accepted',
                'rejected',
                'duplicate'
            ].includes(
                lead.status
            )

    ).length;

}


/* =========================================================
   START QUEUE
========================================================= */

async function startQueue(
    product
) {

    const s =
        getState(product);


    if (s.running) {

        return;

    }


    if (!s.leads.length) {

        alert(
            'Upload a CSV first.'
        );

        return;

    }


    s.running =
        true;


    saveState();

    renderPanel(product);


    log(
        product,
        'Queue started.'
    );


    const limit =
        Number(
            document.getElementById(
                'limit_' + product
            ).value
        ) || 15;


    const minimumDelay =
        Number(
            document.getElementById(
                'min_' + product
            ).value
        ) || 60;


    const maximumDelay =
        Number(
            document.getElementById(
                'max_' + product
            ).value
        ) || 180;


    while (

        s.running &&

        s.index <
        s.leads.length

    ) {


        /*
           Dashboard-level rolling
           24-hour limit.
        */

        if (
            submissionsLast24Hours(
                product
            ) >= limit
        ) {

            log(
                product,
                'Rolling 24-hour dashboard limit reached: ' +
                limit
            );


            break;

        }


        const lead =
            s.leads[
                s.index
            ];


        if (
            lead.status !== 'pending'
        ) {

            s.index++;

            continue;

        }


        await submitLead(
            product,
            lead
        );


        s.index++;

        saveState();

        renderPanel(product);


        if (
            !s.running ||
            s.index >=
            s.leads.length
        ) {

            break;

        }


        /*
           Random delay between
           minimum and maximum.
        */

        const range =
            maximumDelay -
            minimumDelay;


        const delay =
            Math.floor(
                Math.random() *
                (range + 1)
            ) +
            minimumDelay;


        log(
            product,
            'Waiting ' +
            delay +
            ' seconds before next lead.'
        );


        await sleep(
            delay * 1000
        );

    }


    s.running =
        false;


    saveState();

    renderPanel(product);


    if (
        s.index >=
        s.leads.length
    ) {

        log(
            product,
            'Queue completed.'
        );

    }

    else {

        log(
            product,
            'Queue paused.'
        );

    }

}


/* =========================================================
   PAUSE
========================================================= */

function pauseQueue(
    product
) {

    const s =
        getState(product);


    s.running =
        false;


    saveState();


    log(
        product,
        'Pause requested.'
    );

}


/* =========================================================
   CLEAR COMPLETED
========================================================= */

function clearCompleted(
    product
) {

    const s =
        getState(product);


    s.leads =
        s.leads.filter(

            lead =>
                lead.status ===
                'pending'

        );


    s.index =
        0;


    saveState();

    renderPanel(product);


    log(
        product,
        'Completed leads cleared.'
    );

}


/* =========================================================
   CLEAR EVERYTHING
========================================================= */

function clearEverything(
    product
) {

    if (
        !confirm(
            'Clear the entire ' +
            PRODUCTS[product].name +
            ' queue and local history?'
        )
    ) {

        return;

    }


    state[product] = {

        leads: [],

        index: 0,

        running: false,

        logs: [],

        last: {}

    };


    saveState();

    renderPanel(product);

}


/* =========================================================
   HEALTH CHECK
========================================================= */

async function healthCheck(
    product
) {

    const target =
        document.getElementById(
            'health_' + product
        );


    target.innerHTML =
        '<div class="notice">Checking Railway...</div>';


    try {

        const response =
            await fetch(
                RAILWAY +
                '/health'
            );


        const data =
            await response.json();


        target.innerHTML =

            '<div class="success">' +

            '<strong>Railway online.</strong><br>' +

            escapeHTML(
                JSON.stringify(
                    data
                )
            ) +

            '</div>';

    }

    catch (error) {

        target.innerHTML =

            '<div class="error">' +

            '<strong>Health check failed.</strong><br>' +

            escapeHTML(
                error.message
            ) +

            '</div>';

    }

}


/* =========================================================
   EXPORT REPORT
========================================================= */

function exportReport(
    product
) {

    const s =
        getState(product);


    const rows = [

        [

            'First Name',

            'Last Name',

            'Phone',

            'Email',

            'Status',

            'Code',

            'Lead ID',

            'Response',

            'Submitted At'

        ]

    ];


    s.leads.forEach(

        lead => {

            rows.push(

                [

                    lead.firstname,

                    lead.lastname,

                    lead.phone,

                    lead.email,

                    lead.status,

                    lead.code,

                    lead.leadId,

                    lead.response,

                    lead.submittedAt

                ]

            );

        }

    );


    const csv =

        rows.map(

            row =>

                row.map(

                    value =>

                        '"' +

                        String(
                            value ?? ''
                        )
                        .replace(
                            /"/g,
                            '""'
                        ) +

                        '"'

                ).join(',')

        ).join('\n');


    const blob =
        new Blob(
            [csv],
            {
                type:
                    'text/csv'
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            'a'
        );


    link.href =
        url;


    link.download =
        PRODUCTS[product].key +
        '_report.csv';


    link.click();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   LOGGING
========================================================= */

function log(
    product,
    message
) {

    const s =
        getState(product);


    s.logs.unshift(

        '[' +
        new Date()
            .toLocaleTimeString() +
        '] ' +
        message

    );


    s.logs =
        s.logs.slice(
            0,
            150
        );


    saveState();

    renderPanel(product);

}


/* =========================================================
   FILE READER
========================================================= */

function readFile(
    product,
    file
) {

    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            try {

                loadCSV(
                    product,
                    event.target.result
                );

            }

            catch (error) {

                alert(
                    'Could not read CSV: ' +
                    error.message
                );

            }

        };


    reader.readAsText(
        file
    );

}


/* =========================================================
   DRAG & DROP
========================================================= */

function setupDropZone(
    product
) {

    const drop =
        document.getElementById(
            'drop_' + product
        );


    if (!drop) {

        return;

    }


    drop.addEventListener(
        'dragover',
        function(event) {

            event.preventDefault();

            drop.style.background =
                '#f8fafc';

        }
    );


    drop.addEventListener(
        'dragleave',
        function(event) {

            event.preventDefault();

            drop.style.background =
                '';

        }
    );


    drop.addEventListener(
        'drop',
        function(event) {

            event.preventDefault();

            drop.style.background =
                '';


            const file =
                event.dataTransfer.files[0];


            if (file) {

                readFile(
                    product,
                    file
                );

            }

        }
    );

}


/* =========================================================
   RENDER TABS
========================================================= */

function renderTabs() {

    const container =
        document.getElementById(
            'tabs'
        );


    container.innerHTML =
        '';


    Object.values(
        PRODUCTS
    ).forEach(

        product => {

            const button =
                document.createElement(
                    'button'
                );


            button.className =
                'tab ' +
                (
                    product.key ===
                    current
                        ? 'active'
                        : ''
                );


            button.textContent =
                product.name;


            button.onclick =
                function() {

                    current =
                        product.key;

                    renderAll();

                };


            container.appendChild(
                button
            );

        }

    );

}


/* =========================================================
   RENDER PANEL
========================================================= */

function renderPanel(
    product
) {

    const config =
        PRODUCTS[product];


    const s =
        getState(product);


    let panel =
        document.getElementById(
            'panel_' + product
        );


    if (!panel) {

        panel =
            document.createElement(
                'div'
            );


        panel.id =
            'panel_' + product;


        panel.className =
            'panel';


        document
            .getElementById(
                'panels'
            )
            .appendChild(
                panel
            );

    }


    const accepted =
        s.leads.filter(

            lead =>
                lead.status ===
                'accepted'

        ).length;


    const rejected =
        s.leads.filter(

            lead =>
                lead.status ===
                'rejected'

        ).length;


    const duplicates =
        s.leads.filter(

            lead =>
                lead.status ===
                'duplicate'

        ).length;


    const pending =
        s.leads.filter(

            lead =>
                lead.status ===
                'pending'

        ).length;


    const invalid =
        s.leads.filter(

            lead =>
                lead.status ===
                'invalid'

        ).length;


    const payout =
        product === 'zolos'

            ? accepted *
              CPL.zolos

            : 0;


    let tableRows =
        '';


    s.leads.forEach(

        (lead, index) => {

            tableRows +=

                '<tr>' +

                '<td>' +
                (index + 1) +
                '</td>' +

                '<td>' +
                escapeHTML(
                    lead.firstname
                ) +
                '</td>' +

                '<td>' +
                escapeHTML(
                    lead.lastname
                ) +
                '</td>' +

                '<td>' +
                escapeHTML(
                    lead.phone
                ) +
                '</td>' +

                '<td>' +
                escapeHTML(
                    lead.email
                ) +
                '</td>' +

                '<td>' +

                '<span class="badge ' +
                escapeHTML(
                    lead.status
                ) +
                '">' +

                escapeHTML(
                    lead.status
                ) +

                '</span>' +

                '</td>' +

                '<td>' +
                escapeHTML(
                    lead.code
                ) +
                '</td>' +

                '<td>' +
                escapeHTML(
                    lead.leadId
                ) +
                '</td>' +

                '<td>' +
                escapeHTML(
                    lead.response
                ) +
                '</td>' +

                '</tr>';

        }

    );


    let logRows =
        '';


    s.logs.forEach(

        entry => {

            logRows +=

                '<div>' +
                escapeHTML(
                    entry
                ) +
                '</div>';

        }

    );


    let lastResponse =
        '{}';


    if (
        s.last &&
        Object.keys(
            s.last
        ).length
    ) {

        lastResponse =

            JSON.stringify(
                s.last,
                null,
                2
            );

    }


    panel.innerHTML = `

        <div class="cards">

            <div class="card">

                <small>
                    Accepted
                </small>

                <div class="big">
                    ${accepted}
                </div>

            </div>


            <div class="card">

                <small>
                    Rejected
                </small>

                <div class="big">
                    ${rejected}
                </div>

            </div>


            <div class="card">

                <small>
                    Duplicates
                </small>

                <div class="big">
                    ${duplicates}
                </div>

            </div>


            <div class="card">

                <small>
                    Pending
                </small>

                <div class="big">
                    ${pending}
                </div>

            </div>


            <div class="card">

                <small>

                    ${
                        product === 'zolos'
                            ? 'Estimated Gross Payout'
                            : 'Invalid'

                    }

                </small>

                <div class="big">

                    ${
                        product === 'zolos'

                            ? 'R' +
                              payout.toFixed(2)

                            : invalid

                    }

                </div>

            </div>

        </div>


        <div class="section">

            <h2>
                ${escapeHTML(
                    config.name
                )}
            </h2>


            <div class="config">

                <div class="box">

                    <small>
                        Railway Route
                    </small>

                    <strong>
                        ${escapeHTML(
                            config.route
                        )}
                    </strong>

                </div>


                <div class="box">

                    <small>
                        Campaign
                    </small>

                    <strong>
                        ${escapeHTML(
                            config.campaign
                        )}
                    </strong>

                </div>


                <div class="box">

                    <small>
                        Offer ID
                    </small>

                    <strong>
                        ${escapeHTML(
                            config.offer
                        )}
                    </strong>

                </div>


                <div class="box">

                    <small>
                        SID
                    </small>

                    <strong>
                        25393
                    </strong>

                </div>

            </div>


            ${
                product === 'zolos'

                    ? `

                    <div class="notice">

                        <strong>
                            Zolos Debt requirements:
                        </strong>

                        Income R10,000+,
                        debt R35,000+,
                        employed,
                        age 18–60.

                        <br><br>

                        LeadByte fields:

                        email,
                        firstname,
                        lastname,
                        phone1,
                        optinurl,
                        optindate,
                        offer_id,
                        debt_greater_than_35_000,
                        income_greater_than_10_000,
                        underdebtreview,
                        employment.

                        <br><br>

                        <strong>
                            Commercial:
                        </strong>

                        R25 CPL.

                        <br><br>

                        <strong>
                            Important:
                        </strong>

                        Age is used for dashboard
                        validation only because
                        the supplied LeadByte
                        specification does not
                        contain an age field.

                    </div>

                    `

                    : ''

            }

        </div>


        <div class="section">

            <h2>
                Queue Controls
            </h2>


            <div class="controls">

                <label class="file">

                    Upload CSV

                    <input
                        type="file"
                        accept=".csv,.txt"
                        id="file_${product}"
                    >

                </label>


                <button
                    class="green"
                    onclick="startQueue('${product}')"
                >

                    Start Queue

                </button>


                <button
                    class="orange"
                    onclick="pauseQueue('${product}')"
                >

                    Pause

                </button>


                <button
                    class="gray"
                    onclick="clearCompleted('${product}')"
                >

                    Clear Completed

                </button>


                <button
                    class="red"
                    onclick="clearEverything('${product}')"
                >

                    Clear Everything

                </button>


                <button
                    class="gray"
                    onclick="exportReport('${product}')"
                >

                    Export Report

                </button>


                <button
                    class="gray"
                    onclick="healthCheck('${product}')"
                >

                    Health Check

                </button>

            </div>


            <div class="settings">

                <div>

                    <label>
                        Maximum leads / rolling 24h
                    </label>

                    <input
                        id="limit_${product}"
                        type="number"
                        min="1"
                        value="15"
                    >

                </div>


                <div>

                    <label>
                        Minimum delay (seconds)
                    </label>

                    <input
                        id="min_${product}"
                        type="number"
                        min="1"
                        value="60"
                    >

                </div>


                <div>

                    <label>
                        Maximum delay (seconds)
                    </label>

                    <input
                        id="max_${product}"
                        type="number"
                        min="1"
                        value="180"
                    >

                </div>


                <div>

                    <label>
                        Opt-in URL
                    </label>

                    <input
                        id="url_${product}"
                        value="${
                            product === 'zolos'

                                ? 'https://sites.google.com/view/zolos-debt/home'

                                : 'https://sites.google.com/'
                        }"
                    >

                </div>

            </div>


            <div
                class="drop"
                id="drop_${product}"
            >

                Drag and drop your CSV here

            </div>


            <div style="margin-top:12px">

                Queue:

                ${s.index}

                /

                ${s.leads.length}

                &nbsp; | &nbsp;

                Last 24h submissions:

                ${submissionsLast24Hours(
                    product
                )}

                /

                15

            </div>


            <div class="progress">

                <div
                    class="bar"
                    style="width:${
                        s.leads.length

                            ? Math.min(
                                100,
                                (
                                    s.index /
                                    s.leads.length
                                ) *
                                100
                              )

                            : 0
                    }%"
                ></div>

            </div>


            <div
                id="health_${product}"
                style="margin-top:10px"
            ></div>

        </div>


        <div class="section">

            <h2>
                Last API Response
            </h2>


            <pre>${escapeHTML(
                lastResponse
            )}</pre>

        </div>


        <div class="section">

            <h2>
                Lead Queue
            </h2>


            <div class="tablewrap">

                <table>

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>
                                First Name
                            </th>

                            <th>
                                Last Name
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Code
                            </th>

                            <th>
                                Lead ID
                            </th>

                            <th>
                                Response
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${tableRows}

                    </tbody>

                </table>

            </div>

        </div>


        <div class="section">

            <h2>
                Activity Log
            </h2>


            <div class="log">

                ${logRows}

            </div>

        </div>

    `;


    const fileInput =
        document.getElementById(
            'file_' + product
        );


    if (fileInput) {

        fileInput.onchange =
            function(event) {

                const file =
                    event.target.files[0];


                if (file) {

                    readFile(
                        product,
                        file
                    );

                }

            };

    }


    setupDropZone(
        product
    );

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

    renderTabs();


    const panels =
        document.getElementById(
            'panels'
        );


    panels.innerHTML =
        '';


    Object.values(
        PRODUCTS
    ).forEach(

        product => {

            renderPanel(
                product.key
            );

        }

    );


    document
        .querySelectorAll(
            '.panel'
        )
        .forEach(

            panel => {

                panel.classList.toggle(

                    'active',

                    panel.id ===
                    'panel_' +
                    current

                );

            }

        );

}


/* =========================================================
   START
========================================================= */

renderAll();


/*
   Initial dashboard log.
*/

Object.keys(
    PRODUCTS
).forEach(

    product => {

        if (
            !getState(
                product
            ).logs.length
        ) {

            log(
                product,
                PRODUCTS[product].name +
                ' dashboard loaded.'
            );

        }

    }

);

</script>

</body>
</html>
