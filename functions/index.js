const functions = require("firebase-functions");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://geoloca-cdead-default-rtdb.firebaseio.com"
  });

  const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const db = admin.firestore();

const sendResponse = (response, statusCode, body) => {
    response.send({
        statusCode,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(body)
    })
}

exports.signUp = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true })
    corsHandler(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const userRef = db.collection('user').doc(req.body.uid)
                await userRef.set({
                    uid: req.body.uid,
                    name: req.body.name,
                    email: req.body.email,
                    lat: null,
                    lng: null,
                    images:{id:"",path:""}
                }).then(() => {
                    console.log('Successfully created new user:');
                    sendResponse(res, 200,{create:req.body.uid})
                }).catch((error) => {
                    sendResponse(res, 500, { error: error })
                });
            } catch (err) {
                console.log(err);
                sendResponse(res, 500, { err: err });
            }
        } else if (req.method === 'DELETE') {
            try {
                return db.collection('user').doc(req.body.uid).delete().then(() => {
                    console.log('Delete new user:',req.body.uid);
                    sendResponse(res, 200,{delete:req.body.uid})
                }).catch((error) => {
                    sendResponse(res, 500, { error: error })
                });
            } catch (err) {
                console.log(err);
                sendResponse(res, 500, { err: err });
            }
        } else {
            sendResponse(res, 405, { error: "Invalid Request method!" })
        }
    })
})

exports.editUserData = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true })
    corsHandler(req, res, async () => {
        if (req.method !== 'POST') {
            sendResponse(res, 405, { error: "Invalid Request method" })
        }
        try {
            return db.collection('user').doc(req.body.uid).set({
                name: req.body.name,
                images: req.body.images
            },{merge:true}).then(() => {
                console.log('set firebase!');
                sendResponse(res, 200, { editUserData: 'completed!' });  
            })
        } catch (err) {
            console.log(err);
            sendResponse(res, 500, { err: err });
        }
    })
})

exports.sendMessage = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true })
    corsHandler(req, res, async () => {
        if (req.method !== 'POST') {
            sendResponse(res, 405, { error: "Invalid Request method" })
        }
        try {
            return db.collection('user').doc(req.body.uid).collection('friend').doc(req.body.friendId).collection('message').doc().set({
                message: req.body.message,
                time: req.body.time,
                sendParson: req.body.uid,
                date: req.body.date,
                sendNumber: req.body.sendNumber
            }, { merge: true }).then(() => {
                db.collection('user').doc(req.body.friendId).collection('friend').doc(req.body.uid).collection('message').doc().set({
                    message: req.body.message,
                    time: req.body.time,
                    sendParson: req.body.uid,
                    date: req.body.date,
                    sendNumber: req.body.sendNumber
                }, { merge: true }).then(() => {
                    console.log('send message!');
                    sendResponse(res, 200, { editUserData: 'completed!' });    
                })
            })
        } catch (err) {
            console.log(err);
            sendResponse(res, 500, { err: err });
        }
    })
})

exports.friendRequest = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true })
    corsHandler(req, res, async () => {
        if (req.method !== 'POST') {
            sendResponse(res, 405, { error: "Invalid Request method" })
        }
        try {
            return db.collection('user').doc(req.body.friendId).collection('request').doc(req.body.uid).set({
                requestDate: req.body.date,
                requestFriendName: req.body.name,
                requestImages: { id: req.body.images.id, path: req.body.images.path}
            }, { merge: true }).then(() => {
                console.log('send message!');
                sendResponse(res, 200, { editUserData: 'completed!' });  
            })
        } catch (err) {
            console.log(err);
            sendResponse(res, 500, { err: err });
        }
    })    
})

exports.deleteRequest = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true })
    corsHandler(req, res, () => {
        if (req.method !== 'DELETE') {
            sendResponse(res, 405, { error: "Invalid Request method" })
        }
        try {
            return db.collection('user').doc(`${req.body.uid}`).collection('request').doc(`${req.body.requestFriendId}`).delete().then(() => {
                console.log('completed deleteRequest');
                sendResponse(res, 200, 'completed! deleteRequest');  
            })
        } catch (err) {
            console.log(err);
            sendResponse(res, 500, { err: err });
        }
    })    
})

exports.approvalRequest = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true })
    corsHandler(req, res, async () => {
        if (req.method !== 'POST') {
            sendResponse(res, 405, { error: "Invalid Request method" })
        }
        try {
            db.collection('user').doc(`${req.body.uid}`).collection('friend').doc(`${req.body.requestFriendId}`).set({
                name: req.body.requestName,
                images: { id: req.body.requestImages.id, path: req.body.requestImages.path}
            },{merge:true}).then(() => {
                db.collection('user').doc(`${req.body.requestFriendId}`).collection('friend').doc(`${req.body.uid}`).set({
                    name: req.body.myName,
                    images: { id: req.body.myImages.id, path: req.body.myImages.path}
                }).then(() => {
                    db.collection('user').doc(`${req.body.uid}`).collection('request').doc(`${req.body.requestFriendId}`).delete().then(() => {
                        console.log('completed approvalRequest');
                        sendResponse(res, 200, 'completed approvalRequest');  
                    })
                })
            })
        } catch (err) {
            console.log(err);
            sendResponse(res, 500, { err: err });
        }
    })
})