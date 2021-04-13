const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'pug');
app.use(express.static('public'));

/*Mongo*/
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
MongoClient.connect(url, function (err, client) {
  console.log("Connected successfully to  Mongo server");
});
const ObjectID = require('mongodb').ObjectID;


/*  const products=[
{
    id:1,
    name:'shoe 1',
    image:'https://images.unsplash.com/photo-1597248881519-db089d3744a5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    color:'yellow'
},
{
    id:2,
    name:'shoe 2',
    image:'https://images.unsplash.com/photo-1552346154-21d32810aba3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    color:'red'

},
{
    id:3,
    name:'shoe 3',
    image:'https://images.unsplash.com/photo-1549298916-f52d724204b4?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1301&q=80',
    color:'orange'
}


] */

/*MainPage index*/
app.get('/', (req, res) => {

  MongoClient.connect(url, function (err, client) {
    const db = client.db('ShoesDB');
    const collection = db.collection('summershoes');

    collection.find({}).toArray((error, documents) => {
      client.close();
      // console.log("This is  the last product image")
      // /*    const lastIndx = documents.length;
      //    console.log(documents[lastIndx].image) */
      // console.log(documents[2].image)
      res.render('index', { products: documents });

    });
  });


});

/*Products indivudual page */
app.get('/products/:id', (req, res) => {

  const selectedId = req.params.id;

  MongoClient.connect(url, function (err, client) {
    const db = client.db('ShoesDB');
    const collection = db.collection('summershoes');

    collection.find({ "_id": ObjectID(selectedId) }).toArray((error, documents) => {
      client.close();


      res.render('products', { product: documents[0] });
    });
  });


  /* const selectedId=req.params.id;
   let selectedProduct=products.filter(e=>{
       return e.id==selectedId;
   });
   selectedProduct= selectedProduct[0];

   res.render('products',{product:selectedProduct}); */

});
/*Create a new item*/
app.post('/products', urlencodedParser, (req, res) => {



  MongoClient.connect(url, function (err, client) {
    const db = client.db('ShoesDB');
    const collection = db.collection('summershoes');

    const newSuperHero = {

      name: req.body.product,
      image: req.body.image_shoe
    }



    collection.insertOne(newSuperHero);
    res.redirect("/");
  });
  /* 
       const newId = products[products.length - 1].id + 1;
    const newSuperHero = {
      id: newId, 
      name: req.body.product, 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
    
    products.push(newSuperHero); 
    
    res.redirect('/'); */
});

/*Delete Item*/
app.get('/products/delete/:id', (req, res) => {
  const selectedId = req.params.id;

  MongoClient.connect(url, function (err, client) {
    const db = client.db('ShoesDB');
    const collection = db.collection('summershoes');

    collection.deleteOne({ "_id": ObjectID(selectedId) });
    res.redirect("/");
  });



  /*   let selectedProductIndex=products.findIndex(e=> e.id==selectedId);
    products.splice(selectedProductIndex,1);

    res.redirect('/') */

});

/*Update*/
app.post('/products/:id', urlencodedParser, (req, res) => {

   
    
  MongoClient.connect(url, function (err, client) {
    
    const updatedId=req.params.id

    const db = client.db('ShoesDB');
    const collection = db.collection('summershoes');
    
    
    
    const filter = { "_id":  ObjectID(updatedId)  };
    const update = { $set: { name: req.body.product } };

    

    collection.updateOne(filter, update)  
    

    
    
    res.redirect('/')
    });

  });

  // let selectedProductIndex=products.findIndex(e=> e.id==updatedId);
  // products[selectedProductIndex].name=req.body.product

  // res.redirect('/')




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});