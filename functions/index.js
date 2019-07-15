const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

if (process.env.NODE_ENV === "development") {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: 'https://baby-steps-app.firebaseio.com' 
    });
} else {
    admin.initializeApp({});
}


app.get('/classes', (req, res) => {
    admin.firestore().collection('classes').get()
        .then(data => {
            let classes=[];
            data.forEach(doc => {
                classes.push({
                    classId: doc.id,
                    name: doc.data().name,
                    company: doc.data().company,
                    url: doc.data().url,
                    category: doc.data().category,
                    description: doc.data().description,
                    dateTime: doc.data().dateTime,
                    duration: doc.data().duration,
                    places: doc.data().places,
                    price: doc.data().price,
                    singleClass: doc.data().singleClass,
                    indoor: doc.data().indoor,
                    createdAt: doc.data().createdAt,
                    modifiedAt: doc.data().modifiedAt
                });
            });
            return res.json(classes);
        })
        .catch(err => console.error(err)) 
});

app.post('/classes', (req, res) => {
    const newClass = {
        name: req.body.name,
        company: req.body.company,
        url: req.body.url,
        category: req.body.category,
        description: req.body.description,
        dateTime: req.body.dateTime,
        duration: req.body.duration,
        places: req.body.places,
        price: req.body.price,
        singleClass: req.body.singleClass,
        // otherDates: req.body.otherDates,
        indoor: req.body.indoor,
        createdAt: new Date().toISOString(),
        modifiedAt: null,
    }
    admin.firestore()
        .collection('classes')
        .add(newClass)
        .then(doc => {
            res.status(201).json({message: `Class successfully saved. Document id: ${doc.id}.` });
        })
        .catch(err => {
            res.status(500).json({ error: "An error occured."});
            console.error(err);
        })
});

exports.api = functions.region('europe-west2').https.onRequest(app);