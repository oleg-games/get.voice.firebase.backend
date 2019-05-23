const bodyParser = require("body-parser");
const Busboy = require("busboy");
const getRawBody = require("raw-body");
const contentType = require("content-type");

export default function(path: any, app: any) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use((req: any, res: any, next: any) => {
        if (req.rawBody === undefined && req.method === "POST" && req.headers["content-type"].startsWith("multipart/form-data")) {
            getRawBody(req, {
                length: req.headers["content-length"],
                limit: "10mb",
                encoding: contentType.parse(req).parameters.charset
            }, function(err: any, string: any) {
                if (err) return next(err)
                req.rawBody = string;
                next();
            })
        } else {
            next();
        }
    })

    app.use((req: any, res: any, next: any) => {
        if (req.method === "POST" && req.headers["content-type"].startsWith("multipart/form-data")) {
            const busboy = new Busboy({
                headers: req.headers
            });
            let fileBuffer = new Buffer("");
            req.files = {
                file: []
            };

            busboy.on("file", (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
                file.on("data", (data: any) => {
                    fileBuffer = Buffer.concat([fileBuffer, data]);
                });

                file.on("end", () => {
                    const file_object = {
                        fieldname,
                        originalname: filename,
                        encoding,
                        mimetype,
                        buffer: fileBuffer
                    };

                    req.files.file.push(file_object);
                    next();
                });
            });

            busboy.end(req.rawBody);
        } else {
            next();
        }
    })
}