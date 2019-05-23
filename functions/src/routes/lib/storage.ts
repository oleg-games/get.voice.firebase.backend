const express = require("express");
import { Storage, Security } from '../../services';
import { authenticate } from '../../middleware';
const bodyParser = require("body-parser");
const Busboy = require("busboy");
const getRawBody = require("raw-body");
const contentType = require("content-type");
const router = express.Router()
const FILE_LIMIT = "10mb"

router.use(bodyParser.json({ limit: FILE_LIMIT }));
router.use(bodyParser.urlencoded({ limit: FILE_LIMIT, extended: true }));
router.use((req: any, res: any, next: any) => {
    if (req.rawBody === undefined && req.method === "POST" && req.headers["content-type"].startsWith("multipart/form-data")) {
        getRawBody(req, {
            length: req.headers["content-length"],
            limit: FILE_LIMIT,
            encoding: contentType.parse(req).parameters.charset
        }, function (err: any, string: any) {
            if (err) return next(err)
            req.rawBody = string;
            next();
        })
    } else {
        next();
    }
})

router.use((req: any, res: any, next: any) => {
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

router.post("/upload", authenticate(), async (req: any, res: any, next: any) => {
    console.log('/upload')
    console.log('name', req.files.file[0])
    try {
        console.log('files', req.files)
        const phone: any = await Security.getPhoneByTokenFromRequest(req);
        const metadata: any = await Storage.uploadImageToStorage(req.files.file[0], phone)
        console.log('metadata', metadata)
        res.send({ url: metadata });
        // res.send({ url: metadata[0].mediaLink });
    } catch (err) {
        console.log('err', err)
        next(err)
    }
});

export default router;