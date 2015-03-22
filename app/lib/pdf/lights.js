//////////////////////////
// Ticket PDF Generator //
//////////////////////////

var PDFKit  = require('pdfkit');
var barcode = require('barcode');
var fs      = require('fs');

/**
 * Draw one ticket on one page of the doc
 * @param {object}   doc       PDFKit instance
 * @param {object}   data      Ticket data
 * @param {Boolean}  firstPage True if this is the first page of the PDF
 * @param {string}   basePath  The base directory
 * @param {Function} callback  Called when the ticket is written
 */
var drawOnePage = function (doc, data, firstPage, basePath, callback) {
    if (!firstPage) {
        doc.addPage();
    }

    // Background image
    doc.image(__dirname + '/lights.png', 65, 65, {
        width: 1064,
        height: 599
    });

    // Background white rectangle
    doc.roundedRect(105, 105, 984, 519, 10)
       .fillColor('#fff', 0.7)
       .fill();

    // Firstname & Lastname
    doc.fillColor('#000')
       .fontSize(32)
       .text(data.displayname, 145, 145);

    // Event name
    doc.text(data.eventname, 145, 285);

    // Date
    doc.text(data.date, 145, 330);

    // Place
    doc.text(data.place, 145, 375);

    // Org message
    doc.fontSize(28)
       .text('MESSAGE DE L\'ORGANISATEUR', 145, 430)
       .fontSize(22)
       .text('Merci d\'imprimer et d\'apporter ce billet à l\'entrée de l\'événement. Une pièce d\'identité pourra vous être demandée. Une fois scanné à l\'entrée, aucun autre exemplaire de ce billet ne sera accepté au contrôle.', {
            width: 900
       });

    // Purchase date
    doc.fontSize(26)
       .text('Acheté le ' + data.purchaseDate, 700, 560);

    // More text
    doc.fontSize(22);
    doc.text('INFORMATIONS COMPLÉMENTAIRES', 105, 720)
       .text('Pour plus d\'informations, rendez vous sur le site de l\'association ' + data.association + ' : ', 105, 750, { continued: true })
       .text(data.website, {
            link: data.website,
            underline: true
       })
       .text('En cas de besoin, merci de contacter directement l\'organisateur : ', 105, 775, { continued: true })
       .text(data.mail, {
            link: 'mailto:' + data.mail,
            underline: true
       })
       .fontSize(26)
       .font('Lato-Bold')
       .text('Merci de ne pas plier le billet sur les codes-barres !', 105, 830);

    // Terms
    doc.font('Lato-Regular')
       .fontSize(20)
       .text('Conditions d\'utilisation du billet', 105, 950)
       .text('Le billet est soumis aux conditions générales de vente que vous avez acceptées avant l\'achat du billet. Le billet d\'entrée est valable s\'il est imprimé sur du papier A4 blanc, vierge recto et verso. L\'entrée est soumise au contrôle de la validité de votre billet. Une bonne qualité d\'impression est nécessaire. Les billets partiellement imprimés, souillés, endommagés ou illisibles ne seront pas acceptés et seront considérés comme non valables. En cas d\'incident ou de mauvaise qualité d\'impression, vous devez imprimer à nouveau votre fichier. Pour vérifier la bonne qualité de l\'impression, assurez-vous que les informations écrites sur le billet, ainsi que les pictogrammes (code à barres 2D) sont bien lisibles. Ce titre doit être conservé jusqu\'à la fin de la manifestation. Une pièce d\'identité pourra être demandée conjointement à ce billet. En cas de non-respect de l\'ensemble des règles précisées ci-dessus, ce billet sera considéré comme non valable.', {
            align: 'justify',
            width: 980
       })
       .text("\n")
       .text('Ce billet est reconnu électroniquement lors de votre arrivée sur site. À ce titre, il ne doit être ni dupliqué, ni photocopié. Toute reproduction est frauduleuse et inutile.', {
            align: 'justify',
            width: 980
       });

    // Logo
    doc.image(basePath + data.logo, 921, 145);

    // Barcode
    barcode('ean13', {
        data: data.barcode,
        width: 300,
        height: 75
    }).getBase64(function (err, imgsrc) {
        doc.image(new Buffer(imgsrc.replace('data:image/PNG;base64,', ''), 'base64'), 145, 200);

        callback();
    });
};

/**
 * Generates a PDF and exports it to a Buffer from data object
 * @param {object}   data     The ticket data
 * @param {Function} callback The callback (one argument : buffered pdf)
 */
module.exports = function (data, callback) {
    /**
     * Data structure : Array of
     * {
     *      displayname: string,
     *      eventname: string,
     *      date: string,
     *      place: string,
     *      price: string,
     *      barcode: string,
     *      purchaseDate: string,
     *      association: string,
     *      website: string,
     *      mail: string,
     *      logo: string
     * }
     */

    // Path to app/
    var basePath = fs.realpathSync(__dirname + '/../../');

    var doc = new PDFKit({
        size: 'a2' // 1190.55 * 1683.78 
    });

    // Fonts
    doc.registerFont('Lato-Regular', basePath + '/public/static/fonts/lato/lato-regular.ttf');
    doc.registerFont('Lato-Bold',    basePath + '/public/static/fonts/lato/lato-bold.ttf');
    doc.font('Lato-Regular');

    doc.info = {
        Title: 'Place ' + data[0].eventname,
        Author: 'BuckUTT',
        Subject: 'Contient votre place pour l\'événement ' + data.eventname,
    };

    // Pipe to output
    var bytes = [];
    var file = null;
    doc.on('data', function (chunk) {
        bytes.push(chunk);
    });
    doc.on('end', function () {
        file = Buffer.concat(bytes);
        callback(file);
    });

    data.forEach(function (ticket, i) {
        var first = (i === 0);
        var last  = (i === data.length - 1);

        drawOnePage(doc, ticket, first, basePath, function () {
            if (last) {
                doc.end();
            }
        });
    });

    return;
};

// Execute `node lights.js` to generate a test pdf directly
if (require.main === module) {
    module.exports([{
        displayname: 'Gabriel Juchault',
        eventname: 'Gala 2015',
        date: '26 Mai 2015 - 20h00',
        place: 'UTT',
        price: '27.00',
        barcode: '378017390490',
        purchaseDate: '12/02/2015 - 21h00',
        association: 'BDE',
        website: 'http://bde.utt.fr',
        mail: 'bde@utt.fr',
        logo: '/public/static/img/upload/gala2015.png'
    }], function (buffer) {
        fs.writeFile('lights.pdf', buffer);
    });
}
