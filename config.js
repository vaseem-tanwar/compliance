module.exports = {
    "port": 1951,
    "secretKey": "hyrgqwjdfbw4534efqrwer2q38945765",
    "host": "https://my.teammateapp.co.nz",
    // production: {
    //     username: 'brain1uMMong0User',
    //     password: 'PL5qnU9nuvX0pBa',
    //     host: '68.183.173.21',
    //     port: '27017',
    //     dbName: 'COMPLIANCE',
    //     authDb: 'admin'
    // },
    production: {
        username: 'teammateapp',
        password: 'Pa$$wo22rd',
        host: 'localhost',
        port: '27017',
        dbName: 'COMPLIANCE',
        authDb: 'admin'
    },
    siteConfig: {
        LOGO: 'images/logo.png',
        HEADERCOLOR: '#fff',
        FOOTERCOLOR: '#fff',
        SITENAME: 'TEAMMATE'
    },
    email: {
        MAIL_USERNAME: "native.brainium@gmail.com",
        MAIL_PASS: "ezqdoguxuxdiftaj"
    },
    positionStack: {
        baseUrl: 'https://api.positionstack.com/v1/',
        apiKey: 'b26a74cc7f42388c5baacca37d5ecfcc'
    },
    uploadProfilePath: "public/uploads/profile/",
    profilePath: "uploads/profile/",
    uploadPlantPath: "public/uploads/plant/",
    plantPath: "uploads/plant/",
    uploaHRPath: "public/uploads/hr/",
    hrtPath: "uploads/hr/",
    uploadObservationPath: "public/uploads/observation/",
    observationPath: "uploads/observation/",
    uploadRiskPath: "public/uploads/risk/",
    riskPath: "uploads/risk/",
    uploadHazardousPath: "public/uploads/hazardous/",
    hazardousPath: "uploads/hazardous/",
    uploadSupplierPath: "public/uploads/supplier/",
    supplierPath: "uploads/supplier/",
    uploadAuditPath: "public/uploads/audit/",
    auditPath: "uploads/audit/",
    apiUrl: "https://my.teammateapp.co.nz:1951/",
    adminUrl: "https://my.teammateapp.co.nz/admin/",
    webUrl: "https://my.teammateapp.co.nz/",
    serverPath: 'https://my.teammateapp.co.nz/api-service/',
    logPath: "/ServiceLogs/admin.debug.log",
    dev_mode: true,
    __root_dir: __dirname,
    __site_url: '',
    limit: 10,
    adminEmailAddress: 'ipsita.deb@brainiumibfotech.com',
    accessList: [
        { keyField: 'accident', isAccess: 'yes' },
        { keyField: 'improvement', isAccess: 'yes' },
        { keyField: 'ncr', isAccess: 'yes' },
        { keyField: 'formSubmission', isAccess: 'yes' },
        { keyField: 'audit', isAccess: 'yes' },
        { keyField: 'task', isAccess: 'yes' },
        { keyField: 'hr', isAccess: 'yes' },
        { keyField: 'plant', isAccess: 'yes' },
        { keyField: 'supplier', isAccess: 'yes' },
        { keyField: 'risk', isAccess: 'yes' },
        { keyField: 'hazardous', isAccess: 'yes' },
        { keyField: 'reportChart', isAccess: 'yes' },
        { keyField: 'system', isAccess: 'yes' }
    ]
}