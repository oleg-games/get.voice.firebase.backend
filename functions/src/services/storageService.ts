import Firebase from '../config/firebase';
import * as uuid from 'uuid';

/**
 * @class Storage
 */
export default class Storage {

    static get instanse() {
        return Firebase.getFirebase().storage;
    }

    static getImagePhoneRef(phone: string) {
        return this.getImageFilePoints(phone);
    }

    static getBucket() {
        return Firebase.getStorage().bucket();
    }

    static getImageRef() {
        // Create a child reference
        // Get a reference to the storage service, which is used to create references in your storage bucket
        const storage: any = Firebase.getStorage();
        console.log('storage', storage)
        // Create a storage reference from our storage service
        const storageRef = storage.ref();
        return storageRef.child('images');
        // imagesRef now points to 'images'
    }

    static getImageFilePoints(phone: string) {
        // Points to 'images/space.jpg'
        // Note that you can use variables to create child values
        return this.getImagePhonePoints(phone).child(uuid.v4());
    }

    static getImagePhonePoints(phone: string) {
        // Points to 'images/space.jpg'
        // Note that you can use variables to create child values
        return this.getImageRef().child(phone);
    }

    static uploadImageToStorage(file: any, phone: any) {
        return new Promise((resolve, reject) => {
            const fileUpload: any = this.getBucket().file(`/images/${phone}/${uuid.v4()}`);
            const blobStream = fileUpload.createWriteStream({
                metadata: {
                    contentType: "image/jpg"
                }
            });

            blobStream.on("error", (error: any) => {
                console.log('blobStream error', error)
                reject(error)
            });

            blobStream.on("finish", () => {
                console.log('finish');
                fileUpload.getMetadata()
                    .then((metadata: any) => {
                        const link = metadata[0].mediaLink.replace('https://www.googleapis.com/download/storage/v1/b', 'https://firebasestorage.googleapis.com/v0/b')
                        resolve(link);
                    })
                    .catch((error: any) => {
                        console.log('getMetadata error', error)
                        reject(error)
                    });
            });

            blobStream.end(file.buffer);
        });
    }

};