var express = require('express');
var app = express();
var fs = require('fs');

app.use(require('body-parser')());
app.set('view engine', 'jade');


app.get('/', function (req, res) {
    var files=fs.readdirSync("..");
    files=files.filter(function(f){return /.*\.md$/.test(f);})
    console.log("new axccess!!!")
    var name=req.query.name;
    if(name=="")return;
    if(!name.match(/\.md/))return;
    if(name.match(/\//))return;
    console.log(req.query)
    var content=fs.readFileSync("../"+name);
    res.render('index', { title: name, files: files, content:content});
});

app.post("/save",function(req,res){
    console.log(req.body);
    var name=req.body.name;
    var content=req.body.content.replace(/\r\n?/g,"\n"); 
    
    console.log(req.body)
    if(!name.match(/\.md/))return;
    if(name.match(/\//))return;
    fs.writeFileSync("../"+name,content)
    res.redirect('/?name='+name);
})

app.listen(3001, function () {
      console.log('Example app listening on port 3001!');
});
