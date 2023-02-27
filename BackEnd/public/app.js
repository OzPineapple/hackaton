const contenedorQR = document.getElementById('contenedorQR');
        const dato = localStorage.getItem("txt");
        console.log(dato);
        localStorage.removeItem("txt");

        const QR = new QRCode(contenedorQR);

        window.onload = (event) => {
            qr(event);
        };

        function qr(e) {
            e.preventDefault();
	        QR.makeCode(dato);
        }